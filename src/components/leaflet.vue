<template>
  <div :id='uid' class='leaflet-map' v-loading='loading'>

    <select v-model='parameterIndex'>
      <option v-for='(parameter, index) in parameters' :value='index' :key='parameter.name'>{{parameter.name}}</option>
    </select>

  </div>
</template>
<script>

import 'leaflet/dist/leaflet.css'

require('leaflet.heat')

import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  props: ['context'],
  data() { return {
    uid: Math.random().toString(32).substring(2),
    loading: true,
    parameterIndex: 10,
    parameters: [
      {name: 'pH', label: '-'},
      {name: 'EGV 20°C', label:'mS/cm'},
      {name: 'Hardheid', label: 'mmol/l'},
      {name: 'HCO3', label: 'mg/l'},
      {name: 'Ca', label: 'mg/l'},
      {name: 'Mg', label: 'mg/l'},
      {name: 'Fe', label: 'mg/l'},
      {name: 'Mn', label: 'mg/l'},
      {name: 'NH4', label: 'mg NH4 / l'},
      {name: 'Na', label: 'mg/l'},
      {name: 'Cl', label: 'mg/l'},
      {name: 'SO4', label: 'mg SO4 / l'},
      {name: 'CH4', label: 'ug/l'},
      {name: 'Al', label: 'ug/l'},
      {name: 'As', label: 'ug/l'},
      {name: 'K', label: 'mg/l'},
    ]
  }},
  mounted() {
    this.$options.ignoreRemove = false
    this.$options.removedLayers = ["Wingebied"]
    this.loadMap()

  },
  watch: {
    context() { 
      this.loadMap()
    },
    parameterIndex() {
      this.loadMap()
    }

  },
  methods: {

    async loadMap() {


      this.loading = true

      if(this.$options.map) {
        this.$options.ignoreRemove = true
        this.$options.map.remove()
        this.$options.ignoreRemove = false
      }

      // add base layers
      var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3']
      });

      var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })

      this.$options.map = L.map(this.uid, {
        center: [50,5],
        zoom: 5,
        layers: [streetMap]
      })


      // add wells
      var wells = await this.loadWells()

      if(!_.includes(this.$options.removedLayers, 'Putten')) {
        wells[0].addTo(this.$options.map)
      }
      if(!_.includes(this.$options.removedLayers, 'Kwaliteit')) {
        wells[1].addTo(this.$options.map)
      }

      // add fields
      var fields = await this.loadFields()
      if(!_.includes(this.$options.removedLayers, 'Wingebied')) {
        fields.addTo(this.$options.map)
      }

      this.$options.map.on({
        overlayadd: function(e) {
          this.$options.removedLayers = this.$options.removedLayers.filter(item => item !== e.name)
        }.bind(this),
        overlayremove: function(e) {
          if(!this.$options.ignoreRemove) { 
            this.$options.removedLayers.push(e.name)
          }
        }.bind(this)
      })

      L.control.layers({"Sateliet":googleHybrid, "Kaart":streetMap}, {"Putten": wells[0], "Wingebied": fields, "Kwaliteit": wells[1]}, {collapsed: false}).addTo(this.$options.map)

    },

    async loadFields() {
      var promise = new Promise(function(resolve, reject) {
        if(this.$options.fieldJSON) {
          var field = L.geoJSON(this.$options.fieldJSON)
          resolve(field)
        } else {
          let xhr = new XMLHttpRequest();
          xhr.open('GET', '/static/winvelden.geojson');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onload = function() {
          if (xhr.status === 200) {
            this.$options.fieldJSON = JSON.parse(xhr.responseText)
            var field = L.geoJSON(this.$options.fieldJSON)
            resolve(field)
          }
          }.bind(this);
          xhr.send();
        }
      }.bind(this))
      return promise
    },

    async loadWells() {
      var children = await this.$pi.getChildren(this.context)

      var requests = []

      for(var child of children) {
        requests.push(this.$pi.getValue(child.Path + '|Asset gegevens|Coordinaten|Latitude'))
        requests.push(this.$pi.getValue(child.Path + '|Asset gegevens|Coordinaten|Longitude'))
        requests.push(this.$pi.getValue(child.Path + '|Procesgegevens|Status winput (numeriek)'))
        requests.push(this.$pi.getValue(child.Path + '|Waterkwaliteit|'+this.parameters[this.parameterIndex].name))
      }



      var results = await Promise.all(requests)
      var wells = []


      var greenIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      var redIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });


      var heatmap = []
      var maxquality = 0

      for(var child of children) {
        let lat = results.shift().Value
        let lon = results.shift().Value

        let status = results.shift().Value
        let quality = results.shift().Value

        if(quality > maxquality) {
          maxquality = quality
        }

        if(lat > 0) {
          var marker = L.marker([lat, lon], {icon: status == '1' ? greenIcon : redIcon})
          marker.bindPopup("<b>"+child.Name+"</b><br />"+this.parameters[this.parameterIndex].name+": "+quality + " "+this.parameters[this.parameterIndex].label)
          marker.Path = child.Path

          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            this.$router.push({name: 'put', params: {context: e.target.Path}})
          }.bind(this));
          wells.push(marker)
          heatmap.push([lat, lon, quality])
        }
      }
      if(wells.length > 0) {
        var group = L.featureGroup(wells)

        if(!_.includes(this.$options.removedLayers, 'Putten')) {
          group.addTo(this.$options.map)
        }

        this.$options.map.fitBounds(group.getBounds())
      }
      var heatmap = L.heatLayer(heatmap, {radius: 40, max: maxquality, maxZoom: 4})

      var heatmapgroup = new L.LayerGroup([heatmap])

      this.loading = false

      return [group, heatmapgroup]

    }
  }
}
</script>

<style>
.leaflet-map {
  padding-top: 50%;
  background: white;
}
.leaflet-map select {
  position: absolute;
  z-index: 100000;
  right: 10px;
  top: 125px;
  width: 90px;
}
.leaflet-map .leaflet-control-layers-expanded {
  height: 135px;
}
</style>
