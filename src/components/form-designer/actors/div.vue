<template>
  <div class="psodiv dropable" put="true" pull="true" sort="true" :fid="cpnt.fid">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "pso-div-actor",
  props: ["cpnt"]
};
</script>
<style lang="less" scoped>
.psodiv {
  width: 100%;
  display: block;
  background-color: #fafafa;
  padding: 15px;
  > div {
    & + div {
      margin-top: 15px;
    }
  }
}
</style>