<template>
  <div
    :class="['actor', 'dragable', cpnt.CPNT.class || '']"
    :componentid="cpnt.componentid"
    :fid="cpnt.fid"
    @click.stop="actorClickHandler()"
  >
    <component v-bind:is="currentEL" :cpnt="cpnt">
      <designer-cpnt v-for="cpntItem in cpnt.childComponents" :key="cpntItem.fid" :cpnt="cpntItem"></designer-cpnt>
    </component>
    <div class="controller left">
      <i :class="cpnt.CPNT.icon"></i>
    </div>
    <div class="controller right" v-if="cpnt.data._deletable">
      <span class="actor-delete el-icon-delete" @click.stop="removeHandler"></span>
    </div>
  </div>
</template>
<script>
const componentsMap = {};
const requireComponent = require.context("./actors", true);
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = _.upperFirst(
    _.camelCase(
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );
  componentsMap[`PsoActor${componentName}`] = componentConfig.default;
});
export default {
  name: "designerCpnt",
  props: ["cpnt"],
  components: componentsMap,
  computed: {
    currentEL() {
      return `pso-actor-${this.cpnt.componentid}`;
    },
  },
  methods: {
    actorClickHandler() {
      this.cpnt.store.setCurrentCpnt(this.cpnt);
    },
    removeHandler() {
      this.cpnt.store.remove(this.cpnt);
    },
  },
};
</script>
<style lang="less" scoped>
.actor {
  position: relative;
  padding: 20px 20px 0 20px;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  &:hover {
    background-color: #fafafa;
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    cursor: grab;
    .right {
      display: flex;
    }
  }
  &.selected {
    background-color: #e3f3ff;
    &:hover {
      background-color: #e3f3ff;
    }
    .right {
      display: flex;
    }
  }
  .controller {
    position: absolute;
    top: 0;
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.16);
    font-size: 14px;
    line-height: 20px;
    height: 20px;
    text-align: center;
    color: #999;
    background-color: #fff;
  }
  .left {
    width: 20px;
    border-radius: 3px;
    left: 20px;
    width: 20px;
    border-radius: 3px;
    top: 18px;
  }
  .right {
    top: -5px;
    right: 5px;
    display: none;
    > span {
      width: 24px;
      cursor: pointer;
    }
    .actor-delete {
      line-height: 24px;
      height: 24px;
      border-radius: 3px;
      color: #666;
      background-color: #fff;
      transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
      &:hover {
        background-color: #e36464;
        color: #fff;
        transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
      }
    }
  }
}
</style>