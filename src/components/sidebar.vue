<template>
<div id='sidebar'>

  <div>
   <el-popover
    ref="popover2"
    placement="right"
    width="120"
    popper-class='dark'
    :offset='25'
    trigger="hover"
    v-model='visible2'
    >
    <ul>
      <li @click='handleClick("/")'>Kwaliteit</li>

      <li @click='handleClick("/vergunningen")'>
          Winvergunningen
      </li>
    </ul>
  </el-popover>

    <div class='application' @click='handleClick("/")' :class="activeClass == 'slimm' ? 'active' : ''" v-popover:popover2>
      <i class='application-icon el-icon-location-outline'></i>
      <span class='nav-title'>SLIMM</span>
    </div>

    <div class='application' @click='handleClick("/analyse")' :class="activeClass == 'analyse' ? 'active' : ''">
      <i class='application-icon el-icon-setting'></i>
      <span class='nav-title'>Analyse</span>
    </div>

   <el-popover
    ref="popover"
    placement="right"
    width="120"
    popper-class='dark'
    :offset='25'
    trigger="hover"
    v-model='visible'
    >
    <ul>
      <li @click='handleClick("/dbm")'>DBM</li>

      <li @click='handleClick("/n8w8")'>
          Nachtwacht
      </li>
    </ul>
  </el-popover>

    <div class='application' @click='handleClick("/dbm")' :class="activeClass == 'dbm' ? 'active' : ''" v-popover:popover>
      <i class='application-icon el-icon-share'></i>
      <span class='nav-title'>DBM</span>
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
      visible: false,
      visible2: false,
      applications: [
        {'title': 'slimm', 'icon': 'el-icon-location-outline', 'desc':'Open SLIMM Dashboard', 'route': '/'},
        {'title': 'analyse', 'icon': 'el-icon-setting', 'desc':'Open SLIMM Analyse tool', 'route': '/analyse'},
        {'title': 'dbm', 'icon': 'el-icon-share', 'desc':'Open Digitale Bandbreedte Monitor', 'route': '/dbm'}
      ]
    }
  },
  methods: {
    handleClick(app) {
      // hide popover
      this.visible = false
      this.visible2 = false
      this.$router.push(app)
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
  opacity: 0.7;
  transition: all 0.3s;
}
#sidebar .active {
  position: relative;
  border-bottom: 1px solid #409EFF;
  background: #0072AB;
  opacity: 1;
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
  cursor: pointer;
  background: #444;
  opacity: 1;
}
#sidebar .application.info {
  position: absolute;
  bottom: 0px;
  width: 60px;
  border-bottom: none;
  border-top: 1px solid #555;
}
.el-popover.dark {
  background: #22282C;
  opacity: 0.95;
  border: 1px solid #333;
  padding: 0px;
}
.el-popover.dark .popper__arrow {
  border-right-color: #333 !important;
}
.el-popover.dark .popper__arrow::after {
  border-right-color: #22282C !important;
}
.el-popover.dark ul {
  cursor: pointer;
  color: #FFF;
  margin: 0px;
  padding: 0px;
}
.el-popover.dark ul li {
  list-style: none;
  padding: 15px 20px;
}
.el-popover.dark ul li:hover {
  background: #434A50;
  transition: all 0.5s;
}

</style>

