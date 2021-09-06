<template>
  <div class="social-item">
    <div class="social-item-header">
      <div>
        <img :src="data.map_key7" />
        <span>{{ data.map_key1 }}</span>
      </div>
      <div>
        <el-switch v-model="data.map_key2" active-value="1" inactive-value="0" @change="onSave"></el-switch>
      </div>
    </div>
    <el-form
      v-if="data.map_key2 === '1'"
      style="margin-top: 20px; max-width: 500px"
      size="medium"
      label-width="140px"
      label-position="right"
    >
      <template>
        <el-form-item label="APPKEY：" required>
          <el-input size="small" v-model="data.map_key4" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="APPSECRET：" required>
          <el-input size="small" v-model="data.map_key5" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="自动创建用户：">
          <el-switch v-model="data.map_key8" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="注册成功后脚本：">
          <el-button size="mini" type="success" @click="showDeisgner.show = true">设计脚本</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="$emit('save', true)">保存</el-button>
        </el-form-item>
      </template>
    </el-form>
    <pso-sql-designer :opener="showDeisgner" :sql="sql"></pso-sql-designer>
  </div>
</template>
<script>
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      showDeisgner: { show: false },
      sql: [],
    };
  },
  watch: {
    "showDeisgner.show": {
      handler(value) {
        if (!value) {
          this.data.map_key9 = JSON.stringify(this.sql);
        }
      },
    },
  },
  async created() {
    if (this.data.map_key9) {
      this.sql = JSON.parse(this.data.map_key9);
    }
  },
  methods: {
    onSave() {
      if (this.data.map_key2 === "0") {
        this.$emit("save", false);
      }
    },
  },
};
</script>
<style lang="less">
.social-item {
  padding: 20px;
  background-color: #f7f8fa;
  & + .social-item {
    margin-top: 10px;
  }
  .social-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      display: flex;
      align-items: center;
    }
    img {
      width: 30px;
      margin-right: 10px;
    }
    span {
      font-size: 16px;
    }
  }
}
</style>