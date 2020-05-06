<template>
  <div class="pso-form-actor__table-wrapper">
    <div
      class="pso-form-actor__table dropable"
      anticlass="unSubTable"
      put="true"
      pull="true"
      sort="true"
      :fid="cpnt.fid"
    >
      <slot></slot>
    </div>
    <div class="pso-form-actor__table-plus">
      <el-button type="primary" size="mini" icon="el-icon-plus">添加新行</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "pso-table-actor",
  props: ["cpnt"]
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.pso-form-actor__table-plus {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 5px 0;
}
.pso-form-actor__table {
  width: 100%;
  display: flex;
  background-color: #fafafa;
  padding: 15px;
  overflow-x: scroll;
  > div {
    & + div {
      margin-left: 15px;
    }
  }
  @{deep} .actor {
    flex: 0 0 160px;
  }
  @{deep} .actor-wrapper {
    flex-direction: column;
    .actor-label {
      width: 100%;
      border: 1px solid #cccccc;
      border-bottom: none;
      padding: 3px;
    }
    .actor-body {
      width: 100%;
    }
  }
}
</style>