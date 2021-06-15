<template>
  <div style="padding: 15px 15px 0 0" v-loading="initializing">
    <el-button size="mini" type="primary" plain @click="asyncManually">同步！</el-button>
    <el-form label-position="left" label-width="110px" size="small">
      <el-form-item label="请求方式" required>
        <el-select size="mini" filterable v-model="data.inner_type">
          <el-option label="增量插入" value="0"></el-option>
          <el-option label="增量更新" value="1"></el-option>
          <el-option label="插入或更新" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="同步模式" required>
        <el-select size="mini" filterable v-model="data.async_type">
          <el-option label="立即同步" value="0"></el-option>
          <el-option label="定时同步" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参数转换" required>
        <el-button type="primary" size="mini" @click="trans('paramsa')">设置</el-button>
      </el-form-item>
      <el-form-item label="字段集转换" required>
        <el-button type="primary" size="mini" @click="trans('paramsb')">设置</el-button>
      </el-form-item>
      <el-form-item label="API" required>
        <el-select size="mini" filterable v-model="data.api_tag">
          <el-option :label="api.api_name" :value="api.api_id" v-for="(api, i) in apicfgs" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="增量类型" required>
        <el-select size="mini" filterable v-model="data.incre_type">
          <el-option label="时间" value="0"></el-option>
          <el-option label="增量字段" value="1"></el-option>
          <el-option label="顺序" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="增量字段" required>
        <el-input v-model="data.incre_field" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-divider content-position="left">接口调用成功标记配置</el-divider>
      <el-form-item label="内部字段" required>
        <el-input v-model="successFlag.key" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="API标识字段" required>
        <el-input v-model="successFlag.field" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="值类型" required>
        <el-select size="mini" filterable v-model="successFlag.type">
          <el-option label="boolean" value="boolean"></el-option>
          <el-option label="number" value="number"></el-option>
          <el-option label="string" value="string"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="值" required>
        <el-input v-model="successFlag.value" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-divider content-position="left">接口调用返回值配置</el-divider>
      <el-form-item label="内部字段" required>
        <el-input v-model="dataFlag.key" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="API数据字段" required>
        <el-input v-model="dataFlag.field" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="数据值类型" required>
        <el-select size="mini" filterable v-model="dataFlag.type">
          <el-option label="数组" value="1"></el-option>
          <el-option label="对象" value="2"></el-option>
          <el-option label="字符串" value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <pso-dialog :visible="showEditor" width="70%" @close="showEditor = false">
      <template #title>
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>转换配置</span>
            </div>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto">
        <el-form label-position="left" label-width="260px" size="mini" inline>
          <el-form-item :label="getField(k).field_display" v-for="(v, k, i) in curTrans" :key="i">
            <el-input v-model="curTrans[k]" size="mini" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { checkUntransField } from "../../tool/form";
const successFlag = {
  key: "",
  field: "",
  type: "boolean",
  value: "",
};
const dataFlag = {
  key: "",
  field: "",
  type: "1",
  value: "",
};

export default {
  props: {
    data: Object,
    fields: Array,
    code: String,
  },
  data() {
    return {
      initializing: false,
      successFlag: { ...successFlag },
      dataFlag: { ...dataFlag },
      showEditor: false,
      curTrans: {},
      apicfgs: [],
      proxy: {
        paramsa: {},
        paramsb: {},
      },
    };
  },
  watch: {
    successFlag: {
      deep: true,
      handler() {
        this.formatFlag();
      },
    },
    dataFlag: {
      deep: true,
      handler() {
        this.formatFlag();
      },
    },
    "proxy.paramsa": {
      deep: true,
      handler(data) {
        this.transParams(data, "inner_params");
      },
    },
    "proxy.paramsb": {
      deep: true,
      handler(data) {
        this.transParams(data, "field_config");
      },
    },
  },
  async created() {
    this.initializing = true;
    if (this.data.inner_return.length) {
      this.analyzeFlag(this.data.inner_return);
    }

    for (let f of this.fields) {
      if (!checkUntransField(f.field_name)) {
        this.$set(this.proxy.paramsa, `${f.field_name}`, this.data.inner_params[f.field_name] || "");
        this.$set(this.proxy.paramsb, `${f.field_name}`, this.data.field_config[f.field_name] || "");
      }
    }
    const ret = await this.API.apicfg({ data: { limit: 99, start: 0 } });
    this.apicfgs = ret.data;
    this.initializing = false;
  },
  methods: {
    transParams(data, type) {
      this.data[type] = {};
      for (let key in data) {
        if (data[key]) {
          this.data[type][key] = data[key];
        }
      }
    },
    formatFlag() {
      this.data.inner_return = [{ ...this.successFlag }, { ...this.dataFlag }];
    },
    analyzeFlag(data) {
      if (data) {
        this.analyze(this.successFlag, data[0]);
        this.analyze(this.dataFlag, data[1]);
      } else {
        this.successFlag = { ...successFlag };
        this.dataFlag = { ...dataFlag };
      }
    },
    analyze(source, target) {
      for (let key in source) {
        source[key] = target[key];
      }
    },
    trans(type) {
      this.curTrans = this.proxy[type];
      this.showEditor = true;
    },
    getField(field_name) {
      return _.find(this.fields, { field_name });
    },
    async asyncManually() {
      const ret = await this.API.asyncIApiDataManually({ data_code: this.code });
      this.ResultNotify(ret);
    },
  },
};
</script>