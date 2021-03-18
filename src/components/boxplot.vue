<template>
  <div class='boxplot' v-loading='loading'>
    <canvas :id='uid'></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'

import 'chartjs-chart-box-and-violin-plot'
//import exportPlugin from 'chartjs-plugin-export'
//require('chartjs-plugin-export/src/chartjs-plugin-export.css')

const boxplugin = {
  id: 'boxplugin',
  beforeDraw(chart) {

    if(chart.options.parameter.ll) {
      this.drawThreshold(chart,chart.options.parameter.ll , 'red')

    }
    if(chart.options.parameter.ul) {
      this.drawThreshold(chart,chart.options.parameter.ul , 'red')
    }
    if(chart.options.parameter.lt) {
      this.drawThreshold(chart,chart.options.parameter.lt , 'orange')
    }
    if(chart.options.parameter.ut) {
      this.drawThreshold(chart,chart.options.parameter.ut , 'orange')
    }

  },

  drawThreshold(chart, value, color) {

    var yScale = chart.scales['y-axis-0']
    var xScale = chart.scales['x-axis-0']

    if(value > xScale.max || value < xScale.min) {
      return
    }

    chart.ctx.beginPath();
    chart.ctx.moveTo(xScale.getPixelForValue(value), yScale.getPixelForValue(yScale.min));
    chart.ctx.lineWidth = 1
    chart.ctx.strokeStyle = color;
    chart.ctx.lineTo(xScale.getPixelForValue(value), yScale.getPixelForValue(yScale.max));
    chart.ctx.stroke();

  }
}

export default {
  props: ['parameter', 'locations', 'name', 'year', 'xlabel', 'min', 'max', 'attrpath'],
  data() { return {
    bmap: ["#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f"],
    cmap: ["rgba(55,126,184,0.8)", "rgba(102,166,30,0.8)", "rgba(152,78,163,0.8)", "rgba(0,210,213,0.8)", "rgba(255,127,0,0.8)", "rgba(175,141,0,0.8)", "rgba(127,128,205,0.8)", "rgba(179,233,0,0.8)", "rgba(196,46,96,0.8)", "rgba(166,86,40,0.8)", "rgba(247,129,191,0.8)", "rgba(141,211,199,0.8)", "rgba(190,186,218,0.8)", "rgba(251,128,114,0.8)", "rgba(128,177,211,0.8)", "rgba(253,180,98,0.8)", "rgba(252,205,229,0.8)", "rgba(188,128,189,0.8)", "rgba(255,237,111,0.8)"],
    uid: Math.random().toString(32).substring(2),
    loading: true
  }},
  created() {
  },
  mounted() {
   //Chart.plugins.register(exportPlugin)

    var options = {
      type: 'horizontalBoxplot',
      plugins: [boxplugin],
      options: {
        animation: false,
        legend: {
          position: 'top'
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.name + " - " + this.parameter.name + " - " + this.year
        },
        plugins: {
          crosshair: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.xlabel
            }
          }]
        },
        parameter: this.parameter
      }
    }

    var ctx = document.getElementById(this.uid).getContext("2d")
    this.$options.chart = new Chart(ctx, options)
    this.loading = false

    this.loadData()
  },

  watch: {
    locations() {
      this.loadData()
    },
    parameter() {
      this.loadData()
    },
    year() {
      this.loadData()
    },
    min(val) {
      console.log(this.min)
      this.$options.chart.options.scales.xAxes[0].ticks.min = val
      this.$options.chart.update()
    },
    max(val) {
      this.$options.chart.options.scales.xAxes[0].ticks.max = val
      this.$options.chart.update()
    }
  },

  methods: {

    getBoxPlotData(data) {

      var values = []
      for(var result of data) {
        if(result.Value < 0.01) {
          values.push(result.Value)
        } else {
          values.push(Math.round(result.Value * 100) / 100)
        }
      }
      return values
    },

    async loadData() {
      this.loading = true

      var chart = this.$options.chart


      chart.data.datasets = []
      chart.data.labels = []


      chart.options.title.text = this.name + " - " + this.parameter.name
      chart.options.parameter = this.parameter
      chart.options.scales.xAxes[0].scaleLabel.labelString = this.parameter.label

      chart.update()


      if (this.min != null) { chart.options.scales.xAxes[0].ticks.min = this.min }
      if (this.max != null) { chart.options.scales.xAxes[0].ticks.max = this.max }

      var datasetIndex = 0

      var token = Math.random()
      this.$options.token = token

      for(var year of [...this.year].sort()) {

        var requests = []

        for(var location of this.locations) {
          var path = location.Path + this.attrpath +this.parameter.name
          path += " (lab)"
          requests.push(this.$pi.getRecorded(path, year + '-01-01', year+1 + '-01-01'))
        }

        var results = await Promise.all(requests)
        if(token != this.$options.token) { return }

        var data = []

        chart.data.datasets.push({
            label: year,
            backgroundColor: this.cmap[datasetIndex],
            borderColor: this.bmap[datasetIndex],
            borderWidth: 1.5,
            itemRadius: 0,
            outlierColor: '#333',
            padding: 0.2,
            data: []
        })

        
        for(var location of this.locations) {
          var measurements = results.shift()
          if(measurements.length > 0) {
            if(datasetIndex == 0) {
              chart.data.labels.push(location.Name)
            }
            chart.data.datasets[datasetIndex].data.push(this.getBoxPlotData(measurements))
          }
        }
        
        datasetIndex += 1
      }

      chart.update()

      this.loading = false

    }
  }

}
</script>
<style>
.boxplot {
  min-height: 850px;
}
</style>
