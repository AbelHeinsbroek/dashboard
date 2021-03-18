<template>
  <div id='header'>

    <div id='nav-popover' v-if='popoverVisible' :style="{left: popoverLeft+'px'}">
      <ul id="sibling_list">
        <li v-for="sibling, indx in siblings" :class='{active: index==indx}' @click='openSibling(indx)'>
          {{sibling.Name}}
        </li>
      </ul>
    </div>

    <div id='header-content'>
      <el-button class='prev' @click='$router.back()' v-if="context"><span class='el-icon-arrow-left'></span><span class='hidden-xs-only'>&nbsp; Vorige</span></el-button>

      <span class='title' v-if="!context">{{$parent.title}}</span>

      <div class='crumbs hidden-xs-only' v-show='context != null'>
        <span v-for='(component, indx) in components'>
          <span class='crumb' v-if="!isLast(indx)" @click='handleClick(indx)'>
            {{component}} <span class='el-icon-arrow-right arrow'></span>
          </span>
          <a class='last' v-else @click='popoverClick($event)'>
            {{component}} <span class='el-icon-arrow-down toggle'></span>
          </a>
        </span>
      </div>

      <div class='arrows' v-if="arrowsEnabled">
        <el-button @click='prevSibling' type='primary'><span class='el-icon-arrow-left'></span></el-button>
        <el-button @click='nextSibling' type='primary'><span class='el-icon-arrow-right'></span></el-button>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'navigation',
  data() { return {
    siblingPath: '',
    siblings: [],
    popoverVisible: false,
    popoverLeft: 100,
    index: 0
  }},
  computed: {
    context() {
      return this.$route.params.context
    },
    altContext() {
      return this.context
    },
    arrowsEnabled() {
      if(!this.context) { return false }

      return (this.context.split("\\").length > 8 || this.context.split("\\").length == 7) && this.siblings.length > 1
    },
    components() {
      if(this.context == null) { return [1,2] }

      var sliced = this.context.split("\\").splice(5)
      return sliced
    },
    title() {
      return this.components[this.components.length-1]
    }
  },
  mounted() {
    console.log(this.$parent)
  },
  watch: {
    popoverVisible(val) {
      if(val) {
        window.addEventListener("click", this.closePopover)
      }
      if(!val) {
        window.removeEventListener("click", this.closePopover)
      }
    },
    context: {
      immediate: true,
      handler(value) {
        if(!this.context) { return }
        var path = this.context.split("\\").slice(0,-1).join("\\")
        if(path != this.siblingPath) {
          this.siblingPath = path
          this.loadSiblings()
        }
      }
    },
  },
  methods: {
    popoverClick(evt) {
      evt.stopPropagation()
      this.popoverVisible = !this.popoverVisible
      this.popoverLeft = evt.clientX - 100
    },
    closePopover() {
      this.popoverVisible = false
    },
    async loadSiblings() {
      this.siblings = await this.$pi.getChildren(this.siblingPath)
      var index = 0
      for(var sibling of this.siblings) {
        if (sibling.Path == this.context) {
          this.index = index
        }
        index+=1
      }
    },
    nextSibling() {
      this.index += 1
      if(this.index >= this.siblings.length) {
        this.index = 0
      }
      this.$router.replace({params: {context: this.updatePath(this.siblings[this.index].Name)}})
    },
    prevSibling() {
      this.index -= 1
      if(this.index < 0) {
        this.index = this.siblings.length - 1
      }
      this.$router.replace({params: {context: this.updatePath(this.siblings[this.index].Name)}})
    },
    openSibling(index) {
      this.index = index
      this.popoverVisible = false

      if(this.arrowsEnabled) {
        this.$router.replace({params: {context: this.updatePath(this.siblings[this.index].Name)}})
      } else {
        this.$router.push({name: this.siblings[index].Name.toLowerCase(), params: {context: this.siblings[index].Path}})
      }
    },
    updatePath(sibling) {
      var path = this.context.split("\\").slice(0,-1).join("\\")
      return path + "\\" + sibling
    },
    isLast(index) {
      return(index == this.components.length-1)
    },
    handleClick(index) {
      if(index == 0) {
        if(this.$router.mode == 'map') {
          this.$router.push('/map')
        } else {
          this.$router.push('/')
        }
      }
      if(index == 1) {
        var path = this.altContext.split("\\").slice(0,7).join("\\")
        this.$router.push('/locatie/'+path)
      }
      if(index == 2 || index == 3) {
        var path = this.altContext.split("\\").slice(0,8).join("\\")
        var name = this.altContext.split("\\").slice(0,8).pop().toLowerCase()
        this.$router.push({name: name, params: {context:path}})
      }
    }
  }

}
</script>
<style>
#header .mobile-title {
  font-size: 14px;
  margin-top: 40px;
  font-weight: bold;
}
#header .el-popover {
  z-index: 5000;
}
#header {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  padding: 5px 10px;
  z-index: 4000;
  background: #FFF;
  text-align: center;
  border-bottom: 1px solid #AAA;
}
#header-content {
  max-width: 1700px;
  padding: 5px;
  z-index: 50;
  position: relative;
  margin: auto;
}
#header span.title {
  display: inline-block;
  font-size: 22px;
  font-weight: bold;
  margin: 5px;
}
.crumbs {
  font-size: 20px;
  margin: 5px;
  color: #888;
}
.last {
  color: #333;
  cursor: pointer;
}

.arrow {
  font-size: 15px;
  display: inline-block;
  margin: 0px 10px;
  color: #888 !important;
}
.toggle {
  font-size: 12px;
}
.crumbs :hover {
  color: #409EFF;
  cursor: pointer;
}

.arrows {
  position: absolute;
  top: 0px;
  right: 0px;
}
#nav-popover {
  background: white;
  width: 250px;
  text-align: left;
  border: 1px solid #AAA;
  top: 50px;
  left: 50%;
  position: absolute;
  z-index: 100000;
  transition: all 1s;
  box-shadow: 0px 0px 10px #CCC;
}
#nav-popover::before {
  content: '';
  position: absolute;
  border-bottom: 10px solid #AAA;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid transparent;
  left: 50%;
  margin-left: -10px;
  top: -20px;
}
#nav-popover::after {
  content: '';
  position: absolute;
  border-bottom: 9px solid #FFF;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: 9px solid transparent;
  left: 50%;
  margin-left: -9px;
  top: -18px;
}

#sibling_list {
  margin: 0px;
  padding: 0px;
}
#sibling_list li {
  color: #606266;
  font-family: helvetica;
  list-style-type: none;
  font-size: 16px;
  padding: 10px;
  padding-left: 20px;
  border-bottom: 1px solid #AAA;
  cursor: pointer;
}
#sibling_list li:hover {
  background: #F2F6FC;
}
#sibling_list li:last-child {
  border-bottom: none;
}
#sibling_list .active {
  color: #409EFF;
  font-weight: bold;
}

@media only screen and (max-width: 1820px) {
  #header-content {
    margin-left: 50px;
  }
}
@media only screen and (max-width: 900px) {
  #header-content {
    margin-left: 0px;
  }
}

</style>
