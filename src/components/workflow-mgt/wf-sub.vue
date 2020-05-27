<template>
  <el-table :data="data" style="width: 100%" key="tag">
    <el-table-column prop="subForm" label="子表单" width="180"></el-table-column>
    <el-table-column label="是否是流程">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.isFlow" size="small" active-value="1" inactive-value="0"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="选择流程">
      <template>
        <el-select v-model="wfDesigner.wfFiletype" placeholder="请选择">
          <el-option
            v-for="item in wfDesigner.fileTypes"
            :key="item.wf_filetype"
            :label="item.wf_filetype"
            :value="item.wf_filetype"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          plain
          @click="$emit('goDesigner',{node_id:scope.row.subCode})"
        >设置流程</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: ["data"],
  computed: {
    ...mapState(["wfDesigner"])
  },
  methods: {}
};
</script>