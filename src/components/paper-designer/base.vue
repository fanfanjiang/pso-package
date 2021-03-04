<template>
  <div>
    <el-form size="mini" label-position="left" label-width="110px" style="margin-bottom: 10px">
      <el-divider content-position="left">必填项设置</el-divider>
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
      <el-divider content-position="left">考试设置</el-divider>
      <el-form-item label="需要登录">
        <el-checkbox v-model="store.paperConfig.authRequired"></el-checkbox>
      </el-form-item>
      <el-form-item label="需要阅卷">
        <el-checkbox v-model="store.paperConfig.gradeable"></el-checkbox>
      </el-form-item>
      <el-form-item label="显示考分">
        <el-checkbox v-model="store.paperConfig.showResult"></el-checkbox>
      </el-form-item>
      <el-form-item label="答题限制">
        <el-radio-group v-model="store.paperConfig.unlimited">
          <el-radio :label="true">无限次</el-radio>
          <el-radio :label="false">有限次</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="答题次数" v-if="!store.paperConfig.unlimited">
        <el-input-number size="mini" v-model="store.paperConfig.examLimit" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="及格分数">
        <el-input-number size="mini" v-model="store.paperConfig.passScore" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-divider content-position="left">脚本设置</el-divider>
      <el-form-item label="动态试卷名称">
        <el-input size="mini" v-model="store.paperConfig.paperNameRefer" placeholder></el-input>
      </el-form-item>
    </el-form>
    <great-panel :padding="0" color="#fff">
      <template #header>
        <span>考试结束脚本</span>
        <sql-tip></sql-tip>
      </template>
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
        <span>阅卷结束脚本</span>
        <sql-tip></sql-tip>
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
    <great-panel :padding="0" color="#fff">
      <template #header>
        <span>设置脚本参数：</span>
      </template>
      <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showArgs = true"></el-button>
    </great-panel>
    <sql-designer ref="designer" :opener="sqlOpener" :sql="curScript"></sql-designer>
    <pso-dialog :visible="showArgs" width="50%" @close="showArgs = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>脚本参数</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <paper-args :store="store"></paper-args>
      </div>
    </pso-dialog>
  </div>
</template> 
<script>
import SqlDesigner from "../sql-designer";
import GreatPanel from "../great-panel";
import SqlTip from "./common/sqltip";
import PaperArgs from "./arguments";

export default {
  components: { SqlDesigner, GreatPanel, SqlTip, PaperArgs },
  props: {
    store: Object,
  },
  data() {
    return {
      showArgs: false,
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