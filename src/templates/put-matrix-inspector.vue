<template>
  <div id='matrix-inspector'>
    <el-radio-group v-model='duration'>
      <el-radio-button label='24h'>24H</el-radio-button>
      <el-radio-button label='48h'>48H</el-radio-button>
      <el-radio-button label='7d'>1W</el-radio-button>
    </el-radio-group>
    <label id='plabel'>Vergelijk met:</label>
    <el-select v-model='parameter'>
      <el-option v-for='par in parameters' :key='par.name' :value='par.name'></el-option>
    </el-select>

    <schakelingen-matrix :start='start' :interval='sampling' :wells='wells' v-if='wells != undefined'></schakelingen-matrix>

    <pi-chart :title='parameter' :start='start' end='*' :maintain-aspect-ratio='false'>
      <pi-trend
        :path="'.|Waterkwaliteitsmetingen (ss)|'+parameter+' (ss)'"
        :context="context"
        marker="rect"
        color="blue"
        stepped
        recorded
        />
    </pi-chart>

  </div>
</template>
<script>

import matrix2 from '../components/put-matrix'

export default {
  name: 'winput-matrix-inspector',
  props: ['wells', 'context'],
  data() { return {
    duration: '24h',
    parameter: 'Cl', 
    parameters: [
      {name: 'pH', ll: 6.5, lt:7.7, ut: 8.3, ul: 9.5, min:6.5, max: 9.5},
      {name: 'EGV 20°C', ut: 80, ul: 130, min: 20, max: 130},
      {name: 'Hardheid', ut:1.43, ul: 2, ll:1, min:0, max:2.5},
      {name: 'HCO3', ll: 60, lt: 90, min: 40, max:350},
      {name: 'CO2', ll: 60, lt: 90, min: 40, max:350},
      {name: 'Ca', min: 0, max:0.7, ut:0.4, ul: 0.6, min: 0.2, max:0.7},
      {name: 'Mg', min: 0, max:0.7, ut:0.4, ul: 0.6, min: 0.2, max:0.7},
      {name: 'K', ut: 2.2, min:0, max:2.5},
      {name: 'TOC', ut: 3, ul: 5, min:0, max:6},
      {name: 'Fe', ut: 0.05, ul: 0.1, min:0, max:0.15},
      {name: 'Mn', ut: 0.01, ul: 0.05, min:0, max:0.06},
      {name: 'NH4', ut: 0.05, ul: 0.20, min:0, max:0.1},
      {name: 'CH4', ut: 0.05, ul: 0.20, min:0, max:0.1},
      {name: 'Na', ul: 100, min:0, max:120},
      {name: 'Cl', ut: 100, ul: 150, min:0, max:120},
    ]
  }},
  computed: {
    start() {
      return '*-'+this.duration
    },
    sampling() {
      return '5m'
    }
  },
  components: {
    SchakelingenMatrix: matrix2,
  }
}


</script>
<style>
#matrix-inspector canvas {
  height: 40vh;
  max-height: 40vh;
  min-height: 40vh;
}
#matrix-inspector #plabel {
  display: inline-block;
  font-weight: bold;
  margin-left: 30px;
  margin-right: 5px;
  font-size: 13px;
}
</style>
