<template>
  <div>
    <el-form-item label="授权类型">
      <el-select v-model="node.opa" placeholder="请选择" @change="opaChangeHandler">
        <el-option v-for="item in authType" :key="item.id" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设置处理人">
      <div class="wf-panel-usersection">
        <div class="wf-panel-usersection__list">
          <el-tag
            size="medium"
            closable
            @close="handleDelSelection(item)"
            v-for="(item,index) of node.opaitems"
            :key="index"
          >{{item.name}}</el-tag>
        </div>
        <pso-picker-user
          v-if="node.opa===REVIEW_AUTH_TYPE.anybody.value||node.opa===REVIEW_AUTH_TYPE.one.value"
          pattern="checkbox"
          :show="showSelector"
          @confirm="opaAddHandler"
          @cancel="showSelector=false"
        ></pso-picker-user>
        <pso-picker-position
          v-if="node.opa===REVIEW_AUTH_TYPE.anyPosition.value||node.opa===REVIEW_AUTH_TYPE.position.value"
          pattern="checkbox"
          :show="showSelector"
          @confirm="opaAddHandler"
          @cancel="showSelector=false"
        ></pso-picker-position>
        <pso-picker-post
          v-if="node.opa===REVIEW_AUTH_TYPE.anyJob.value||node.opa===REVIEW_AUTH_TYPE.job.value"
          pattern="checkbox"
          :show="showSelector"
          @confirm="opaAddHandler"
          @cancel="showSelector=false"
        ></pso-picker-post>
      </div>
    </el-form-item>
    <el-form-item label="主体权限项">
      <el-select :multiple="true" v-model="node.bodyitemsList" placeholder="请选择">
        <el-option
          v-for="item in wfDesigner.permissionEntries"
          :key="item.body_id"
          :label="item.body_name"
          :value="item.body_id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="node.atype==='form'" label="表单权限项">
      <el-select :multiple="true" v-model="node.authitemsList" placeholder="请选择">
        <el-option
          v-for="item in wfDesigner.formAuthOptions"
          :key="item.body_id"
          :label="item.body_name"
          :value="item.body_id"
        ></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { REVIEW_AUTH_TYPE } from "../../../const/workflow";
import { pickerMixin } from "../../../mixin/picker";

export default {
  props: ["node"],
  mixins: [pickerMixin({ baseObjName: "node", dataListName: "opaitems", typeName: "_type" })],
  data() {
    return {
      showSelector: false,
      REVIEW_AUTH_TYPE: _.cloneDeep(REVIEW_AUTH_TYPE)
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
    authType() {
      return Object.values(this.REVIEW_AUTH_TYPE);
    }
  },
  methods: {
    opaAddHandler(data) {
      const auth = _.find(this.authType, { value: this.node.opa });
      data.forEach(item =>
        Object.assign(item, { uid: "", pid: "", did: "" }, { [auth.opaId]: item[auth.idName], name: item[auth.opaName] })
      );
      this.handleAddSelection(data);
    },
    opaChangeHandler(value) {
      const auth = _.find(this.authType, { value });
      this.resetPicker({ idName: auth.idName });
    }
  }
};
</script>
<style lang="less" scoped>
.wf-panel-usersection {
  .wf-panel-usersection__list {
    > span {
      margin-right: 5px;
    }
  }
}
</style>