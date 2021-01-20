<template>
  <pso-label :cpnt="cpnt">
    <div style="display: flex; align-items: center">
      <template v-if="isFormSource">
        <el-select v-model="formProxy" :disabled="!cpntEditable" clearable placeholder="请选择" filterable :multiple="multiple">
          <el-option v-for="(f, i) in formSrcList" :key="i" :label="f[uname]" :value="f[uid]"> </el-option>
        </el-select>
      </template>
      <template v-else>
        <div class="pso-form-user-selectedlist" v-if="!loading && proxy.list.length">
          <el-tag v-for="item in proxy.list" size="medium" :key="item.user_id" :closable="cpntEditable" @close="handleDelSelection(item)">
            {{ item.user_name }}
          </el-tag>
        </div>
        <pso-picker-user v-if="cpntEditable" :pattern="cpnt.data._type" @confirm="handleAddSelection">
          <div style="margin-top: -4px">
            <el-button size="mini" icon="el-icon-plus" circle></el-button>
          </div>
        </pso-picker-user>
      </template>
      <pso-skeleton v-if="loading" :lines="1" :s-style="{ width: '120px', padding: '0 5px' }"></pso-skeleton>
    </div>
  </pso-label>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";
import { mapState } from "vuex";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" }), cpntMixin],
  data() {
    return {
      loading: false,
      proxy: {
        list: [],
        type: this.cpnt.data._type,
      },
      formProxy: [],
      formSrcList: [],
    };
  },
  computed: {
    ...mapState(["base"]),
    isFormSource() {
      return this.cpnt.data._sourceType === "2";
    },
    uid() {
      return this.isFormSource ? this.cpnt.data._bindFormField : "user_id";
    },
    uname() {
      return this.isFormSource ? `${this.cpnt.data._bindFormField}_x` : "user_name";
    },
    multiple() {
      return this.cpnt.data._type === "checkbox";
    },
  },
  watch: {
    "proxy.list"(val) { 
      if (val && val.length) {
        this.cpnt.data._val = _.map(val, this.uid).join(",");
      } else {
        this.cpnt.data._val = "";
      }
    },
  },
  async created() {
    this.loading = true;

    let initList = [];
    if (this.cpnt.data._val) {
      initList = this.cpnt.data._val.split(",");
    } else if (this.cpnt.data._defaultValType === "current" && this.base.user && this.base.user.user_id) {
      initList = [this.base.user.user_id];
    }

    if (this.isFormSource) {
      this.resetPicker({ idName: this.uid, reset: false });
      await this.getFormSource();
      this.formProxy = this.multiple ? initList : initList.length ? initList[0] : "";
      this.$watch("formProxy", {
        deep: true,
        handler(data) {
          this.setDataByIds(data);
        },
      });
    }

    if (initList.length) {
      await this.setDataByIds(initList);
    } else {
      this.proxy.valList = [];
    }

    this.loading = false;
    //初始化时
    this.dispatch("PsoformInterpreter", "cpnt-user-initialized", { cpnt: this.cpnt, value: this.cpnt.data._val, proxy: this.proxy });
  },
  methods: {
    async getFormSource() {
      const params = { limit: 9999999, page: 0, leaf_auth: 4, data_code: this.cpnt.data._bindForm, keys: JSON.stringify({}) };
      const ret = await this.API.form({ data: params, method: "get" });
      this.formSrcList = ret.data;
    },
    async getUser(user_id) {
      return await this.API.user({ data: { user_id }, method: "get" });
    },
    async setDataByIds(users) {
      if (users && typeof users === "string") {
        users = users.split(",");
      }
      const list = [];

      for (let uid of users) {
        let data = null;
        if (this.isFormSource) {
          data = _.find(this.formSrcList, { [this.uid]: uid });
        }
        if (!data) {
          data = await this.getUser(uid);
          if (data && this.isFormSource) {
            data = { [this.uid]: uid, [this.uname]: data.user_name };
            this.formSrcList.push(data);
          }
        }
        if (data && data[this.uid]) list.push(data);
      }
      if (this.isFormSource) {
        this.proxy.list = list;
      } else {
        this.handleAddSelection(list);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.pso-form-user-selectedlist {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
  > span {
    margin: 2px;
    box-sizing: content-box;
  }
}
</style>