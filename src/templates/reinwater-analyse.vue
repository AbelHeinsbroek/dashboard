<template>
  <div id='reinwater-analyse'>

    <el-container id='reinwater-analyse-container'>
        <el-aside id='filters'>
          <h3>Instellingen</h3>

        <el-collapse v-model='activeNames'>
          <el-collapse-item title="Bron" name='bron'>
            <el-radio-group v-model='source' size='small'>
              <el-radio-button label="rein">Reinwater</el-radio-button>
              <el-radio-button label="ruw">Ruwwater</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
          <el-collapse-item title="Team" name='team'>
            <el-select v-model='team'>
              <el-option v-for="(team, index) in teams"
                         :key='team'
                         :label='team'
                         :value='team'>
              </el-option>
            </el-select>
          </el-collapse-item>
          <el-collapse-item title="Parameter" name='parameter'>
            <div class='parameter-radio'>

              <el-radio-group v-model='parameterIndex'>
                <div class='radio' v-for='(item, index) in parameters' :key='item.name'>
                <el-radio :label='index'>
                  {{item.name}}
                </el-radio>
                </div>
              </el-radio-group>

            </div>
          </el-collapse-item>

          <el-collapse-item title="Weergave" name='weergave'>
            <el-radio-group v-model='mode' size='small'>
              <el-radio-button label="box" icon='el-icon-upload'>Boxplot</el-radio-button>
              <el-radio-button label="trend">Tijdsreeks</el-radio-button>
            </el-radio-group>
            <div v-if="mode == 'trend'">
              <br />
              <el-checkbox label='Toon Metingen' v-model='datapoints'></el-checkbox><br />
              <el-checkbox label='Toon Jaargemiddelde' v-model='yearavg'></el-checkbox><br />
            </div>
          </el-collapse-item>

          <el-collapse-item title="As-instellingen" name='axis'>
            <el-input-number v-model='cmin' :step='0.1' controls-position='right' size='small'></el-input-number>
            <el-input-number v-model='cmax' :step='0.1' controls-position='right' size='small'></el-input-number>
          </el-collapse-item>


          <el-collapse-item title="Periode" name='period'>
            <el-checkbox-group
              :enabled = 'false'
              id='year-select'
              v-model='year'
               :min='1'>

              <div v-for='year in years' :key='year'>
                <el-checkbox :label='year' :key='year'>{{year}}</el-checkbox>
              </div>

            </el-checkbox-group>
          </el-collapse-item>
        </el-collapse>

    </el-aside>

    <el-main>

      <el-row :gutter='10'>

        <boxplot :parameter='parameters[parameterIndex]' :locations='locations' :name='team' :year='year' v-if="mode == 'box'" :class="team" :min='Number(cmin)' :max='Number(cmax)' :attrpath='attrpath'></boxplot>

        <el-col :lg='12' :xl='8' v-for='location in locations' :key='location.Name' v-if="mode == 'trend'" >
          <pi-chart v-if="mode == 'trend'" :start='trendStart' :end='trendEnd' :title="location.Name + ' - ' +item.name" :y-label='item.label'>
            <pi-axis :min='Number(cmin)' :max='Number(cmax)' :label='parameters[parameterIndex].label'>


              <pi-trend :path="'.'+attrpath+parameters[parameterIndex].name + ' (lab)'" 
                v-if='datapoints'
                :context='location.Path' 
                :marker-size='1'
                marker='circ'
                :line='false'
                :order='3'
                color='green' />

              <pi-trend :data='loadYearAverage(location.Path)'
                v-if='yearavg'
                :marker-size='0'
                marker='none'
                :line='true'
                :width= '3'
                color='blue' 
                nothresh
                :order='2'
                />

              <pi-threshold v-if='item.ll'
                :value='item.ll'
                color='red'
                mode='le'
                />

              <pi-threshold v-if='item.lt'
                :value='item.lt'
                color='orange'
                mode='le'
                />

              <pi-threshold v-if='item.ul'
                :value='item.ul'
                color='red'
                mode='ge'
                />

              <pi-threshold v-if='item.ut'
                :value='item.ut'
                color='orange'
                mode='ge'
                />

              </pi-axis>
          </pi-chart>
        </el-col>

      </el-row>
    </el-main>
    </el-container>
  </div>

</template>
<script>
import BoxPlot from '../components/boxplot.vue'
import ruw from '../assets/ruwwater.json'
import moment from 'moment'

export default {
  name: 'ReinwaterAnalyse',
  data() { return {
    locations: [],
    trendData: {},
    activeNames: ['bron', 'team', 'weergave', 'axis', 'parameter', 'period'],
    source: 'rein',
    mode: 'box',
    cmin: 0,
    cmax: 3.6,
    teams: ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6', 'Alle Teams'],
    team: 'Team 1',
    parameterIndex: 3,
    year: [new Date().getFullYear()],
    datapoints: true,
    yearavg: false,
    parameters: [
      {name: 'pH', label: '-', ll: 7.0, lt:7.7, ut: 8.3, ul: 9.5, min:6.6, max: 9.8, ln:7.0, un:9.5, rt:true, cmin:6.6, cmax:9.8},
      {name: 'EGV 20°C', label:'mS/cm', ut: 80, ul: 130, min: 20, max: 150, un:150, rt:true, cmin:0, cmax:150},
      {name: 'Troebelingsgraad', label:'FTE', ut: 0.4, ul: 1, un:1, rt:true, min:0, max:1.5, cmin:0, cmax:1.6},
      {name: 'Hardheid', label: 'mmol/l', ut:1.43, ul: 2, min:0, max:3.6, ln:1, rt:true, cmin:0, cmax:3.6},
      {name: 'TACC90', label: 'mmol/l', min: 0, max:1.0, ut:0.4, ul: 0.6, cmin:0, cmax:1},
      {name: 'SI-index', label: 'mmol/l', min: -1, max:0.2, cmin:-1, cmax:0.2},
      {name: 'O2', label: 'mg/l', min: 0, max:15, cmin:0, cmax:15, ll:2, lt:4},
      {name: 'HCO3', label: 'mg/l', ll: 60, lt: 90, min: 40, max:340, ln:60, cmin:0, cmax:340},
      {name: 'Agressief CO2', label: 'mg/l', ul: 2.2, min:0, max:4.0, cmin:0, cmax:5},
      {name: 'TOC', label: 'mg/l', ut: 3, ul: 5, min:0, max:6, cmin:0, cmax:5},
      {name: 'Kleurintensiteit', label: 'mg Pt/Co/l',  ut: 10, ul: 20, min:0, max:20, un: 20, cmin:6,cmax:20},
      {name: 'Al', label: 'ug/l', ut: 30, ul: 30, min:0, max:40, un:0.2, cmin:0, cmax:40},
      {name: 'As', label: 'ug/l', ut: 1, ul: 10, min:0, max:10, un:0.2, cmin:0, cmax:5},
      {name: 'Cr', label: 'ug/l', ut: 10, ul: 50, min:0, max:2, un:0.2, cmin:0, cmax:5},
      {name: 'Ni', label: 'ug/l', ut: 10, ul: 20, min:0, max:25, un:0.2, cmin:0, cmax:25},
      {name: 'Fe', label: 'mg/l', ut: 0.05, ul: 0.1, min:0, max:0.2, un:0.2, cmin:0, cmax:0.2},
      {name: 'Mn', label: 'mg/l', ut: 0.01, ul: 0.05, min:0, max:0.18, un:0.05, cmin:0, cmax:0.18},
      {name: 'NH4', label: 'mg NH4 / l', ut: 0.05, ul: 0.20, min:0, max:0.2, un:0.2, cmin:0, cmax:0.2},
      {name: 'NO2', label: 'mg/l', ut: 0.03, ul: 0.05, min:0, max:0.06, cmin:0, cmax:0.06},
      {name: 'NO3', label: 'mg/l', ut: 25, ul: 50, min:0, max:55, un:0.2, cmin:0, cmax:55},
      {name: 'Na', label: 'mg/l', ul: 100, min:0, max:120, un:150, cmin:0, cmax:120},
      {name: 'Cl', label: 'mg/l', ut: 100, ul: 150, min:0, max:150, un: 150, cmin:0, cmax:200},
      {name: 'SO4', label: 'mg SO4 / l', ut: 100, ul: 150, min:0, max:120, un: 150, cmin:0, cmax:120},
      {name: 'Temperatuur', label: 'graden Celsius', min:0, max:20, cmin:0, cmax:20},
      {name: 'E-coli', label: 'kve/100 ml', ul: 1.0, min:0, max:2, un:1, cmin:0, cmax:2},
      {name: 'Aeromonas 30°C', label: 'kve/100 ml', ut: 20, ul: 100, min:0, max:1000, un:1000, cmin:0, cmax:1000},
      {name: 'Koloniegetal 22°C', label: 'kve/ml', ul: 100, min:0, max:150, un: 100, cmin:0, cmax:150},
    ],
  }},
  mounted() {
    this.loadData()
    this.$parent.title = 'SLIMM Analyse'
  },
  computed: {
      attrpath() {
        if(this.source == 'rein') {
          return "\\Reinwater\\Reinwater opslag|Waterkwaliteitsmetingen (lab)|"
        } else {
          return "|Waterkwaliteitsmetingen (lab)|"
        }
      },
      years() {
        var now = (new Date()).getFullYear()
        var years = []
        for(var i=0;i<=6;i++) {
          years.push(now-6+i)
        }
        return years
      },
      parameterLabels() {
        var labels = []
        for(var parameter in this.parameters) {
          labels.push(parameter.name)
        }
        return labels
      },
      item() {
        return this.parameters[this.parameterIndex]
      },
      trendStart() {
        var minyear = Math.min(...this.year)
        return minyear+"-01-01"
      },
      trendEnd() {
        var maxyear = Math.max(...this.year)
        return maxyear+"-12-31" 
      }
  },
  components: {
    boxplot: BoxPlot
  },
  watch: {
    source() {
      this.loadData()
    },
    team() {
      this.loadData()
    },

    parameterIndex(val) {
      this.cmin = this.parameters[val].cmin
      this.cmax = this.parameters[val].cmax
      this.yearavg = false
    }
  },
  methods: {
     async loadYearAverage(path) {
       var data = await this.$pi.getRecorded(path + this.attrpath + this.item.name + " (lab)", (Math.min(...this.year)-1)+"-01-01", "*")
       // interpolate to daily data
       var start = moment(data[0].Timestamp) 
       var end = moment(data[data.length-1].Timestamp)

       var days = end.diff(start, 'days')

       var dataindex = 0

       var dayvalue = 0
       var daytime = moment(data[0].Timestamp)

       var interpolated = []
       var rollingmean = []

       var i = 0

       for(var day = 0; day < days; day++) {
         start.add(1, 'day')

         if(start.isAfter(daytime)) {
           dataindex+=1
           dayvalue = data[dataindex-1].Value
           daytime = moment(data[dataindex].Timestamp)
         }
         interpolated.push(dayvalue)
         if(i >= 365) {
           var mean = _.mean(interpolated.slice(i-365, i))
           rollingmean.push({
             x: start.toDate(),
             y: mean
           })
         }


         i+=1
        }

       return rollingmean
     },
     async loadData() {
        if(this.team == 'Alle Teams') {
          if(this.source == 'rein') {
            this.locations = await this.$pi.getChildren('\\\\SR-16642\\SLIMM Productie\\Vitens\\Productiebedrijven')
          } else {
            this.locations = this.getRuwLocations(true)
          }
        } else {
          if(this.source == 'rein') {
            this.locations = await this.$pi.getChildren('\\\\SR-16642\\SLIMM Productie\\Vitens\\'+this.team)
          } else {
            this.locations = this.getRuwLocations(false)
          }
        }
    },
    getRuwLocations(all) {
      var locations = []

      if(this.team == 'Alle Teams') {
        var locs = Object.values(ruw).flat()
      } else {
        var locs = ruw[this.team]
      }


      for(var loc of locs) {

        for(var street of loc.streets) {
          locations.push({
            Name: street.replace("WG", "") + " (" + loc.short + ")",
            Path: loc.path + "\\Grondwaterwinning\\"+street
          })
        }
      }
      return(locations)
    }
  },
}
</script>
<style>
#reinwater-analyse {
  position: absolute;
  top: 50px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
#reinwater-analyse #filters {
  border-right: 1px solid #EEE;
  overflow-x: hidden;
}
#reinwater-analyse-container {
  height: 100%;
}
#reinwater-analyse h3 {
  text-align: center;
}
#year-select {
}
#reinwater-analyse .pi-chart {
  margin-top: 20px;
}
#reinwater-analyse .Alle {
  height: 2000px;
}
#reinwater-analyse .range-input .el-input {
  width: 80px;
  margin-right: 5px;
}

#reinwater-analyse .parameter-radio {
  max-height: 250px;
  overflow-y: scroll;
}
#reinwater-analyse .radio {
  margin-bottom: 5px;
}
#reinwater-analyse .el-collapse-item {
  padding-left: 10px;
}
#reinwater-analyse .el-collapse-item__header {
  font-size: 13px;
  color: #333;
  font-weight: bold;
}

</style>
