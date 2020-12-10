<template>
  <div style="margin-top: 20px">
    <div>
      <pso-title>默认文本</pso-title>
      <el-button size="mini" type="primary" plain @click="addParam">添加参数</el-button>
      <el-table :data="defText" style="width: 100%" key="param">
        <el-table-column label="文本名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" size="mini" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="文本ID">
          <template slot-scope="scope">
            <el-input v-model="scope.row.id" size="mini" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="delParam(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <pso-title>文本</pso-title>
      <div v-for="(item, index) in data" :key="index">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="组名称">
            <el-input v-model="item.name" size="mini" placeholder></el-input>
          </el-form-item>
        </el-form>
        <el-table :data="item.list" style="width: 100%" key="param">
          <el-table-column label="文本名称" prop="name"></el-table-column>
          <el-table-column label="文本修正">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" size="mini" placeholder></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px">
          <el-button size="mini" type="danger" plain @click="delGroup(index)">删除组</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <el-button size="mini" type="primary" plain @click="addGroup">添加组</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import shortid from "shortid";
export default {
  props: ["data", "defText"],
  data() {
    return {};
  },
  methods: {
    addParam() {
      this.defText.push({
        id: "",
        name: "",
        value: "",
      });
    },
    delParam(index) {
      this.defText.splice(index, 1);
    },
    delGroup(index) {
      this.data.splice(index, 1);
    },
    addGroup() {
      this.data.push({
        id: shortid.generate(),
        name: "",
        list: _.cloneDeep(this.defText),
      });
    },
  },
};
</script>