<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <pso-signature v-if="!cpnt.data._val" @save="saveHandler" :show="showSig"></pso-signature>
    <div class="pso-form-sig-img" v-else>
      <img :src="cpnt.data._val" />
      <el-button
        v-if="cpnt.store.editable&&!cpnt.data._read"
        type="danger"
        icon="el-icon-delete"
        circle
        size="mini"
        @click="cpnt.data._val=''"
      ></el-button>
    </div>
  </el-form-item>
</template>
<script>
import PsoSignature from "@/components/common/pso-signature";
import cpntMixin from "../mixin";

export default {
  components: { PsoSignature },
  mixins: [cpntMixin],
  data() {
    return {
      showSig: false
    };
  },
  methods: {
    saveHandler(data) {
      this.cpnt.data._val = data;
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.pso-form-sig-img {
  height: 140px;
  width: 200px;
  position: relative;
  box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 0.1);
  margin: 5px;
  > img {
    height: 100%;
    width: 100%;
  }
  @{deep} {
    .el-button {
      position: absolute;
      top: -14px;
      right: -14px;
    }
  }
}
</style>