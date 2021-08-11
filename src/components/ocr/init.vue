<template>
  <div v-loading="initializing">
    <template v-if="!initializing">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="供应商">
          <el-radio-group size="large" v-model="instance.supper_name" @change="onVendorChange">
            <el-radio-button size="large" :label="d.id" v-for="(d, k, i) in OCR_VENDOR" :key="i">{{ d.name }} </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模式" v-if="instance.supper_name" @change="onModeChange">
          <el-radio-group size="large" v-model="instance.api_type">
            <el-radio-button
              size="large"
              v-for="(d, k, i) in OCR_WAY"
              :key="i"
              :label="d.id"
              :disabled="!OCR_VENDOR[instance.supper_name].enable[d.id]"
              >{{ d.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div>
        <div v-if="options">
          <pso-form-interpreter v-bind="options" ref="formImage"></pso-form-interpreter>
          <div style="margin-top: 30px">
            <el-button type="primary" @click="submit" :disabled="submiting" :loading="submiting">保 存</el-button>
          </div>
        </div>
        <pso-empty v-else text="暂未开放"></pso-empty>
      </div>
    </template>
  </div>
</template>
<script>
import { genComponentData } from "../form-designer/helper";
import { OCR_VENDOR, OCR_WAY } from "./const";
const FIELDS = {
  supper_name: "",
  api_type: "",
  api_config: "",
  param_config: "",
};

export default {
  data() {
    this.OCR_VENDOR = OCR_VENDOR;
    this.OCR_WAY = OCR_WAY;
    return {
      instance: { ...FIELDS },
      submiting: false,
      initializing: true,
    };
  },
  computed: {
    options() {
      const { supper_name, api_type, api_config, param_config } = this.instance;
      if (!supper_name || !OCR_VENDOR[supper_name].params || !OCR_VENDOR[supper_name].params[api_type]) return;
      const data_config = _.cloneDeep(Object.values(OCR_VENDOR[supper_name].params[api_type]));

      const dataInstance = {};
      if (api_config) {
        Object.assign(dataInstance, api_config);
      }
      if (param_config) {
        Object.assign(dataInstance, param_config);
      }

      data_config.forEach((d) => genComponentData(d));
      return {
        size: "large",
        formEntity: { data_config, forceInsertSys: false },
        dataInstance,
      };
    },
  },
  created() {
    this.initializ();
  },
  methods: {
    onVendorChange() {
      this.refresh({ supper_name: this.instance.supper_name });
    },
    onModeChange() {
      this.refresh({ supper_name: this.instance.supper_name, api_type: this.instance.api_type });
    },
    refresh(data) {
      this.instance = { ...FIELDS, ...data };
    },
    async initializ() {
      this.initializing = true;
      const ret = await this.API.request("/api/ocr/vendor", { data: {}, method: "get" });
      this.initializing = false;

      this.api_config = {};
      this.param_config = {};

      if (ret.success && ret.data.length) {
        const { api_config, param_config } = ret.data[0];

        this.instance = {
          ...ret.data[0],
          api_config: api_config ? JSON.parse(api_config) : "",
          param_config: param_config ? JSON.parse(param_config) : "",
        };
      }
    },
    async submit() {
      try {
        const params = OCR_VENDOR[this.instance.supper_name].params[this.instance.api_type];
        const data = (await this.$refs.formImage.makeData()).dataArr[0];

        const api_config = {};
        const param_config = {};

        for (let key in params) {
          if (params[key].group === "api") {
            api_config[key] = data[key];
          } else {
            param_config[key] = data[key];
          }
        }

        this.submiting = true;
        const ret = await this.API.request("/api/ocr/vendor", {
          data: { ...this.instance, api_config: JSON.stringify(api_config), param_config: JSON.stringify(param_config) },
        });
        this.submiting = false;
        this.ResultNotify(ret);
      } catch (error) {}
    },
  },
};
</script>