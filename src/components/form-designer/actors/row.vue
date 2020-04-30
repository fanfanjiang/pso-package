<template>
  <div class="psorow dropable" put="true" pull="true" sort="true" :fid="cpnt.fid">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "pso-row-actor",
  props: ["cpnt"]
};
</script>
<style lang="less" scoped>
.psorow {
  width: 100%;
  display: flex;
  background-color: #fafafa;
  padding: 15px;
  > div {
    & + div {
      margin-left: 15px;
    }
  }
}
</style>