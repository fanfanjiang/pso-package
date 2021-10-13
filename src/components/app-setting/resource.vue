<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      icon="el-icon-tickets"
      :fetch-fun="fetch"
      :fields="FIELDS"
      :slots="SLOTS"
      @dbclick="dbClickHandler"
      @select="selectHandler"
    >
      <template #tablefun> </template>
      <template #datafun>
        <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
        <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除</el-button>
      </template>
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>配置</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="配置编码" required>
            <el-input size="small" v-model="curInstance.map_key0"></el-input>
          </el-form-item>
          <el-form-item label="保存栏目" required>
            <pso-picker-tree :request-options="{ dimen: 6, data_type: 'sysdoc' }" pattern="radio" rootable @confirm="onConfirm">
              <el-button size="mini" type="primary" plain>选择栏目</el-button>
            </pso-picker-tree>
          </el-form-item>
          <el-form-item label="保存类型" required>
            <el-select filterable clearable size="small" v-model="curInstance.map_key3">
              <el-option v-for="(v, n) in TYPE" :key="n" :label="v" :value="n + ''"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否重命名">
            <el-select filterable clearable size="small" v-model="curInstance.map_key4">
              <el-option v-for="(v, n) in YES_NO" :key="n" :label="v" :value="n + ''"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否覆盖">
            <el-select filterable clearable size="small" v-model="curInstance.map_key5">
              <el-option v-for="(v, n) in YES_NO" :key="n" :label="v" :value="n + ''"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否分类">
            <el-select filterable clearable size="small" v-model="curInstance.map_key6">
              <el-option v-for="(v, n) in YES_NO" :key="n" :label="v" :value="n + ''"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input size="small" v-model="curInstance.map_key7"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
const TYPE = { 0: "时间格式", 1: "ID格式" };
const YES_NO = { 0: "否", 1: "是" };

export default {
  mixins: [FetchMixin],
  props: {
    id: String,
  },
  data() {
    this.TYPE = TYPE;
    this.YES_NO = YES_NO;
    this.FIELDS = [
      { v: "map_key2", n: "保存栏目" },
      { v: "map_key3", n: "保存类型", trans: (v) => TYPE[v] },
      { v: "map_key4", n: "是否重命名", trans: (v) => YES_NO[v] },
      { v: "map_key5", n: "是否覆盖", trans: (v) => YES_NO[v] },
      { v: "map_key6", n: "是否分类", trans: (v) => YES_NO[v] },
      { v: "map_key7", n: "分类名称" },
    ];
    this.DATA = {
      auto_no: "",
      map_key0: "",
      map_key1: "",
      map_key2: "",
      map_key3: "0",
      map_key4: "0",
      map_key5: "0",
      map_key6: "0",
      map_key7: "",
      map_key8: "",
      map_key9: "",
      config_type: 80,
    };
    return {
      ID: "auto_no",
    };
  },
  created() {},
  methods: {
    async fetch() {
      const ret = await this.API.getSysConfig(this.getFetchParams({ keys: { config_type: { value: this.DATA.config_type, type: 1 } } }));
      ret.data.data = ret.data;
      ret.data.page = ret.data.length;
      return ret;
    },
    async addOrUpdate(data) {
      data.config_type = this.DATA.config_type;
      return await this.API.updateSysConfig(data);
    },
    checkValidity(data) {
      if (!data.map_key0 || !data.map_key2 || !data.map_key3) {
        this.$message("请完善信息");
        return;
      }
      return true;
    },
    onConfirm(data) {
      if (data.length) {
        this.curInstance.map_key2 = data[0].node_id;
      }
    },
  },
};
</script>
