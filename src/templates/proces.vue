<template>
  <div id="proces">
    <div class='year-picker' v-if='!isMobile'>
      <el-input-number v-model='yminInput' :step='1' :min='2012' controls-position='right' size='small'></el-input-number>
      <el-input-number v-model='ymaxInput' :step='1' controls-position='right' size='small'></el-input-number>
    </div>

    <div id='process-single' v-if='singleUnit'>
      <h1>{{unittitle}}</h1>
      <el-row :gutter='10'>
        <el-col :xs='24' :span='8' v-for='parameter in parameters' :key='parameter.title'>
          <pi-chart :title="parameter.title"  :start='ymin' :end='ymax'>
            <pi-axis :suggested-min="parameter.min" :suggested-max="parameter.max">
              <pi-trend 
                 :path="'.|Kwaliteitsmetingen effluent (lab)|'+parameter.path+' (lab)'" 
                 :context="context" 
                 color='green'
                 title = 'lab'
                 marker='rect'
                 :marker-size='5'
                 :line='false'
                />
            </pi-axis>
          </pi-chart>
        </el-col>
      </el-row>
    </div>

    <div id='process-overview' v-else>
      <div class='mode-toggle'>
        <el-radio-group v-model="mode">
          <el-radio-button label="individual">Invididueel</el-radio-button>
          <el-radio-button label="comparison">Vergelijking</el-radio-button>
        </el-radio-group>
      </div>



      <div v-if="mode=='individual'">
        <div class='street' v-for='(street, index) in streets' :key='index'>
          <h3 v-if='streets.length > 1'>{{street.Name}}</h3>
            <div class='process' v-for='(unit, index) in street.children' :key='index'>
              <el-button class='unit-button' @click='$router.push({params:{context: unit.Path}})'>{{unit.Name}} <i class='el-icon-arrow-right'></i></el-button>
              <el-row :gutter='10'>
                <el-col :xs='24' :span='8' v-for='parameter in mainParameters' :key='parameter.title'>
                  <pi-chart :title="parameter.title" :start='ymin' :end='ymax'>
                    <pi-axis :suggested-min="parameter.min" :suggested-max="parameter.max">
                      <pi-trend 
                         :path="'.|Kwaliteitsmetingen effluent (lab)|'+parameter.path+' (lab)'" 
                         :context="unit.Path" 
                         color='green'
                         marker='rect'
                         :marker-size='5'
                         :line='false'
                        />
                      <pi-trend 
                         :path="'.|Kwaliteitsmetingen effluent (ss)|'+parameter.path+' (ss)'" 
                         :context="unit.Path" 
                         color='blue'
                         marker='none'
                         :marker-size='5'
                         :line='true'
                        />
                      </pi-axis>
                   </pi-chart>
                </el-col>
              </el-row>
            </div>
        </div>
      </div>

      <div class='comparison' v-else>
        <el-row :gutter='10'>
          <el-col :xs='24' :span='12' v-for='parameter in parameters' :key='parameter.title'>
            <h3>{{parameter.title}}</h3>

              <pi-chart :title="parameter.title":start='ymin' :end='ymax' legend='top'>
                <pi-axis :suggested-min="parameter.min" :suggested-max="parameter.max">
                  <pi-trend v-for='(child, index) in allstreets.children'
                     :key='child.Name'
                     :path="'.|Kwaliteitsmetingen effluent (lab)|'+parameter.path+' (lab)'" 
                     :context="child.Path" 
                     :label='child.Name'
                     :color='cmap[index]'
                     marker='rect'
                     :marker-size='5'
                     :line='false'
                    />
                </pi-axis>
             </pi-chart>


          </el-col>
        </el-row>
      </div>
    </div>


  </div>
</template>

<script>

export default {
  data() { return {
    cmap: ["#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f"],

    yminInput: new Date().getFullYear()-1,
    ymaxInput: new Date().getFullYear()+1,

    processes: {
      'snelfiltratie':  [
        {path:'Fe', title: 'IJzer (mg/l)', min:0, max:0.2},
        {path:'Mn', title: 'Mangaan (mg/l)', min:0, max:0.2},
        {path:'NH4', title: 'Ammonium (mg/l)', min:0, max:0.05, ul:0.05},
        {path:'Troebelingsgraad', title: 'Troebelingsgraad (NTU)', min:0, max:0.2, ul:0.4},
        {path:'O2', title: 'Zuurstof (mg/l)', min:0, max:12, ll:4},
        {path:'NO2', title: 'Nitriet (mg/l)', min:0, max:0.05},
        {path:'pH', title: 'pH (-)', min:7, max:9},
        ],
      'nafiltratie':  [
        {path:'Fe', title: 'IJzer (mg/l)', min:0, max:0.1},
        {path:'Mn', title: 'Mangaan (mg/l)', min:0, max:0.1},
        {path:'Troebelingsgraad', title: 'Troebelheid (NTU)', min:0, max:0.2, ul:0.4},
        {path:'NH4', title: 'Ammonium (mg/l)', min:0, max:0.05, ul:0.05},
        {path:'O2', title: 'Zuurstof (mg/l)', min:0, max:12},
        {path:'NO2', title: 'Nitriet (mg/l)', min:0, max:0.05},
        {path:'pH', title: 'pH (-)', min:7, max:9},
        ],
      'voorfiltratie':  [
        {path:'Fe', title: 'IJzer (mg/l)', min:0, max:0.2},
        {path:'Mn', title: 'Mangaan (mg/l)', min:0, max:0.2},
        {path:'NH4', title: 'Ammonium (mg/l)', min:0, max:0.05},
        {path:'Troebelingsgraad', title: 'Troebelingsgraad (NTU)', min:0, max:0.2, ul:0.4},
        {path:'O2', title: 'Zuurstof (mg/l)', min:0, max:12},
        {path:'NO2', title: 'Nitriet (mg/l)', min:0, max:0.05},
        {path:'pH', title: 'pH (-)', min:7, max:9},
        ],
      'beluchting':  [
        {path:'CH4', title: 'Methaan (ug/l)', min:0, max:100},
        ],
      'ontharding':  [
        {path:'Hardheid', title: 'Totale Hardheid (mmol/l)', min:0.9, max:1.5, ul:1.43, ll:1, rt:1},
        {path:'pH', title: 'pH (-)', min:7, max:9, rt:1},
        {path:'HCO3', title: 'Bicarbonaat (mg/l)', min:200, max:400},
        {path:'EGV 20°C', title: 'Geleidbaarheid (mS/cm)', min:10, max:30, rt:1},
        {path:'SI-index', title: 'SI Index (-)', min:0.3, max:0.6},
        {path:'Troebelingsgraad', title: 'Troebelingsgraad (FTE)', min:0, max:16, rt:1},
        ],
      'ontzuring':  [
        {path:'CO2', title: 'CO2 (mg/l)', min:0, max:10},
        {path:'pH', title: 'pH (-)', min:7, max:9},
        {path:'O2', title: 'Zuurstof (mg/l)', min:6, max:12},
        {path:'HCO3', title: 'HCO3 (mg/l)', min:0, max:100},
        {path:'Hardheid', title: 'Hardheid (mmol/l)', min:0, max:2},
        ],
      'ontkleuring':  [
        {path:'Kleurintensiteit', title: 'Kleurintensiteit (mg Pt/Co/l)', min:0, max:10, ul: 10},
        {path:'pH', title: 'pH (-)', min:7, max:9},
        {path:'Troebelingsgraad', title: 'Troebelheidsgraad (NTU)', min:0, max:0.5, ul:0.4},
        ],
      'membraanfiltratie':  [
        {path:'Kleurintensiteit', title: 'Kleurintensiteit (mg Pt/Co/l)', min:0, max:10, ul: 10},
        {path:'Hardheid', title: 'Totale Hardheid (mmol/l)', min:0, max:1.5, ul:1.43},
        {path:'Agressief CO2', title: 'Agg. CO2 (mg/l)', min:0, max:50},
        {path:'Fe', title: 'IJzer (mg/l)', min:0, max:0.1},
        {path:'HCO3', title: 'Bicarbonaat (mg/l)', min:0, max:15},
        {path:'NH4', title: 'Ammonium (mg/l)', min:0, max:0.05},
        {path:'pH', title: 'pH (-)', min:7, max:9},
        {path:'Cl', title: 'Chloride (mg/l)', min:0, max:5},
        ],
      'vacuumontgassing':  [
        {path:'CH4', title: 'Methaan (ug/l)', min:3000, max:6000},
        {path:'CO2', title: 'CO2 (mg/l)', min:0, max:10},
        {path:'O2', title: 'Zuurstof (mg/l)', min:0, max:10},
        ],
      'oc verwijdering':  [
        {path:'Koloniegetal 22°C', title: 'Koloniegetal (KvE)', min:0, max:100},
        {path:'Kleurintensiteit', title: 'Kleurintensiteit (mg Pt/Co/l)', min:0, max:10, ul: 10},
        ],
    },

    context: "",
    streets: [],
    allstreets: [],
    mode: 'individual'
  }},
  beforeMount() {
    this.context = this.$route.params.context
  },
  watch: {
    '$route' (to, from) {
      this.context = to.params.context
    },
    yminInput(val) {
      if(val >= this.ymaxInput) {
        this.ymaxInput+=1
      }
    },
    ymaxInput(val) {
      if(val <= this.yminInput) {
        this.yminInput-=1
      }
    }
  },

  mounted() {
    this.loadData()
  },

  computed: {
    ymin() {
      return this.yminInput
    },
    ymax() {
      return this.ymaxInput > new Date().getFullYear() ? "*" : this.ymaxInput
    },
    singleUnit() {
      return this.context.split("\\").length > 8
    },
    unittitle() {
      return this.context.split("\\").pop()
    },
    isMobile() {
     return /Mobi/.test(navigator.userAgent)
    },


    parameters() {

      if(!this.singleUnit) {
        var proces = this.context.split("\\").pop().toLowerCase()
      } else {
        var proces = this.context.split("\\")[7].toLowerCase()
      }
      return this.processes[proces]
    },
    mainParameters() {
      return this.parameters.slice(0,3)
    }
  },


  methods: {
    async loadData() {
      var context = this.singleUnit ? this.context.split("\\").splice(0,8).join("\\") : this.context

      var streets = await this.$pi.getChildren(context)

      var allstreets = {
        children: []
      }

      for(var street of streets) {
        street.children = await this.$pi.getChildren(street.WebId)
        allstreets.children = allstreets.children.concat(street.children)
      }
      this.streets = streets
      this.allstreets = allstreets
    }
  }

}
</script>

<style>
.mode-label {
  display: inline-block;
  width: 100px;
  font-weight: bold;
  text-align: left;
}
h5 {
  margin-top: 10px;
  clear: both;
}
.comparison {
}
.unit-button {
  margin-top: 15px !important;
  margin-bottom: 10px !important;
  font-weight: bold !important;
  font-size: 16px !important;
}
.mode-toggle {
  text-align: center;
  border-bottom: 1px solid #CCC;
  height: 20px;
  margin: 20px 0px;
}
.pi-chart {
  margin-bottom: 10px;
}
#proces {
  position: relative;
}
#proces .year-picker {
  width: 510px;
  position: absolute;
  right: 0px;
  text-align: right;
}
/*
#proces .year-picker .el-input {
  width: 100px;
  display: inline-block;
}
*/

</style>
