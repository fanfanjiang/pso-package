<template>
  <div class="ocr-test" v-loading="initializing">
    <div class="ocr-test-l">
      <great-panel>
        <template #header>
          <i class="el-icon-upload2"></i>
          <span>上传证照</span>
        </template>
        <div class="ocr-uploader" v-loading="uploading">
          <pso-upload
            @start="onStart"
            @error="onError"
            @success="onSuccess"
            visible
            dragable
            :api="api"
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
      <great-panel>
        <template #header>
          <i class="el-icon-data-analysis"></i>
          <span>识别结果</span>
        </template>
      </great-panel>
      <div class="ocr-test-output">
        <codemirror ref="codemirror" :options="cmOptions" v-model="output" />
      </div>
    </div>
  </div>
</template>
<script>
import GreatPanel from "../great-panel";
export default {
  components: { GreatPanel },
  data() {
    return {
      initializing: true,
      api: "/api/ocr/upload",
      cmOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        lineWrapping: true,
      },
      output: "",
      templates: [],
      instance: {
        cert_id: "",
        word: "",
      },
      submiting: false,
      uploading: false,
    };
  },
  created() {
    this.initializ();
  },
  methods: {
    async initializ() {
      this.initializing = true;
      const ret = await this.API.request("/api/ocr/template", { data: { limit: 99999 }, method: "get" });
      this.initializing = false;
      this.templates = ret.data.data;
    },
    onStart() {
      this.uploading = true;
    },
    onError() {
      this.uploading = false;
    },
    onSuccess(data) {
      if (data.data) {
        this.output += (this.output ? "\n\n" : "") + JSON.stringify(data.data);
      }
      this.uploading = false;
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
<style lang="less">
.ocr-test {
  display: flex;
  height: 100%;
  .ocr-test-l {
    width: 40%;
    height: 100%;
  }
  .ocr-test-r {
    width: 60%;
    height: 100%;
    padding-left: 10px;
    overflow: hidden;
    .great-panel-header {
      margin-bottom: 0;
    }
  }
  .ocr-test-output {
    height: 100%;
    .vue-codemirror {
      height: 100%;
      width: 100%;
    }
    .CodeMirror {
      height: 100% !important;
      width: 100%;
      border-radius: 0;
      border: none;
    }
    .CodeMirror-gutters {
      border: none;
    }
  }
  .ocr-test-form {
    background: #fff;
    padding: 20px 10px;
  }
}
.ocr-uploader {
  height: 140px;
  .pso-upload {
    height: 100%;
  }
  .pso-upload__footer {
    display: none;
  }
}
</style>