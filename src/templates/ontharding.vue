<template>
  <div id="ontharding-street">
    <h1>Pelletontharding Straat 1</h1>
      <el-row :gutter='10'>
        <el-col :span='6'>
          <gauge path=".|Prestaties|Cijfer Hardheid ontharding" :context='context' title='Hardheid' />
        </el-col>
        <el-col :span='6'>
          <gauge path=".|Prestaties|Cijfer TACC90 ontharding" :context='context' title='TACC90' />
        </el-col>
        <el-col :span='6'>
          <gauge path=".|Prestaties|Cijfer pH ontharding" :context='context' title='pH' />
        </el-col>
        <el-col :span='6'>
          <gauge path=".|Prestaties|Cijfer Troebelingsgraad ontharding" :context='context' title='Troebelheid' />
        </el-col>
      </el-row>

    <el-tabs>
      <el-tab-pane label='Overzicht' lazy>
        <el-row :gutter='15'>
          <el-col :span='8'>
            <h3>Softsensoren</h3>
            <pi-chart start='*-18d' end='*' title='Softsensor Hardheid'>
              <pi-axis :min='1.20' :max='1.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|Hardheid (ss)' :context='context' recorded />
                <pi-trend path='.|Kwaliteitsmetingen effluent (lab)|Hardheid reinwater (lab)' :context='context' :line='false' marker='rect' color='red' :marker-size='5' recorded />
                <pi-threshold mode='le' :value='1' color='red' />
                <pi-threshold mode='ge' :value='1.43' color='orange' />
                <pi-threshold mode='ge' :value='2' color='red' />
              </pi-axis>
            </pi-chart> <br />
            <pi-chart start='*-18d' end='*' title='Softsensor TACC90'>
              <pi-axis :min='0.20' :max='0.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|TACC90 (ss)' :context='context' recorded />
                <pi-trend path='.|Kwaliteitsmetingen effluent (lab)|TACC90 reinwater (lab)' :context='context' :line='false' marker='rect' color='red' :marker-size='5' recorded />
                  <pi-threshold mode='ge' :value='0.4' color='orange' />
                  <pi-threshold mode='ge' :value='0.6' color='red' />
              </pi-axis>
            </pi-chart>
            <br />
            <pi-chart start='*-18d' end='*' title='Softsensor pH'>
              <pi-axis :min='7.70' :max='8.3'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (lab)|pH reinwater (lab)' :context='context' :line='false' marker='rect' color='red' :marker-size='5' recorded />
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|pH (ss)' :context='context' recorded />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='16'>
            <h3>Reactoren</h3>
            <div class='reactors'>
              <div class='reactor' v-for='reactor in reactors' :key='reactor.Path' >
                <pi-multistate :path="reactor.Path+'|Prestaties|Kleurwaarde proces onthardingsreactor'" class='reactor-unit'>
                </pi-multistate>
                  <el-button @click="$router.push({name: 'reactor', params: {context: reactor.Path}})">
                    {{reactor.Name}}
                  </el-button>
              </div>
            </div>
            <h3>Waterkwaliteit en Toetsing</h3>
            <ontharding-table :context='context' />
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label='Real-time Waterkwaliteit' lazy>
        <el-row :gutter='15'>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Softsensor Hardheid'>
              <pi-axis :suggested-min='1.20' :suggested-max='1.5'>
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
              <pi-axis :suggested-min='7.5' :suggested-max='8.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|pH (ss)' :context='context' recorded />
                  <pi-threshold mode='le' :value='7.7' color='orange' />
                  <pi-threshold mode='ge' :value='8.3' color='orange' />
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
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|EGV 20°C (ss)' :context='context' recorded />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='8'>
            <pi-chart start='*-2d' end='*' title='Softsensor SI-Index'>
              <pi-axis :suggested-min='0' :suggested-max='0.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|SI-index (ss)' :context='context' recorded />
              </pi-axis>
            </pi-chart>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label='Reactoren' lazy>
        <el-row :gutter='15'>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Softsensor Hardheid' legend='top'>
              <pi-axis :suggested-min='1.20' :suggested-max='1.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|Hardheid (ss)' :context='reactor.Path' recorded v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Softsensor TACC90' legend='top'>
              <pi-axis :suggested-min='0.20' :suggested-max='0.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|TACC90 (ss)' recorded :context='reactor.Path' recorded v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Softsensor pH' legend='top'>
              <pi-axis :suggested-min='7.5' :suggested-max='8.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|pH (ss) vóór CO2' recorded :context='reactor.Path' recorded v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Softsensor HCO3' legend='top'>
              <pi-axis :suggested-min='80' :suggested-max='8.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|HCO3 (ss)' recorded :context='reactor.Path' recorded v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Softsensor EGV' legend='top'>
              <pi-axis>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|EGV 20°C (ss) vóór CO2' recorded :context='reactor.Path' recorded v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Softsensor SI-Index' legend='top'>
              <pi-axis :suggested-min='0' :suggested-max='0.5'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|SI-index (ss)' recorded :context='reactor.Path' recorded v-for='(reactor, index) in reactors'  :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label='Procesgegevens' lazy>
        <el-row :gutter='15'>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Debiet reactor' legend='top'>
              <pi-axis :suggested-min='1.20' :suggested-max='1.5'>
                <pi-trend path='.|Procesgegevens|Waterdebiet onthardingsreactor' :context='reactor.Path' v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Debiet Bypass' legend='top'>
              <pi-axis :suggested-min='0.20' :suggested-max='0.5'>
                <pi-trend path='.|Procesgegevens|PI Waterdebiet by-pass reactor (meting)' :context='reactor.Path' v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Bedhoogte pelletbed' legend='top'>
              <pi-axis :suggested-min='7.5' :suggested-max='8.5'>
                <pi-trend path='.|Procesgegevens|Bedhoogte pelletbed (meting)' :context='reactor.Path' v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Drukverschil' legend='top'>
              <pi-axis :suggested-min='80' :suggested-max='8.5'>
                <pi-trend path='.|Procesgegevens|PI drukverschil fluide bed (meting)' :context='reactor.Path' v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
          <el-col :span='12'>
            <pi-chart start='*-2d' end='*' title='Softsensor EGV' legend='top'>
              <pi-axis>
                <pi-trend path='.|Procesgegevens|Dosering kalkmelk' :context='reactor.Path' v-for='(reactor, index) in reactors' :color='cmap[index]' :label='reactor.Name' :key='reactor.Path' />
              </pi-axis>
            </pi-chart>
          </el-col>
        </el-row>

      </el-tab-pane>




      </el-tab-pane>
    </el-tabs>
    <!--
      <el-tab-pane label='Realtime Waterkwaliteit'>
        </el-row>
        <el-row>
          <el-col :span='8'>
            <pi-chart start='*-6d' end='*' title='Softsensor HCO3'>
              <pi-axis :suggested-min='125' :suggested-max='180'>
                <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|HCO3 (ss)' :context='context' recorded />
                  <pi-threshold mode='le' :value='7.7' color='orange' />
                  <pi-threshold mode='ge' :value='8.3' color='orange' />
              </pi-axis>
            </pi-chart>
          </el-col>
        </el-row>
        hip
      </el-tab-pane>
      <el-tab-pane label='Reactoren' lazy>
        hoi
      </el-tab-pane>
    </el-tabs>
    -->

    <!--
        <pi-chart start='*-6d' end='*' title='Softsensor Hardheid'>
          <pi-axis :suggested-min='1.20' :suggested-max='1.5'>
            <pi-trend path='.|Kwaliteitsmetingen effluent (ss)|Hardheid (ss)' :context='context' />
          </pi-axis>
        </pi-chart>
    -->
  
  </div>
</template>

<script>

import Gauge from '../components/gauge.vue'
import OnthardingTable from '../components/ontharding-table.vue'

export default {
  name: 'app',
  data() { return {
    cmap: ["#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f"],
    context: "",
    reactors: [],
  }},
  beforeMount() {
      this.context = this.$route.params.context + "\\Pelletontharding - straat 1"
  },
  mounted() {
    this.loadData()
  },
  watch: {
    '$route' (to, from) {
      this.context = to.params.context
    }
  },
  methods: {
    async loadData() {
      this.reactors = await this.$pi.getChildren(this.context)
    }
  },
  components: {
    gauge: Gauge,
    OnthardingTable: OnthardingTable
  },
  computed: {
    title() {
      return this.context.split("\\").pop()
    }
  }
}
</script>

<style>
.pi-chart {
  margin-bottom: 15px;
}
.gauges {
  height: 220px;
}
.gauge {
  margin-bottom: 20px;
}
.reactor {
  width: 200px;
  display: inline-block;
  text-align: center;
}
.reactor-unit.orange {
  background-color: #FF2323;
}
.reactor-unit {
  width: 120px;
  height: 120px;
  border: 1px solid #333;
  margin: auto;
  margin-bottom: 10px;
  background-image: url(../assets/steps/ontharder.png);
  background-size: 130px;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
