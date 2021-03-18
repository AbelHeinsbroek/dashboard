<template>
  <div id="application">
    <el-dialog :visible.sync='showDialog' title='Informatie'>
      <info></info>
    </el-dialog>

    <navigation></navigation>
    <sidebar></sidebar>
    <div id='container' :class='activeApp'>
      <!--
    <el-alert title='Vanwege een technische storing zijn de statuskleuren per locatie momenteel mogelijk niet correct' description='Er wordt gewerkt aan een oplossing' type='warning alert' show-icon></el-alert>
      -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import navigation from './components/navigation.vue'
import sidebar from './components/sidebar.vue'
import info from './components/info.vue'

export default {
  data() { return {
    title: 'SLIMM Overzicht',
    showDialog: false
  }},
  components: {
    navigation: navigation,
    sidebar: sidebar,
    info: info
  },
  computed: {
    activeApp() {
      if(this.$route.name == 'Analyse') {
        return 'analyse'
      }
      if(this.$route.name == 'DBM' || this.$route.name == 'NachtWacht') {
        return 'dbm'
      }
      return 'slimm'
    }
  }
}

</script>

<style>
body {
  margin: 0px;
  padding: 0px;
  font-family: "Helvetica Neue", Helvetica;
}

#header {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  padding: 5px 10px;
  z-index: 50;
  background: #FFF;
  text-align: center;
  border-bottom: 1px solid #AAA;
}
#header span.title {
  display: inline-block;
  font-size: 22px;
  font-weight: bold;
  margin: 5px;
}
#header .prev {
  float: left;
}
#header .next {
  float: right;
}


#container {
  background: #FFF;
  padding: 20px;
  color: #2c3e50;
  padding-top: 60px;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
}

@media only screen and (min-width: 1820px) {
  #container.slimm {
    margin: auto;
    max-width: 1700px;
  }
  #container.analyse, #container.dbm {
    margin-left: 60px;
  }
}
@media only screen and (max-width: 1820px) {
  #container {
    margin-left: 60px;
  }
}
@media only screen and (max-width: 900px) {
  #container {
    padding-left: 5px;
    padding-right: 5px;
    margin-left: 0px;
  }

  .pi-chart {
    min-height: 250px;
  }
}




.pi-loading {
  background: url('assets/loading.gif') center center no-repeat;
}

</style>
