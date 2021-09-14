<template>
  <div class="dynamic-rule">
    <div class="dynamic-rule-item" v-for="(c, i) in conditions" :key="i">
      <div class="dynamic-rule-item-body">
        <div class="dynamic-rule-filter">
          <div class="dynamic-rule-filter__header">
            <span class="dynamic-rule-filter__name">{{ getTarget(c)._fieldName }}</span>
            <div class="dynamic-rule-filter__op">
              <el-select size="mini" v-model="c.op" placeholder="操作">
                <el-option label="等于" value="1"></el-option>
                <el-option label="包含" value="2"></el-option>
                <el-option label="在其中" value="4"></el-option>
                <el-option label="大于" value="20"></el-option>
                <el-option label="大于等于" value="21"></el-option>
                <el-option label="小于" value="22"></el-option>
                <el-option label="小于等于" value="23"></el-option>
              </el-select>
            </div>
            <i class="dynamic-rule-filter__del el-icon-close" @click="delCondition(i)"></i>
          </div>
          <div class="dynamic-rule-filter__body" v-if="c.op">
            <div class="dynamic-rule-filter__value">
              <el-select v-if="c.sid" size="mini" v-model="c.sid" clearable placeholder="请选择">
                <el-option v-for="s in sources" :key="s.fid" :label="s._fieldName" :value="s._fieldValue"></el-option>
              </el-select>
              <template v-else>
                <div class="dynamic-rule-filter__value-l">
                  <cpnt :data="getTarget(c)" v-model="c.value"></cpnt>
                </div>
                <div class="dynamic-rule-filter__value-r">
                  <el-dropdown v-if="!c.sid" @command="commandHandler($event, c)" size="mini" trigger="click">
                    <span class="el-dropdown-link">
                      <i class="el-icon-plus el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="s in sources">
                        <el-dropdown-item :key="s._fieldValue" :command="s._fieldValue">{{ s._fieldName }}</el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dynamic-rule-add">
      <el-dropdown @command="addCondition" size="mini" trigger="click">
        <el-button class="el-dropdown-link" size="mini" icon="el-icon-plus">添加筛选条件</el-button>
        <el-dropdown-menu slot="dropdown">
          <template v-for="t in targets">
            <el-dropdown-item :key="t._fieldValue" :command="t._fieldValue">{{ t._fieldName }}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import cpnt from "./cpnt";
// 动态筛选组件,这个只能用于keys中，需要请求接口
export default {
  components: { cpnt },
  props: {
    targets: Array,
    sources: Array,
    conditions: Array,
  },
  model: {
    prop: "conditions",
    event: "change",
  },
  data() {
    return {};
  },
  watch: {
    conditions: {
      deep: true,
      handler(val) {
        this.$emit("change", val);
      },
    },
  },
  created() {
    console.log(this.targets);
    console.log(this.sources);
  },
  methods: {
    getTarget(item) {
      const { tid, value } = item;
      const cpnt = _.find(this.targets, { _fieldValue: tid });
      if (cpnt && value) {
        cpnt._val = value;
      }
      return cpnt || {};
    },
    addCondition(tid) {
      this.conditions.push({ tid: tid, op: "", sid: "", value: "" });
    },
    delCondition(i) {
      this.conditions.splice(i, 1);
    },
    commandHandler(tid, item) {
      item.sid = tid;
    },
  },
};
</script>