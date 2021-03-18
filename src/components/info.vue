<template>
<div id='info'>
  <div id='info-header'></div>
  <el-tabs>
    <el-tab-pane label='Status' lazy>
      <div v-if='show'>
      <h3>LIMS</h3><pi-multistate context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|LIMS' class='status-circle' :colors="[[0,'red'], [1,'green']]"></pi-multistate><br />
      <strong>Status:</strong><pi-value context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|LIMS'></pi-value> <br />
      <strong>Laatste synchronisatie:</strong> <pi-value context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|LIMS|Tijd sinds Laatste Sync' :precision='0'></pi-value> uur geleden<br />
      <strong>Aantal meetwaarden:</strong> <pi-value context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|LIMS|Aantal Resultaten' :precision='0'></pi-value><br />

      <h3>PI</h3><pi-multistate context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|PI' class='status-circle' :colors="[[0,'red'], [1,'green']]"></pi-multistate><br />

      <strong>SR-16634 (MN/FL)</strong> <pi-multistate context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|PI|SR16634' class='status-circle' :colors="[[0,'red'], [1,'green']]"></pi-multistate><br />
      <strong>SR-16635 (FR)</strong> <pi-multistate context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|PI|SR16635' class='status-circle' :colors="[[0,'red'], [1,'green']]"></pi-multistate><br />
      <strong>SR-16636 (OV)</strong> <pi-multistate context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|PI|SR16636' class='status-circle' :colors="[[0,'red'], [1,'green']]"></pi-multistate><br />
      <strong>SR-16637 (GE)</strong> <pi-multistate context='\\sr-16642\SLIMM Productie\Vitens' path='.|Systeem|Status|PI|SR16637' class='status-circle' :colors="[[0,'red'], [1,'green']]"></pi-multistate><br />
      </div>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
export default { 
  data() {
    return {
    }
  },
  computed: {
    show() {
      return this.$parent.$parent.showDialog
    }
  }
}

</script>

<style>
#info-header {
  height: 90px;
  background: url('../assets/banner.png') no-repeat center center;
}
#info strong, #info h3 {
  display: inline-block;
  width: 180px;
  margin: 5px 0px;
}
#info h3 {
  width: 184px;
  margin: 15px 0px;
}
#info .status-circle {
  width: 15px;
  height: 15px;
  display: inline-block;
  border-radius: 10px;
}


</style>
