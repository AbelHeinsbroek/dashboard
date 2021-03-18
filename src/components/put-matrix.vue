<template>
  <div class='well-status-matrix' v-loading='loading'>
    <canvas :id='uid'></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'
import 'chartjs-chart-matrix'
import 'chartjs-plugin-crosshair'

export default {
  props: {
    wells: {
      type: Array,
      default: []
    },
    start: {
      type: [String, Number],
      default: '*-24h'
    },
    end: {
      type: [String, Number],
      default: '*'
    },
    interval: {
      type: [String],
      default: '10m'
    }
  },
  data() { return {
    loading: false,
    test: 123,
    uid: Math.random().toString(32).substring(2),
  }},
  mounted() {
    this.loading = true
    var options = {
      type: 'matrix',
      data: {
        datasets: [{
						data: [],
						backgroundColor: function(ctx) {
							var value = ctx.dataset.data[ctx.dataIndex].v;
              if(value == 1) {
                return '#67B239'
              } else {
                return '#FF2422'
              }
						},
						width: function(ctx) {
							var a = ctx.chart.chartArea;
              if(this === undefined) {
                return 0
              }
							return (a.right - a.left) / ((ctx.dataset.data.length) / this.wells.length);

						}.bind(this),
						height: function(ctx) {
							var a = ctx.chart.chartArea;
							return (a.bottom - a.top) / this.wells.length - 1;
						}.bind(this)
					}]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          crosshair: {
            line: {
              color: '#000',
              width: 1,
            },
            sync: {
              suppressTooltips: true 
            },
            callbacks: {
              afterZoom: function(start, end) {
                // remove first item
                this.$options.chart.data.datasets[0].data.shift()
                var indextosplice = Math.floor(this.$options.chart.data.datasets[0].data.length / this.wells.length)
                this.$options.chart.data.datasets[0].data.splice(indextosplice, 1)

                this.$options.chart.update(0)
              }.bind(this)
            }
          },
        },
        legend: false,
        scales: {
              xAxes: [{
                type: 'time',
                ticks: {
                  display: true,
                  stepSize: 1
                },
                gridLines: {
                  display: false
                },
                time: {
                  displayFormats: {
                    hour: 'HH:mm',
                    minute: 'HH:mm'
                  },
                  tooltipFormat: 'dd. D MMM HH:mm:ss'
                }
              }],
              yAxes: [{
                ticks: {
                  display: true,
                  min: -0.5,
                  max: this.wells.length - 0.5,
                  stepSize: 1,
                  callback: function(value, index, values) {
                    if(value % 1 == 0) {

                      return this.wells[value].Name.replace("Winput ", "")
                    } else {
                      return ""
                    }

                  }.bind(this),
                },
                gridLines: {
                  display: false
                },
              }]
          }
      }}
    var ctx = document.getElementById(this.uid).getContext("2d")
    this.$options.chart = new Chart(ctx, options)
    this.loadData()
  },
  beforeDestroy() {
    this.$options.chart.destroy()
  },
  watch: {
    wells() {
      this.loadData()
    },
    start() {
      this.loadData()
    },
    end() {
      this.loadData()
    }
  },
  methods: {
    async loadData() {
      this.loading = true
      if(this.wells.length == 0) { return }
      var requests = []
      for(var well of this.wells) {
        requests.push(this.$pi.getInterpolated(well.Path+"|Procesgegevens|Status winput (numeriek)", this.start, this.end, this.interval))
      }
      var data = []
      var index = 0
      var results = await Promise.all(requests)
      for(var well of this.wells) {
        var result = results.shift()
        for(var res of result) {
          data.push({
            y: index,
            x: new Date(res.Timestamp.replace("T"," ")),
            v: res.Value
          })
        }
        index+=1
      }

      this.loading = false
      this.$options.chart.data.datasets[0].data = data
      this.$options.chart.options.scales.yAxes[0].ticks.max = this.wells.length - 0.5
      this.$options.chart.update(0)
    }
  }

}
</script>
<style>
</style>
