<template>
  <div id="reinwater">
    <div class='year-picker' v-if='!isMobile'>
      <el-input-number v-model='yminInput' :step='1' :min='2012' size='small' controls-position='right'></el-input-number>
      <el-input-number v-model='ymaxInput' :step='1' size='small' controls-position='right'></el-input-number>
    </div>

    <el-row :gutter='10'>
      <el-col v-for="(item, index) in parameters" :md="12" :lg="8" :key='index'>
        <pi-chart :title='item.name' :start='ymin' :end='ymax' :legend='item.rt ? "top" : ""'>

          <pi-axis :suggested-min='item.smin'
              :suggested-max='item.smax'
              :min='item.min' 
              :max='item.max'
              >

            <pi-trend
              :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)'"
              :context="context"
              :marker-size="5"
              marker="rect"
              color="green"
              :line="false"
              label="Lab"
              recorded
              />

            <pi-trend v-if='item.rt'
              :path="'.|Waterkwaliteitsmetingen (online)|'+item.name+' (online)'"
              :context="context"
              marker="none"
              color="blue"
              label="Online"
              />

            <pi-trend v-if='item.ss'
              :path="'.|Waterkwaliteitsmetingen (ss)|'+item.name+' (ss)'"
              :context="context"
              marker="none"
              color="darkblue"
              label="Softsensor"
              />
          </pi-axis>

          <pi-threshold v-if='item.ll'
            :value='item.ll'
            color='red'
            mode='le'
            />

          <pi-threshold v-if='item.lt'
            :value='item.lt'
            color='orange'
            mode='le'
            />

          <pi-threshold v-if='item.ul'
            :value='item.ul'
            color='red'
            mode='ge'
            />

          <pi-threshold v-if='item.ut'
            :value='item.ut'
            color='orange'
            mode='ge'
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
    yminInput: new Date().getFullYear()-1,
    ymaxInput: new Date().getFullYear()+1,
    parameters: [
      {name: 'pH', ll: 7.0, lt:7.7, ut: 8.3, ul: 9.5, min:7.0, max: 9.5, ln:7.0, un:9.5, rt:true, ss:true},
      {name: 'EGV 20°C', ut: 80, ul: 125, min: 20, max: 125, un:150, rt:true, ss:true},
      {name: 'Troebelingsgraad', ut: 0.4, ul: 1, un:1, rt:true},
      {name: 'Hardheid', ut:1.43, ul: 2, ll:1, smin:0, smax:2.5, ln:1, rt:true, ss:true},
      {name: 'O2', lt: 4, ll:2, smin:5, smax:10, ln:2, rt:true},
      {name: 'TACC90', min: 0, smax:0.7, ut:0.4, ul: 0.6, smin: 0.2, smax:0.7, ss:true},
      {name: 'HCO3', ll: 60, lt: 90, smin: 40, smax:350, ln:60, ss:true},
      {name: 'Agressief CO2', ul: 2.2, smin:0, smax:2.5},
      {name: 'TOC', smin:0, smax:6},
      {name: 'Kleurintensiteit', ut: 10, ul: 20, smin:0, smax:25, un: 20},
      {name: 'Fe', ut: 0.05, ul: 0.1, smin:0, smax:0.15, un:0.2},
      {name: 'Mn', ut: 0.01, ul: 0.05, smin:0, smax:0.06, un:0.05},
      {name: 'Al', ul: 30, smin:0, smax:40, un: 200},
      {name: 'NH4', ut: 0.05, ul: 0.20, smin:0, smax:0.1, un:0.2},
      {name: 'Na', ut: 100, ul: 150, smin:0, smax:120, un:150},
      {name: 'Cl', ut: 100, ul: 150, smin:0, smax:120, un: 150},
      {name: 'SO4', ut: 100, ul: 150, smin:0, smax:120, un: 150},
      {name: 'NO3', ut: 25, ul: 50, smin:0, smax:60, un: 50},
      {name: 'NO2', ut: 0.03, ul: 0.05, smin:0, smax:0.05, un: 50},
      {name: 'Enzymactiviteit', smin:0, smax:2},
      {name: 'E-coli', ul: 1.0, min:0, smax:2, un:1},
      {name: 'Aeromonas 30°C', ut: 20, ul: 100, min:0, smax:120, un:1000},
      {name: 'Koloniegetal 22°C', ul: 100, min:0, smax:150, un: 100},
      {name: 'SI-index', ll: -0.2, smin:-1, smax:1},
    ]
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

  asyncComputed: {
    children() {
      var path = this.$pi.parse('../..', this.context)
      return this.$pi.getChildren(path)
    },
  },


  methods: {

    async loadLocationSpecific() {

    },
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
#reinwater h5 {
  margin-top: 10px;
  clear: both;
}
#reinwater .pi-chart {
  margin-bottom: 10px;
}

#reinwater {
  position: relative;
}
#reinwater .year-picker {
  width: 310px;
  text-align: right;
  position: absolute;
  right: 0px;
  top: -60px;
  z-index: 10000;
}
#reinwater .el-tabs__content {
  overflow: visible !important;
}
</style>

