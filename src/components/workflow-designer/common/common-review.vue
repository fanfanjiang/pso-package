<template>
  <div>
    <el-form-item :label="typeText">
      <el-select v-model="node[field]" placeholder="请选择" @change="opaChangeHandler">
        <el-option v-for="item in authType" :key="item.id" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="pickerText">
      <div class="wf-panel-usersection">
        <div class="wf-panel-usersection__list">
          <el-tag size="medium" closable @close="handleDelSelection(item)" v-for="(item, index) of node[list]" :key="index">{{
            item.name
          }}</el-tag>
        </div>
        <pso-picker-user
          v-if="node[field] === REVIEW_AUTH_TYPE.anybody.value || node[field] === REVIEW_AUTH_TYPE.one.value"
          pattern="checkbox"
          :show="showSelector"
          @confirm="opaAddHandler"
          @cancel="showSelector = false"
        ></pso-picker-user>
        <pso-picker-position
          v-if="node[field] === REVIEW_AUTH_TYPE.anyPosition.value || node[field] === REVIEW_AUTH_TYPE.position.value"
          pattern="checkbox"
          :show="showSelector"
          @confirm="opaAddHandler"
          @cancel="showSelector = false"
        ></pso-picker-position>
        <pso-picker-post
          v-if="node[field] === REVIEW_AUTH_TYPE.anyJob.value || node[field] === REVIEW_AUTH_TYPE.job.value"
          pattern="checkbox"
          :show="showSelector"
          @confirm="opaAddHandler"
          @cancel="showSelector = false"
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
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { REVIEW_AUTH_TYPE } from "../../../const/workflow";
import { pickerMixin } from "../../../mixin/picker";

export default {
  props: {
    node: {
      type: Object,
    },
    typeText: {
      type: String,
      default: "授权类型",
    },
    pickerText: {
      type: String,
      default: "设置处理者",
    },
    typeFilter: {
      type: Function,
    },
    field: {
      type: String,
      default: "opa",
    },
    list: {
      type: String,
      default: "opaitems",
    },
    reset: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [pickerMixin({ baseObjName: "node", dataListName: "opaitems", typeName: "_type" })],
  data() {
    return {
      showSelector: false,
      REVIEW_AUTH_TYPE: _.cloneDeep(REVIEW_AUTH_TYPE),
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
    authType() {
      const types = Object.values(this.REVIEW_AUTH_TYPE);
      return this.typeFilter ? this.typeFilter(types) : types;
    },
  },
  created() {
    if (this.reset) {
      this.resetPicker({ dataListName: this.list, reset: false });
    }
    this.node[this.field] && this.opaChangeHandler(this.node[this.field], false);
  },
  methods: {
    opaAddHandler(data) {
      const auth = _.find(this.authType, { value: this.node[this.field] });
      data.forEach((item) => {
        delete item.create_time;
        delete item.expire_time;
        delete item.user_pwd;
        delete item.user_sex;
        delete item.user_email;
        delete item.user_img;
        delete item.user_phone;
        Object.assign(item, { uid: "", pid: "", did: "" }, { [auth.opaId]: item[auth.idName], name: item[auth.opaName] });
      });
      this.handleAddSelection(data);
    },
    opaChangeHandler(value, reset = true) {
      const auth = _.find(this.authType, { value });
      this.resetPicker({ idName: auth.idName, reset });
    },
  },
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