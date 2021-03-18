<template>
  <div id="grondwater-trends">

    <div class='year-picker' v-if='!isMobile'>
      <el-input-number v-model='yminInput' :step='1' :min='2012' size='small' controls-position='right'></el-input-number>
      <el-input-number v-model='ymaxInput' :step='1' size='small' controls-position='right'></el-input-number>
    </div>

    <el-row :gutter='10'>
      <el-col v-for="(item, index) in parameters" :md="12" :lg="8" :key='index'>
        <pi-chart :title='item' :start='ymin' :end='ymax'>

          <pi-trend
            :path="'.|Waterkwaliteitsmetingen (lab)|'+item+' (lab)'"
            :context="context"
            :marker-size="5"
            marker="rect"
            color="green"
            :line="false"
            label="Lab"
            recorded
            />
        </pi-chart>

      </el-col>
    </el-row>
      <p style='clear:both'></p>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() { return {
    context: "",
    yminInput: new Date().getFullYear()-2,
    ymaxInput: new Date().getFullYear()+1,
    parameters: ['Al', 'Ca', 'CH4', 'Cl', 'EGV 20°C', 'Fe', 'Hardheid', 'HCO3', 'K', 'Mg', 'Mn', 'Na', 'NH4', 'NO3', 'pH', 'SO4', 'Temperatuur']
  }},
  beforeMount() {
      this.context = this.$route.params.context
  },
  watch: {
    '$route' (to, from) {
      this.context = to.params.context
    },
    yminInput(val) {
      if(val >= this.ymaxInput) {
        this.ymaxInput+=1
      }
    },
    ymaxInput(val) {
      if(val <= this.yminInput) {
        this.yminInput-=1
      }
    }
  },
  computed: {
    ymin() {
      return this.yminInput
    },
    ymax() {
      return this.ymaxInput > new Date().getFullYear() ? "*" : this.ymaxInput
    },
    isMobile() {
     return /Mobi/.test(navigator.userAgent)
    },
  },
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
#grondwater-trends {
  position: relative;
  margin-top: 0px;
}
#grondwater-trends label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
  text-align: left;
}
#grondwater-trends h5 {
  margin-top: 10px;
  clear: both;
}
#grondwater-trends .pi-chart {
  margin-bottom: 10px;
}
#grondwater-trends {
  position: relative;
}
#grondwater-trends .year-picker {
  width: 310px;
  text-align: right;
  position: absolute;
  right: 0px;
  top: -60px;
  z-index: 10000;
}
#winveld .el-tabs__content {
  overflow: visible !important;
}
</style>
