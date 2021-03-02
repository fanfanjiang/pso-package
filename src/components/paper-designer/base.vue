<template>
  <div>
    <el-form size="mini" label-position="left" label-width="60px" style="margin-bottom: 10px">
      <el-form-item label="登录">
        <el-checkbox v-model="store.paperConfig.authRequired"></el-checkbox>
      </el-form-item>
      <el-form-item label="姓名">
        <el-checkbox v-model="store.paperConfig.nameRequired"></el-checkbox>
      </el-form-item>
      <el-form-item label="身份证">
        <el-checkbox v-model="store.paperConfig.IDRequired"></el-checkbox>
      </el-form-item>
      <el-form-item label="手机">
        <el-checkbox v-model="store.paperConfig.phoneRequired"></el-checkbox>
      </el-form-item>
      <el-form-item label="地址">
        <el-checkbox v-model="store.paperConfig.addressRequired"></el-checkbox>
      </el-form-item>
      <el-form-item label="及格">
        <el-input-number size="mini" v-model="store.paperConfig.passScore" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
    </el-form>
    <great-panel :padding="0" color="#fff">
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>考试结束脚本：</span>
      </template>
      <div style="padding: 10px; background: #f7f8fa">
        传入参数
        <br />exam_id：试卷ID；<br />exam_user：答题人ID；<br />result_id：答题结果ID；<br />result_score：分数;<br />passed：是否及格
      </div>
      <el-switch size="mini" v-model="store.paperConfig.examEndSqlRequired"> </el-switch>
      <el-button
        v-if="store.paperConfig.examEndSqlRequired"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        size="mini"
        circle
        @click="openScript('examEndSql')"
      ></el-button>
    </great-panel>
    <great-panel :padding="0" color="#fff">
      <template #header>
        <i class="el-icon-edit-outline"></i>
        <span>阅卷结束脚本：</span>
      </template>
      <el-switch size="mini" v-model="store.paperConfig.gradeEndSqlRequired"> </el-switch>
      <el-button
        v-if="store.paperConfig.gradeEndSqlRequired"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        size="mini"
        circle
        @click="openScript('gradeEndSql')"
      ></el-button>
    </great-panel>
    <sql-designer ref="designer" :opener="sqlOpener" :sql="curScript"></sql-designer>
  </div>
</template> 
<script>
import SqlDesigner from "../sql-designer";
import GreatPanel from "../great-panel";
export default {
  components: { SqlDesigner, GreatPanel },
  props: {
    store: Object,
  },
  data() {
    return {
      sqlOpener: { show: false },
      curScript: [],
    };
  },
  methods: {
    openScript(script) {
      this.curScript = this.store.paperConfig[script];
      this.sqlOpener.show = true;
    },
  },
};
</script>