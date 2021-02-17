<template>
  <div class="form-executor-header">
    <div class="form-executor-header__l">
      <div class="form-executor-title">
        <slot name="title"></slot>
      </div>
    </div>
    <div class="form-executor-header__r">
      <slot name="action"></slot>
    </div>
  </div>
</template>
<script>
export default {};
</script>