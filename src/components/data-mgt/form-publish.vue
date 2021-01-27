<template>
  <div v-if="!init">
    <div class="pso-table-controller">
      <el-button size="mini" type="primary" plain @click="$emit('save')">保存</el-button>
    </div>
    <div>
      <span>是否对外开放</span>
      <el-switch v-model="data.isPublic"></el-switch>
    </div>
    <div v-if="data.isPublic" class="pso-dd-public">
      <pso-title>对外配置</pso-title>
      <el-form ref="form" label-width="120px" label-position="left">
        <pso-form-attach :cpnt="logo" @value-change="handleLogoChange">
          <el-button icon="el-icon-paperclip" plain size="mini">上传LOGO</el-button>
        </pso-form-attach>
        <el-form-item label="标题">
          <el-input v-model="data.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="提交文本">
          <el-input v-model="data.subBtnText" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="完成文本">
          <el-input v-model="data.doneText" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="是否提交">
          <el-switch v-model="data.submitable"></el-switch>
        </el-form-item>
        <el-form-item label="表单label宽度">
          <el-input v-model="data.formLabelWith" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="对齐方式">
          <el-select size="mini" v-model="data.formLabelPosition">
            <el-option label="顶部对齐" value="top"></el-option>
            <el-option label="左对齐" value="left"></el-option>
            <el-option label="右对齐" value="right"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <pso-title>发布数据规则</pso-title>
      <div>
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
      <el-table :data="data.rules" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
        <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
        <el-table-column label="字段" width="140" prop="name"></el-table-column>
        <el-table-column label="值">
          <template slot-scope="scope">
            <el-form>
              <pso-form-component
                :force-show="true"
                :cpnt="scope.row.cpnt"
                @value-change="valueChangeHandler($event, scope.row)"
              ></pso-form-component>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 10px 0 10px 0">
        <el-row :gutter="10">
          <el-col :span="4" v-for="q in data.qrList" :key="q.id">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="q.qr" />
              <div style="padding: 0px 10px 10px 10px">
                <div>规则序号:{{ q.value }}</div>
                <el-button size="mini" class="button" @click="updateRule(q)">更新规则</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <pso-title>表单链接</pso-title>
      <p>{{ host }}/form/{{ node.node_name }}</p>
      <pso-title>链接二维码</pso-title>
      <div>
        <img :src="qrsrc" alt />
      </div>
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
export default {
  props: ["data", "node", "store"],
  components: { PsoFormComponent, PsoFormAttach },
  data() {
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
    if (this.data.rules) {
      this.data.rules.forEach((f) => {
        f.cpnt = this.makeCpnt(f, { [f.id]: f.val });
      });
    }
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
      params.appid = this.$store.state.base.user.appid; 
      return await QRCode.toDataURL(`${this.host}/form/${this.node.node_name}?${Qs.stringify(params)}`);
    },
    handleFilterAdd(index) {
      const { _fieldValue, _fieldName, componentid } = this.fields[index];
      const filter = {
        id: _fieldValue,
        name: _fieldName,
        cid: componentid,
        val: "",
      };
      filter.cpnt = this.makeCpnt(filter);
      this.data.rules.push(filter);
    },
    makeCpnt(proxy, data) {
      this.$set(proxy, "store", new FormStore({ ...this.store.getBaseInfo(), designMode: false }));
      proxy.store.updateInstance(data);
      const cpnt = proxy.store.search({ options: { fid: proxy.id } });
      cpnt.data._hideForever = false;
      cpnt.data._hideOnNew = false;
      delete cpnt.data._fieldName;
      return cpnt;
    },
    delHandler(index) {
      this.data.rules.splice(index, 1);
    },
    valueChangeHandler({ value }, proxy) {
      proxy.val = value;
    },
    handleSelectionChange(val) {
      this.selectedList = val.map((item) => {
        return this.data.rules.indexOf(item) + 1;
      });
    },
    async genQRByRule() {
      const data = { id: shortid.generate(), value: this.selectedList.join(",") };
      data.qr = await this.genQR({ id: data.id });
      this.data.qrList.push(data);
    },
    async updateRule(rule) {
      rule.value = this.selectedList.join(",");
    },
  },
};
</script> 
