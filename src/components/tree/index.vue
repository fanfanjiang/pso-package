<template>
  <div class="pso-tree" :style="treeStyle">
    <div class="pso-tree__search" v-if="searchable">
      <mu-text-field v-model="filterText">
        <template v-slot:prepend>
          <i class="el-icon-search"></i>
        </template>
      </mu-text-field>
    </div>
    <pso-skeleton v-if="loadingWholeTree" :lines="10"></pso-skeleton>
    <div v-else class="pso-tree__body" v-loading="loading">
      <el-tree
        ref="tree"
        :node-key="nodeKey"
        :default-expand-all="defaultExpendAll"
        :draggable="draggable"
        :empty-text="emptyText"
        :data="treeData"
        :props="treeProps"
        :filter-node-method="filterNodeHandler"
        :allow-drop="allowDropHandler"
        :allow-drag="allowDragHandler"
        :lazy="lazyLoad"
        :load="getNodeData"
        @node-drag-start="nodeDragStart"
        :show-checkbox="showCheckbox"
        @node-click="nodeClickHandler"
        @node-drop="nodeDropHandler"
        @check="checkChangeHandler"
      >
        <span class="pso-tree__node" slot-scope="{node}">
          <span class="pso-tree__node-title">
            <img :src="getNodeIcon(node)" alt />
            <span>{{ node.label }}</span>
          </span>
          <span v-if="editMode" :class="[{'pso-tree__node-btns':true},{'show':node.showMenu}]">
            <el-dropdown
              size="small"
              trigger="hover"
              :show-timeout="50"
              @command="treeFunHandler($event,node)"
              @visible-change="nodeMenuChangeHandler(node)"
            >
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <slot name="node-edit-menu">
                  <template v-if="!node.data.is_leaf">
                    <el-dropdown-item v-if="folderMode" command="newFolder">新建文件夹</el-dropdown-item>
                    <el-dropdown-item command="newNode">新建{{nodeEditLable}}</el-dropdown-item>
                  </template>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete" v-if="!(rootable&&node.level===1)">删除</el-dropdown-item>
                </slot>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
      <el-dialog
        v-loading="nodePayload.loading"
        width="30%"
        :append-to-body="true" 
        :close-on-click-modal="false"
        :title="nodePayload.formTitle"
        :visible.sync="nodePayload.showForm"
      >
        <el-form v-if="nodePayload.node" :model="nodePayload.node.data" label-width="80px">
          <el-form-item :label="nodePayload.nameLable">
            <el-input v-model="nodePayload.node.data.node_display" autocomplete="off"></el-input>
          </el-form-item>
          <slot v-bind:node="nodePayload.node.data"></slot>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodePayload.showForm = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editNode"
            :loading="nodePayload.loading"
            :disabled="nodePayload.loading"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { TreeMixin } from "../../mixin/tree";

export default {
  mixins: [TreeMixin()],
  props: {
    treeStyle: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
.pso-tree {
  width: 100%;
  padding: 15px;
  height: 100%;
  background-color: transparent;
  box-shadow: 1px 0 1px 0 rgba(0, 0, 0, 0.06), inset -1px 0 0 0 rgba(255, 255, 255, 0.2);
  @{deep} .el-tree-node__expand-icon {
    opacity: 0 !important;
    width: 1px !important;
    padding: 0 !important;
    height: 24px !important;
    transform: rotate(0deg) !important;
  }
  .pso-tree__node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    &:hover {
      .pso-tree__node-btns {
        opacity: 1;
        transition: all 0.2s ease-in-out;
      }
    }
    > span {
      display: flex;
      align-items: center;
    }
    .pso-tree__node-title {
      > img {
        height: 20px;
        width: 20px;
        margin-right: 5px;
      }
      > span {
        font-size: 13px;
      }
    }
    .pso-tree__node-btns {
      padding-right: 10px;
      color: #999;
      opacity: 0;
      transition: all 0.2s ease-in-out;
      &.show {
        opacity: 1;
        transition: all 0.2s ease-in-out;
      }
    }
  }
  .pso-tree__search {
    i {
      margin-right: 5px;
    }
    @{deep} {
      .mu-input {
        margin-bottom: 0;
        width: 100%;
      }
      .mu-input__focus {
        color: @main-color;
      }
    }
  }
}
</style>