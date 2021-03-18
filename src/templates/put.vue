<template>
  <div id="put-trends">
    <h2>{{title}}</h2>
    <el-row :gutter='10'>
      <el-col v-for="(item, index) in parameters" :md="12" :lg="8" :key='index'>
        <pi-chart :title='item' start='*-10y' end='*'>

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
    parameters: ['Al', 'Ca', 'CH4', 'Cl', 'CO2', 'EGV 20°C', 'Fe', 'Hardheid totaal', 'HCO3', 'K', 'Mg', 'Mn', 'Na', 'NH4', 'NO3', 'pH', 'SO4', 'As', 'Temperatuur']
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
#put-trends .pi-chart {
  margin-bottom: 10px;
}
</style>
