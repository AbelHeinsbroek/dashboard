<template>
  <div id="test">
    <h1>Dispensatie tabel</h1>
    <div v-for='(team,name) in locations' :key='name'>
      <h3>{{name}}</h3>
      <div class='multistate green demo'></div>Beinvloedbaar <br />
      <div class='multistate gray demo'></div>Niet Beinvloedbaar <br />
      <div class='multistate orange demo'></div>Dispensatie <br />
      <table cellspacing=0 cellpadding=0>
        <thead>
          <th class='title'></th>
          <th v-for='parameter in parameters' :key='parameter' class='rotate'><div><span>{{parameter}}</span></div></th>
        </thead>
        <tbody>
          <tr v-for='location in team'>
            <td>{{location.Name}}</td>
            <td v-for='parameter in parameters'>

              <pi-multistate :context='location.Path' :path="'.\\Reinwater\\Reinwater opslag|Dispensatietabel normoverschrijdingen|'+parameter" :colors='colors'>&nbsp;</pi-multistate>

            </td>
          </tr>
        
        
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  data() { return {
    locations: {},
    parameters: ['Aeromonas 30°C', 'Agressief CO2', 'Al', 'Cl', 'E-Coli', 'EGV 20°C', 'Enzymactiviteit', 'Fe', 'Hardheid', 'HCO3', 'Kleurintensiteit', 'Koloniegetal 22°C', 'Mn', 'Na', 'NH4', 'NO2', 'NO3', 'O2', 'pH', 'SI-index', 'SO4', 'TACC90', 'TOC', 'Troebelingsgraad'],
    colors: [[0,'green'],[1,'gray'], [2, 'orange']]
  }},

  mounted() {
    this.loadLocations()
  },
  methods: {
    async loadLocations() {

        this.locations = {}
        var teams = await this.$pi.getChildren('\\\\SR-16642\\SLIMM Productie\\Vitens')
        var requests = []

        // create request promises
        for(var team of teams) {
          if(team.Name != "Productiebedrijven") {
            requests.push(this.$pi.getChildren(team.Path))
          }
        }

        var results = await Promise.all(requests)

        for(var team of teams) {
          if(team.Name != "Productiebedrijven") {
            this.$set(this.locations,team.Name,results.shift())
          }
        }
    }
  }



}
</script>
<style scoped>
table {
  font-size: 13px;
}
table .multistate {
  padding: 5px;
}
table td {
  border-right: 2px solid #FFF;
  border-bottom: 2px solid #FFF;
}

th.title {
  width: 200px;
}
th.rotate {
  height: 140px;
  white-space: nowrap;
}
th.rotate > div {
  transform: translate(15px, 51px)
  rotate(315deg);
  width: 30px;
}
th.rotate > div > span {
  border-bottom: 1px solid #AAA;
  padding: 5px 10px;
}

.gray {
  background: #CCC;
}
.demo {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-right: 10px;
}

</style>
