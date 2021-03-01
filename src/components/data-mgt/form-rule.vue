<template>
  <div class="pso-form_rule">
    <div class="pso-form_rule-l">
      <great-panel color="#fff">
        <template #header>
          <i class="el-icon-edit-outline"></i>
          <span>规则（为选择的字段设置条件，只有当表单满足条件时这些字段才显示或必填）</span>
        </template>
        <div class="rule-list">
          <div
            :class="ruleListClass(index)"
            class="rule-list-item"
            v-for="(r, index) in rules"
            :key="index"
            @click="handleRuleClick(index)"
          >
            <div>规则{{ index + 1 }}</div>
            <i class="rule-list-item__del el-icon-delete-solid" @click.stop="handleRuleDel(index)"></i>
          </div>
        </div>
        <div class="rule-btn-add" @click="handleRuleAdd"><i class="el-icon-plus"></i>添加规则</div>
      </great-panel>
    </div>
    <div class="pso-form_rule-r">
      <great-panel v-if="curRule">
        <template #header>
          <i class="el-icon-edit-outline"></i>
          <span>设置规则</span>
        </template>
        <h4>选择规则类型</h4>
        <el-select size="mini" v-model="curRule.controlType" placeholder="规则类型">
          <el-option v-for="(t, i) in ctrlType" :key="i" :label="t.n" :value="t.v"></el-option>
        </el-select>
        <h4>选择显示字段</h4>
        <div class="rule-set">
          <div class="rule-set__display">
            <el-select size="mini" v-model="curRule.controlIds" filterable multiple placeholder="选择字段">
              <el-option
                v-for="(f, i) in fields"
                :key="i"
                :label="f._fieldName"
                :value="f._fieldValue"
                :disabled="isFieldDisabled(f._fieldValue)"
              ></el-option>
            </el-select>
          </div>
          <div class="rule-set__filter">
            <h4>满足以下条件时显示或必填</h4>
            <div class="rule-set__filter-item" v-for="(f, index) in curRule.filters" :key="index">
              <div class="rule-set__filter-item-wrapper">
                <div class="rule-set__filter-item__op">
                  <div class="rule-set__filter-item__op-title">{{ f.name }}</div>
                  <el-select size="mini" v-model="f.op" placeholder="选择操作">
                    <el-option v-for="(f, index) in getOp(f.cid)" :key="index" :label="f.name" :value="index"></el-option>
                  </el-select>
                  <i class="rule-set__filter-item__op-del el-icon-close" @click="handleFilterDel(index)"></i>
                </div>
                <div class="rule-set__filter-item__val" v-if="f.op || f.op === 0">
                  <el-input size="mini" v-if="getMatch(f) === 1" v-model="f.val" placeholder="请输入内容"></el-input>
                  <el-form v-else>
                    <pso-form-component
                      :force-show="true"
                      :cpnt="f.cpnt"
                      @value-change="valueChangeHandler($event, f)"
                    ></pso-form-component>
                  </el-form>
                </div>
              </div>
              <div class="rule-set__filter-item__type" v-if="curRule.filters.length - 1 !== index">
                <el-select size="mini" v-model="curRule.type">
                  <el-option v-for="rt in ruleType" :key="rt.n" :label="rt.n" :value="rt.v"></el-option>
                </el-select>
              </div>
            </div>
            <div class="rule-set__filter-add">
              <el-dropdown size="mini" v-if="curRule.controlIds.length" trigger="click" @command="handleFilterAdd">
                <el-button class="el-dropdown-link" size="mini" icon="el-icon-plus">添加筛选条件</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(f, index) in avlFilter" :key="index" :command="index">{{ f._fieldName }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div v-else>请选择显示字段</div>
            </div>
          </div>
        </div>
      </great-panel>
      <div v-else class="rule-set-empty">请选择一个规则</div>
    </div>
  </div>
</template>
<script>
import { CPNT } from "../../const/form";
import FormStore from "../form-designer/model/store.js";
import PsoFormComponent from "../form-interpreter/cpnt";
import GreatPanel from "../great-panel";

export default {
  props: ["store", "rules"],
  components: { GreatPanel, PsoFormComponent },
  data() {
    this.ruleType = [
      { n: "且", v: 1 },
      { n: "或", v: 2 },
    ];
    this.ctrlType = [
      { n: "显示", v: 1 },
      { n: "必填", v: 2 },
    ];
    return {
      curRule: null,
    };
  },
  created() {
    for (let r of this.rules) {
      for (let f of r.filters) {
        f.cpnt = this.makeCpnt(f, { [f.id]: f.val });
      }
    }
    if (this.rules.length) {
      this.handleRuleClick(0);
    }
  },
  computed: {
    fields() {
      return this.store.search({ options: { db: true }, onlyData: true });
    },
    usedFields() {
      let f = [];
      this.rules.forEach((item) => (f = f.concat(item.controlIds)));
      return f;
    },
    avlFilter() {
      return this.fields.filter((f) => this.curRule.controlIds.indexOf(f._fieldValue) === -1);
    },
  },
  methods: {
    isFieldDisabled(id) {
      return this.usedFields.indexOf(id) !== -1;
    },
    ruleListClass(index) {
      return {
        active: this.curRule ? this.curRule === this.rules[index] : false,
      };
    },
    handleRuleClick(index) {
      this.curRule = this.rules[index];
      if (typeof this.curRule.controlType === "undefined") {
        this.$set(this.curRule, "controlType", 1);
      }
    },
    handleRuleDel(index) {
      if (this.curRule === this.rules[index]) this.curRule = null;
      this.rules.splice(index, 1);
    },
    handleRuleAdd() {
      this.rules.push({
        controlType: 1,
        controlIds: [],
        filters: [],
        type: this.ruleType[0].v,
      });
      this.handleRuleClick(this.rules.length - 1);
    },
    handleFilterDel(index) {
      this.curRule.filters.splice(index, 1);
    },
    handleFilterAdd(index) {
      const { _fieldValue, _fieldName, componentid } = this.avlFilter[index];
      const filter = {
        id: _fieldValue,
        name: _fieldName,
        cid: componentid,
        op: "",
        val: "",
      };
      filter.cpnt = this.makeCpnt(filter);
      this.curRule.filters.push(filter);
    },
    getOp(componentid) {
      return CPNT[componentid].fop;
    },
    makeCpnt(proxy, data) {
      this.$set(proxy, "store", new FormStore({ ...this.store.getBaseInfo(), designMode: false }));
      proxy.store.updateInstance(data);
      const cpnt = proxy.store.search({ options: { db: true }, dataOptions: { _fieldValue: proxy.id } })[0];
      cpnt.data._hideForever = false;
      cpnt.data._hideOnNew = false;
      delete cpnt.data._fieldName;
      return cpnt;
    },
    valueChangeHandler({ value }, proxy) {
      proxy.val = value;
    },
    getMatch({ cid, op }) {
      return CPNT[cid].fop[op].match;
    },
  },
};
</script>