<template>
  <div class='well-matrix'>

    <div class='mode-toggle'>
      <el-radio-group v-model="mode">
        <el-radio-button label="matrix">Matrix</el-radio-button>
        <el-radio-button label="comparison">Vergelijking</el-radio-button>
      </el-radio-group>
    </div>

    <table v-if="mode=='matrix'">
      <thead>
        <th></th>
        <th>Put</th>
        <th>Debiet</th>
        <th v-for='parameter in parameters' :key='parameter'>{{parameter}}</th>
        <th></th>
      </thead>
      <tr v-for='well in wells' :key='well.Path'>

        <td class='well-status'>
            <pi-multistate path=".|Procesgegevens|Status winput (numeriek)" :context="well.Path" :colors="[[0,'pump-off'],[1,'pump-on']]" class='pump-icon'></pi-multistate>
        </td>
        <td class='well-name'>{{well.Name}}</td>
        <td class='well-volume'>
            <pi-value path=".|Procesgegevens|Waterdebiet winput" :context="well.Path" units='auto'></pi-value>
        </td>
        <td v-for='parameter in parameters'>
          <pi-value :path="'.|Waterkwaliteit|'+parameter" :context="well.Path" units='' :precision='1'></pi-value>
        </td>
        <td>
          <el-button size='small' icon='el-icon-chart' @click="$router.push({name: 'put', params: {context: well.Path}})">Kwaliteithistorie</el-button>
        </td>

      </tr>
      <tr class='softsensor'>
        <td>
        </td>
        <td class='well-name'>Softsensor</td>
        <td class='well-volume'>
            <pi-value path=".|Procesgegevens|Waterdebiet inkomend ruwwater" :context="context" units='auto'></pi-value>
        </td>
        <td v-for='parameter in parameters' :key='parameter'>
          <pi-value :path="'.|Waterkwaliteitsmetingen (ss)|'+parameter + ' (ss)'" :context="context" units='' :precision='1'></pi-value>
        </td>
        <td>
        </td>
      
      
      </tr>
    </table>
    <div v-else>
    <el-row :gutter='10'>
      <el-col :xs='24' :span='12' v-for='parameter in parameters' key='parameter'>
        <h3>{{parameter}}</h3>
        <pi-chart start='*-5y' end='*' legend='top'>
            <pi-trend
              v-for='(well, windex) in wells'
              :key='well.Path'
              :path="'.|Waterkwaliteitsmetingen (lab)|'+parameter+' (lab)'"
              :context="well.Path"
              :marker-size="5"
              marker="rect"
              :color="cmap[windex]"
              :line="false"
              :label="well.Name"
              recorded
              />
        </pi-chart>
      </el-col>
    </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: ['wells', 'context'],
  data() { return {
    parameters: ['Al', 'Ca', 'CH4', 'Cl', 'EGV 20°C', 'Fe', 'Hardheid', 'HCO3', 'K', 'Mg', 'Mn', 'Na', 'NH4', 'NO3', 'pH', 'SO4', 'As', 'Temperatuur'],
    mode: 'matrix',
    cmap: ["#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f"],
  }}
}
</script>
<style>
.well-matrix {
  overflow-x: auto;
}
.well-matrix table {
  width: 100%;
  font-size: 14px;
  border-spacing: 0px;
  text-align: center;
}
.well-matrix tr:nth-child(even) {
    background-color: #f2f2f2
}
.well-matrix .well-volume {
}
.well-matrix thead {
  color: #777;
  font-size: 15px;
}
.well-matrix th {
  padding: 10px;
  margin: 0px;
  border-bottom: 1px solid #777;
}
.well-matrix td {
  padding: 15px 5px;
  margin: 0px;
  border-right: 1px solid #EEE;
}

.well-matrix .well-status {
  padding: 0px;
  text-align: center;
  border-right: none;
  width: 30px;
}
.well-matrix .pump-icon {
  margin-right: 0px;
}
.well-matrix .well-name {
  font-weight: bold;
  text-align: left;
}

.well-matrix td {
  border-bottom: 1px solid #EEE;
}
.well-matrix .softsensor td {
  font-weight: bold;
  background-color: #409EFF;
  color: #FFF;
  border-right: none;
  border-top: 2px solid #888;
}
.well-matrix .mode-toggle {
  text-align: center;
  border-bottom: 1px solid #CCC;
  height: 20px;
  margin: 0px 0px;
  margin-bottom: 30px;
}

</style>
