<template>
  <div id='groundwater-table'>
    <table>
      <thead>
        <th>Parameter</th>
        <th>Waarde<br/>(softsensor)</th>
        <th>Waarde<br/>(labmeting)</th>
        <th>Datum</th>
        <th>Eenheid</th>
      </thead>
      <tbody>
        <tr v-for='item in parameters'>
          <td class='parameter-name'>{{item.name}}</td>
          <td>
            <pi-value v-if='!item.noss' :path="'.|Waterkwaliteitsmetingen (ss)|'+item.name+' (ss)'" :context='context' ></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)'" :context='context' ></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)|Datum'" :context='context'></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)|Eenheid'" :context='context' v-if="item.name != 'CH4' && item.name != 'Al'"></pi-value>
              <span v-else>μg/l</span>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
  </div>
</template>

<script>

export default {
  props: ['context'],
  data() { return {
    parameters: [
      {name: 'pH'},
      {name: 'EGV 20°C'},
      {name: 'Hardheid'},
      {name: 'HCO3'},
      {name: 'CO2'},
      {name: 'Ca'},
      {name: 'Mg'},
      {name: 'TOC'},
      {name: 'Fe'},
      {name: 'Mn'},
      {name: 'NH4'},
      {name: 'Na'},
      {name: 'Cl'},
      {name: 'SO4'},
      {name: 'CH4'},
      {name: 'Al'},
      {name: 'K'},
    ]
  }},
  computed: {
    isMobile() {
       return /Mobi/.test(navigator.userAgent)
    }
  }
}
</script>

<style>
#groundwater-table {
  overflow-x: auto;
}
#groundwater-table table {
  width: 100%;
  font-size: 14px;
  border-spacing: 0px;
}
#groundwater-table thead {
  text-align: center;
}
#groundwater-table th {
  padding: 10px;
  margin: 0px;
  background: #EEE;
}
#groundwater-table td {
  margin: 0px;
}

#groundwater-table .parameter-name {
  text-align: right;
  font-weight: bold;
  padding-right: 10px;
}

#groundwater-table td {
  border-bottom: 1px solid #CCC;
  border-left: 1px solid #DDD;
  text-align: center;
  padding: 5px 10px;
}
td.sparkline {
  padding: 0px !important;
  max-width: 300px;
}

</style>
