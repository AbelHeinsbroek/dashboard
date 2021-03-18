<template>
  <div id='reinwater-dispensatie-table'>
    <div class='information'>
      <dl>
        <dt>Geen</dt><dd>Parameter is beinvloedbaar door de zuivering</dd>
        <dt>Niet beinvloedbaar</dt><dd>De zuivering heeft geen invloed op deze parameter</dd>
        <dt>Dispensatie</dt><dd>Parameter is beinvloedbaar, maar de zuivering is niet in staat om de drempelwaarde te halen</dd>
      </dl>
    </div>
    <table>
      <thead>
        <th>Parameter</th>
        <th>Dispensatie</th>
        <th>Verklaring</th>
      </thead>
      <tbody>
        <tr v-for='item in parameters'>
          <td class='parameter-name' v-if='item.name.substring(0,2) != "ZZ"'>{{item.name}}</td>
          <td class='parameter-name' v-else><pi-value :path="'.|Waterkwaliteitsmetingen (lab)|'+item.name+' (lab)|Parameternaam dashboard'" :context='context' ></pi-value></td>
          <td class='dispensatie-waarde'>
            <pi-multistate :path="'.|Dispensatietabel normoverschrijdingen|'+item.name" :context='context' :colors="[[0,'geen'], [1,'niet-beinvloedbaar'], [2, 'dispensatie']]">
              <pi-value :path="'.|Dispensatietabel normoverschrijdingen|'+item.name" :context='context'></pi-value>
            </pi-multistate>
          </td>
          <td class='verklaring'>
            <pi-value :path="'.|Dispensatietabel normoverschrijdingen|'+item.name+'|Verklaring'" :context='context'></pi-value>
          </td>
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
      {name: 'pH', ll: 7.0, lt:7.7, ut: 8.3, ul: 9.5, min:7.0, max: 9.5, ln:7.0, un:9.5, rt:true},
      {name: 'EGV 20°C', ut: 80, ul: 125, min: 20, max: 125, un:125, rt:true},
      {name: 'Troebelingsgraad', ut: 0.4, ul: 1, un:1, rt:true},
      {name: 'Hardheid', ut:1.43, ul: 2, ll:1, min:0, max:2.5, ln:1, rt:true},
      {name: 'TACC90', min: 0, smax:0.7, ut:0.4, ul: 0.6, min: 0.2, max:0.7},
      {name: 'O2', lt: 4, ll:2, smin:5, smax:10, ln:2, rt:true},
      {name: 'HCO3', ll: 60, lt: 90, min: 40, max:350, ln:60},
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
#reinwater-dispensatie-table {
  overflow-x: auto;
}
#reinwater-dispensatie-table table {
  width: 100%;
  font-size: 14px;
  border-spacing: 0px;
}
#reinwater-dispensatie-table thead {
  text-align: center;
}
#reinwater-dispensatie-table th {
  padding: 10px;
  margin: 0px;
  background: #EEE;
}
#reinwater-dispensatie-table td {
  margin: 0px;
}

#reinwater-dispensatie-table .parameter-name {
  text-align: right;
  font-weight: bold;
  padding-right: 10px;
  width: 250px;
}

#reinwater-dispensatie-table .dispensatie-waarde {
  width: 250px;
  text-align: center;
}
#reinwater-dispensatie-table .geen {
}
#reinwater-dispensatie-table .dispensatie {
  font-weight: bold;
  color: darkred;
}
#reinwater-dispensatie-table .niet-beinvloedbaar {
  font-weight: bold;
  color: orange;
}

#reinwater-dispensatie-table td {
  border-bottom: 1px solid #CCC;
  border-left: 1px solid #DDD;
  text-align: left;
  padding-left: 10px;
  height: 40px;
}
.information {
  display: inline-block;
  font-size: 13px;
}
.information dt {
  float: left;
  clear: left;
  width: 130px;
	text-align: right;
  font-weight: bold;
}
.information dt::after {
	content: ":";
}
.information dd {
   margin: 0 0 0 140px;
	 padding: 0 0 0.5em 0;
}

</style>
