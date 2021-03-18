<template>
  <div id='dbm-wrapper'>
    <iframe id='dbm-frame' src='http://dbm'>
    </iframe>
  </div>
</template>

<script>


export default {
  mounted() {
    this.$parent.title = 'DBM'
  }   
}
</script>
<style>
#dbm-wrapper {
  position: absolute;
  left: 0px;
  top: 50px;
  right: 0px;
  bottom: 0px;
}
#dbm-frame {
  border: none;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
}

</style>
