<template>
  <div id='overview-map' ref='map' v-loading='loading'>

    <div id='pop' class='el-tooltip__popper is-dark'>
      <div x-arrow="" class="popper__arrow"></div>
      <span class='title'>{{selected.name}}</span><br /><br />
      <strong>Huidig</strong>
      <span class='label'>Maand:</span><span><pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Maandonttrekking' units='m3' :precision='0' :conversion='1e6'></pi-value>
        (<pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Maandonttrekking|Percentage Winvergunning' units='%' :precision='1'></pi-value>)
      </span><br />
      <span class='label'>Jaar:</span><span><pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Jaaronttrekking' units='Mm3' :precision='2'></pi-value>
        (<pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Jaaronttrekking|Percentage Winvergunning' units='%' :precision='1'></pi-value>)
      </span><br />
      <strong>Prognose</strong>
      <span class='label'>Maand:</span><span><pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Maandonttrekking|Prognose Maandontrekking' units='m3' :precision='0' :conversion='1e6'></pi-value>
        (<pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Maandonttrekking|Prognose Percentage Winvergunning' units='%' :precision='1'></pi-value>)
      </span><br />
      <span class='label'>Jaar:</span><span><pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Jaaronttrekking|Prognose Jaaronttrekking' units='Mm3' :precision='2'></pi-value>
        (<pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Jaaronttrekking|Prognose Percentage Winvergunning' units='%' :precision='1'></pi-value>)
      </span><br />
      <strong>Vergunning</strong>
      <span class='label'>Maand:</span><span><pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Maandvergunning locatie (Mm3/m)' units='m3' :precision='0' :conversion='1e6'></pi-value></span><br />
      <span class='label'>Jaar:</span><span><pi-value v-if="selected.name != ''" :context='selected.path.replace("Productie", "Test")' path='.\Grondwaterwinning|Winvergunning|Jaarvergunning locatie (Mm3/j)' units='Mm3' :precision='2'></pi-value></span><br />
    </div>

    <el-button @click='$router.mode="map"; $router.push("/map")' id='list-toggle'><i class='el-icon-menu'></i> Naar Kwaliteit</el-button>

      <el-radio-group v-model='term' size='normal' id='term-toggle'>
        <el-radio-button label="maand">Maandvergunning</el-radio-button>
        <el-radio-button label="jaar">Jaarvergunning</el-radio-button>
      </el-radio-group>

      <el-radio-group v-model='mode' size='normal' id='mode-toggle'>
        <el-radio-button label="actueel">Actueel</el-radio-button>
        <el-radio-button label="prognose">Prognose</el-radio-button>
      </el-radio-group>

      <el-alert
        title="Lineaire extrapolatie op basis van verbruik tot nu."
        type="info"
        v-if='mode=="prognose"'
        :closable='0'
        id='prognose-info'
        show-icon>
      </el-alert>

      <div class='legend'>
        <span class='dot green'></span><span class='dot-description'>Vergunning &lt; 85%</span><br />
        <span class='dot yellow'></span><span class='dot-description'>Vergunning 85% tot 95%</span><br />
        <span class='dot orange'></span><span class='dot-description'>Vergunning 95% tot 100%</span><br />
        <span class='dot red'></span><span class='dot-description'>Vergunning &ge; 100% </span><br />
      </div>

  <svg></svg>
  </div>
</template>

<script>
import * as d3 from "d3"
import Popper from "element-ui/src/utils/popper"
import locationData from "../assets/locations.js"

var _ = require('lodash')

export default {
  data() { return {
    width: 0,
    height: 0,
    x:0,
    y:0,
    term: 'maand',
    mode: 'actueel',
    loading: true,
    centered: null,
    tooltipMode: '.\\Reinwater\\Reinwater opslag|Prestaties|Overschreden reinwaterparameters (beinvloedbaar)',
    selected: {
      name: '',
      maand_onttrekking: 123,
      maand_onttrekking_p: 123,
      jaar_onttrekking: 2.4,
      jaar_onttrekking_p: 123,
      maand_prognose: 2.4,
      maand_prognose_: 2.4,
      jaar_prognose: 2.4,
      jaar_prognose_p: 2.4,
      maand_vergunning: 2.4,
      jaar_vergunning: 2.4,
    }
  }},
  scale: 1,
  created() {
   if(/Mobi/.test(navigator.userAgent)) {
     this.$router.replace("/list")
   }
  },
  mounted() {
    this.$parent.title = 'SLIMM Kwantiteit Overzicht'
    window.addEventListener('resize', this.resize)
    this.drawMap()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  watch: {
    mode() {
      this.$options.locationLayer.selectAll('circle').attr('fill', this.fillLocation)
    },
    term() {
      this.$options.locationLayer.selectAll('circle').attr('fill', this.fillLocation)
    }


  },
  methods: {

    drawMap() {


      var width = this.$refs.map.clientWidth
      var height = this.$refs.map.clientHeight

      // Define color scale
      this.$options.color = d3.scaleLinear()
        .domain([0, 8])
        .clamp(true)
        .range(['#164094', '#0884C2']);

      this.$options.projection = d3.geoMercator()

      this.$options.path = d3.geoPath()
        .projection(this.$options.projection);

      // Set svg width & height
      this.$options.svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

      // Add background
      this.$options.background = this.$options.svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height)
        .on('click', this.clickTeam);

      this.$options.g = this.$options.svg.append('g');

      this.$options.mapLayer = this.$options.g.append('g')
        .classed('map-layer', true);


      this.$options.textLayer = this.$options.g.append('g')
        .classed('text-layer', true);

      // Load map data
      d3.json('/static/teams.geojson').then(function(mapData) {
        var features = mapData.features;
        this.$options.mapData = mapData

        this.$options.projection.fitSize([width, height], mapData)

        // Draw each team as a path
        this.$options.mapLayer.selectAll('path')
            .data(features)
            .enter().append('path')
            .attr('d', this.$options.path)
            .attr('vector-effect', 'non-scaling-stroke')
            .style('fill', this.fillTeam.bind(this))
            .on('mouseover', this.mouseoverTeam)
            .on('mouseout', this.mouseoutTeam)
            .on('click', this.clickTeam.bind(this));

         this.$options.mapLayer.selectAll('text')
            .data(features)
            .enter().append('text')
            .text(function(d){ return "Team " + d.properties.TEAM})
            .attr("transform", function(d) { return "translate("+this.$options.path.centroid(d)+")" }.bind(this))
            .attr('class', 'team-text')

        // load locations after loading map
        this.loadLocations()
      }.bind(this));
    },

    async loadLocations() {
      this.$options.locationLayer = this.$options.mapLayer.append('g')
        .classed('location-layer', true);

      var locations = locationData
      var requests = []

      for(var location of locations) {
        requests.push(this.$pi.getValue(location.path.replace("Productie", "Test")+"\\Grondwaterwinning|Winvergunning|Jaaronttrekking|Percentage Winvergunning", true))
        requests.push(this.$pi.getValue(location.path.replace("Productie", "Test")+"\\Grondwaterwinning|Winvergunning|Jaaronttrekking|Prognose Percentage Winvergunning", true))
        requests.push(this.$pi.getValue(location.path.replace("Productie", "Test")+"\\Grondwaterwinning|Winvergunning|Maandonttrekking|Percentage Winvergunning", true))
        requests.push(this.$pi.getValue(location.path.replace("Productie", "Test")+"\\Grondwaterwinning|Winvergunning|Maandonttrekking|Prognose Percentage Winvergunning", true))
      }
      try {
        var results = await Promise.all(requests)
      } catch(err) {
        this.$alert("SLIMM kan geen verbinding maken met de PI servers, probeer het later opnieuw", "Geen verbinding", {
          confirmButtonText: 'OK',
          type: 'error',
          duration: 0
        })
        return
      }

      var points = []
      for(var location of locations) {

        var jaar = results.shift().Value
        var jaarPrognose = results.shift().Value
        var maand = results.shift().Value
        var maandPrognose = results.shift().Value

        points.push({
          'name': location.name,
          'path': location.path,
          'team': location.team,
          'x': location.x,
          'y': location.y,
          'jaar': jaar,
          'jaar-prognose': jaarPrognose,
          'maand': maand,
          'maand-prognose': maandPrognose
        })
      }
      // add to map
      this.$options.locationLayer.selectAll('circle')
          .data(points).enter()
          .append('circle')
          .attr("cx", function(d) { return this.$options.projection([d.y,d.x])[0]}.bind(this) )
          .attr("cy", function(d) { return this.$options.projection([d.y,d.x])[1]}.bind(this) )
          .attr("r", 6)
          .attr("class", function(d) { return "location-"+d.name.replace(/[^a-z0-9]/g, '')})
          //.attr('vector-effect', 'non-scaling-stroke')
          .style("pointer-events", "click")
          .on("click", function(d) {this.clickLocation(d.path)}.bind(this))
          .on("mouseenter", function(d) {this.mouseoverLocation(d)}.bind(this))
          .on("mouseout", function(d) {this.mouseoutLocation(d)}.bind(this))
          .attr("fill", this.fillLocation)

      var width = this.$refs.map.clientWidth
      var height = this.$refs.map.clientHeight

      // add voronoi
      var voronoi = d3.voronoi()
        .x(function(d) { return this.$options.projection([d.y, d.x])[0]}.bind(this) )
        .y(function(d) { return this.$options.projection([d.y, d.x])[1]}.bind(this) )
        .extent([[0, 0], [width, height]])

      this.$options.voronoi = voronoi(points)
      this.$options.svg.on('mousemove', this.findAndHighlightLocation.bind(this))

      // set to true for voronoi debug
      var displayVoronoi = false
      if(displayVoronoi) {
        this.$options.locationLayer.selectAll('path')
            .data(voronoi.polygons(points)).enter()
            .append('path')
            .attr("d", function(d, i) { return "M" + d.join("L") + "Z";})
            .style('stroke', 'red')
            .style('fill', 'none')
            .attr('class', function(d, i) { return "voronoi-"+i})
      }

      this.loading = false

      this.$options.x = 0
      this.$options.y = 0

      this.$options.textLayer.selectAll('text')
          .data(points).enter()
          .append('text')
          .attr("x", function(d) { return this.$options.projection([d.y,d.x])[0]}.bind(this) )
          .attr("y", function(d) { return this.$options.projection([d.y,d.x])[1]}.bind(this) )
          .text(function(d) { return d.name })
          .style('font-size',4)
          .style('opacity',0)
    },

    findAndHighlightLocation() {
      var coordinates = d3.mouse(this.$options.background.node())
      var width = this.$refs.map.clientWidth
      var height = this.$refs.map.clientHeight

      //this.x = coordinates[0]+","+coordinates[1]+"("+this.$options.scale.toFixed(2)+") "+(-this.$options.x/this.$options.scale + coordinates[0]/this.$options.scale).toFixed(0)+","+(coordinates[1]/this.$options.scale).toFixed(0)
      var x = (width / 2) - this.$options.x * this.$options.scale + coordinates[0]/this.$options.scale
      //var y = (height / 2) - this.$options.y * this.$options.scale + coordinates[1]/this.$options.scale

      var scale = this.$options.scale

      var x = (scale > 1) ? -((width / 2) - this.$options.x * scale) : 0
      var y = (scale > 1) ? -((height / 2) - this.$options.y * scale) : 0

      var xcoord = (x + coordinates[0]) / scale
      var ycoord = (y + coordinates[1]) / scale

      var site = this.$options.voronoi.find(xcoord, ycoord, 30)
      if(site != null && site != this.$options.highlighted) {
        this.$options.highlighted = site
        var d = site.data
        var selection = '.location-'+d.name.replace(/[^a-z0-9]/g, '')
        var node = this.$options.locationLayer.select(selection).node()

        this.selected.name = d.name
        this.selected.path = d.path

        this.$nextTick(function() {
          this.$options.popper = new Popper(node, document.getElementById('pop'), {placement: 'top'})
          document.getElementById('pop').style.opacity = '1'
        })
      } else {
        if(site == null) {
          this.$options.highlighted = false
          if(this.$options.popper) {
            this.$options.popper.destroy()
          }
          document.getElementById('pop').style.opacity = '0'
        }

      }
    },
    mouseoverLocation(d) {
      var scale = this.$options.scale
      var selection = '.location-'+d.name.replace(/[^a-z0-9]/g, '')
      this.$options.locationLayer.select(selection).attr('r', 7/scale)
    },
    mouseoutLocation(d) {
      var scale = this.$options.scale
      var selection = '.location-'+d.name.replace(/[^a-z0-9]/g, '')
      this.$options.locationLayer.select(selection).attr('r', 6/scale)
    },

    clickLocation(path) {
      this.$router.push({name: 'grondwaterwinning', params: {context: path + '\\Grondwaterwinning'}})
    },

    fillLocation(d) {

      if(this.term == 'jaar') {
        var parameter = (this.mode == 'prognose') ? 'jaar-prognose' : 'jaar'
      } else {
        var parameter = (this.mode == 'prognose') ? 'maand-prognose' : 'maand'
      }


      if(d[parameter] >= 100) {
          return "red"
      } 
      else if(d[parameter] <= 85 ) {
          return "#64AA3B"
      } 
      else if(d[parameter] >= 95){
          return "#ED6B04"
      } else {
        // geel
          return "#F5CA29"
      }
    },

    mouseoverTeam(d, i, nodes) {
      d3.selectAll(nodes).style('fill', function(dd) { 
        if(dd == this.centered) {
          return '#2495C8'
        } else {
          return d==dd ? '#6BB9DA' : this.fillTeam(dd) 
        }
      }.bind(this));
    },

    clickTeam(d) {
      var width = this.$refs.map.clientWidth
      var height = this.$refs.map.clientHeight

      if(d && this.centered !== d) {
        var bounds = this.$options.path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
          translate = [width / 2 - scale * x, height / 2 - scale * y];
          this.centered = d

          this.$options.mapLayer.selectAll('path')
            .style('fill', function(d){return this.centered && d===this.centered ? '#2495C8' : this.fillTeam(d);}.bind(this));


          this.$options.x = x
          this.$options.y = y

      } else {
        var x = width / 2;
        var y = height / 2;
        var scale = 1;
        this.centered = null;
        this.$options.x = 0
        this.$options.y = 0
      }

      this.$options.scale = scale

      this.$options.g.transition()
        .duration(750)
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + scale + ')translate(' + -x + ',' + -y + ')');

      this.$options.locationLayer
        .selectAll('circle')
        .transition().duration(750)
        .attr("r", 6/scale)
        .attr("stroke-width", 1.5/scale)
        .style("opacity", function(d) {return (scale == 1) || (this.centered && this.centered.properties.TEAM == d.team) ? 1 : 0.3}.bind(this))

      this.$options.textLayer
        .selectAll('text').style("font-size", 6/(0.5*scale)+"px")
        .attr("dx", 3/(0.5*scale))
        .attr("dy", -3/(0.5*scale))

      if(scale == 1){
        this.$options.textLayer
          .selectAll('text').style("opacity", 0)
      }

      this.$options.textLayer
        .selectAll('text')
        .transition().duration(750)
        .style("opacity", function(d) { return (this.centered && this.centered.properties.TEAM == d.team) ? 1 : 0}.bind(this))
    },
    fillTeam(d) {
      if(d) {
        // 'randomly' swap colors
        var cmap = [7,1,5,2,3,4,6,0]
        return this.$options.color(cmap[d.properties.TEAM])
      } else {
        return ""
      }
    },
    requestResize: _.debounce(function() {
      d3.select("svg").selectAll("*").remove();
      this.drawMap()
    }, 150, {leading: false}),
    resize() {
      this.requestResize()
    }
  }
}
</script>

<style>
#overview-map {
  position: relative;
  height: calc(100vh - 100px);
  min-height: 30vw;
  background: #FFF;
}
#overview-map .background {
  fill: #fff;
}
#overview-map .map-layer {
  fill: #fff;
  stroke: #fff;
  stroke-width: 2;
  cursor: pointer;
}
#overview-map .location-layer {
  stroke: #000;
  stroke-width: 1.5;
  cursor: pointer;
}
#overview-map .text-layer text {
  color: #333;
  pointer-events: none;
}
#overview-map .team-text {
  fill: #FFF;
  stroke-width: 0;
  fill-opacity: .4;
  font-size: 25px;
  font-weight: 400;
  text-anchor: middle;
  pointer-events: none;
}
#list-toggle {
  position: absolute;
  left: 20px;
  top: 20px;
}
#term-toggle {
  position: absolute;
  right: 20px;
  top: 20px;
}
#mode-toggle {
  position: absolute;
  right: 58px;
  top: 75px;
}
#prognose-info {
  position: absolute;
  right: 58px;
  width: 350px;
  top: 120px;
}
#pop {
  left: -10000px;
  position: absolute;
  background: rgba(0,0,0,0.8);
  padding: 5px 10px;
  color: white;
  pointer-events: none;
  z-index: 999999;
}
#pop strong {
  display: block;
  line-height: 1.5;
}
#pop .label {
  display: inline-block;
  width: 100px;
}
.title {
  font-size: 14px;
  font-weight: bold;
}

/* legend styles */

.legend {
  background: rgba(255,255,255,0.6);
  border-radius: 5px;

  position: absolute;
  padding: 10px;
  width: 295px;
  right: 20px;
  top: 150px;
  font-size: 13px;
}
.legend .dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  border: 1px solid #333;
  margin-right: 10px;
  margin-bottom: 5px;
  vertical-align: middle;
}
.legend .dot-description {
  display: inline-block;
  margin-bottom: 5px;
  vertical-align: middle;
}

</style>
