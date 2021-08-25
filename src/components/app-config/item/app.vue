<template>
  <div v-loading="initializing">
    <el-form-item label="应用名称">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="应用图片">
      <pso-form-attach ref="attach" :cpnt="attach" @value-change="handleAttachChange" :downloadable="false">
        <el-button size="mini"><i class="el-icon-paperclip el-icon--left"></i>上传</el-button>
      </pso-form-attach>
    </el-form-item>
    <el-form-item label="应用地址">
      <el-input size="small" v-model="data.map_key2" autocomplete="off"></el-input>
    </el-form-item>
  </div>
</template>
<script>
import { Attach } from "../../../mixin/form";

export default {
  mixins: [Attach],
  props: {
    data: Object,
  },
  data() {
    return {
      initializing: false,
      roles: [],
    };
  },
  async created() {
    this.createCpnt();
  },
  methods: {
    handleAttachChange({ value }) {
      this.data.map_key1 = value;
    },
  },
};
</script>
