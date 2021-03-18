<template>
  <div id='reinwater-table'>
    <table>
      <thead>
        <th>Parameter</th>
        <th>Waarde<br/>(real-time)</th>
        <th>Waarde<br/>(softsensor)</th>
        <th>Waarde<br/>(labmeting)</th>
        <th>Datum</th>
        <th>Eenheid</th>
        <th>Drempelwaarde</th>
        <th>Grenswaarde</th>
        <th>DWB Norm</th>
        <th>Beinvloedbaar</th>
      </thead>
      <tbody>
        <tr v-for='item in parameters'>
          <td class='parameter-name' v-if='item.name.substring(0,2) != "ZZ"'>{{item.name}}</td>
          <td class='parameter-name' v-else><pi-value :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)|Parameternaam dashboard'" :context='context' ></pi-value></td>

          <td>
            <div v-if='item.rt'>
              <pi-multistate :path="'.|Prestaties|Toetsing reinwaterparameters (online)|'+item.name+' (online)'" :context='context' :colors="[[-4,'red'],[-3,'red'],[-2,'yellow'],[-1,'green'],[0,'gray'],[1,'green'],[2,'yellow'],[3,'red'],[4,'red']]" class='kleurwaarde'>
                <pi-value :path="'.|Waterkwaliteitsmetingen (online)|'+item.name+' (online)'" :context='context' ></pi-value>
              </pi-multistate>
            </div>
          
          </td>
          <td>
            <div v-if='item.ss'>
              <pi-multistate :path="'.|Prestaties|Toetsing reinwaterparameters (ss)|'+item.name+' (ss)'" :context='context' :colors="[[-4,'red'],[-3,'red'],[-2,'yellow'],[-1,'green'],[0,'gray'],[1,'green'],[2,'yellow'],[3,'red'],[4,'red']]" class='kleurwaarde'>
                <pi-value :path="'.|Waterkwaliteitsmetingen (ss)|'+item.name+' (ss)'" :context='context' ></pi-value>
              </pi-multistate>
            </div>
          
          </td>
          <td>
            <pi-multistate :path="'.|Prestaties|Toetsing reinwaterparameters (lab)|'+item.name+' (lab)'" :context='context' :colors="[[-4,'red'],[-3,'red'],[-2,'yellow'],[-1,'green'],[0,'gray'],[1,'green'],[2,'yellow'],[3,'red'],[4,'red']]" class='kleurwaarde'>
              <pi-value :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)'" :context='context' ></pi-value>
            </pi-multistate>
          </td>
          <td>
              <pi-value :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)|Datum'" :context='context'></pi-value>
          </td>
          <td>
              <pi-value :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)|Eenheid'" :context='context'></pi-value>
          </td>
          <td>
            <span v-show='item.lt'>&ge; {{item.lt}}</span>
            <span v-show='item.ut'>&le; {{item.ut}}</span>
          </td>
          <td>
            <span v-show='item.ll'>&ge; {{item.ll}}</span>
            <span v-show='item.ul'>&le; {{item.ul}}</span>
          </td>
          <td>
            <span v-show='item.ln'>&ge; {{item.ln}}</span>
            <span v-show='item.un'>&le; {{item.un}}</span>
          </td>
          <td>
            <pi-multistate :path="'.|Dispensatietabel normoverschrijdingen|'+item.name" :colors="[[0,'green'],[1,'white'], [2, 'striped']]" :context='context' class='dispensatie'></pi-multistate>
          <td />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  data() { return {
    context: '',
    parameters: [
      {name: 'pH', ll: 7.0, lt:7.7, ut: 8.3, ul: 9.5, min:7.0, max: 9.5, ln:7.0, un:9.5, rt:true, ss:true},
      {name: 'EGV 20°C', ut: 80, ul: 125, min: 20, max: 125, un:125, rt:true, ss:true},
      {name: 'Troebelingsgraad', ut: 0.4, ul: 1, un:1, rt:true},
      {name: 'Hardheid', ut:1.43, ul: 2, ll:1, min:0, max:2.5, ln:1, rt:true, ss:true},
      {name: 'O2', lt: 4, ll:2, smin:5, smax:10, ln:2, rt:true},
      {name: 'TACC90', min: 0, smax:0.7, ut:0.4, ul: 0.6, min: 0.2, max:0.7, ss:true},
      {name: 'HCO3', ll: 60, lt: 90, min: 40, max:350, ln:60, ss:true},
      {name: 'Agressief CO2', ul: 2.2, min:0, max:2.5},
      {name: 'TOC', min:0, max:6},
      {name: 'Kleurintensiteit', ut: 10, ul: 20, min:0, max:25, un: 20},
      {name: 'Fe', ut: 0.05, ul: 0.1, min:0, max:0.15, un:0.2},
      {name: 'Mn', ut: 0.01, ul: 0.05, min:0, max:0.06, un:0.05},
      {name: 'Al', ul: 30, min:0, max:60, un: 200},
      {name: 'NH4', ut: 0.05, ul: 0.20, min:0, max:0.1, un:0.2},
      {name: 'Na', ut: 100, ul: 150, min:0, max:120, un:150},
      {name: 'Cl', ut: 100, ul: 150, min:0, max:120, un: 150},
      {name: 'SO4', ut: 100, ul: 150, min:0, max:120, un: 150},
      {name: 'NO3', ut: 25, ul: 50, min:0, max:60, un: 50},
      {name: 'NO2', ut: 0.03, ul: 0.05, smin:0, smax:0.05, un: 50},
      {name: 'As', ut: 1.00, ul: 10.0, smin:0, smax:0.05, un: 50},
      {name: 'Ni', ut: 1.00, ul: 10.0, smin:0, smax:0.05, un: 50},
      {name: 'Enzymactiviteit', min:0, max:2},
      {name: 'E-coli', ul: 1.0, min:0, max:2, un:1},
      {name: 'Aeromonas 30°C', ut: 20, ul: 100, min:0, max:120, un:1000},
      {name: 'Koloniegetal 22°C', ul: 100, min:0, max:150, un: 100},
    ]
  }},
  computed: {
    isMobile() {
       return /Mobi/.test(navigator.userAgent)
    }
  },
  beforeMount() {
    this.context = this.$route.params.context
  },
  mounted() {
    this.loadLocationSpecific()
  },
  methods: {
    async loadLocationSpecific() {
      var requests = []

      for (var loc=1; loc<6;loc++) {
        var path = this.context + "|Waterkwaliteitsmetingen (lab)|ZZ LOC0" + loc + " (lab)"
        requests.push(this.$pi.getValue(path))
      }
      var results = await Promise.all(requests)
      var loc = 1;
      for (var result of results) {
        if(result.Good) {
          this.parameters.push({
            name: 'ZZ LOC0'+loc
          })
        }
        loc += 1
      }
    }
  },
  watch: {
    '$route.params.context'() {
      this.context = this.$route.params.context
    }
  },
  components: {
  },
}
</script>

<style>
#reinwater-table {
  overflow-x: auto;
}
#reinwater-table table {
  width: 100%;
  font-size: 14px;
  border-spacing: 0px;
}
#reinwater-table thead {
  text-align: center;
}
#reinwater-table th {
  padding: 10px;
  margin: 0px;
  background: #EEE;
}
#reinwater-table td {
  margin: 0px;
}

#reinwater-table .parameter-name {
  text-align: right;
  font-weight: bold;
  padding-right: 10px;
}

#reinwater-table td {
  border-bottom: 1px solid #CCC;
  border-left: 1px solid #DDD;
  text-align: center;
  height: 40px;
}
#reinwater-table .kleurwaarde {
  padding: 5px 10px;
  margin: 5px;
  text-align: center;
  border: 1px solid #333;
  color: #000;
  height: 16px;
}
#reinwater-table .kleurwaarde {
  text-overflow: ellipsis;
}
td.sparkline {
  padding: 0px !important;
  max-width: 300px;
}

#reinwater-table .dispensatie {
  margin: auto;
  text-align: center;
  border: 1px solid #333;
  width: 20px;
  border-radius: 20px;
  color: #000;
  height: 20px;
}
#reinwater-table .striped {
  background: repeating-linear-gradient(
    135deg,
    white,
    white 3px,
    #67B23A 3px,
    #67B23A 6px
  );
}

</style>
