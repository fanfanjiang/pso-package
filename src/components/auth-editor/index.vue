<template>
  <el-dialog
    width="30%"
    :append-to-body="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    title="权限项"
    :visible="show"
    @close="$emit('cancel')"
  >
    <el-form :model="formData" size="mini" label-width="100px">
      <el-form-item label="权限项名称">
        <el-input v-model="formData.body_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="权限项描述">
        <el-input v-model="formData.body_note" autocomplete="off"></el-input>
      </el-form-item>
      <slot></slot>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="$emit('cancel')">取 消</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="saveAuth"
        :loading="loading"
        :disabled="loading"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import shortid from "shortid";

export default {
  props: {
    params: Object,
    show: {
      type: Boolean,
      default: false
    },
    autoSave: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        body_id: shortid.generate(),
        body_name: "",
        body_note: ""
      }
    };
  },
  created() {
    if (this.params) this.formData = Object.assign(this.formData, this.params);
  },
  methods: {
    async saveAuth() {
      if (this.autoSave) {
        await this.API.permissionEntries({ data: this.formData, method: this.formData.body_id ? "put" : "post" });
      }
      this.$emit("saved", this.formData);
    }
  }
};
</script>