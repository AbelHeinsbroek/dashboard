<template>
  <div id="reinwater">
    <h1>Reinwater {{locationName}}</h1>
    <div class='reinwatercijfer' v-if='context !== null'>
      <el-row class='hidden-xs-only'>
        <el-col :span='9'>
          <div class='cijfer'>
            <gauge path=".|Prestaties|Rapportcijfer reinwater" :context="context" title='Rapportcijfer'></gauge>
          </div>
        </el-col>
        <el-col :span='15'>
          <div class='cijfer-chart'>
          <pi-chart start='*-1y' end='*' :min='6' :max='10' title='Rapportcijfer Reinwater' :maintain-aspect-ratio="false">
            <pi-axis :min='6' :max='10'>
              <pi-trend path=".|Prestaties|Rapportcijfer reinwater" :context="context" color='#409EFF' :width='2' label='Cijfer' />
            </pi-axis>
          </pi-chart>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-tabs>
      <el-tab-pane label="Overzicht">
        <reinwater-table></reinwater-table>
      </el-tab-pane>
      <el-tab-pane label="Trends" lazy>
        <trends></trends>
      </el-tab-pane>
      <el-tab-pane label="Dispensatietabel" lazy>
        <reinwater-dispensatie></reinwater-dispensatie>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import Gauge from '../components/gauge.vue'

import ReinwaterTrends from '../templates/reinwater-trends.vue'
import ReinwaterTable from '../templates/reinwater-table.vue'
import ReinwaterDispensatie from '../templates/reinwater-dispensatie.vue'

export default {
  name: 'app',
  data() { return {
    context: null,
  }},
  components: {
    trends: ReinwaterTrends,
    ReinwaterTable: ReinwaterTable,
    ReinwaterDispensatie: ReinwaterDispensatie,
    gauge: Gauge
  },
  beforeMount() {
    if(!this.$route.params.context.includes('Reinwater opslag')) {
      this.$router.replace({name:'reinwater', params: {context: this.$route.params.context + "\\Reinwater opslag"}})
    }
    this.context = this.$route.params.context
  },
  watch: {
    '$route' (to, from) {
      if(!to.params.context.includes('Reinwater opslag')) {
        this.$router.replace({name:'reinwater', params: {context: this.$route.params.context + "\\Reinwater opslag"}})
        return
      }
    }
  },

  asyncComputed: {
    locationName() {
      if(this.context === null) { return '' }
      return this.context.split("\\")[6]
    },
  },

  methods: {
  }

}
</script>

<style>
#grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
#grid .column {
  margin: 5px;
  padding: 0px 10px;
  background: white;
}
#grid .location {
  font-size: 15px;
  padding: 5px 0px;
}
#reinwater label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
  text-align: left;
}
h5 {
  margin-top: 10px;
  clear: both;
}
.reinwatercijfer .gauge {
  height: 200px;
}
.reinwatercijfer .el-col {
  height: 200px;
}
.reinwatercijfer .cijfer-chart {
  height: 200px;
}

</style>
