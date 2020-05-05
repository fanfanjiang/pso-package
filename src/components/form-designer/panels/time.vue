<template>
  <div class="act-time-panel">
    <common-panel
      :cpnt="cpnt"
      :info="'可设为日期、时间或日期+时间'"
      :needPlaceholder="true"
      :needDefaultValue="false"
    >
      <el-form-item label="选择类型">
        <el-radio v-model="cpnt.data._type" label="date">日期</el-radio>
        <el-radio v-model="cpnt.data._type" label="datetime">日期时间</el-radio>
        <el-radio v-model="cpnt.data._type" label="time">时间</el-radio>
      </el-form-item>
      <el-form-item label="默认值">
        <el-select v-model="cpnt.data._defaultType" placeholder="请选择">
          <el-option
            v-for="item in options[cpnt.data._type]"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="act-time-panel__subselect">
          <el-time-picker
            v-model="cpnt.data._defaultValue"
            v-if="cpnt.data._type==='time'&&cpnt.data._defaultType==='2'"
            :format="'HH:mm:ss'"
          ></el-time-picker>
        </div>
      </el-form-item>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import { DATE_OPTION } from "../../../const/form";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  data() {
    return {
      options: DATE_OPTION
    };
  },
  watch: {
    "cpnt.data._type": function() {
      this.cpnt.data._defaultType = "";
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
.act-time-panel__subselect {
  margin-top: 10px;
}
</style>