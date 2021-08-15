<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="证件内容"
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
      <template v-slot:field="{ data }">
        <el-button plain type="primary" size="mini" @click="onClickShit(data.row, 'match_word')">词库</el-button>
        <el-button plain type="primary" size="mini" @click="onClickShit(data.row, 'match_pre')">紧前</el-button>
        <el-button plain type="primary" size="mini" @click="onClickShit(data.row, 'match_after')">紧后</el-button>
        <el-button plain type="primary" size="mini" @click="onClickShit(data.row, 'val_rule')">替换词</el-button>
        <el-button plain v-if="data.row.con_val_type === 1" type="primary" size="mini" @click="onClickOp(data.row)">配置字段</el-button>
      </template>
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>证件内容</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="返回名称" required>
            <el-input v-model="curInstance.content_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="返回字段">
            <el-input v-model="curInstance.content_field" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="匹配词库">
            <el-button plain type="primary" size="mini" @click="onClickShit(curInstance, 'match_word')">设置</el-button>
          </el-form-item>
          <el-form-item label="匹配顺序">
            <el-input-number size="mini" v-model="curInstance.match_order" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="值类型">
            <el-select filterable clearable size="small" v-model="curInstance.con_val_type">
              <el-option v-for="(v, n) in VAL_TYPE" :key="n" :label="v" :value="parseInt(n)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="输出格式">
            <el-input v-model="curInstance.con_val_format" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="紧前分割词库">
            <el-button plain type="primary" size="mini" @click="onClickShit(curInstance, 'match_pre')">设置</el-button>
          </el-form-item>
          <el-form-item label="紧后分割词库">
            <el-button plain type="primary" size="mini" @click="onClickShit(curInstance, 'match_after')">设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showView" width="50%" @close="showView = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>配置内容</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <ocr-format :id="pInstance.leaf_id"></ocr-format>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showDot" width="40%" @close="showDot = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>配置词库</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" :disabled="editing" :loading="editing" @click="onClickSaveDot()">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <doteditor v-if="curInstance" v-model="curInstance[dotField]"></doteditor>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import OcrFormat from "./format";
import Doteditor from "./doteditor";
const VAL_TYPE = { 0: "直接获取", 1: "多分段获取" };

export default {
  components: { OcrFormat, Doteditor },
  mixins: [FetchMixin],
  props: {
    id: String,
  },
  data() {
    this.VAL_TYPE = VAL_TYPE;
    this.SLOTS = [{ n: "操作", v: "field", w: 380 }];
    this.FIELDS = [
      { v: "content_name", n: "返回名称", w: 160 },
      { v: "content_field", n: "返回字段", w: 160 },
      { v: "match_order", n: "匹配顺序", w: 100 },
      // { v: "match_word", n: "匹配词库" },
      { v: "con_val_type", n: "值类型", w: 100, trans: (v) => VAL_TYPE[v] },
      { v: "con_val_format", n: "输出格式" },
      // { v: "match_pre", n: "紧前分割词库" },
      // { v: "match_after", n: "紧后分割词库" },
    ];
    this.DATA = {
      leaf_id: "",
      content_name: "",
      content_field: "",
      match_order: 0,
      match_word: "",
      con_val_type: 0,
      con_val_format: "",
      match_pre: "",
      match_after: "",
      val_rule: "",
      begin_match: 0,
    };
    return {
      ID: "leaf_id",
      showView: false,
      pInstance: {},
      showDot: false,
      dotField: "",
    };
  },
  created() {},
  methods: {
    async fetch(data = {}) {
      data.cert_id = this.id;
      const ret = await this.API.request("/api/ocr/field", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      ret.data.data = ret.data;
      ret.data.page = ret.count;
      return ret;
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/ocr/field", { data, method: "post" });
    },
    checkValidity(data) {
      if (!data.content_name) {
        return this.$notify({ title: "名称不能为空", type: "warning" });
      }
      if (!data.content_field) {
        return this.$notify({ title: "返回字段不能为空", type: "warning" });
      }
      if (!data.leaf_id) {
        delete data.leaf_id;
      }
      data.cert_id = this.id;
      return true;
    },
    onClickOp(data) {
      this.pInstance = data;
      this.showView = true;
    },
    onClickShit(data, field) {
      this.dotField = field;
      this.curInstance = data;
      this.showDot = true;
    },
    onClickSaveDot() {
      if (this.curInstance[this.ID]) {
        this.saveHandler();
      }
      this.showDot = false;
    },
  },
};
</script>
