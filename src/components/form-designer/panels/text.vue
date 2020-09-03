<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="可以输入一般文字" :needPlaceholder="true">
      <el-form-item label="显示方式">
        <el-radio v-model="cpnt.data._type" label="text">单行</el-radio>
        <el-radio v-model="cpnt.data._type" label="textarea">多行</el-radio>
      </el-form-item>
      <el-form-item label="扫码录入">
        <el-switch size="mini" v-model="cpnt.data._scannable" active-text="是否支持扫码"></el-switch>
        <div v-if="cpnt.data._scannable">
          <el-radio v-model="cpnt.data._scanType" label="qr">二维码</el-radio>
          <el-radio v-model="cpnt.data._scanType" label="bar">条形码</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="模糊查询">
        <el-switch size="mini" v-model="cpnt.data._searchable" active-text="开启模糊查询"></el-switch>
      </el-form-item>
      <picker-form
        v-if="cpnt.data._searchable"
        :data="cpnt.data"
        form-field="_searchForm"
        :fields="[{n:'查询字段',f:'_searchField'}]"
      ></picker-form>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import PickerForm from "../../picker/pso-picker-form";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    PickerForm,
  },
};
</script>
