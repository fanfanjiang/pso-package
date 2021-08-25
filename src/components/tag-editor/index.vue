<template>
  <div class="pso-tageditor">
    <template v-if="!numberable">
      <el-tag :key="tag" v-for="tag in data" :size="size" closable :disable-transitions="false" @close="handleClose(tag)">{{ tag }}</el-tag>
    </template>
    <el-input-number
      v-if="numberable"
      style="margin-right: 5px"
      size="mini"
      v-model="data[0]"
      controls-position="right"
      :precision="2"
      :min="0"
    ></el-input-number>
    <template v-else>
      <el-input
        class="pso-tageditor__newtag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <el-button v-else-if="data.length < max" class="pso-tageditor__add" size="mini" @click="showInput">+{{ text }}</el-button>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    data: {
      type: Array,
      default: () => [],
    },
    text: {
      type: String,
      default: "添加",
    },
    max: {
      type: Number,
      default: Infinity,
    },
    numberable: {
      type: Boolean,
      default: false,
    },
    splitsymbol: {
      type: String,
      default: "|",
    },
    size: {
      type: String,
      default: "small",
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      inputVisible: false,
      inputValue: "",
    };
  },
  watch: {
    data: {
      deep: true,
      handler(value) {
        const data = [];
        value.forEach((d) => d && data.push(d));
        this.$emit("change", data.length ? data.join(this.splitsymbol) : "");
      },
    },
  },
  created() {
    if (this.numberable && !this.data.length) {
      this.data = [0];
    }
    if (this.value) {
      this.data.splice(0, this.data.length, ...this.value.split(this.splitsymbol));
    }
  },
  methods: {
    handleClose(tag) {
      this.data.splice(this.data.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
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
    },
  },
};
</script>
<style lang="less">
.pso-tageditor {
  span {
    margin-right: 10px;
  }
  span,
  .pso-tageditor__newtag,
  .pso-tageditor__add {
    margin-left: 0 !important;
  }
}
</style>
