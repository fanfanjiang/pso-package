<template>
  <div style="margin-top: 20px">
    <great-panel>
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>状态配置</span>
      </template>
      <status-designer :code="code" :data="status" :fields="fields"></status-designer>
    </great-panel>
    <great-panel>
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>阶段配置</span>
      </template>
      <status-designer :code="code" :data="stage" :fields="fields"></status-designer>
    </great-panel>
    <great-panel>
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>提交配置</span>
      </template>
      <form-submit :code="code" :data="subdata"></form-submit>
    </great-panel>
  </div>
</template>
<script>
import StatusDesigner from "./status-designer";
import FormSubmit from "./form-submit";
import GreatPanel from "../great-panel";

export default {
  components: { GreatPanel, StatusDesigner, FormSubmit },
  props: {
    fields: Array,
    code: String,
    status: Array,
    stage: Array,
    subdata: Array,
  },
};
</script>