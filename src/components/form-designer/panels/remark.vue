<template>
  <div class="act-section-body">
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" info="添加说明文字"></panel-header>
    <el-form label-position="top" label-width="80px">
      <el-form-item label="颜色">
        <el-color-picker size="mini" v-model="cpnt.data._color"></el-color-picker>
      </el-form-item>
    </el-form>
    <el-form label-position="top" label-width="80px">
      <el-form-item label="说明">
        <markdown-editor :proxy="cpnt.data" vfield="_defaultValue"></markdown-editor>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";
import MarkdownEditor from "../../markdown-editor";

export default {
  props: ["cpnt"],
  components: {
    panelHeader,
    MarkdownEditor,
  },
};
</script>
