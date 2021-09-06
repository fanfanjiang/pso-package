<template>
  <div class="ocr-word">
    <div class="ocr-word-l">
      <word-change ref="wordchange" @rowclick="onWordChange"></word-change>
    </div>
    <div class="ocr-word-r">
      <pso-common-view
        ref="view"
        title="识别变种词"
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
    </div>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>错词配置</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="证照" required>
            <el-select filterable clearable size="small" v-model="curInstance.cert_id">
              <el-option v-for="(d, i) in shits" :key="i" :label="d.cert_name" :value="d.cert_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="识别变种词" required>
            <el-input v-model="curInstance.error_word" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="纠正词" required>
            <el-input v-model="curInstance.change_word" size="small" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import WordChange from "./word-change";

export default {
  components: { WordChange },
  mixins: [FetchMixin],
  data() {
    this.FIELDS = [{ v: "error_word", n: "识别变种词" }];
    this.DATA = {
      auto_no: "",
      error_word: "",
      change_word: "",
      cert_id: "",
    };
    return {
      ID: "auto_no",
      words: [],
      fetchParams: {
        change_word: "",
      },
      shits: [],
    };
  },
  async created() {
    const ret = await this.API.request("/api/ocr/template", { data: { limit: 9999, page: 0 }, method: "get" });
    if (ret.success) {
      this.shits = ret.data.data;
    }
  },
  methods: {
    async fetch(data = {}) {
      const ret = await this.API.request("/api/ocr/word", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      return ret;
    },
    async addOrUpdate(data) {
      const ret = await this.API.request("/api/ocr/word", { data, method: "post" });
      this.$refs.wordchange.refresh();
      return ret;
    },
    beforeAddInstance() {
      this.curInstance.change_word = this.fetchParams.change_word;
    },
    checkValidity(data) {
      if (!data.error_word) {
        this.$notify({ title: "错误词不能为空", type: "warning" });
        return;
      }
      if (!data.change_word) {
        this.$notify({ title: "改正词不能为空", type: "warning" });
        return;
      }
      if (!data.auto_no) {
        delete data.auto_no;
      }
      return true;
    },
    onWordChange(data) {
      this.fetchParams.change_word = data;
    },
  },
};
</script>
<style lang="less">
.ocr-word {
  display: flex;
  height: 100%;
  .ocr-word-l {
    width: 50%;
  }
  .ocr-word-r {
    width: 50%;
  }
}
</style>
