<template>
  <div id="softsensor">
    <el-row :gutter='10'>
      <el-col v-for="item in parameters" :md="12" :lg="8" key='item.name'>
        <pi-chart :title='item.name' start='*-48h' end='*'>
          <pi-trend
            :path="'.|Waterkwaliteitsmetingen (ss)|'+item.name+' (ss)'"
            :context="context"
            marker="none"
            color="blue"
            stepped
            recorded
            />
        </pi-chart>
      </el-col>
      <p style='clear:both'></p>
    </el-row>
  </div>
</template>

<script>

export default {
  data() { return {
    context: "",
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
  beforeMount() {
      this.context = this.$route.params.context
  },
  watch: {
    '$route' (to, from) {
      this.context = to.params.context
    }
  },
  computed: {
    title() {
      return this.context.split("\\").pop()
    }
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
#softsensor label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
  text-align: left;
}
#reinwater h5 {
  margin-top: 10px;
  clear: both;
}
</style>
