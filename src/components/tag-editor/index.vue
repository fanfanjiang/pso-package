<template>
  <div class="pso-tageditor">
    <el-tag
      :key="tag"
      v-for="tag in data"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >{{tag}}</el-tag>
    <el-input
      class="pso-tageditor__newtag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-button v-else class="pso-tageditor__add" size="mini" @click="showInput">{{text}}</el-button>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array
    },
    text: {
      type: String,
      default: "添加"
    }
  },
  data() {
    return {
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    console.log(this.data);
  },
  methods: {
    handleClose(tag) {
      this.data.splice(this.data.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.data.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>
