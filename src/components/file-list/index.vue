<template>
  <div class="pso-upload__list">
    <el-row :gutter="10">
      <el-col :xs="8" :sm="6" v-for="(file,index) in files" :key="file.fid">
        <div class="pso-upload__list-item">
          <div class="pso-upload__list-item-fix">
            <div class="pso-upload__list-item__progress" v-if="file.percentage!==100">
              <el-progress :width="80" type="circle" :percentage="file.percentage"></el-progress>
              <div class="pso-upload__list-progress__name">{{file.name}}</div>
            </div>
            <template v-else>
              <div class="pso-upload__list-info">
                <div class="pso-upload__list-info__bg" v-bind:style="file.style"></div>
                <div class="pso-upload__list-info__name" v-if="!file.isImg">{{file.name}}</div>
              </div>
              <div class="pso-upload__list-panel">
                <span class="pso-upload__list-panel__item" @click="goShowViewer({index,file})">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="pso-upload__list-panel__item" @click="$emit('download',file)">
                  <i class="el-icon-download"></i>
                </span>
                <span class="pso-upload__list-panel__item" @click="$emit('delete',file)">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
    <transition name="el-fade-in">
      <file-viewer :fIndex="fIndex" :fileList="files" v-if="showViewer" @close="showViewer=false"></file-viewer>
    </transition>
  </div>
</template>
<script>
import FileViewer from "../file-viewer";
export default {
  components: { FileViewer },
  props: ["files"],
  data() {
    return {
      showViewer: false,
      fIndex: 0
    };
  },
  methods: {
    goShowViewer(params) {
      this.fIndex = params.index;
      this.showViewer = true;
      this.$emit("check", params);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable";
.pso-upload__list {
  position: relative;
  width: 100%;
  height: 100%;
  .pso-upload__list-item {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    margin-bottom: 8px;
    box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    &:hover {
      .pso-upload__list-panel {
        opacity: 1;
      }
    }
    .pso-upload__list-item-fix {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .pso-upload__list-item__progress {
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      @{deep} .el-progress {
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex: 1;
        align-items: center;
      }
    }
    .pso-upload__list-info {
      display: flex;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .pso-upload__list-info__bg {
        flex: 1;
        background-repeat: no-repeat;
        background-position: 50%;
      }
    }
    .pso-upload__list-progress__name,
    .pso-upload__list-info__name {
      height: 30px;
      line-height: 30px;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 5px;
      overflow: hidden;
      font-size: 12px;
    }
    .pso-upload__list-panel {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .pso-upload__list-panel__item {
        cursor: pointer;
        color: #fff;
        font-size: 18px;
      }
    }
  }
}
</style>