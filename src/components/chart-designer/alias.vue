<template>
  <el-dialog
    width="30%"
    append-to-body
    close-on-click-modal
    destroy-on-close
    title="设置别名"
    :visible="show"
    @close="$emit('cancel')"
  >
    <el-form label-width="60px">
      <el-form-item label="别名">
        <el-input v-model="params.alias" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
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
    }
  },
  data() {
    return {};
  },
  methods: {
    async save() {
      this.$emit("saved");
    }
  }
};
</script>