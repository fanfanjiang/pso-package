<template>
  <div class="formula-designer">
    <div class="formula-designer__menu">
      <div class="formula-designer__menu-header">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="公式" name="formula" v-if="formulable"></el-tab-pane>
          <el-tab-pane label="字段" name="field"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="formula-designer__menu-body">
        <div class="formula-designer__formula" v-if="formulable" v-show="activeTab==='formula'">
          <el-collapse v-model="activeFormula">
            <el-collapse-item
              v-for="f in FORMULA_LIST"
              :title="f.name"
              :name="f.name"
              :key="f.name"
            >
              <el-tooltip
                popper-class="formula-tooltip"
                v-for="item in f.list"
                :visible-arrow="false"
                effect="dark"
                :key="item.id"
                placement="right"
              >
                <div slot="content" class="formula-designer__formula-tip">
                  <div>{{item.input}}</div>
                  <div v-html="item.example"></div>
                </div>
                <div class="formula-designer__formula-item" @click="handleClickFormula(item)">
                  <p>{{item.id}}</p>
                  <p>{{item.info}}</p>
                </div>
              </el-tooltip>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="formula-designer__field" v-show="activeTab==='field'">
          <div
            class="formula-designer__field-item"
            v-for="(cpnt,index) in cpnts"
            :key="index"
            @click="handleClickCpnt(cpnt)"
          >
            <div>{{cpnt.fieldDisplay||cpnt._fieldName}}</div>
            <div>{{getCPNT(cpnt).name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="formula-designer__body">
      <div class="formula-designer__body__header">
        <i class="el-icon-info"></i>在左侧点击选择函数或字段变量，且在英文输入法下编辑
      </div>
      <div class="formula-designer__body__content">
        <codemirror
          ref="codemirror"
          :options="cmOptions"
          v-model="code"
          @changes="handleCodeChange"
          @key-handled="handleKey"
        />
      </div>
      <div class="formula-designer__body__footer">
        <div class="formula-designer__test">
          <div v-if="example">示例：{{example}}</div>
          <div v-if="example">结果：{{result}}</div>
        </div>
        <div>
          <el-button type="text" size="small" @click="handleTest">测试</el-button>
          <el-button type="text" size="small" @click="$emit('cancel')">取消</el-button>
          <el-button type="primary" size="small" @click="confirm">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { FORMULA, FORMULA_LIST } from "../../const/formula";
import { CPNT } from "../../const/form";
import { codemirror } from "vue-codemirror";
import CodeMirror from "codemirror/lib/codemirror.js";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
const FORMULA_KEY = Object.keys(FORMULA);
const formulajs = require("@handsontable/formulajs");
import dayjs from "dayjs";

export default {
  components: { codemirror },
  props: {
    cpnts: Array,
    value: String,
    formulable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      FORMULA_LIST: FORMULA_LIST,
      activeTab: "formula",
      activeFormula: "",
      code: "",
      mirrorCursor: {
        cursorHeight: 0.8,
      },
      cmOptions: {
        lineWrapping: true,
        extraKeys: { Ctrl: "autocomplete" },
        hintOptions: {
          hint: this.handleHint,
          completeSingle: false,
        },
      },
      showHint: true,
      example: "",
      result: "",
    };
  },
  computed: {
    codeRef() {
      return this.$refs.codemirror.codemirror;
    },
  },
  created() {
    Object.keys(formulajs).forEach((key) => {
      window[key] = formulajs[key];
    });
    if (!this.formulable) {
      this.activeTab = "field";
    }
  },
  mounted() {
    if (this.value) {
      this.code = this.value;
      this.$nextTick(() => this.decorate());
    }
  },
  methods: {
    handleTest() {
      try {
        let codeCopy = this.code;
        this.cpnts.forEach((item) => {
          let tempVal;
          switch (item._fieldRealType) {
            case "decimal":
              tempVal = _.random(100);
              break;
            case "datetime":
              tempVal = dayjs().format("YYYY-MM-DD");
            case "string":
              tempVal = "123";
              break;
          }
          codeCopy = codeCopy.replace(new RegExp(`@${item.fid}@`, "g"), tempVal);
        });
        this.example = codeCopy;
        this.result = eval(codeCopy);
      } catch (error) {
        this.result = error;
        this.$message({ message: "公式错误", type: "warning" });
      }
    },
    confirm() {
      this.$emit("confirm", this.code);
    },
    getCPNT(cpnt) {
      return CPNT[cpnt.componentid];
    },
    handleClickFormula(formula) {
      const codeRef = this.codeRef;
      codeRef.replaceSelection(`${formula.id}()`);
      const cursor = codeRef.getCursor();
      codeRef.setCursor({ line: cursor.line, ch: cursor.ch + formula.cursorLocation });
      codeRef.focus();
    },
    decorate() {
      const codeRef = this.codeRef;

      let n = 0;
      const matches = [];
      codeRef.eachLine((line) => {
        const reg = /@[0-9a-zA-Z-_]+@/g;
        while (true) {
          const match = reg.exec(line.text);
          if (!match) break;
          matches.push({ n, match });
        }
        n++;
      });
      for (let { n, match } of matches) {
        const cpnt = _.find(this.cpnts, { fid: match[0].replace(/@/g, "") });
        if (cpnt) {
          codeRef.markText(
            { line: n, ch: match.index },
            { line: n, ch: match.index + match[0].length },
            {
              replacedWith: $(
                `<span class="code-widget"><span>${cpnt.fieldDisplay || cpnt._fieldName}</span><span>${cpnt._defaultValue}</span></span>`
              )[0],
              selectLeft: true,
              selectRight: true,
            }
          );
        }
      }
    },
    handleClickCpnt(cpnt) {
      const codeRef = this.codeRef;
      this.mirrorCursor = codeRef.getCursor();
      const text = `@${cpnt.fid}@`;
      codeRef.replaceSelection(text);
      codeRef.markText(
        this.mirrorCursor,
        { line: this.mirrorCursor.line, ch: this.mirrorCursor.ch + text.length },
        {
          replacedWith: $(
            `<span class="code-widget"><span>${cpnt.fieldDisplay || cpnt._fieldName}</span><span>${cpnt._defaultValue}</span></span>`
          )[0],
          selectLeft: true,
          selectRight: true,
          handleMouseEvents: true,
        }
      );
      this.mirrorCursor = codeRef.getCursor();
      codeRef.focus();
    },
    getLastIgnore(char) {
      let index = key.toLowerCase().lastIndexOf(curChar);
      if (index === -1) {
        index = key.lastIndexOf(curChar);
      }
      return index;
    },
    handleHint(editor) {
      const list = [];
      const cur = editor.getCursor();
      const curLine = editor.getLine(cur.line);
      let end = cur.ch;
      let start = end;

      let match = "";
      let matching;
      do {
        let curChar = curLine.charAt(start - 1);
        if (/[a-zA-Z]/.test(curChar)) {
          match = curChar + match;
          matching = true;
          start--;
        } else {
          matching = false;
        }
      } while (matching);

      if (match) {
        const reg = new RegExp(`^${match}`, "i");
        for (let key of FORMULA_KEY) {
          if (reg.test(key)) list.push(key);
        }
      }
      return { list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end) };
    },
    handleCodeChange() {
      if (!this.showHint) return (this.showHint = true);
      this.codeRef.closeHint();
      this.codeRef.showHint();
    },
    handleKey(editor, key) {
      this.showHint = !(key === "Enter");
    },
  },
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.formula-designer {
  position: relative;
  display: flex;
  height: 100%;
  @{deep} {
    .CodeMirror-line {
      line-height: 24px !important;
    }
    .vue-codemirror {
      height: 100%;
      width: 100%;
    }
    .CodeMirror {
      height: 100% !important;
      width: 100%;
      border-radius: 0;
      border: none;
    }
    .code-widget {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      background: #fd8647;
      color: #fff;
      margin: 0 4px;
      border-radius: 3px;
      padding: 0 8px;
      font-size: 13px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
  .formula-designer__menu {
    width: 240px;
    height: 100%;
    position: relative;
    .formula-designer__menu-header {
      padding: 0 15px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .formula-designer__menu-body {
      padding: 0 0 0 10px;
      margin-top: 40px;
      overflow-y: scroll;
      height: 100%;
    }
  }
  .formula-designer__body {
    flex: 1;
    position: relative;
    height: 100%;
    width: calc(100% - 240px);
    border-left: 1px solid #ebeef5;
    .formula-designer__body__header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      font-size: 13px;
      color: #949393;
      border-bottom: 1px solid #ebeef5;
      line-height: 40px;
      margin: 0 10px;
      i {
        margin-right: 5px;
      }
    }
    .formula-designer__body__content {
      height: 100%;
      padding: 40px 0px 60px 10px;
    }
    .formula-designer__body__footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-shadow: 8px 0px 12px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
.formula-designer__test {
  div {
    font-size: 12px;
  }
}
.formula-designer__field-item {
  cursor: pointer;
  padding: 5px;
  border-top: 1px solid #ebeef5;
  > div:first-child {
    font-size: 14px;
    color: #fd8647;
    margin-bottom: 5px;
  }
  > div:last-child {
    font-size: 12px;
    color: #949393;
  }
}
.formula-designer__formula-item {
  cursor: pointer;
  & + .formula-designer__formula-item {
    margin-top: 8px;
  }
  p {
    margin: 0;
    &:first-child {
      margin-bottom: 0px;
      color: #fd8647;
    }
    &:last-child {
      color: #999;
      font-size: 12px;
    }
  }
}
</style>
<style lang="less">
.formula-tooltip {
  background-color: #fff !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .formula-designer__formula-tip {
    color: #666;
    div {
      &:first-child {
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 5px;
      }
      & + div {
        margin-top: 10px;
      }
    }
  }
}
.CodeMirror-hints {
  z-index: 99999999;
}
</style>