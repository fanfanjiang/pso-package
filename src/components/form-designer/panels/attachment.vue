<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="可以添加图片、文件" :needPlaceholder="false" :needDefaultValue="false" :needUnique="false">
      <el-form-item label="个数限制">
        <el-input-number size="small" v-model="cpnt.data._limit" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="图片高度">
        <el-input size="small" v-model="cpnt.data._showheight"></el-input>
      </el-form-item>
      <el-form-item label="图片宽度">
        <el-input size="small" v-model="cpnt.data._showwidth"></el-input>
      </el-form-item>
      <pso-form-attach :cpnt="img" @value-change="handleImgChange">
        <el-button icon="el-icon-paperclip" plain size="mini">上传默认图片</el-button>
      </pso-form-attach>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import { genComponentData } from "../helper";
import PsoFormAttach from "../../form-interpreter/components/attachment";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    PsoFormAttach,
  },
  data() {
    return {
      img: { data: {} },
    };
  },
  created() {
    this.img.data = genComponentData({ componentid: "attachment", _fieldName: "默认图片", _val: this.cpnt.data._defaultValue || "" });
  },
  methods: {
    handleImgChange({ value }) {
      this.cpnt.data._defaultValue = value;
    },
  },
};
</script>
<style lang="less" scoped>
</style>