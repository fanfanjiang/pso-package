<template>
  <div v-if="!init" style="margin-top: 20px">
    <great-panel>
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>开放权限</span>
      </template>
      <el-form ref="form" label-width="70px" label-position="left">
        <div class="form-wrapper">
          <el-form-item label="开启">
            <el-switch v-model="data.isPublic"></el-switch>
          </el-form-item>
        </div>
        <div class="form-wrapper" v-if="data.isPublic">
          <el-form-item label="需要登录">
            <el-switch v-model="data.authRequired"></el-switch>
          </el-form-item>
          <el-form-item label="开启时间">
            <el-date-picker size="mini" v-model="data.stime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
          </el-form-item>
          <el-form-item label="关闭时间">
            <el-date-picker size="mini" v-model="data.etime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
          </el-form-item>
          <el-form-item label="模板">
            <el-select size="mini" v-model="data.layout">
              <el-option label="默认模板" value="default"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开启规则">
            <el-switch v-model="data.ruleable"></el-switch>
          </el-form-item>
        </div>
      </el-form>
    </great-panel>
    <div v-if="data.isPublic" class="pso-dd-public" style="margin-top: 15px">
      <great-panel>
        <template #header>
          <i class="el-icon-edit-outline"></i>
          <span>对外配置</span>
        </template>
        <el-form ref="form" label-width="120px" label-position="left">
          <div class="form-wrapper">
            <pso-form-attach :cpnt="logo" @value-change="handleLogoChange">
              <el-button icon="el-icon-paperclip" plain size="mini">上传LOGO</el-button>
            </pso-form-attach>
            <el-form-item label="是否提交">
              <el-switch v-model="data.submitable"></el-switch>
            </el-form-item>
            <el-form-item label="网页标题">
              <el-input v-model="data.pageTitle" size="mini"></el-input>
            </el-form-item>
          </div>
          <div class="form-wrapper">
            <el-form-item label="标题">
              <el-input v-model="data.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="提交按钮文本">
              <el-input v-model="data.subBtnText" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="完成文本">
              <el-input v-model="data.doneText" size="mini"></el-input>
            </el-form-item>
          </div>
          <div class="form-wrapper">
            <el-form-item label="未开启、截止文本">
              <el-input v-model="data.errorText" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="表单LABEL宽度">
              <el-input v-model="data.formLabelWith" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="对齐方式">
              <el-select size="mini" v-model="data.formLabelPosition">
                <el-option label="顶部对齐" value="top"></el-option>
                <el-option label="左对齐" value="left"></el-option>
                <el-option label="右对齐" value="right"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-wrapper">
            <el-form-item label="显示提交结果">
              <el-switch v-model="data.showReturn"></el-switch>
            </el-form-item>
          </div>
        </el-form>
      </great-panel>
      <great-panel v-if="data.ruleable">
        <template #header>
          <i class="el-icon-edit-outline"></i>
          <span>发布数据规则</span>
        </template>
        <div style="margin-bottom: 10px; text-align: right">
          <el-dropdown trigger="click" @command="handleFilterAdd">
            <el-button class="el-dropdown-link" size="mini" icon="el-icon-plus">添加规则</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(f, index) in fields" :key="index" :command="index">{{ f._fieldName }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span style="margin-left: 10px">
            <el-button :disabled="!selectedList.length" type="primary" size="mini" @click="genQRByRule">生成二维码</el-button>
          </span>
        </div>
        <el-table border size="mini" :data="data.rules" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
          <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
          <el-table-column label="字段" width="140" prop="name"></el-table-column>
          <el-table-column label="值">
            <template slot-scope="scope">
              <el-form>
                <pso-form-component
                  v-if="checkHasCpnt(scope.row.id)"
                  :force-show="true"
                  :cpnt="getCpnt(scope.row.id)"
                  @value-change="valueChangeHandler($event, scope.row)"
                ></pso-form-component>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </great-panel>
      <great-panel>
        <template #header>
          <i class="el-icon-edit-outline"></i>
          <span>链接二维码</span>
        </template>
        <el-row :gutter="10">
          <el-col :span="4" key="def">
            <el-card :body-style="{ padding: '0px' }">
              <el-popover placement="top-start" trigger="hover" :content="getFullURI()">
                <img slot="reference" :src="qrsrc" />
              </el-popover>
              <div style="padding: 0px 10px 10px; text-align: center">默认二维码</div>
            </el-card>
          </el-col>
          <el-col :span="4" v-for="(q, i) in data.qrList" :key="i">
            <el-card :body-style="{ padding: '0px' }">
              <el-popover placement="top-start" trigger="hover" :content="getFullURI({ ruleid: q.id })">
                <img slot="reference" :src="q.qr" />
              </el-popover>
              <div style="padding: 0px 10px 10px; text-align: center">规则:{{ q.value }}</div>
              <div style="padding: 0px 10px 10px; display: flex; align-items: center; justify-content: space-between">
                <el-button size="mini" @click="updateRule(q)">更新规则</el-button>
                <el-button type="danger" size="mini" @click="delRule(i)">删除</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </great-panel>
    </div>
  </div>
</template>
<script>
import PsoFormAttach from "../form-interpreter/components/attachment";
import PsoFormComponent from "../form-interpreter/cpnt";
import FormStore from "../form-designer/model/store.js";
import { genComponentData } from "../form-designer/helper";
import shortid from "shortid";
import Qs from "qs";
import GreatPanel from "../great-panel";
import { _DATA } from "./const";
import { formatJSONList } from "../../utils/util";
export default {
  props: ["data", "node", "store"],
  components: { GreatPanel, PsoFormComponent, PsoFormAttach },
  data() {
    this.mockStore = null;
    return {
      qrsrc: "",
      selectedList: [],
      init: true,
      logo: { data: {} },
    };
  },
  watch: {
    "node.node_name"() {
      this.genQR();
    },
    "logo.data._val"() {},
  },
  computed: {
    host() {
      return `http://${window.location.host}`;
    },
    fields() {
      return this.store.search({ options: { db: true }, onlyData: true });
    },
  },
  async created() {
    this.init = true;
    this.qrsrc = await this.genQR();

    formatJSONList([this.data], _DATA.pubCfg);

    this.mockStore = new FormStore({ ...this.store.getBaseInfo(), designMode: false });

    if (typeof this.data.attach === "object") {
      this.data.attach = "";
    }
    this.logo.data = genComponentData({ componentid: "attachment", _fieldName: "LOGO", _val: this.data.attach || "" });
    this.init = false;
  },
  methods: {
    handleLogoChange({ value }) {
      this.data.attach = value;
    },
    async genQR(params = {}) {
      return await QRCode.toDataURL(this.getFullURI(params));
    },
    getFullURI(params = {}) {
      params.appid = this.$store.state.base.user.appid;
      return `${this.host}/form/${this.node.node_name}?${Qs.stringify(params)}`;
    },
    handleFilterAdd(index) {
      const { _fieldValue, _fieldName, componentid } = this.fields[index];
      const filter = { id: _fieldValue, name: _fieldName, cid: componentid, val: "" };
      this.data.rules.push(filter);
    },
    checkHasCpnt(id) {
      return this.mockStore.searchByField(id);
    },
    getCpnt(id) {
      //初始化规则参数
      const mockStore = new FormStore({ ...this.store.getBaseInfo(), designMode: false });
      const mockData = {};
      if (this.data.rules) {
        this.data.rules.forEach((f) => {
          mockData[f.id] = f.val;
        });
        mockStore.updateInstance(mockData);
      }

      const cpnt = mockStore.searchByField(id);
      cpnt.data._fieldName = "";
      cpnt.data._hideForever = false;
      cpnt.data._hideOnNew = false;
      if (cpnt.componentid === "asstable") {
        cpnt.data._new = false;
        cpnt.data._relate = true;
      }
      return cpnt;
    },
    delHandler(index) {
      this.data.rules.splice(index, 1);
    },
    valueChangeHandler({ value }, proxy) {
      proxy.val = value;
    },
    handleSelectionChange(val) {
      this.selectedList = val.map((item) => this.data.rules.indexOf(item) + 1);
    },
    async genQRByRule() {
      const data = { id: shortid.generate(), value: this.selectedList.join(",") };
      data.qr = await this.genQR({ ruleid: data.id });
      this.data.qrList.push(data);
    },
    async updateRule(rule) {
      rule.value = this.selectedList.join(",");
    },
    delRule(i) {
      this.data.qrList.splice(i, 1);
    },
  },
};
</script> 
