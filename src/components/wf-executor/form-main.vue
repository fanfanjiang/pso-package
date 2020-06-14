<template>
  <div class="pso-wf-mainform">
    <el-form
      :rules="rules"
      :model="store.data"
      label-width="80px"
      label-position="top"
      size="medium"
    >
      <div class="pso-wf-mainform__item">
        <el-form-item v-if="store.TEXT.file.show" :label="store.TEXT.file.value" prop="filetype">
          <el-select v-model="store.data.filetype" :disabled="readMode">
            <el-option
              v-for="type in store.cfg.files"
              :key="type.wf_code"
              :label="type.wf_filetype"
              :value="type.wf_filetype"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="store.TEXT.import.show" :label="store.TEXT.import.value" prop="import">
          <el-select v-model="store.data.import" :disabled="readMode">
            <el-option v-for="val in important" :key="val" :label="val" :value="val"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="pso-wf-mainform__item">
        <el-form-item v-if="store.TEXT.secret.show" :label="store.TEXT.secret.value" prop="secret">
          <el-select v-model="store.data.secret" :disabled="readMode">
            <el-option v-for="val in secret" :key="val" :label="val" :value="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="store.TEXT.urgent.show" :label="store.TEXT.urgent.value" prop="urgent">
          <el-select v-model="store.data.urgent" :disabled="readMode">
            <el-option v-for="val in urgent" :key="val" :label="val" :value="val"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>  
<script>
import { WF_IMPORTANCE, WF_SECTRE, WF_URGENT } from "../../const/workflow";
export default {
  props: {
    store: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    readMode() {
      return this.store.curStep && this.store.curStep.atype !== "form";
    }
  },
  data() {
    return {
      important: WF_IMPORTANCE,
      secret: WF_SECTRE,
      urgent: WF_URGENT,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        import: [{ required: true, message: "请选择", trigger: "change" }],
        secret: [{ required: true, message: "请选择", trigger: "change" }],
        urgent: [{ required: true, message: "请选择", trigger: "change" }],
        filetype: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  }
};
</script>
<style lang="less">
.pso-wf-mainform {
  margin-bottom: 20px;
  .pso-wf-mainform__item {
    display: flex;
    > div {
      flex: 1;
      width: 100%;
      margin-bottom: 10px;
      & + div {
        margin-left: 15px;
      }
    }
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__label {
    padding-bottom: 0;
  }
  .el-select {
    width: 100%;
  }
}
</style>
