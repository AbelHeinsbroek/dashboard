<template>
  <div id="grondwater">
    <h1>Grondwaterwinning</h1>
    <h3>Totaal Pompstation</h3>
    <el-row :gutter='10'>
      <el-col :span='12' :xs='24'>
        <pi-chart start='1/1/2012' end='1/1/2020' class='onttrekking' type='bar' title='Jaaronttrekking' :maintain-aspect-ratio="false" legend='top' stacked>
          <pi-axis position='left' stacked>
            <pi-threshold path='.|Winvergunning|Jaarvergunning locatie (Mm3/j)' color='red' mode='ge' :context='context.replace("Productie", "Test")' :conversion='1e6' set-max />

            <pi-trend path='.|Procesgegevens|Waterdebiet totaal grondwaterverbruik WS (berekening PI)' :context='street.Path' :color='cmap[index]' :label='street.Name' summary summary-interval='1 year' v-for='(street, index) in streets' :key='street.Name'></pi-trend>
          </pi-axis>
        </pi-chart>
      </el-col>
      </el-col>
      <el-col :span='12' :xs='24'>
        <pi-chart :start='start' :end='end' class='onttrekking' type='bar' title='Maandonttrekking' :maintain-aspect-ratio="false" stacked legend='top'>
          <pi-axis position='left' stacked>
            <pi-threshold path='.|Winvergunning|Maandvergunning locatie (Mm3/m)' color='red' mode='ge' :context='context.replace("Productie", "Test")' :conversion='1e6' set-max />
            <pi-trend path='.|Procesgegevens|Waterdebiet totaal grondwaterverbruik WS (berekening PI)' :context='street.Path' :color='cmap[index]' :label='street.Name' summary summary-interval='1 month' v-for='(street, index) in streets' :key='street.Name'></pi-trend>
          </pi-axis>
        </pi-chart>
      </el-col>
    </el-row>

    <div v-if='streets.length > 1'>

      <el-row :gutter='10' v-for='(street, index) in streets' :key='street.Name'>
        <h3>{{street.Name}}</h3>
        <el-col :span='12' :xs='24'>
          <pi-chart start='1/1/2012' end='1/1/2020' class='onttrekking' type='bar' title='Jaaronttrekking' :maintain-aspect-ratio="false" stacked>
            <pi-axis position='left' stacked>
              <pi-threshold path='.|Winvergunning|Jaarvergunning wingebied (Mm3/j)' color='red' mode='ge' :context='street.Path' :conversion='1e6' set-max />
              <pi-trend path='.|Procesgegevens|Waterdebiet totaal grondwaterverbruik WS (berekening PI)' :context='street.Path' :color='cmap[index]' :label='street.Name' summary summary-interval='1 year'></pi-trend>
            </pi-axis>
          </pi-chart>
        </el-col>
        </el-col>
        <el-col :span='12' :xs='24'>
          <pi-chart :start='start' :end='end' class='onttrekking' type='bar' title='Maandonttrekking' :maintain-aspect-ratio="false" stacked>
            <pi-axis position='left' stacked>
              <pi-threshold path='.|Winvergunning|Maandvergunning wingebied (Mm3/m)' color='red' mode='ge' :context='street.Path' :conversion='1e6' set-max />
              <pi-trend path='.|Procesgegevens|Waterdebiet totaal grondwaterverbruik WS (berekening PI)' :context='street.Path' :color='cmap[index]' :label='street.Name' summary summary-interval='1 month'></pi-trend>
            </pi-axis>
          </pi-chart>
        </el-col>
      </el-row>
    </div>


<!--
    <el-row :gutter='20'>
    <el-col :span='12' :xs='24' v-for="street in streets" :key='street.Name'>
      <el-button @click="$router.push({name: 'winstraat', params: {context: context+'\\'+street.Name}})">{{street.Name}} <i class='el-icon-arrow-right'></i></el-button>
      <br /><Br />
      <groundwater-table :context='street.Path'></groundwater-table>
    </el-col>
    </el-row>
-->
  </div>
</template>

<script>

import table from '../components/grondwater-table'
import moment from 'moment'

window.moment = moment

export default {
  name: 'app',
  data() { return {
    context: "",
    start: moment().subtract(18, 'months').startOf('month'),
    end: moment().add(1, 'months').startOf('month'),
    trueContext: "",
    streets: [],
    cmap: ["#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f"],
    mode: 'individual'
  }},
  beforeMount() {
    this.context = this.$route.params.context
  },
  watch: {
    '$route' (to, from) {
      this.context = to.params.context
    }
  },

  components: {
    GroundwaterTable: table
  },

  mounted() {
    this.loadData()
  },


  methods: {
    async loadData() {
      var streets = await this.$pi.getChildren(this.context.replace('Productie', 'Test'), true, 'Wingebied Template') 

      if(streets.length==1) {
      //  this.$router.replace({name:'winstraat', params: {context: streets[0].Path}})
      }

      this.streets = streets
    }
  }

}
</script>

<style>
.onttrekking {
  height: 250px;
}

#grondwater .chart {
  max-height: 200px;
}

.pump-icon {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  display: inline-block;
  margin-right: 10px;
}
.pump-name {
  display: inline-block;
  width: 170px;
  font-weight: bold;
}
.pump-flow {
  display: inline-block;
  text-align: right;
  width: 50px;
}
.pump-icon.pump-on {
  background: green;
}
.pump-icon.pump-off {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  border: 2px solid gray;
}
.mode-label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
  text-align: left;
}
h5 {
  margin-top: 10px;
  clear: both;
}
.comparison {
}
.groundwater-chart {
  min-height: 400px;
  max-height: 400px;
  height: 400px;
}
</style>
