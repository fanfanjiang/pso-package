<template>
  <div class="theme-item">
    <div class="theme-item-l">
      <div class="theme-item-title">{{ data.map_key1 }}</div>
      <div class="theme-item-preview">
        <div class="tip-t" :style="{ 'background-color': data.variables['@nav-bg-color'] }">
          <span :style="navStyle"></span>
          <span :style="navStyle"></span>
          <span :style="navStyle"></span>
        </div>
        <div class="tip-b">
          <div class="tip-b-l" :style="{ 'background-color': data.variables['@aside-bg-color'] }">
            <span :style="asideStyle"></span>
            <span :style="asideStyle"></span>
            <span :style="asideStyle"></span>
            <span :style="asideStyle"></span>
          </div>
          <div class="tip-b-r"></div>
        </div>
      </div>
    </div>
    <div class="theme-item-r">
      <div class="theme-item-switch">
        <el-switch v-model="data.map_key3" active-value="1" inactive-value="0" @change="onSave"></el-switch>
      </div>
      <el-form size="medium" label-position="top">
        <el-form-item label="">
          <pso-form-attach ref="attach" :cpnt="attach" @value-change="onAttachChange" :downloadable="false">
            <el-button size="medium" v-show="!data.map_key4"><i class="el-icon-paperclip el-icon--left"></i>上传LOGO</el-button>
          </pso-form-attach>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { Attach } from "../../mixin/form";
export default {
  mixins: [Attach],
  props: {
    data: Object,
  },
  computed: {
    navStyle() {
      return {
        "background-color": this.data.variables["@nav-text-color"],
      };
    },
    asideStyle() {
      return {
        "background-color": this.data.variables["@aside-text-color"],
      };
    },
  },
  created() {
    this.createCpnt(this.data.map_key4);
  },
  methods: {
    onSave() {},
    onAttachChange({ value }) {
      this.data.map_key4 = value;
      this.$emit("save", false);
    },
  },
};
</script>
<style lang="less">
.theme-item {
  display: flex;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f7f8fa;
  justify-content: space-between;
  .el-form-item {
    margin-bottom: 0;
  }
  .theme-item-l {
  }
  .theme-item-r {
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .theme-item-title {
    font-size: 16px;
    font-weight: bolder;
    margin-bottom: 30px;
  }
  .theme-item-switch {
    margin-bottom: 20px;
  }
  .theme-item-preview {
    width: 140px;
    height: 100px;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    .tip-t {
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
      > span {
        height: 25%;
        width: 15%;
        & + span {
          margin-left: 5px;
        }
      }
    }
    .tip-b {
      display: flex;
      align-items: center;
      height: calc(100% - 20px);
      .tip-b-l {
        width: 40px;
        height: 100%;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        > span {
          height: 6%;
          width: 60%;
          margin-top: 5px;
          opacity: 0.5;
        }
      }
      .tip-b-r {
        flex: 1;
        height: 100%;
      }
    }
  }
}
</style>