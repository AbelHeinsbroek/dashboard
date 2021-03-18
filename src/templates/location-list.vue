<template>
  <div id="overzicht">
    <el-button @click='$router.mode = "map"; $router.push("/map")' id='view-toggle' class='hidden-xs-only'><i class='el-icon-location'></i> Kaartweergave</el-button>
    <div class='mode-toggle'>
      <el-radio-group v-model='mode' size='normal'>
        <el-radio-button label=".\Reinwater|Prestaties|Kleurwaarde kwaliteit Reinwater beinvloedbaar">Beinvloedbaar</el-radio-button>
        <el-radio-button label=".\Reinwater|Prestaties|Kleurwaarde kwaliteit Reinwater">Alle Overschrijdingen</el-radio-button>
      </el-radio-group>
    </div>
    <span class='clear: both;'></span>
    
    <div id='columns' v-loading='isLoading'>
      <div class='column' v-for='(team, name) in teams'>
        <h3>{{name}}</h3>
        <div v-for='location in team' class='location'>
          <el-col :span='20'>
              <el-button @click="$router.push('locatie/'+location.Path.replace('Productiebedrijven', name))">{{location.Name}}</el-button>
          </el-col>
          <el-col :span='4' @click='getmessage()'>
            <div @mouseenter='openPopovers = location.Name'>
            <el-tooltip>
              <div slot="content"><pi-value v-if='openPopovers == location.Name' :context='location.Path' :path='tooltipMode'></pi-value>&nbsp;</div>
              <pi-multistate :path='mode' :context='location.Path' class='state' :colors="[[-4,'red'],[-3,'red'],[-2,'yellow'],[-1,'green'],[0,'gray'],[1,'green'],[2,'yellow'],[3,'red'],[4,'red']]"></pi-multistate>
            </el-tooltip>
            </div>
          </el-col>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Overzicht',
  data() { return {
    isLoading: false,
    openPopovers: '',
    mode: '.\\Reinwater|Prestaties|Kleurwaarde kwaliteit Reinwater beinvloedbaar',
    teams: {
    }
  }},

  mounted() {
    this.$root.title = "SLIMM Locatieoverzicht"
    this.load()
  },
  computed: {
    title() {
      if(_.includes(this.mode, "beinvloedbaar")) {
        return "Beinvloedbare overschrijdingen"
      } else {
        return "Alle overschrijdingen"
      }
    },
    tooltipMode() {
      if(_.includes(this.mode, "beinvloedbaar")) {
        return '.\\Reinwater\\Reinwater opslag|Prestaties|Overschreden reinwaterparameters (beinvloedbaar)'
      } else {
        return '.\\Reinwater\\Reinwater opslag|Prestaties|Overschreden reinwaterparameters'
      }
    }
  },

  methods: {
    async load() {

      this.isLoading = true

      const teams = await this.$pi.getChildren('\\\\SR-16642\\'+afdb+'\\Vitens')

      var requests = []

      // create request promises
      for(var team of teams) {
        if(team.Name != "Productiebedrijven" && team.Name != "Team Test") {
          requests.push(this.$pi.getChildren(team.Path))
        }
      }

      var teamdata = {}
      var results = await Promise.all(requests)

      for(var team of teams) {
        if(team.Name != "Productiebedrijven" && team.Name != "Team Test") {
          teamdata[team.Name] = results.shift()
        }
      }

      // fix for slow IE
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.isLoading = false
        })
      });
      this.teams = teamdata

    }

  }
}
</script>
<style>
#overzicht {
  position: relative;
}
#columns {
  min-height: 100px;
  display: flex;
  flex-wrap: wrap;
}
.mode-toggle {
  text-align: center;
  border-bottom: 1px solid #CCC;
  height: 20px;
  margin: 20px 0px;
}
.toggle-title {
  text-align: center;
}
.column {
  flex: 1;
  margin: 0px 10px;
  max-width: 260px;
}

@media (max-width: 480px) { 
    .column    {
      max-width: 480px !important;
    }
}
.column h3 {
  text-align: center;
}
.location {
  margin: 5px;
}
.location button {
  width: 98%;
  font-weight: bold;
  text-align: left !important;
  margin-bottom: 4px;
}
.location .multistate {
  width: 32px;
  height: 32px;
  margin: 2px;
  outline: 1px solid #AAA;
}

#view-toggle {
  position: absolute;
  left: 15px;
}
</style>
