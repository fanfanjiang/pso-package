<template>
  <div class="pso-tree" :style="treeStyle">
    <div class="pso-tree__header">
      <div class="pso-tree__search" v-if="searchable">
        <mu-text-field v-model="filterText">
          <template v-slot:prepend>
            <i class="el-icon-search"></i>
          </template>
        </mu-text-field>
      </div>
      <div v-if="editMode">
        <el-button
          icon="el-icon-plus"
          size="mini"
          circle
          @click="treeFunHandler('newFolder',{data:{node_id:0}})"
        ></el-button>
      </div>
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
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </slot>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
      <el-popover placement="top-start" width="240" trigger="click" v-if="editMode">
        <div class="pso-tree__trash-body">
          <div class="pso-tree__trash-btns">
            <el-button size="mini" @click="restoreTrash" :disabled="canTrash">还 原</el-button>
            <el-button size="mini" type="danger" @click="emptyTrash" :disabled="canTrash">清 空</el-button>
          </div>
          <el-table
            size="mini"
            :data="trash"
            style="width: 100%"
            @selection-change="handleTrashSelect"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="node_display" label="名称"></el-table-column>
          </el-table>
        </div>
        <div class="pso-tree__trash" slot="reference">
          <i class="el-icon-delete"></i>
        </div>
      </el-popover>
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
            <el-input size="small" v-model="nodePayload.node.data.node_display" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="标签" v-if="nodePayload.node.data.node_pid===0">
            <el-select size="small" v-model="nodePayload.node.data.data_type">
              <el-option
                v-for="item in dimens"
                :key="item.dimen_tag"
                :label="item.tag_name"
                :value="item.dimen_tag"
              ></el-option>
            </el-select>
          </el-form-item>
          <slot v-bind:node="nodePayload.node.data"></slot>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodePayload.showForm = false" size="small">取 消</el-button>
          <el-button
            size="small"
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
