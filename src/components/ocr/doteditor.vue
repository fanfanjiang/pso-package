<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button size="mini" type="primary" plain @click="onAdd">新增词库项</el-button>
    </div>
    <el-table key="status" size="mini" border :data="condition" style="width: 100%">
      <el-table-column label="识别词库">
        <template slot-scope="scope">
          <el-input v-model="scope.row.value" size="small" autocomplete="off"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onRemove(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      condition: [],
    };
  },
  watch: {
    condition: {
      deep: true,
      handler(value) {
        const data = [];
        value.forEach((d) => d.value && data.push(d.value));
        this.$emit("change", data.length ? data.join(",") : "");
      },
    },
  },
  created() {
    this.condition = this.value.split(",").map((value) => ({ value }));
  },
  methods: {
    onAdd() {
      this.condition.push({ value: "" });
    },
    onRemove(index) {
      this.condition.splice(index, 1);
    },
  },
};
</script>