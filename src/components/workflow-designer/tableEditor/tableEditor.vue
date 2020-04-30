<template>
  <div class="wf-table-editor">
    <div class="wf-table-editor__menu-wrapper">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive, getMarkAttrs}">
        <div class="wf-table-editor__menu">
          <div class="wf-table-editor__menu-header">
            <span>操作</span>
            <span>{{selectedOp}}</span>
          </div>
          <el-select
            size="small"
            filterable
            v-model="fieldValue"
            placeholder="插入字段"
            @change="setField(commands)"
            @focus="selectedOp='插入工作表字段'"
          >
            <el-option
              v-for="item in options"
              :key="item._fieldValue"
              :label="item.displayName||item._fieldName"
              :value="item._fieldValue"
            ></el-option>
          </el-select>
          <el-select
            size="small"
            filterable
            v-model="perEntryVal"
            placeholder="插入权限项"
            @change="setPermission(commands)"
            @focus="selectedOp='插入权限项'"
          >
            <el-option
              v-for="item in workflowEditor.permissionEntries"
              :key="item.body_id"
              :label="item.body_name"
              :value="item.body_id"
            ></el-option>
          </el-select>
          <div class="wf-table-editor__icon">
            <editor-menu-item
              v-for="menuItem of menu"
              :key="menuItem.type"
              :type="menuItem.type"
              :tip="menuItem.tip"
              :src="menuItem.src"
              :isActive="menuItem.type==='align'?(getMarkAttrs('align').textAlign === menuItem.src):(isActive[menuItem.type]&&isActive[menuItem.type](menuItem.params||{}))"
              @click="commands[menuItem.method||menuItem.type](menuItem.params||{})"
              @hover="selectedOp=menuItem.tip"
              @mouseenter="selectedOp=menuItem.tip"
              @mouseleave="selectedOp=''"
            ></editor-menu-item>
            <transition-group name="el-zoom-in-top">
              <template v-if="isActive.table()">
                <editor-menu-item
                  v-for="menuItem of tableMenu"
                  :key="menuItem.type"
                  :type="menuItem.type"
                  :tip="menuItem.tip"
                  :src="menuItem.src"
                  :isActive="isActive[menuItem.type]&&isActive[menuItem.type](menuItem.params||{})"
                  @click="commands[menuItem.method||menuItem.type](menuItem.params||{})"
                  @mouseenter="selectedOp=menuItem.tip"
                  @mouseleave="selectedOp=''"
                ></editor-menu-item>
              </template>
            </transition-group>
          </div>
        </div>
      </editor-menu-bar>
    </div>
    <div class="wf-table-editor__save" v-if="workflowEditor.wfCode">
      <el-button type="primary" size="mini" round :loading="saving" @click="saveHandler">保存主体</el-button>
    </div>
    <div class="wf-table-editor__content" :style="contentStyle">
      <editor-content :editor="editor" />
    </div>
    <transition name="el-zoom-in-top">
      <div class="wf-table-editor__review" v-if="fieldNode">
        <div class="wf-table-editor__review-header">审核展示配置</div>
        <codemirror
          ref="codemirror"
          v-model="fieldNode.attrs.format"
          @blur="blurHandler"
          @focus="showDrop = true"
        />
        <transition name="el-zoom-in-top">
          <ul class="dropdown" v-show="showDrop">
            <li
              v-for="item in reviewLogField"
              :key="item.id"
              @click="dropClickHandler(item)"
            >{{item.name}}</li>
          </ul>
        </transition>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { genComponentData } from "@/components/form-designer/helper/index.js";
import { WF_FIND_NODE } from "@/store/mutation-types";
import { REVIEW_LOG_FORMAT } from "@/const/workflow";

import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";

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
  TableRow
} from "tiptap-extensions";

import FieldNode from "./fieldNode";
import Align from "./align";
import PermissionEntries from "./permissionEntries";

import EditorMenuItem from "./menuItem";

export default {
  components: { EditorMenuItem, EditorContent, EditorMenuBar, EditorFloatingMenu, codemirror },
  componentName: "PsoWfEditorTable",
  data() {
    return {
      saving: false,
      selectedOp: "",
      editor: null,
      menu: [
        {
          type: "bold",
          tip: "加粗"
        },
        {
          type: "italic",
          tip: "斜体"
        },
        {
          type: "strike",
          tip: "删除线"
        },
        {
          type: "underline",
          tip: "下划线"
        },
        {
          type: "paragraph",
          tip: "段落文本"
        },
        {
          type: "align",
          tip: "居左",
          src: "left",
          params: { textAlign: "left" }
        },
        {
          type: "align",
          tip: "居中",
          src: "center",
          params: { textAlign: "center" }
        },
        {
          type: "align",
          tip: "居右",
          src: "right",
          params: { textAlign: "right" }
        },
        {
          type: "heading",
          tip: "h1",
          src: "h1",
          params: { level: 1 }
        },
        {
          type: "heading",
          tip: "h2",
          src: "h2",
          params: { level: 2 }
        },
        {
          type: "heading",
          tip: "h3",
          src: "h3",
          params: { level: 3 }
        },
        {
          type: "heading",
          tip: "h4",
          src: "h4",
          params: { level: 4 }
        },
        {
          type: "heading",
          tip: "h5",
          src: "h5",
          params: { level: 5 }
        },
        {
          type: "bullet_list",
          tip: "无序列表"
        },
        {
          type: "ordered_list",
          tip: "有序列表"
        },
        {
          type: "blockquote",
          tip: "引用"
        },
        {
          type: "table",
          tip: "表格",
          method: "createTable",
          params: { rowsCount: 3, colsCount: 3, withHeaderRow: false }
        },
        {
          type: "undo",
          tip: "回退"
        },
        {
          type: "redo",
          tip: "前进"
        }
      ],
      tableMenu: [
        {
          type: "deleteTable",
          tip: "删除表格"
        },
        {
          type: "addColumnBefore",
          tip: "左插列"
        },
        {
          type: "addColumnAfter",
          tip: "右插列"
        },
        {
          type: "deleteColumn",
          tip: "删除列"
        },
        {
          type: "addRowBefore",
          tip: "上插行"
        },
        {
          type: "addRowAfter",
          tip: "下插行"
        },
        {
          type: "deleteRow",
          tip: "删除行"
        },
        {
          type: "toggleCellMerge",
          tip: "合并单元格"
        }
      ],
      fieldValue: "",
      perEntryVal: "",
      fieldNode: null,
      showDrop: false,
      mirrorCursor: {
        cursorHeight: 0.8
      },
      coding: false,
      reviewLogField: REVIEW_LOG_FORMAT
    };
  },
  computed: {
    ...mapState(["workflowEditor"]),
    contentStyle() {
      return {
        "margin-top": this.fieldNode ? "140px" : "0px"
      };
    },
    reviewList() {
      const formStore = this.workflowEditor.formStore;
      if (formStore && formStore.search) {
        return this.$store.getters[WF_FIND_NODE]({ options: { tid: "review" } });
      }
      return [];
    },
    options() {
      const formStore = this.workflowEditor.formStore;
      let list = [];
      if (formStore && formStore.search) {
        const formRet = formStore.search({
          onlyData: true,
          onlyMain: true,
          options: { db: true },
          beforePush: item => {
            item.data.displayName = `[${item.CPNT.name}]${item.data._fieldName}`;
            return true;
          }
        });
        list = list.concat(formRet);
      }

      //添加系统字段
      list = list.concat([
        genComponentData({ _fieldValue: "wf_ctime", _fieldName: "[系统]创建时间", componentid: "time" }),
        genComponentData({ _fieldValue: "wf_creator", _fieldName: "[系统]创建人", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_fileCode", _fieldName: "[系统]流程编号", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_import", _fieldName: "[系统]重要等级", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_secret", _fieldName: "[系统]秘密等级", componentid: "text" }),
        genComponentData({ _fieldValue: "wf_urgent", _fieldName: "[系统]加急程度", componentid: "text" })
      ]);

      this.reviewList.forEach(({ target }) => {
        list.push(genComponentData({ _fieldValue: target.nid, _fieldName: `[审核意见]${target.name}`, componentid: "text" }));
      });

      return list;
    }
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
          resizable: true
        }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new FieldNode(),
        new Align(),
        new PermissionEntries()
      ],
      content: this.workflowEditor.tableContent
    });
  },
  created() {
    this.$on("field-click", node => {
      let reviewNode;
      this.reviewList.forEach(({ target }) => {
        if (target.nid === node.attrs.field) {
          reviewNode = node;
        }
      });
      if (reviewNode) {
        this.fieldNode = reviewNode;
        this.$nextTick(() => this.decorate());
      } else {
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
        format: ""
      });
      this.fieldValue = "";
    },
    setPermission(commands) {
      commands.createPermission({
        name: _.find(this.workflowEditor.permissionEntries, { body_id: this.perEntryVal }).body_name,
        value: this.perEntryVal
      });
      this.perEntryVal = "";
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
          selectRight: true
        }
      );
      this.mirrorCursor = this.$refs.codemirror.codemirror.getCursor();
      this.$refs.codemirror.codemirror.focus();
    },
    decorate() {
      let n = 0;
      const matches = [];
      this.$refs.codemirror.codemirror.eachLine(line => {
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
              selectRight: true
            }
          );
        }
      }
    },
    async saveHandler() {
      this.saving = true;
      const ret = await this.API.updateWfTable({ wf_code: this.workflowEditor.wfCode, wf_body_tp: this.exportHtml() });
      this.saving = false;
      this.$notify({ title: ret.success ? "保存成功" : "保存失败", type: ret.success ? "success" : "warning" });
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable";
@import "~@/assets/less/mixins/mixins";

.wf-table-editor {
  position: relative;
  height: 100%;
  .wf-table-editor__save {
    position: fixed;
    right: 20px;
    top: 70px;
    z-index: 2;
  }
  .wf-table-editor__menu-wrapper {
    position: fixed;
    left: 20px;
    top: 70px;
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
    width: calc(100% - 224px);
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
  position: fixed;
  left: 260px;
  top: 70px;
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
</style>