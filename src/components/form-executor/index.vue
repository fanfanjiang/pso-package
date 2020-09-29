<template>
  <div class="form-executor">
    <div class="form-executor-body">
      <pso-form-interpreter
        ref="formImage"
        :form-entity="cfg"
        :data-id="dataId"
        :data-instance="instance"
        :data-default="defForm"
        :editable="dataId ? edtailEditable : addable"
      ></pso-form-interpreter>
    </div>
    <div class="form-executor-footer">
      <div class="form-executor-footer__l"></div>
      <div class="form-executor-footer__r"></div>
    </div>
  </div>
</template>
<script>
export default {};
</script>