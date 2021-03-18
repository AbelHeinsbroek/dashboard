<template>
  <div id="test">
  <h1>Oldeholtpade Reinwater</h1>
  <div v-for='(straat,index) in straten'>
    <h3>{{straat.Name}}</h3>
    <el-row :gutter='15'>
      <el-col :span='12'>
        <pi-chart :title='straat.Name'>
          <pi-axis label='Debiet' position='left'>
            <pi-trend path='.|Procesgegevens|Waterdebiet distributiestraat' :context='straat.Path' label='Debiet' color='blue' :width='1'></pi-trend>
          </pi-axis>
          <pi-axis label='Druk' position='right'>
            <pi-trend path='.|Procesgegevens|Druk distributiestraat' :context='straat.Path' label='Debiet' color='green'></pi-trend>
          </pi-axis>
        </pi-chart>
      </el-col>
      <el-col :span='12'>
        <h3 v-for='klep in kleppen[index]'>
          {{klep.Name}}
        </h3>
      </el-col>
    </el-row>
  </div>
  </div>
</template>

<script>

import moment from 'moment'
import Gauge from '../components/gauge.vue'

export default {
  data() { return {
    context: '\\\\PIAF\\SLIMM Test\\Vitens\\Productiebedrijven\\Pb. Oldeholtpade',
    straten: [],
    kleppen: [],
    pompen: {},
    cmap: ["#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f"]
  }},

  mounted() {
    this.load()
  },
  methods: {
    async load() {

      var straten = await this.$pi.getChildren(this.context, false, 'Distributiestraat Template', null)
      this.straten = straten.slice(0,5)

      var requests = []

      for(var straat of straten) {
        requests.push(this.$pi.getChildren(straat.Path, true))
      }

      var straten_kleppen = await Promise.all(requests)

      for(var i=0;i<straten.length;i++) {
        var kleppen = straten_kleppen.shift()
        this.kleppen.push(kleppen)
      }

    }
  },

  components: {
    gauge: Gauge,
  },


}
</script>

<style>
.rein {
  color: red;
}

.ps {
  min-height: 300px;
}

#reservoirs {
  display: flex;
  flex-wrap: wrap;
}
#reservoirs .res {
  margin: 10px;
  flex: 1 1 0;
}
#reservoirs h5 {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#reservoirs .reservoir {
  height: 200px;
}

</style>
