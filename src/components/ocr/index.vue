<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="证件配置"
      icon="el-icon-tickets"
      :fetch-fun="fetch"
      :fields="FIELDS"
      :slots="SLOTS"
      @dbclick="dbClickHandler"
      @select="selectHandler"
    >
      <template #tablefun>
        <pso-search text="证件名称" v-model="fetchParams.cert_name"></pso-search>
        <el-divider direction="vertical"></el-divider>
        <pso-search text="证件编码" v-model="fetchParams.cert_code"></pso-search>
        <el-divider direction="vertical"></el-divider>
      </template>
      <template #datafun>
        <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
        <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除</el-button>
      </template>
      <template v-slot:field="{ data }">
        <el-button plain type="primary" size="mini" @click="onClickShit(data.row)">配置词库</el-button>
        <el-button plain v-if="data.row.cert_type === 99" type="primary" size="mini" @click="onClickFieldOp(data.row)">配置内容</el-button>
      </template>
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>证件配置</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="证件名称" required>
            <el-input v-model="curInstance.cert_name" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="证件编码">
            <el-input v-model="curInstance.cert_code" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="匹配类型">
            <el-select filterable clearable size="small" v-model="curInstance.match_type">
              <el-option v-for="(v, n) in MATCH_TYPE" :key="n" :label="v" :value="parseInt(n)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="识别词库">
            <el-button plain type="primary" size="mini" @click="onClickShit(curInstance)">设置</el-button>
          </el-form-item>
          <el-form-item label="匹配正则">
            <el-input v-model="curInstance.cert_regex" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="返回标记">
            <el-input v-model="curInstance.return_tag" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select filterable clearable size="small" v-model="curInstance.cert_type">
              <el-option v-for="(v, n) in CERT_TYPE" :key="n" :label="v" :value="parseInt(n)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="识别印章">
            <el-switch size="mini" v-model="curInstance.is_stamp" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="识别签字">
            <el-switch size="mini" v-model="curInstance.is_sign" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="匹配顺序">
            <el-input-number size="mini" v-model="curInstance.match_order" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="初始替换">
            <el-input v-model="curInstance.cert_init" size="small" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showField" width="80%" @close="showField = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>配置内容</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <ocr-field :id="pInstance.cert_id"></ocr-field>
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
        <doteditor v-if="curInstance" v-model="curInstance.rec_stock"></doteditor>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import OcrField from "./field";
import Doteditor from "./doteditor";

const TYPE = { 0: "否", 1: "是" };
const MATCH_TYPE = { 0: "包含", 1: "正则" };
const CERT_TYPE = { 1: "身份证", 2: "营业执照", 3: "银行卡", 99: "自定义" };

export default {
  mixins: [FetchMixin],
  components: { OcrField, Doteditor },
  data() {
    this.TYPE = TYPE;
    this.MATCH_TYPE = MATCH_TYPE;
    this.CERT_TYPE = CERT_TYPE;
    this.SLOTS = [{ n: "操作", v: "field", w: 200 }];
    this.FIELDS = [
      { v: "cert_name", n: "证件名称" },
      { v: "cert_code", n: "证件编码", w: 200 },
      { v: "cert_type", n: "证件类型", w: 180, trans: (v) => CERT_TYPE[v] },
      { v: "match_type", n: "匹配类型", w: 100, aln: "center", trans: (v) => MATCH_TYPE[v] },
      // { v: "rec_stock", n: "识别词库" },
      // { v: "cert_regex", n: "匹配正则" },
      // { v: "return_tag", n: "返回标记" },
      { v: "is_stamp", n: "识别印章", w: 100, aln: "center", trans: (v) => TYPE[v] },
      // { v: "is_sign", n: "识别签字", trans: (v) => TYPE[v] },
      { v: "match_order", n: "匹配顺序", w: 100, aln: "center" },
      // { v: "cert_init", n: "初始替换" },
    ];
    this.DATA = {
      cert_id: "",
      cert_name: "",
      cert_code: "",
      match_type: 1,
      rec_stock: "",
      cert_regex: "",
      return_tag: "",
      cert_type: 99,
      is_stamp: 0,
      is_sign: 0,
      match_order: 0,
      cert_init: "",
      cert_status: 0,
    };
    return {
      ID: "cert_id",
      using: false,
      showField: false,
      showDot: false,
      pInstance: {},
      fetchParams: {
        cert_name: "",
        cert_code: "",
      },
    };
  },
  created() {},
  methods: {
    async fetch(data) {
      const ret = await this.API.request("/api/ocr/template", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      return ret;
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/ocr/template", { data, method: "post" });
    },
    checkValidity(data) {
      if (!data.cert_name) {
        this.$notify({ title: "名称不能为空", type: "warning" });
        return;
      }
      if (!data.cert_id) {
        delete data.cert_id;
      }
      return true;
    },
    onClickFieldOp(data) {
      this.pInstance = data;
      this.showField = true;
    },
    onClickShit(data) {
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
