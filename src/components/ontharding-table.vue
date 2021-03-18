<template>
  <div id='ontharding-table'>
    <table>
      <thead>
        <th>Parameter</th>
        <th>Prestatie</th>
        <th>Bewaking op</th>
        <th>Waarde<br/>(softsensor)</th>
        <th>Waarde<br/>(online)</th>
        <th>Waarde<br/>(lab)</th>
        <th>Datum</th>
        <th>Eenheid</th>
      </thead>
      <tbody>
        <tr v-for='item in params'>
          <td class='parameter-name'>{{item.name}}</td>
          <td>
            <pi-multistate :path="'.|Prestaties|Kleurwaarde onthardingsstraat|Kleurwaarde '+item.name" :context='context' class='kleurwaarde'>
              <pi-value :path="'.|Prestaties|Kleurwaarde onthardingsstraat|Kleurwaarde '+item.name" :context='context' ></pi-value>
            </pi-multistate>
          </td>
          <td>
            <pi-value :path="'.|Asset gegevens|Soort meting voor toetsing '+item.name+' gezamenlijk effluent'" :context='context' ></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Kwaliteitsmetingen effluent (ss)|'+item.name+' (ss)'" :context='context' v-if='item.name !== "Troebelingsgraad"'></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Kwaliteitsmetingen effluent (online)|'+item.name+' reinwater (online)'" :context='context' v-if="item.name == 'Troebelingsgraad'"></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Kwaliteitsmetingen effluent (lab)|'+item.name+' reinwater (lab)'" :context='context' ></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Kwaliteitsmetingen effluent (lab)|'+item.name+' reinwater (lab)|Datum'" :context='context' ></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Kwaliteitsmetingen effluent (lab)|'+item.name+' reinwater (lab)|Eenheid'" :context='context' ></pi-value>
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
      {name: 'Hardheid'},
      {name: 'pH'},
      {name: 'SI-Index'},
      {name: 'TACC90'},
      {name: 'HCO3'},
      {name: 'Troebelingsgraad'},
    ],
  }},
  computed: {
    params() {
      return this.parameters
    },
    isMobile() {
       return /Mobi/.test(navigator.userAgent)
    }
  }
}
</script>

<style>
#ontharding-table {
  overflow-x: auto;
}
#ontharding-table table {
  width: 100%;
  font-size: 14px;
  border-spacing: 0px;
}
#ontharding-table thead {
  text-align: center;
}
#ontharding-table th {
  padding: 10px;
  margin: 0px;
  background: #EEE;
}
#ontharding-table td {
  margin: 0px;
}

#ontharding-table .parameter-name {
  text-align: right;
  font-weight: bold;
  padding-right: 10px;
}

#ontharding-table td {
  border-bottom: 1px solid #CCC;
  border-left: 1px solid #DDD;
  text-align: center;
  padding: 5px 10px;
}
#ontharding-table .kleurwaarde {
  padding: 5px 10px;
  margin: 5px;
  text-align: center;
  border: 1px solid #333;
  color: #333;
  font-weight: bold;
  min-height: 16px;
}

</style>
