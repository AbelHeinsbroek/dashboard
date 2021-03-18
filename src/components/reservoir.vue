<template>
  <div class='reservoir' v-loading='loading'>
    <span class='value'>{{Math.round(current_content)}}</span>
    <div class='water' :style='{height: level}'></div>
  </div>
</template>

<script>

export default {
  name: 'gauge',
  data() {
    return {
      loading: true,
      current_content: 0,
      max_content: 100
  }},
  props: {
    max: {default: 100, type: [Number, String]},
    content: {default: 0, type: [Number, String]},
    context: {default: '', type: String},
  },
  computed: {
    level() {
      return (this.current_content/this.max_content)*100 + "%"
    }
  },
  mounted() {
    this.loadValue()
  },
  watch: {
    context() {
      this.loadValue()
    },
  },
  methods: {
    async loadValue() {
      this.loading = true

      if(typeof(this.max) === Number) {
        this.max_content = this.max
      } else {
        var max = await this.$pi.getValue(this.$pi.parse(this.max, this.context))
        this.max_content = max.Value
      }

      if(typeof(this.content) === Number) {
        this.current_content = this.content
      } else {
        var current = await this.$pi.getValue(this.$pi.parse(this.content, this.context))
        this.current_content = current.Value

      }



      this.loading = false
    }
  }
}
</script>
<style>
.reservoir {
  width: 100%;
  height: 150px;
  border: 1px solid #AAA;
  position: relative;
}
.reservoir .value {
  position: absolute;
  width: 100%;
  top: 50%;
  text-align: center;
  margin-top: -10px;
  z-index: 2;
}
.reservoir .water {
  background: #8DC0FD;
  position: absolute;
  left: 0px;
  right: 0px;
  z-index: 1;
  bottom: 0px;
}

</style>
