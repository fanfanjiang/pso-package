<template>
  <div class="Lay-setting">
    <div class="header">
      <el-tabs v-model="fetchParams.map_key4">
        <el-tab-pane label="微信消息模板" name="wechatweb"></el-tab-pane>
        <el-tab-pane label="企业微信消息模板" name="wechatcrop"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="body">
      <pso-common-view
        ref="view"
        icon="el-icon-tickets"
        :fetch-fun="fetch"
        :fields="FIELDS"
        @dbclick="dbClickHandler"
        @select="selectHandler"
      >
        <template #tablefun> </template>
        <template #datafun>
          <el-button type="primary" size="mini" @click="addHandler">新增模板</el-button>
          <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除模板</el-button>
        </template>
      </pso-common-view>
    </div>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>模板配置</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <template-set :data="curInstance"></template-set>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import { COLUMN } from "./const";
import TemplateSet from "./template-set";
export default {
  mixins: [FetchMixin],
  components: { TemplateSet },
  data() {
    this.FIELDS = [
      { v: "map_key0", n: "模板ID" },
      { v: "map_key1", n: "模板名称" },
      { v: "map_key3", n: "模板标识" },
    ];
    this.DATA = { ...COLUMN };
    return {
      ID: "auto_no",
      fetchParams: {
        map_key4: "wechatweb",
      },
    };
  },
  methods: {
    async fetch() {
      const ret = await this.API.getSysConfig(this.getFetchParams({ keys: { config_type: { value: 16, type: 1 } } }));
      ret.data.data = ret.data;
      ret.data.page = ret.data.length;
      return ret;
    },
    async addOrUpdate(data) {
      data.map_key4 = this.fetchParams.map_key4;
      data.map_key2 = this.fetchParams.map_key4 === "wechatweb" ? "wechat" : "";
      data.config_type = 16;
      return await this.API.updateSysConfig(data);
    },
    checkValidity(data) {
      if (!data.map_key0 || !data.map_key1 || !data.map_key3) {
        this.$message("请完善信息");
        return;
      }
      return true;
    },
  },
};
</script>
