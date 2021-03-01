<template>
  <el-table
    ref="table"
    style="width: 100%"
    size="mini"
    border
    v-loading="fetching"
    :data="instances"
    @row-click="$emit('row-click', $event)"
    @selection-change="$emit('selection-change', $event)"
  >
    <template #default>
      <el-table-column v-if="checkable" type="selection" width="40" header-align="center" align="center"></el-table-column>
      <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
      <el-table-column label="资源" width="90" align="center">
        <div class="pso-src-mini" slot-scope="scope">
          <pso-attachment
            v-if="scope.row.map_key || scope.row.res_id"
            :ids="scope.row.map_key || scope.row.res_id"
            @initialized="attachInited($event, scope.row)"
          ></pso-attachment>
        </div>
      </el-table-column>
      <el-table-column label="资源名称">
        <template slot-scope="scope">
          {{ scope.row.r_name || scope.row.res_name }}
        </template>
      </el-table-column>
      <el-table-column prop="res_content" label="资源内容"></el-table-column>
      <el-table-column prop="res_type" label="类型" width="60" align="center"></el-table-column>
      <el-table-column prop="res_size" label="大小" width="80">
        <template slot-scope="scope">
          {{ getSize(scope.row.res_size) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="90">
        <template slot-scope="scope">
          {{ scope.row.r_time || scope.row.res_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" v-if="opable">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click.stop="$emit('collect', scope.row)">
            {{ scope.row.auto_no ? "取消收藏" : "收藏" }}
          </el-button>
        </template>
      </el-table-column>
    </template>
    <template #empty>
      <pso-empty></pso-empty>
    </template>
  </el-table>
</template>
<script>
import PsoAttachment from "../attachment";
import { makeFiles } from "../../tool/file";

export default {
  components: { PsoAttachment },
  props: {
    fetching: {
      type: Boolean,
      default: false,
    },
    opable: {
      type: Boolean,
      default: true,
    },
    checkable: {
      type: Boolean,
      default: true,
    },
    instances: Array,
  },
  methods: {
    getSize(num) {
      return `${(parseFloat(num || 0) / 1024).toFixed(2)}kb`;
    },
    attachInited(file, data) {
      if (file.length) {
        makeFiles({ files: file, urlField: "res_path", nameField: "res_name" });
        Object.assign(data, file[0]);
      }
    },
  },
};
</script>