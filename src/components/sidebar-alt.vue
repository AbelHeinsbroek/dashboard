<template>
<div id='sidebar'>

  <div v-for='app in applications' :key='app.title'>
    <div class='application' @click='handleClick(app)' :class="activeClass == app.title ? 'active' : ''">
      <i class='application-icon' :class='app.icon'></i>
      <span class='nav-title'>{{app.title}}</span>
    </div>
  </div>

  <div class='application info' @click='$parent.showDialog = true'>
    <i class='application-icon el-icon-info'></i><br />
    <span class='nav-title'>Info</span>
  </div>

</div>
</template>

<script>
export default { 
  data() {
    return {
      applications: [
        {'title': 'slimm', 'icon': 'el-icon-location-outline', 'desc':'Open SLIMM Dashboard', 'route': '/'},
        {'title': 'analyse', 'icon': 'el-icon-setting', 'desc':'Open SLIMM Analyse tool', 'route': '/analyse'},
        {'title': 'dbm', 'icon': 'el-icon-share', 'desc':'Open Digitale Bandbreedte Monitor', 'route': '/dbm'}
      ]
    }
  },
  methods: {
    handleClick(app) {
      this.$router.push(app.route)
    }
  },
  computed: {
    activeClass() {
      return this.$parent.activeApp
    }
  }
}

</script>

<style>
#sidebar {
  position: fixed;
  left: 0px;
  top: 55px;
  bottom: 0px;
  width: 59px;
  background: #22282C;
  border-right: 1px solid #AAA;
}

#sidebar .application {
  cursor: pointer;
  border-bottom: 1px solid #555;
  text-align: center;
  color: white;
  padding: 5px 0px;
  padding-top: 10px;
}
#sidebar .active {
  position: relative;
  border-bottom: 1px solid #409EFF;
  background: #0072AB;
}

#sidebar .active::before {
  content: '';
  position: absolute;
  border-bottom: 8px solid transparent;
  border-left: 8px solid transparent;
  border-right: 8px solid #FFF;
  border-top: 8px solid transparent;
  right: -2px;
  top: 50%;
  margin-top: -8px;
}
#sidebar .nav-title {
  font-size: 10px;
  margin-top: 5px;
  text-transform: uppercase;
  display: block;
  text-rendering: optimizeLegibility !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important; 
}
#sidebar .application-icon {
  font-size: 30px;
}
#sidebar .application:not(.active):hover {
  background: #444;
}
#sidebar .application.info {
  position: absolute;
  bottom: 0px;
  width: 60px;
  border-bottom: none;
  border-top: 1px solid #555;
}
</style>

