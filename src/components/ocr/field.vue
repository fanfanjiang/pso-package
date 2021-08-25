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
        <el-button type="primary" size="mini" :disabled="selected.length !== 1" @click="onCopyAdd">复制</el-button>
        <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除</el-button>
      </template>
      <template v-slot:field="{ data }">
        <el-button plain type="primary" size="mini" @click="onClickShit(data.row, 'match_word')">词库</el-button>
        <template v-if="!!~VAL_TYPE[data.row.con_val_type].rule.indexOf(10)">
          <el-button plain type="primary" size="mini" @click="onClickShit(data.row, 'match_pre')">紧前</el-button>
          <el-button plain type="primary" size="mini" @click="onClickShit(data.row, 'match_after')">紧后</el-button>
        </template>
        <el-button plain type="primary" size="mini" @click="onClickShit(data.row, 'val_rule')">替换词</el-button>
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
          <el-form-item label="返回字段" required>
            <el-input v-model="curInstance.content_field" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="匹配顺序">
            <el-input-number size="mini" v-model="curInstance.match_order" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="值类型">
            <el-select filterable clearable size="small" v-model="curInstance.con_val_type">
              <el-option v-for="(v, n) in VAL_TYPE" :key="n" :label="v.n" :value="parseInt(n)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合并模式" v-if="!!~VAL_TYPE[curInstance.con_val_type].rule.indexOf(3)">
            <el-radio-group v-model="curInstance.merge_content">
              <el-radio v-for="(v, k, i) in MERGE" :label="parseInt(k)" :key="i">{{ v.n }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="去符号内容" v-if="!!~VAL_TYPE[curInstance.con_val_type].rule.indexOf(0)">
            <el-radio-group v-model="curInstance.clean_symbol">
              <el-radio v-for="(v, k, i) in CLEAN" :label="parseInt(k)" :key="i">{{ v.n }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="符号集合"
            v-if="!!~VAL_TYPE[curInstance.con_val_type].rule.indexOf(1) && curInstance.clean_symbol === CLEAN[1].v"
          >
            <pso-tag-editor v-model="curInstance.symbol_list" size="medium"></pso-tag-editor>
          </el-form-item>
          <el-form-item label="清除已匹配内容" v-if="!!~VAL_TYPE[curInstance.con_val_type].rule.indexOf(2)">
            <el-radio-group v-model="curInstance.clean_pre_value">
              <el-radio v-for="(v, k, i) in CLEANED" :label="parseInt(k)" :key="i">{{ v.n }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="适配数量" v-if="!!~VAL_TYPE[curInstance.con_val_type].rule.indexOf(6)">
            <el-input-number size="mini" v-model="curInstance.pattern_amount" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="提取正则" v-if="!!~VAL_TYPE[curInstance.con_val_type].rule.indexOf(4)">
            <!-- <el-tooltip effect="dark" placement="top-start"> -->
            <!-- <div slot="content" v-html=""></div> -->
            <el-input v-model="curInstance.pattern_string" size="small" autocomplete="off"></el-input>
            <!-- </el-tooltip> -->
          </el-form-item>
          <el-form-item label="输出格式" v-if="!!~VAL_TYPE[curInstance.con_val_type].rule.indexOf(5)">
            <el-input v-model="curInstance.format_string" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="匹配词库">
            <el-button plain type="primary" size="mini" @click="onClickShit(curInstance, 'match_word')">设置</el-button>
          </el-form-item>
          <template v-if="!!~VAL_TYPE[curInstance.con_val_type].rule.indexOf(10)">
            <el-form-item label="紧前分割词库">
              <el-button plain type="primary" size="mini" @click="onClickShit(curInstance, 'match_pre')">设置</el-button>
            </el-form-item>
            <el-form-item label="紧后分割词库">
              <el-button plain type="primary" size="mini" @click="onClickShit(curInstance, 'match_after')">设置</el-button>
            </el-form-item>
          </template>
        </el-form>
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
const CLEAN = {
  0: {
    n: "不去除",
    v: 0,
  },
  1: {
    n: "去除",
    v: 1,
  },
};

const CLEANED = {
  0: {
    n: "不清除",
  },
  1: {
    n: "清除",
  },
};

const MERGE = {
  0: {
    n: "非",
  },
  1: {
    n: "是",
  },
};

const VAL_TYPE = {
  0: {
    n: "直接获取",
    rule: [0, 1],
  },
  1: {
    n: "范围直接提取",
    rule: [0, 1, 2, 10],
  },
  2: {
    n: "范围单个格式获取",
    rule: [0, 1, 2, 3, 4, 5, 10],
  },
  3: {
    n: "范围多个格式获取",
    rule: [0, 1, 4, 5, 6, 10],
  },
};

export default {
  components: { OcrFormat, Doteditor },
  mixins: [FetchMixin],
  props: {
    id: String,
  },
  data() {
    this.VAL_TYPE = VAL_TYPE;
    this.CLEAN = CLEAN;
    this.CLEANED = CLEANED;
    this.MERGE = MERGE;
    this.SLOTS = [{ n: "操作", v: "field", w: 300 }];
    this.FIELDS = [
      { v: "content_name", n: "返回名称" },
      { v: "content_field", n: "返回字段" },
      { v: "match_order", n: "匹配顺序", w: 100 },
      // { v: "match_word", n: "匹配词库" },
      { v: "con_val_type", n: "值类型", w: 100, trans: (v) => VAL_TYPE[v].n },
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
      match_pre: "",
      match_after: "",
      val_rule: "",
      begin_match: 0,
      clean_symbol: 0,
      symbol_list: "",
      clean_pre_value: 0,
      merge_content: 1,
      pattern_string: "",
      pattern_amount: 0,
      format_string: "",
    };
    return {
      ID: "leaf_id",
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
        this.$notify({ title: "名称不能为空", type: "warning" });
        return;
      }
      if (!data.content_field) {
        this.$notify({ title: "返回字段不能为空", type: "warning" });
        return;
      }
      if (data.con_val_type === 2 || data.con_val_type === 3) {
        if (!data.pattern_string) {
          this.$notify({ title: "正则不能为空", type: "warning" });
          return;
        }
      }
      if (!data.leaf_id) {
        delete data.leaf_id;
      }
      data.cert_id = this.id;
      return true;
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
    onCopyAdd() {
      this.curInstance = { ...this.selected[0], content_name: "", content_field: "", leaf_id: "" };
      this.showEditor = true;
    },
  },
};
</script>
