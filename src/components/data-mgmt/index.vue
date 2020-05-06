<template>
  <div class="pso-data-mgmt">
    <div class="pso-data-mgmt__tree" v-bar>
      <div>
        <pso-tree-common
          ref="tree"
          :request-options="treeOptions"
          :default-node-data="defaultNodeData"
          :auto-edit="false"
          @before-node-new="showWorksheetSelector=true"
          @after-node-new="newNode"
          @node-click="nodeClickHandler"
        ></pso-tree-common>
      </div>
    </div>
    <div class="pso-data-mgmt__content" v-bar>
      <div class="pso-dd">
        <div class="pso-dd-header">
          <div class="pso-dd-header__title">工作表：{{dataDesign.selected.node_name}}</div>
          <div class="pso-dd-header__btns">
            <el-button size="small" type="primary" plain @click="editForm">编辑表单</el-button>
          </div>
        </div>
        <div class="pso-dd-tab">
          <el-tabs v-model="dataDesign.selected.tabName" @tab-click="handleTabClick">
            <el-tab-pane label="数据预览" name="preview"></el-tab-pane>
            <el-tab-pane label="字段预览" name="field"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-dd-body">
          <preview-section v-if="dataDesign.selected.tabName==='preview'"></preview-section>
          <field-section v-if="dataDesign.selected.tabName==='field'" :edit="false"></field-section>
        </div>
      </div>
    </div>
    <el-dialog
      title="选择工作表类型"
      width="30%"
      custom-class="worksheet-dialog"
      :append-to-body="true"
      :center="true"
      :visible.sync="showWorksheetSelector"
    >
      <div class="pso-worksheet-menu">
        <div class="pso-worksheet-menu__tip">{{curWsMenu.tip}}</div>
        <div class="pso-worksheet-menu__list">
          <div
            :class="[{'pso-worksheet-menu__item':true,'active':curWsMenu===item}]"
            @mouseenter="curWsMenu=item"
            @mouseleave="curWsMenu={}"
            @click="newSheet(item)"
            v-for="(item,index) in worksheetMenu"
            :key="index"
          >
            <img :src="curWsMenu===item?item.icon[1]:item.icon[0]" :alt="item.name" />
            <span>{{item.name}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { DD_DATA_SET } from "@/store/mutation-types";

import DataDesignForm from "@/components/dataDesign/form";
import DataDesignExcel from "@/components/dataDesign/excel";
import DataDesignXml from "@/components/dataDesign/xml";
import DataDesignSql from "@/components/dataDesign/sql";
import { SHEET_MENU } from "./const.js";

export default {
  components: { DataDesignForm, DataDesignExcel, DataDesignXml, DataDesignSql },
  props: ["appid", "treeOptions"],
  data() {
    return {
      key: 0,
      worksheetMenu: SHEET_MENU,
      showWorksheetSelector: false,
      curWsMenu: {},
      defaultNodeData: {
        data_type: this.treeOptions.data_type,
        node_dimen: this.treeOptions.node_dimen
      },
      curNode: null
    };
  },
  computed: {
    ...mapState(["dataDesign"]),
    current() {
      return `data-design-${this.dataDesign.selected.data_type}`;
    }
  },
  watch: {
    "dataDesign.selected"() {
      this.key++;
    }
  },
  created() {
    this.$store.commit(DD_DATA_SET, { appid: this.appid });
  },
  methods: {
    async newSheet(sheet) {
      const { id } = sheet;
      if (id === "form") {
        this.$router.push({
          name: "formDesigner",
          query: { pid: this.$refs.tree.nodePayload.parent.data.node_id, appid: this.dataDesign.appid }
        });
      }
      if (id === "excel" || id === "xml") {
        this.$refs.tree.setNodePayload({
          parentNode: this.$refs.tree.nodePayload.parentNode,
          node: { data: { data_type: "form", is_leaf: 1 } },
          show: true
        });
      }
    },
    setSelect(data, tab = "preview") {
      this.$set(data, "tabName", tab);
      this.$store.commit(DD_DATA_SET, { selected: data });
    },
    nodeClickHandler(data) {
      data.is_leaf && this.setSelect(data);
    },
    newNode(data) {
      this.setSelect(data, "field");
      this.showWorksheetSelector = false;
    }
  }
};
</script>
<style lang="less">
@import "~@/assets/less/component/data-mgmt.less";
</style>
