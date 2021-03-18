<template>
  <div id="location">
    <h2>{{locationName}}</h2>
    <h3>Reinwaterkwaliteit</h3>

    <div class='hidden-sm-and-down buttons'>
        <el-button @click="handleCommand('maps')"><i class='fa fa-map-o'></i> Locatie</el-button>
        <el-button @click="handleCommand('pid')"><i class='fa fa-tachometer'></i> Processchema</el-button>
        <el-button @click="handleCommand('paspoort')" v-if="paspoortLink != ''"><i class='fa fa-file-text-o'></i> Paspoort</el-button>
        <el-button @click="handleCommand('ris')" v-if="risCode != ''"><i class='fa fa-recycle'></i> Reststoffen</el-button>
    </div>

    <el-dropdown @command="handleCommand" class='open-dropdown hidden-md-and-up'>
      <el-button type="default">Open...<i class='el-icon-arrow-down el-icon--right'></i></el-button>
      <el-dropdown-menu slot='dropdown'>
        <el-dropdown-item command="maps"><i class='fa fa-map-o'></i> Locatie in Google Maps</el-dropdown-item>
        <el-dropdown-item command="pid"><i class='fa fa-tachometer'></i> Open Processchema</el-dropdown-item>
        <el-dropdown-item command="paspoort" v-if="paspoortLink != ''"><i class='fa fa-file-text-o'></i> Open Paspoort</el-dropdown-item>
        <el-dropdown-item command="ris" v-if="locationName == 'Pb. Kolff'"><i class='fa fa-recycle'></i> Open RIS</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    
    <div class='reinwatercijfer'>
      <el-row>
        <el-col :span='8' :xs="24">
          <div class='cijfer'>
            <gauge path=".|Dashboardgegevens|Reinwater|Rapportcijfer reinwater" :context="context"></gauge>
          </div>
        </el-col>
        <el-col :span='16' :xs="24" class='hidden-xs-only'>
          <div class='rapportcijfer'>
          <pi-chart start='*-1y' end='*' title='Rapportcijfer Reinwater' :maintain-aspect-ratio="false">
            <pi-axis :min='6' :max='10'>
              <pi-trend path=".\Reinwater\Reinwater opslag|Prestaties|Rapportcijfer reinwater" :context="context" color='#409EFF' :width='2' label='Cijfer' />
            </pi-axis>
          </pi-chart>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class='location_stats'>
      <el-row>
        <el-col :span='8' :xs='24'>
          <h4>Productie</h4>
          <label>Inkomend Ruwwater:</label><pi-value path=".|Dashboardgegevens|Grondwaterwinning|Totaal inkomend ruwwater" :context='context' :precision='0' /> m<sup>3</sup>/h <br />
          <label>Uitgaand Reinwater:</label><pi-value path=".|Dashboardgegevens|Reinwater|Totaal uitgaand reinwater" :context='context' :precision='0' /> m<sup>3</sup>/h
        </el-col>
        <el-col :span='8' :xs='24' class='hidden-xs-only'>
          <h4>Voortschrijdend jaargemiddelde</h4>
          <label>Inkomend Ruwwater:</label><pi-value path=".|Dashboardgegevens|Grondwaterwinning|Jaartotaal inkomend ruwwater" :context='context' /> Mm<sup>3</sup>/h <br />
          <label>Uitgaand Reinwater:</label><pi-value path=".|Dashboardgegevens|Reinwater|Jaartotaal uitgaand reinwater" :context='context' /> Mm<sup>3</sup>/h
        </el-col>
        <el-col :span='8' :xs='24' class='hidden-xs-only'>
          <h4>Adresgegevens</h4>
          <pi-value path='.|Adresgegevens|Adres' :context='context'></pi-value><br />
          <pi-value path='.|Adresgegevens|Postcode' :context='context'></pi-value>&nbsp;<pi-value path='.|Adresgegevens|Plaats' :context='context'></pi-value>
          <pi-value path='.|Adresgegevens|Land' :context='context'></pi-value><br />
        </el-col>
      </el-row>
    </div>

    <h3>Processtappen</h3>
    <div class='location_steps' v-loading='loading'>
      <div class='step' v-for='(step, index) in steps' :style="{order: step.order}">

        <div class='step_icon' :class='step.Name.toLowerCase()' @click="$router.push({name: 'ontharding-demo', params: {context: context+'\\'+step.Name}})" v-if='locationName == "Pb. Tull en t Waal" && step.Name == "Ontharding"'></div>
        <div class='step_icon' :class='step.Name.toLowerCase()' @click="$router.push({name: step.Name.toLowerCase(), params: {context: context+'\\'+step.Name}})" v-else></div>

        <el-button @click="$router.push({name: 'ontharding-demo', params: {context: context+'\\'+step.Name}})" class='step-name' v-if='locationName == "Pb. Tull en t Waal" && step.Name == "Ontharding"'>{{step.Name}}</el-button>

        <el-button @click="$router.push({name: step.Name.toLowerCase(), params: {context: context+'\\'+step.Name}})" class='step-name' v-else>
            <pi-multistate path=".\Reinwater\Reinwater opslag|Prestaties|Kleurwaarde reinwaterparameters" :context='context' class='water-state' v-if="step.Name == 'Reinwater'" :colors="[[1,'green'],[2,'yellow'],[3,'orange'],[4,'red']]"></pi-multistate>
          {{step.Name}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import Gauge from '../components/gauge.vue'

export default {
  name: 'Overzicht',
  data() { return {
    loading: true,
    context: '',
    paspoortLink: '',
    risCode: 'A'
  }},

  beforeMount() {
    this.context = this.$route.params.context
  },

  components: {
    gauge: Gauge
  },

  watch: {
    '$route.params.context'() {
      this.context = this.$route.params.context
    }
  },
  asyncComputed: {
    async paspoortLink() {
      if(this.context == "") { return "" }
      var path = this.$pi.parse(".|Locatiegegevens|Paspoort Link", this.context)
      var link = await this.$pi.getValue(path)
      return link.Value
    },
    async risCode() {
      if(this.context == "") { return "" }
      var path = this.$pi.parse(".|Locatiegegevens|RIS Code", this.context)
      var link = await this.$pi.getValue(path)
      return link.Value
    },
    async steps() {
      if(this.context == "") {
        return []
      }
      this.loading = true
      var children = await this.$pi.getChildren(this.context)
      var requests = []

      for(var child of children) {
        var path = child.Path + "|Asset gegevens|Volgnummer"
        requests.push(this.$pi.getValue(path))
      }
      var order = await Promise.all(requests)

      for(var child of children) {
        child.order = order.shift().Value
      }

      this.loading = false
      return children
    }
  },
  computed: {
    locationName() {
      return this.context.split("\\").pop()
    }
  },

  methods: {
    handleCommand(cmd) {
      if(cmd == "pid") {
        this.openPID()
      } else if(cmd == "paspoort") {
        this.openPaspoort()
      } else if(cmd == "ris") {
        this.openRIS()
      } else {
        this.openMaps()
      }

    },
    async openPID() {
      var path = await this.$pi.getValue(this.context + "|Locatiegegevens|Vision Link")
      path = path.Value
      window.open(path, "_self")
    },
    openPaspoort() {
      window.open(this.paspoortLink, "_self")
    },
    openRIS() {
      window.open("http://10.10.0.80/RIS/"+this.risCode+".xlsm", "_self")
    },
    async openMaps() {
      var adres = await this.$pi.getValue(this.context + "|Adresgegevens|Adres")
      var postcode = await this.$pi.getValue(this.context + "|Adresgegevens|Postcode")
      var url = "https://www.google.com/maps/place/"+adres.Value+" "+postcode.Value
      window.open(url, "_self")
    }
  }
}
</script>
<style scoped>
#location {
  max-width: 1200px; 
  position: relative;
  margin: auto;
}
#location .buttons {
  display: inline-block;
  position: absolute;
  right: 0px;
  top: 0px;
}

.open-dropdown {
  position: absolute;
  right: 0px;
  top: 0px;
}
.pp-button {
  position: absolute;
  right: 210px;
  top: 0px;
}

.location button {
  width: 100%;
  font-weight: bold;
  text-align: left !important;
}
.reinwatercijfer {
  height: 230px;
}
.reinwatercijfer .chart {
  height: 200px;
}

.location_steps {
  display: flex;
  flex-wrap: wrap;
  min-width: 400px;
}
.location_stats label {
  font-weight: bold;
  display: inline-block;
  width: 180px;
}
.location_stats .chart {
  min-height: 200px;
}

.step {
  flex: 1;
  margin: 5px 10px;
  max-width: 150px;
  cursor: pointer;
}
@supports (-ms-accelerator:true) {
  .step {
    flex: 0;
  }
}
.step button {
  width: 100%;
}
.step-name {
  padding: 12px 10px;
}
.grondwaterwinning { background: url(../assets/steps/pompput.png) no-repeat center; }
.snelfiltratie, .voorfiltratie, .nafiltratie { background: url(../assets/steps/sandfilter.png) no-repeat center; }
.reinwater { background: url(../assets/steps/reinwater.png) no-repeat center; }
.beluchting { background: url(../assets/steps/plate.png) no-repeat center; }
.ontharding { background: url(../assets/steps/ontharder.png) no-repeat center; }
.ontkleuring { background: url(../assets/steps/ionexchange.png) no-repeat center; }
.ontzuring { background: url(../assets/steps/torenbeluchter.png) no-repeat center; }
.verwijdering { background: url(../assets/steps/carbon.png) no-repeat center; }
.membraanfiltratie { background: url(../assets/steps/membrane.png) no-repeat center; }
.vacuumontgassing { background: url(../assets/steps/ontgassing.png) no-repeat center; }

.step .step_icon {
  background-color: #EEE;
  border: 1px solid #AAA;
  width: 120px;
  height: 120px;
  margin: auto;
  margin-bottom: 10px;
}
.rapportcijfer {
  max-height: 200px;
}
.water-state {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 10px;
}
</style>
