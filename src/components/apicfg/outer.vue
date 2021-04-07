<template>
  <div style="height: 100%">
    <pso-common-view
      ref="view"
      title="对外API"
      icon="el-icon-tickets"
      :fetch-fun="fetch"
      :fields="FIELDS"
      @dbclick="dbClickHandler"
      @select="selectHandler"
    >
      <template #tablefun> </template>
      <template #datafun>
        <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
        <el-button type="danger" size="mini" @click="delHandler" :disabled="deleting" :loading="deleting">删除</el-button>
      </template>
    </pso-common-view>
    <pso-dialog :visible="showEditor" width="60%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>API类型</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="saveHandler()" :disabled="editing" :loading="editing">保存</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <el-form label-position="left" label-width="120px" size="small" v-if="curInstance">
          <el-form-item label="API" required>
            <el-select filterable clearable size="small" v-model="curInstance.action_id">
              <el-option v-for="(d, i) in apis" :key="i" :label="d.action_name" :value="d.action_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源" required>
            <el-select filterable clearable size="small" v-model="curInstance.outer_type">
              <el-option v-for="(d, i) in OUTERTYPE" :key="i" :label="d.n" :value="d.v"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编号" required>
            <picker-form
              v-if="curInstance.outer_type === '0'"
              form-field="outer_code"
              source="3"
              :data="curInstance"
              @loaded="formLoaded"
            ></picker-form>
          </el-form-item>
          <el-form-item label="启用" required>
            <el-switch size="mini" v-model="curInstance.outer_status" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="curInstance.outer_note" size="small" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="参数配置">
            <div>
              <el-button size="mini" type="primary" plain @click="addParams">新增</el-button>
            </div>
            <el-table border size="mini" height="200" style="width: 100%; margin-top: 5px" :data="paramsProxy">
              <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
              <el-table-column label="目标">
                <template slot-scope="scope">
                  <el-select clearable filterable size="mini" v-model="scope.row.t_field">
                    <el-option v-for="(o, i) in options" :key="i" :label="o.fieldDisplay" :value="o._fieldValue"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="来源">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.s_field" size="mini" autocomplete="off"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="必须" width="120" align="center">
                <template slot-scope="scope">
                  <el-switch size="mini" v-model="scope.row.is_need" active-value="1" inactive-value="0"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="110" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="delParams(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="返回配置">
            <div>
              <el-button size="mini" type="primary" plain @click="addReturns">新增</el-button>
            </div>
            <el-table border size="mini" height="200" style="width: 100%; margin-top: 5px" :data="returnProxy">
              <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
              <el-table-column label="来源">
                <template slot-scope="scope">
                  <el-select clearable filterable size="mini" v-model="scope.row.s_field">
                    <el-option v-for="(o, i) in options" :key="i" :label="o.fieldDisplay" :value="o._fieldValue"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="目标">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.t_field" size="mini" autocomplete="off"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="110" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="delReturns(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FetchMixin } from "../../mixin/view";
import PickerForm from "../picker/pso-picker-form";
const OUTERTYPE = [
  { n: "表单", v: "0" },
  { n: "流程", v: "1" },
  { n: "插件", v: "2" },
  { n: "代理", v: "3" },
];

export default {
  mixins: [FetchMixin],
  components: { PickerForm },
  data() {
    this.OUTERTYPE = OUTERTYPE;
    this.FIELDS = [
      { v: "outer_type", n: "类型", w: 100 },
      { v: "outer_code", n: "编号", w: 140 },
      { v: "outer_status", n: "状态", w: 140 },
      { v: "outer_params", n: "参数配置", w: 120 },
      { v: "outer_return", n: "返回配置" },
      { v: "outer_note", n: "备注" },
    ];
    this.DATA = {
      outer_id: "",
      action_id: "",
      outer_type: "",
      outer_code: "",
      is_change: "",
      outer_status: "1",
      outer_params: "",
      outer_return: "",
      outer_note: "",
    };
    return {
      ID: "outer_id",
      apis: [],
      paramsProxy: [],
      returnProxy: [],
      options: [],
    };
  },
  watch: {
    paramsProxy: {
      deep: true,
      handler(val) {
        this.curInstance.outer_params = JSON.stringify(val);
      },
    },
    returnProxy: {
      deep: true,
      handler(val) {
        this.curInstance.outer_return = JSON.stringify(val);
      },
    },
  },
  async created() {
    this.apis = (await this.API.request("/api/apicfg/type", { data: { limit: 9999, page: 0 }, method: "get" })).data;
  },
  methods: {
    async fetch(data) {
      const ret = await this.API.request("/api/apicfg/outer", {
        data: { ...this.getFetchParams(data), page: data.start },
        method: "get",
      });
      ret.data.data = ret.data;
      ret.data.page = ret.count;
      return ret;
    },
    async addOrUpdate(data) {
      return await this.API.request("/api/apicfg/outer", { data, method: "post" });
    },
    dbClickHandler(row) {
      this.curInstance = _.cloneDeep(row);
      const { outer_params, outer_return } = this.curInstance;
      if (outer_params) {
        this.paramsProxy = JSON.parse(outer_params);
      }
      if (outer_return) {
        this.returnProxy = JSON.parse(outer_return);
      }
      this.showEditor = true;
    },
    formLoaded({ fields }) {
      this.options = fields;
    },
    addParams() {
      this.paramsProxy.push({ t_field: "", s_field: "", is_need: "0" });
    },
    delParams(index) {
      this.paramsProxy.splice(index, 1);
    },
    addReturns() {
      this.returnProxy.push({ t_field: "", s_field: "" });
    },
    delReturns(index) {
      this.returnProxy.splice(index, 1);
    },
  },
};
</script>
