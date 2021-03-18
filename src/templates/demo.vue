<template>
  <div id="test">
  <h1>Oldeholtpade</h1>
  <el-row :gutter='20'>
    <el-col :span='12' :xs='24'>
      <h2>Winning</h2>
      <pi-chart start='*-24h' end='*' title='Winning' legend='top'>
        <pi-axis label='Debiet (m3/h)'>
          <pi-trend 
            v-for='(winstraat, index) in winstraten' 
            :key='winstraat.WebId'
            :context='winstraat.Path'
            path='.|Procesgegevens|Waterdebiet inkomend ruwwater'
            :label='winstraat.Name'
            :color='cmap[index]'
          /> 
        </pi-axis>
      </pi-chart>
    </el-col>
    <el-col :span='12' :xs='24'>
      <h2>Distributie</h2>

      <pi-chart start='*-24h' end='*' title='Reinwater' legend='top'>
        <pi-axis label='Debiet (m3/h)'>
          <pi-trend 
            :context='context'
            path='.\Reinwater|Procesgegevens|Waterdebiet totaal uitgaand reinwater (real time)'
            label='Uitgaand'
          /> 
          <pi-trend 
            :context='context'
            path='.\Reinwater|Procesgegevens|Waterdebiet totaal inkomend reinwater (real time)'
            label='Inkomend'
            color='green'
          /> 
        </pi-axis>
      </pi-chart>

    </el-col>
    <el-col :span='12' :xs='24'>
      <h2>Zuivering</h2>
      <pi-chart start='*-24h' end='*' title='Winning' legend='top'>
        <pi-axis label='Debiet (m3/h)'>
          <pi-trend 
            v-for='(zuivering,index) in zuiveringen' 
            :key='zuivering.WebId'
            :context='zuivering.Path'
            path='.|Procesgegevens|Waterdebiet'
            :label='zuivering.Name'
            :color='cmap[index]'
          /> 
        </pi-axis>
      </pi-chart>
    </el-col>
    <el-col :span='12' :xs='24'>
      <h2>Reservoirs</h2>
      <div id='reservoirs'>
        <div v-for='reservoir in reservoirs' :key='reservoir.WebId' class='res'>
          <h5>{{reservoir.Name.replace('reservoir', '')}}</h5>
          <reservoir max='.|Asset gegevens|Inhoud reservoir' content='.|Procesgegevens|Reservoir volume gevuld' :context='reservoir.Path'></reservoir>
        </div>
      </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>

import moment from 'moment'
import Gauge from '../components/gauge.vue'
import Reservoir from '../components/reservoir.vue'

export default {
  data() { return {
    context: '\\\\PIAF\\SLIMM Test\\Vitens\\Productiebedrijven\\Pb. Oldeholtpade',
    reservoirs: [],
    winstraten: [],
    zuiveringen: [],
    cmap: ["#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f"]
  }},

  mounted() {
    this.load()
  },
  methods: {
    async load() {

      var requests = [this.$pi.getElements(this.context, false, 'Reservoir Template', null, 'ExtendedProperties.volgorde.Value'), this.$pi.getElements(this.context, false, 'Winstraat Template'),this.$pi.getElements(this.context, false, null, 'Processtap')]

      var responses = await Promise.all(requests)

      this.reservoirs = responses[0]
      this.winstraten = responses[1]
      this.zuiveringen = responses[2]
    }
  },

  components: {
    gauge: Gauge,
    reservoir: Reservoir
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
