<template>
  <div id="winveld">
    <h2>{{title}}</h2>
    <el-tabs>
      <el-tab-pane label='Overzicht' lazy>
        <el-row :gutter='10'>
          <el-col :span='18' :xs='24'>
            <h4>Winveld</h4>
            <groundwater-map :context='context'></groundwater-map>
            <br />
          </el-col>
          <el-col :span='6' :xs='24'>
            <h4>Putten</h4>
            <div v-for="pump in children" class='pump' :key='pump.Path'>
              <pi-multistate path=".|Procesgegevens|Status winput (numeriek)" :context="pump.Path" :colors="[[0,'pump-off'],[1,'pump-on']]" class='pump-icon'></pi-multistate><span class='pump-name'>{{pump.Name}}</span>
              <pi-value path=".|Procesgegevens|Waterdebiet winput" :context="pump.Path" units='' :precision='1' class='pump-flow'></pi-value> m<sup>3</sup>/h
            </div>
          </el-col>
          <el-col :span='12' class='hidden-xs-only'>
            <h4>Abstractie</h4>
            <pi-chart title='Grondwaterproductie' :maintain-aspect-ratio="false" class='productie'>
              <pi-trend :context='context' path='.|Procesgegevens|Waterdebiet inkomend ruwwater' color='#99F' start='*-24h' end='*' stepped></pi-trend>
            </pi-chart>
            <h4>Putschakelingen</h4>
            <div id='schakelingen'>
              <schakelingen-matrix v-if='children' :wells='children' :context='context'></schakelingen-matrix>
            </div>
          </el-col>
          <el-col :span='12' :xs='24'>
          <h4>Ruwwaterkwaliteit</h4>
          <groundwater-table :context='context'></groundwater-table>
          </el-col>

        </el-row>

      </el-tab-pane>
      <el-tab-pane label="Putkwaliteiten" lazy>
          <groundwater-matrix :wells='children' :context='context'></groundwater-matrix>
      </el-tab-pane>
      <el-tab-pane label="Putschakelingen" lazy>
        <div id='schakelingen-full'>
          <inspector :wells='children' :context='context'></inspector>
        </div>
      </el-tab-pane>
      <el-tab-pane label='Ruwwater Labmetingen' lazy>
        <groundwater-trends :context='context'></groundwater-trends>
      </el-tab-pane>
      <el-tab-pane label='Ruwwater Softsensor' lazy>
        <groundwater-softsensor :context='context'></groundwater-softsensor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import map from '../components/leaflet.vue'
import matrix from '../components/groundwater-matrix'
import matrix2 from '../components/put-matrix'
import softsensor from '../templates/softsensor'
import trends from '../templates/grondwater-trends'
import inspector from '../templates/put-matrix-inspector'
import table from '../components/grondwater-table'
import process from '../templates/proces'

export default {
  name: 'winstraat',
  data() { return {
    context: "",
    parameters: [],
    cmap: ["#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f"],
  }},
  components: {
    GroundwaterMap: map,
    GroundwaterMatrix: matrix,
    SchakelingenMatrix: matrix2,
    GroundwaterSoftsensor: softsensor,
    GroundwaterTrends: trends,
    GroundwaterTable: table,
    Process: process,
    Inspector: inspector
  },

  beforeMount() {
      this.context = this.$route.params.context
  },
  watch: {
    '$route' (to, from) {
      this.context = to.params.context
    }
  },
  asyncComputed: {
    children() {
      return this.$pi.getChildren(this.context)
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
.pump-icon {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  display: inline-block;
  margin-right: 10px;
}
.pump-name {
  display: inline-block;
  width: 100px;
  font-weight: bold;
}
.pump-flow {
  display: inline-block;
  text-align: right;
  width: 50px;
}
.pump-icon.pump-on {
  background: green;
}
.pump-icon.pump-off {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  border: 2px solid gray;
}
.putschakelingen, .productie {
  height: 250px;
}
#schakelingen canvas {
  min-height: 200px;
  height: 30vw;
  max-height: 300px;
}
#schakelingen-full canvas {
  height: 45vw;
  min-height: 300px;
  max-height: 500px;
}
</style>
