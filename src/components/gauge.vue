<template>
  <div class='gauge'>
    <span class='value'>{{value}}</span>
    <canvas :id='chartId'>
    </canvas>
    <span class='title'>{{title}}</span>
  </div>
</template>

<script>

import {Gauge} from '@/gauge.min.js'

export default {
  name: 'gauge',
  data() {
    return {
      gauge: null,
      value: '...',
      chartId: Math.random().toString(36).substr(2,10),
  }},
  props: {
    path: {default: '', type: String},
    context: {default: '', type: String},
    title: {default: '', type: String},
  },
  mounted() {
    var opts = {
      angle: -0.25, /// The span of the gauge arc 
      lineWidth: 0.15, // The line thickness 
      pointer: {
        length: 0.5, // Relative to gauge radius 
        strokeWidth: 0.025 // The thickness 
      },
      colorStart: '#6FADCF',   // Colors 
      colorStop: '#8FC0DA',    // just experiment with them 
      strokeColor: '#E0E0E0',
      percentColors: [[0.0, "#F56C6C" ], [0.50, "#E6A23C"], [1.0, "#67C23A"]],

      staticZones: [
         {strokeStyle: "#F03E3E", min: 0, max: 6}, 
         {strokeStyle: "#FFDD00", min: 6, max: 8}, // Yellow
         {strokeStyle: "#30B32D", min: 8, max: 10}, // Green
      ],
      renderTicks: {
          divisions: 10,
          divWidth: 0.8,
          divLength: 0.5,
          divColor: '#333',
          subDivisions: 2,
          subLength: 0.3,
          subWidth: 0.5,
          subColor: '#666'
      },
    }

    var target = document.getElementById(this.chartId)
    this.gauge = new Gauge(target).setOptions(opts)
    this.gauge.animationSpeed = 15; // set animation speed (32 is default value)
    this.gauge.maxValue = 10;
    this.gauge.setMinValue(0);
    this.loadValue()
    this.gauge.set(0)
  },
  watch: {
    context() {
      this.loadValue()
    }
  },
  methods: {
    async loadValue() {
      var path = ''
      if(this.context === null) {
        return
      }

      if(this.context == '') {
        path = this.$pi.parse(this.path, this.$parent.context)
      } else {
        path = this.$pi.parse(this.path, this.context)
      }
      var value = await this.$pi.getValue(path, false)
      try {
        this.gauge.set(value.Value)
        this.value = value.Value.toFixed(1)
      } catch(e) {
        this.gauge.set(0)
        this.value = '...'
      }
    }
  }
}
</script>
<style>
.gauge {
  position: relative;
}
.gauge .value {
  font-weight: bold;
  position: absolute;
  display: inline-block;
  left: 50%;
  width: 150px;
  top: 70%;
  text-align: center;
  font-size: 20px;
  margin-left: -75px;
}
.gauge .title {
  font-weight: bold;
  position: absolute;
  display: inline-block;
  left: 50%;
  width: 150px;
  top: 90%;
  text-align: center;
  font-size: 20px;
  margin-left: -75px;
}
.gauge canvas {
  width: 100%;
  height: 100%;
}

</style>
