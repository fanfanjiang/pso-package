<template>
  <div style="margin-top: 20px">
    <great-panel>
      <template #header>
        <span>设置插件中文本的映射</span>
      </template>
    </great-panel>
    <great-panel>
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>默认文本</span>
      </template>
      <el-button size="mini" type="primary" plain @click="addParam" style="margin-bottom: 10px">添加参数</el-button>
      <el-table border size="mini" :data="defText" style="width: 100%" key="param">
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
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" plain @click="delParam(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </great-panel>
    <great-panel>
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>自定义文本</span>
      </template>
      <div style="margin-bottom: 20px" v-for="(item, index) in data" :key="index">
        <el-form label-position="left" label-width="80px" style="margin-bottom: 10px">
          <el-form-item label="组名称">
            <el-input v-model="item.name" size="mini" placeholder></el-input>
          </el-form-item>
        </el-form>
        <el-table border size="mini" :data="item.list" style="width: 100%" key="param">
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
        <el-divider></el-divider>
      </div>
      <div style="margin-top: 10px">
        <el-button size="mini" type="primary" plain @click="addGroup">添加组</el-button>
      </div>
    </great-panel>
  </div>
</template>
<script>
import shortid from "shortid";
import GreatPanel from "../great-panel";
export default {
  components: { GreatPanel },
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