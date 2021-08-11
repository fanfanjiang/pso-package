<template>
  <div class="ocr-test" v-loading="initializing">
    <div class="ocr-test-l">
      <great-panel>
        <template #header>
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
            <div>
              <i class="el-icon-upload2"></i>
              <span>上传证照</span>
            </div>
            <div>
              <el-select placeholder="选择证照" filterable clearable size="mini" v-model="upData.cert_code">
                <el-option v-for="(d, i) in templates" :key="i" :label="d.cert_name" :value="d.cert_code"></el-option>
              </el-select>
            </div>
          </div>
        </template>
        <div class="ocr-uploader" v-loading="uploading">
          <pso-upload
            @start="onStart"
            @error="onError"
            @success="onSuccess"
            visible
            dragable
            :api="api"
            :data="upData.cert_code ? upData : {}"
            :upable="false"
            :srcable="false"
            :showconfirm="false"
            :headerable="false"
          ></pso-upload>
        </div>
      </great-panel>
      <great-panel>
        <template #header>
          <i class="el-icon-notebook-1"></i>
          <span>添加词库</span>
        </template>
        <div class="ocr-test-form" v-loading="fetching">
          <el-form size="medium " label-position="left" label-width="80px">
            <el-form-item label="输出字段">
              <el-select filterable clearable size="large" v-model="instance.field">
                <el-option v-for="(d, i) in fields" :key="i" :label="d.content_name" :value="d.leaf_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="识别词">
              <el-input :readonly="!instance.field" v-model="instance.word" size="large" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submit('match_pre')" :disabled="submiting || !instance.word" :loading="submiting">
                加⼊紧前词库
              </el-button>
              <el-button type="primary" @click="submit('match_word')" :disabled="submiting || !instance.word" :loading="submiting">
                加⼊当前词库
              </el-button>
              <el-button type="primary" @click="submit('match_after')" :disabled="submiting || !instance.word" :loading="submiting">
                加⼊紧后词库
              </el-button>
            </el-form-item>
            <el-form-item label="纠正词">
              <el-input :readonly="!instance.field" v-model="instance.wrong" size="large" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="makeWord" :disabled="making || !instance.word || !instance.wrong" :loading="making">
                加⼊纠错词库
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </great-panel>
    </div>
    <div class="ocr-test-r">
      <transition name="el-fade-in">
        <great-panel v-if="ocrRet">
          <template #header>
            <i class="el-icon-chat-dot-square"></i>
            <span>识别结果</span>
          </template>
          <ocr-result :data="ocrRet"></ocr-result>
        </great-panel>
      </transition>
      <great-panel>
        <template #header>
          <i class="el-icon-data-analysis"></i>
          <span>结果详情</span>
        </template>
      </great-panel>
      <div class="ocr-test-output">
        <codemirror ref="codemirror" :options="cmOptions" v-model="output" />
      </div>
    </div>
  </div>
</template>
<script>
import { OcrTest } from "./mixin";

export default {
  mixins: [OcrTest],
  data() {
    return {
      instance: {
        field: "",
        word: "",
        wrong: "",
      },
      submiting: false,
      fetching: false,
      making: false,
      fields: [],
    };
  },
  methods: {
    async fetch(cert_id) {
      this.fetching = true;
      const ret = await this.API.request("/api/ocr/field", { data: { cert_id, limit: 99999 }, method: "get" });
      this.fields = ret.success ? ret.data : [];
      this.fetching = false;
    },
    async afterSuccess(ret = {}) {
      if (ret._template && ret._template.cert_type === 99) {
        await this.fetch(ret._template.cert_id);
      }
    },
    async submit(stock) {
      const { field, word } = this.instance;

      if (!field || !word) return this.$message({ message: "请输入识别词", type: "warning" });

      const data = _.find(this.fields, { leaf_id: field });

      const dictionary = data[stock];
      data[stock] = dictionary ? `${dictionary},${word}` : word;

      this.submiting = true;
      const ret = await this.API.request("/api/ocr/field", { data: { ...data, [stock]: data[stock], optype: 1 } });
      this.submiting = false;
      this.ResultNotify(ret);
    },
    async makeWord() {
      const { word: error_word, wrong: change_word } = this.instance;

      if (!change_word || !error_word) return this.$message({ message: "识别词和纠错词不能为空", type: "warning" });

      this.making = true;
      const ret = await this.API.request("/api/ocr/word", { data: { change_word, error_word, optype: 0 }, method: "post" });
      this.making = false;
      this.ResultNotify(ret);
    },
  },
};
</script>