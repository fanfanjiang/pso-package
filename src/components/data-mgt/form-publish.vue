<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="small" type="primary" plain @click="$emit('save')">保存</el-button>
    </div>
    <div>
      <span>是否对外开放</span>
      <el-switch v-model="data.isPublic"></el-switch>
    </div>
    <div v-if="data.isPublic" class="pso-dd-public">
      <pso-title>对外配置</pso-title>
      <el-form ref="form" label-width="80px" label-position="left">
        <el-form-item label="LOGO">
          <pso-form-attach :cpnt="{data:data.attach}">
            <el-button icon="el-icon-paperclip" plain size="small">上传LOGO</el-button>
          </pso-form-attach>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="data.name"></el-input>
        </el-form-item>
        <el-form-item label="提交文本">
          <el-input v-model="data.subBtnText"></el-input>
        </el-form-item>
        <el-form-item label="完成文本">
          <el-input v-model="data.doneText"></el-input>
        </el-form-item>
      </el-form>
      <pso-title>表单链接</pso-title>
      <p>{{SELFURL}}/form/{{node.node_name}}</p>
      <pso-title>链接二维码</pso-title>
      <div>
        <img :src="qrsrc" alt />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data", "node"],
  data() {
    return {
      qrsrc: ""
    };
  },
  watch: {
    "node.node_name"() {
      this.genQR();
    }
  },
  async created() {
    this.qrsrc = await this.genQR(`${this.SELFURL}/form/${this.node.node_name}`);
  },
  methods: {
    async genQR() {
      return await QRCode.toDataURL(`${this.SELFURL}/form/${this.node.node_name}`);
    }
  }
};
</script>