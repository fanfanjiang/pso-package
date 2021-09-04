<template>
  <div class="ocr-test" v-loading="initializing">
    <div class="ocr-test-l">
      <great-panel>
        <template #header>
          <i class="el-icon-upload2"></i>
          <span>上传证照</span>
        </template>
        <div class="ocr-uploader">
          <ocr-upload :api="api" :data="upData" @success="onSuccess"></ocr-upload>
        </div>
      </great-panel>
      <great-panel>
        <template #header>
          <i class="el-icon-notebook-1"></i>
          <span>添加词库</span>
        </template>
        <div class="ocr-test-form">
          <el-form size="medium " label-position="left" label-width="80px">
            <el-form-item label="选择证照">
              <el-select filterable clearable size="large" v-model="instance.cert_id">
                <el-option v-for="(d, i) in templates" :key="i" :label="d.cert_name" :value="d.cert_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="识别词">
              <el-input v-model="instance.word" size="large" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit" :disabled="submiting || !instance.cert_id || !instance.word" :loading="submiting">
                加入词库
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
        cert_id: "",
        word: "",
      },
      submiting: false,
    };
  },
  created() {
    this.upData.api = "/Ocr/TestOcrCert";
  },
  methods: {
    onOutput(ret) {
      let str = "原始数据:\n\n";

      str += `${ret.data._data || ""}\n\n\n`;

      delete ret.data._data;
      delete ret.data._name;
      delete ret.data._type;

      if (!ret.success) {
        str += `错误信息:\n\n${ret.message}`;
      }

      return str;
    },
    async submit() {
      const { cert_id, word } = this.instance;
      const data = _.find(this.templates, { cert_id });
      const { rec_stock } = data;
      data.rec_stock = rec_stock ? `${rec_stock},${word}` : word;

      this.submiting = true;
      const ret = await this.API.request("/api/ocr/template", { data: { ...data, rec_stock: data.rec_stock, optype: 1 } });
      this.ResultNotify(ret);
      this.submiting = false;
    },
  },
};
</script>
