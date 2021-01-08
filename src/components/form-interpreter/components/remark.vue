<template>
  <div class="pso-form-remark">
    <i class="el-icon-warning"></i>
    <span>{{ cpnt.data._val || cpnt.data._defaultValue }}</span>
  </div>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style lang="less" scoped>
.pso-form-remark {
  i {
    font-size: 16px;
    margin-right: 5px;
  }
  color: #f56c6c;
  font-weight: bold;
  background: #fff;
  letter-spacing: 1.2px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  border-radius: 10px;
}
</style>