<template>
  <div id="reactor">
    <h2>{{title}}</h2>

    <el-row :gutter='10'>
      <el-col :span='6'>
        <gauge path=".|Prestaties|Cijfer Hardheid onthardingsreactor" :context='context' title='Hardheid' />
      </el-col>
      <el-col :span='6'>
        <gauge path=".|Prestaties|Cijfer Troebelingsgraad onthardingsreactor" :context='context' title='Troebelheid' />
      </el-col>

    </el-row>
    <br />

    <el-tabs>
      <el-tab-pane label='Overzicht' lazy>
        <el-row :gutter='15'>
          <el-col :span='24'>
            <ontharding-table :context='context' />
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label='Real-time Waterkwaliteit' lazy>
        <el-row :gutter='15'>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Softsensor Hardheid'>
              <pi-axis :suggested-min='0.95' :suggested-max='1.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|Hardheid (ss)' :context='context' recorded />
                  <pi-threshold mode='le' :value='1' color='red' />
                  <pi-threshold mode='ge' :value='1.43' color='orange' />
                  <pi-threshold mode='ge' :value='2' color='red' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Softsensor TACC90'>
              <pi-axis :suggested-min='0.20' :suggested-max='0.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|TACC90 (ss)' :context='context' recorded />
                  <pi-threshold mode='ge' :value='0.4' color='orange' />
                  <pi-threshold mode='ge' :value='0.6' color='red' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Softsensor pH'>
              <pi-axis :suggested-min='8.0' :suggested-max='9.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|pH (ss) vóór CO2' :context='context' recorded />
                  <pi-threshold mode='le' :value='8.5' color='orange' />
                  <pi-threshold mode='ge' :value='9' color='orange' />
              </pi-axis>
            </pi-chart>
          </el-col>
        </el-row>
        <br />
        <el-row :gutter='15'>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Softsensor HCO3'>
              <pi-axis :suggested-min='80' :suggested-max='8.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|HCO3 (ss)' :context='context' recorded />
                <pi-threshold mode='le' :value='90' color='orange' />
                <pi-threshold mode='le' :value='60' color='red' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Softsensor EGV'>
              <pi-axis>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|EGV 20°C (ss) vóór CO2' :context='context' recorded />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Softsensor SI-Index'>
              <pi-axis :suggested-min='0.5' :suggested-max='0.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|SI-index (ss)' :context='context' recorded />
              </pi-axis>
            </pi-chart>
          </el-col>
          <h3>Online Metingen</h3>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Onlinemeting Troebelingsgraad'>
              <pi-axis :suggested-min='0.5' :suggested-max='0.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (online)|Troebelingsgraad (online) vóór filter' :context='context' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Onlinemeting pH'>
              <pi-axis :suggested-min='8.0' :suggested-max='9.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (online)|pH (online), vóór CO2' :context='context' />
              </pi-axis>
            </pi-chart>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label='Trends' lazy>

        <div class='year-picker' v-if='!isMobile'>
          <el-input-number v-model='yminInput' :step='1' :min='2012' controls-position='right' size='small'></el-input-number>
          <el-input-number v-model='ymaxInput' :step='1' controls-position='right' size='small'></el-input-number>
        </div>

        <el-row :gutter='10'>
          <el-col :xs='24' :span='8' v-for='parameter in parameters' :key='parameter.title'>
            <pi-chart :title="parameter.title"  :start='ymin' :end='ymax' legend='top'>
              <pi-axis :min="parameter.min" :max="parameter.max">


                <pi-trend 
                   :path="'.|Kwaliteitsmetingen effluent (lab)|'+parameter.path+' (lab)'" 
                   :context="context" 
                   color='red'
                   label = 'lab'
                   marker='rect'
                   :marker-size='5'
                   :line='false'
                  />

                <pi-trend v-if='parameter.sspath' :path="'.|Kwaliteitsmetingen effluent (ss)|'+parameter.sspath" :context='context' label='Softsensor'/>

              </pi-axis>
            </pi-chart>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import ReactorTable from '../components/reactor-table.vue'
import Gauge from '../components/gauge.vue'
import Proces from '../templates/proces.vue'

export default {
  name: 'app',
  data() { return {
    context: "",
    yminInput: new Date().getFullYear()-1,
    ymaxInput: new Date().getFullYear()+1,
    parameters: [
        {path:'Hardheid', sspath: 'Hardheid (ss)', title: 'Totale Hardheid (mmol/l)', min:0, max:2.0, ul:1.43, ll:1, rt:1},
        {path:'pH', sspath: 'pH (ss) vóór CO2',title: 'pH (-)', min:7, max:9.5, rt:1},
        {path:'HCO3', sspath: 'HCO3 (ss)', title: 'Bicarbonaat (mg/l)', min:0, max:250},
        {path:'EGV 20°C', sspath: 'EGV 20°C (ss) vóór CO2', title: 'Geleidbaarheid (mS/cm)', min:10, max:30, rt:1},
        {path:'TACC90', sspath: 'TACC90 (ss)', title: 'TACC90', min:0, max:0.6},
        {path:'Troebelingsgraad', title: 'Troebelingsgraad (FTE)', min:0, max:16, rt:1},
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
  components: {
    gauge: Gauge,
    proces: Proces,
    OnthardingTable: ReactorTable
  },
  computed: {
    isMobile() {
      return false
    },
    title() {
      return this.context.split("\\").pop()
    },
    ymin() {
      return this.yminInput
    },
    ymax() {
      return this.ymaxInput > new Date().getFullYear() ? "*" : this.ymaxInput
    },
  }
}
</script>

<style>
#reactor .pi-chart {
  margin-bottom: 10px;
}
#reactor {
  position: relative;
}
#reactor .year-picker {
  width: 510px;
  position: absolute;
  right: 0px;
  text-align: right;
  top: -60px;
}
#reactor .el-tabs__content {
  overflow: visible !important;
}
</style>
