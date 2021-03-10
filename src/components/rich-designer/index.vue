<template>
  <div class="wf-table-editor">
    <div class="wf-table-editor__menu-wrapper">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive, getMarkAttrs }">
        <div class="wf-table-editor__menu">
          <div class="wf-table-editor__menu-header">
            <span>操作</span>
            <span>{{ selectedOp }}</span>
          </div>
          <el-select
            size="small"
            filterable
            v-model="fieldValue"
            placeholder="插入字段"
            @change="setField(commands)"
            @focus="selectedOp = '插入工作表字段'"
          >
            <el-option v-for="(o, i) in options" :key="i" :label="o.displayName || o._fieldName" :value="o._fieldValue"></el-option>
          </el-select>
          <div class="wf-table-editor__icon">
            <editor-menu-item
              v-for="(menuItem, i) of menu"
              :key="i"
              :type="menuItem.type"
              :tip="menuItem.tip"
              :src="menuItem.src"
              :isActive="
                menuItem.type === 'align'
                  ? getMarkAttrs('align').textAlign === menuItem.src
                  : isActive[menuItem.type] && isActive[menuItem.type](menuItem.params || {})
              "
              @click="commands[menuItem.method || menuItem.type](menuItem.params || {})"
              @hover="selectedOp = menuItem.tip"
              @mouseenter="selectedOp = menuItem.tip"
              @mouseleave="selectedOp = ''"
            ></editor-menu-item>
            <transition-group name="el-zoom-in-top">
              <template v-if="isActive.table()">
                <editor-menu-item
                  v-for="menuItem of tableMenu"
                  :key="menuItem.type"
                  :type="menuItem.type"
                  :tip="menuItem.tip"
                  :src="menuItem.src"
                  :isActive="isActive[menuItem.type] && isActive[menuItem.type](menuItem.params || {})"
                  @click="commands[menuItem.method || menuItem.type](menuItem.params || {})"
                  @mouseenter="selectedOp = menuItem.tip"
                  @mouseleave="selectedOp = ''"
                ></editor-menu-item>
              </template>
            </transition-group>
          </div>
        </div>
      </editor-menu-bar>
      <div class="wf-table-editor__common" v-if="curNode">
        <el-select size="small" filterable clearable v-model="curNode.attrs.compareto" placeholder="对比标红">
          <el-option v-for="(o, i) in options" :key="i" :label="o.displayName || o._fieldName" :value="o._fieldValue"></el-option>
        </el-select>
      </div>
      <div class="wf-table-editor__table" v-if="asstableNode">
        <el-divider>关联表配置</el-divider>
        <div>
          <el-select size="mini" v-model="asstableNode.attrs.display" placeholder="展示方式">
            <el-option label="表格" value="table"></el-option>
            <el-option label="脚本" value="script"></el-option>
          </el-select>
        </div>
        <div style="margin-top: 15px" v-if="asstableNode.attrs.display === 'table'">
          <el-switch
            size="mini"
            v-model="asstableNode.attrs.sequence"
            active-value="1"
            inactive-value="0"
            active-text="显示序号"
            inactive-text="不显示"
          ></el-switch>
        </div>
        <div class="wf-table-editor__table-btn">
          <el-button v-if="asstableNode.attrs.display === 'script'" type="primary" size="mini" @click="showDesigner = true"
            >设置脚本</el-button
          >
        </div>
        <div style="margin-top: 15px">
          <el-switch
            size="mini"
            v-model="asstableNode.attrs.direction"
            active-value="1"
            inactive-value="0"
            active-text="纵向表格"
            inactive-text="横向表格"
          ></el-switch>
        </div>
      </div>
    </div>
    <div class="wf-table-editor__save" v-if="saveButton">
      <el-button type="primary" size="mini" round :loading="saving" @click="saveHandler">保存主体</el-button>
    </div>
    <div class="wf-table-editor__content">
      <div :style="contentStyle">
        <editor-content :editor="editor" v-if="editor" />
      </div>
    </div>
    <transition name="el-zoom-in-top">
      <div class="wf-table-editor__review" v-if="fieldNode">
        <div class="wf-table-editor__review-header">审核展示配置</div>
        <codemirror ref="codemirror" v-model="fieldNode.attrs.format" @blur="blurHandler" @focus="showDrop = true" />
        <transition name="el-zoom-in-top">
          <ul class="dropdown" v-show="showDrop">
            <li v-for="item in reviewLogField" :key="item.id" @click="dropClickHandler(item)">{{ item.name }}</li>
          </ul>
        </transition>
      </div>
    </transition>
    <pso-drawer v-if="asstableNode" size="50%" :visible="showDesigner" title="设计脚本" @close="showDesigner = false">
      <template v-slot:whole>
        <formula-designer
          v-if="asstableNode"
          :value="asstableNode.attrs.format"
          :cpnts="tableCpnt[asstableNode.attrs.field]"
          @cancel="showDesigner = false"
          @confirm="confirmScript"
        ></formula-designer>
      </template>
    </pso-drawer>
  </div>
</template>
<script>
import { REVIEW_LOG_FORMAT } from "../../const/workflow";

import { Editor, EditorContent, EditorFloatingMenu, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
} from "tiptap-extensions";

import FieldNode from "./field-node";
import Align from "./align";
import PermissionEntries from "./permission-entries";

import EditorMenuItem from "./menu-item";
import FormulaDesigner from "../form-designer/formula-designer";
import { formOp } from "../form-designer/mixin";

export default {
  components: { EditorMenuItem, EditorContent, EditorMenuBar, EditorFloatingMenu, FormulaDesigner },
  componentName: "RichDesigner",
  mixins: [formOp],
  props: {
    content: {
      type: String,
      default: "",
    },
    reviews: {
      type: Array,
      default: [],
    },
    options: {
      type: Array,
      default: [],
    },
    saveButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      saving: false,
      showDesigner: false,
      selectedOp: "",
      editor: null,
      menu: [
        {
          type: "bold",
          tip: "加粗",
        },
        {
          type: "italic",
          tip: "斜体",
        },
        {
          type: "strike",
          tip: "删除线",
        },
        {
          type: "underline",
          tip: "下划线",
        },
        {
          type: "paragraph",
          tip: "段落文本",
        },
        {
          type: "align",
          tip: "居左",
          src: "left",
          params: { textAlign: "left" },
        },
        {
          type: "align",
          tip: "居中",
          src: "center",
          params: { textAlign: "center" },
        },
        {
          type: "align",
          tip: "居右",
          src: "right",
          params: { textAlign: "right" },
        },
        {
          type: "heading",
          tip: "h1",
          src: "h1",
          params: { level: 1 },
        },
        {
          type: "heading",
          tip: "h2",
          src: "h2",
          params: { level: 2 },
        },
        {
          type: "heading",
          tip: "h3",
          src: "h3",
          params: { level: 3 },
        },
        {
          type: "heading",
          tip: "h4",
          src: "h4",
          params: { level: 4 },
        },
        {
          type: "heading",
          tip: "h5",
          src: "h5",
          params: { level: 5 },
        },
        {
          type: "bullet_list",
          tip: "无序列表",
        },
        {
          type: "ordered_list",
          tip: "有序列表",
        },
        {
          type: "blockquote",
          tip: "引用",
        },
        {
          type: "table",
          tip: "表格",
          method: "createTable",
          params: { rowsCount: 3, colsCount: 3, withHeaderRow: false },
        },
        {
          type: "undo",
          tip: "回退",
        },
        {
          type: "redo",
          tip: "前进",
        },
      ],
      tableMenu: [
        {
          type: "deleteTable",
          tip: "删除表格",
        },
        {
          type: "addColumnBefore",
          tip: "左插列",
        },
        {
          type: "addColumnAfter",
          tip: "右插列",
        },
        {
          type: "deleteColumn",
          tip: "删除列",
        },
        {
          type: "addRowBefore",
          tip: "上插行",
        },
        {
          type: "addRowAfter",
          tip: "下插行",
        },
        {
          type: "deleteRow",
          tip: "删除行",
        },
        {
          type: "toggleCellMerge",
          tip: "合并单元格",
        },
      ],
      fieldValue: "",
      fieldNode: null,
      asstableNode: null,
      tableCpnt: {},
      showDrop: false,
      mirrorCursor: {
        cursorHeight: 0.8,
      },
      coding: false,
      reviewLogField: REVIEW_LOG_FORMAT,
      curNode: null,
    };
  },
  computed: {
    contentStyle() {
      return {
        "margin-top": this.fieldNode ? "140px" : "0px",
      };
    },
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new Table({
          resizable: true,
        }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new FieldNode(),
        new Align(),
        new PermissionEntries(),
      ],
      content: this.content,
    });
  },
  created() {
    this.$on("field-click", async (node) => {
      this.curNode = node;
      let reviewNode;
      this.reviews.forEach(({ target }) => {
        if (target.nid === node.attrs.field) {
          reviewNode = node;
        }
      });
      if (reviewNode) {
        this.fieldNode = reviewNode;
        this.$nextTick(() => this.decorate());
      } else {
        const cpnt = _.find(this.options, { _fieldValue: node.attrs.field });
        if (cpnt.componentid === "asstable") {
          this.asstableNode = node;
          if (!this.tableCpnt[node.attrs.field]) {
            const store = await this.makeFormStore(cpnt._option);
            this.tableCpnt[node.attrs.field] = store.search({
              onlyData: true,
              onlyMain: true,
              options: { db: true },
            });
          }
        } else {
          this.asstableNode = null;
        }
        this.fieldNode = null;
      }
    });
  },
  methods: {
    setField(commands) {
      const cpnt = _.find(this.options, { _fieldValue: this.fieldValue });
      commands.createField({
        name: cpnt.displayName || cpnt._fieldName,
        value: this.fieldValue,
        format: "",
        display: "",
        sequence: "",
        compareto: "",
      });
      this.fieldValue = "";
    },
    exportHtml() {
      return this.editor.getHTML();
    },
    blurHandler() {
      setTimeout(() => {
        if (this.coding) return (this.coding = false);
        this.showDrop = false;
      }, 150);
    },
    dropClickHandler(log) {
      this.coding = true;
      this.mirrorCursor = this.$refs.codemirror.codemirror.getCursor();
      const text = `${log.id}`;
      this.$refs.codemirror.codemirror.replaceSelection(text);
      this.$refs.codemirror.codemirror.markText(
        this.mirrorCursor,
        { line: this.mirrorCursor.line, ch: this.mirrorCursor.ch + text.length },
        {
          replacedWith: $(`<span class="code-log">${log.name}</span>`)[0],
          selectLeft: true,
          selectRight: true,
        }
      );
      this.mirrorCursor = this.$refs.codemirror.codemirror.getCursor();
      this.$refs.codemirror.codemirror.focus();
    },
    decorate() {
      let n = 0;
      const matches = [];
      this.$refs.codemirror.codemirror.eachLine((line) => {
        const reg = /#[0-9a-zA-Z-_]+#/g;
        while (true) {
          const match = reg.exec(line.text);
          if (!match) break;
          matches.push({ n, match });
        }
        n++;
      });
      for (let { n, match } of matches) {
        const log = _.find(REVIEW_LOG_FORMAT, { id: match[0] });
        if (log) {
          this.$refs.codemirror.codemirror.markText(
            { line: n, ch: match.index },
            { line: n, ch: match.index + match[0].length },
            {
              replacedWith: $(`<span class="code-log">${log.name}</span>`)[0],
              selectLeft: true,
              selectRight: true,
            }
          );
        }
      }
    },
    async saveHandler() {
      this.$emit("save", this.exportHtml());
    },
    confirmScript(val) {
      this.asstableNode.attrs.format = val;
      this.showDesigner = false;
    },
  },
  beforeDestroy() {
    try {
      this.editor.destroy();
    } catch (error) {}
  },
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
@import "../../assets/less/mixins/mixins";

.wf-table-editor {
  position: relative;
  height: 100%;
  .wf-table-editor__save {
    position: absolute;
    left: 20px;
    bottom: 20px;
    z-index: 2;
  }
  .wf-table-editor__menu-wrapper {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 2;
    box-shadow: 4px 4px 10px 0 rgba(25, 30, 40, 0.1);
    text-align: center;
    background-color: #fff;
    .wf-table-editor__menu-header {
      padding: 10px 20px;
      margin-bottom: 10px;
      background-color: #fd8647;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .wf-table-editor__menu {
      background-color: #fff;
      width: 220px;
      .wf-table-editor__icon {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        transition: all 0.3s ease-in-out;
        > span {
          display: flex;
          flex-wrap: wrap;
          transition: all 0.3s ease-in-out;
        }
      }
    }
  }
  .wf-table-editor__content {
    min-height: 100%;
    width: calc(100% - 244px);
    padding: 20px;
    margin-left: 240px;
    position: relative;
    z-index: 1;
  }

  @{deep} {
    span[field] {
      background-color: @main-color;
      color: #fff;
      font-size: 13px;
      border-radius: 6px;
      height: 24px;
      display: inline-block;
      line-height: 24px;
      text-align: center;
      letter-spacing: 2px;
      padding: 0 5px;
    }

    span[permission] {
      background-color: #fb2d27;
      color: #fff;
      font-size: 13px;
      border-radius: 6px;
      height: 24px;
      display: inline-block;
      line-height: 24px;
      text-align: center;
      letter-spacing: 2px;
      padding: 0 5px;
    }

    .el-select {
      & + .el-select {
        margin-top: 20px;
      }
    }

    .tableWrapper {
      margin: 1em 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }

    .ProseMirror {
      padding: 20px;
      background-color: #fff;
      box-shadow: 10px 10px 20px 0 rgba(25, 30, 40, 0.2);
      .richEditor();
    }
  }
}

//审核操作
.wf-table-editor__review {
  position: absolute;
  left: 260px;
  top: 20px;
  width: calc(100% - 278px);
  z-index: 3;
  .wf-table-editor__review-header {
    padding: 10px 20px;
    background-color: #fd8647;
    color: #fff;
    display: flex;
    align-items: center;
  }
}
@{deep} {
  .CodeMirror-line {
    line-height: 24px !important;
  }
  .CodeMirror {
    height: 80px !important;
    text-align: left;
    font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  }
  .CodeMirror-widget {
    margin: 0 2px;
  }
  .code-log {
    background-color: #fd8647;
    color: #fff;
    font-size: 12px;
    padding: 0 10px;
    border-radius: 14px;
    margin: 0 2px;
    display: inline-block;
  }
}
.mirror-wrapper {
  position: relative;
}
.dropdown {
  position: absolute;
  top: 120px;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  text-align: left;
  > li {
    cursor: pointer;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    &:hover {
      background-color: #fd8647;
      color: #fff;
    }
  }
}

.wf-table-editor__common,
.wf-table-editor__table {
  padding: 0 0 15px 0;
  .wf-table-editor__table-btn {
    text-align: left;
    padding-left: 16px;
    margin-top: 15px;
  }
}
</style>