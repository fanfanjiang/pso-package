<template>
  <div>
    <el-button style="margin-bottom: 5px" size="mini" type="primary" plain @click="addLink">添加链接</el-button>
    <el-table border size="mini" :data="links" style="width: 100%" @row-click="rowClickHandler">
      <el-table-column label="链接" prop="link">
        <template slot-scope="scope">
          <el-input v-model="scope.row.link" size="mini" autocomplete="off"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="ID字段" prop="rule">
        <template slot-scope="scope">
          <el-input v-model="scope.row.id" size="mini" autocomplete="off"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delLink(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="curLink" style="margin-top:5px">
      <dynamic-rule :rules="curLink.rule" :type="curLink.ruleType" :options="options" sysable @typechange="rtChangeHandler"></dynamic-rule>
    </div>
  </div>
</template>
<script>
import DynamicRule from "../dynamic-rule";
import { genComponentData } from "../form-designer/helper";
export default {
  components: { DynamicRule },
  props: {
    links: Array,
    fields: Array,
  },
  data() {
    return {
      curLink: null,
      options: [],
    };
  },
  methods: {
    addLink() {
      this.links.push({ link: "", id: "", rule: [] });
    },
    delLink(index) {
      this.links.splice(index, 1);
    },
    rtChangeHandler(type) {
      this.curLink.ruleType = type;
    },
    rowClickHandler(data) {
      this.options = [];
      for (let f of this.fields) {
        this.options.push(genComponentData({ componentid: "text", _fieldValue: f.field, _fieldName: f.name }));
      }
      this.curLink = data;
    },
  },
};
</script>