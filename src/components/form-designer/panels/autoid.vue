<template>
  <common-panel :cpnt="cpnt" info="将记录生成一个自动递增的唯一编号" :needPlaceholder="true">
    <el-form-item label="指定编号位数">
      <el-select size="small" v-model="cpnt.data._digit" placeholder="请选择">
        <el-option v-for="item in digit" :key="item" :label="digitName(item)" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="指定日期格式">
      <el-select size="small" v-model="cpnt.data._format" placeholder="请选择">
        <el-option v-for="item in dateFormat" :key="item.v" :label="item.n" :value="item.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设定编号格式">
      <div class="mirror-wrapper">
        <codemirror
          ref="codemirror"
          v-model="cpnt.data._source"
          @blur="blurHandler"
          @focus="focusHandler"
        />
        <transition name="el-zoom-in-top">
          <ul class="dropdown" v-show="showDrop">
            <li v-for="item in options" :key="item.v" @click="dropClickHandler(item)">{{item.n}}</li>
          </ul>
        </transition>
      </div>
      <span>示例：{{sample}}</span>
    </el-form-item>
    <el-form-item label="关联标签字段">
      <el-select v-model="cpnt.data._bind" placeholder="请选择" clearable>
        <el-option
          v-for="item in fieldOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";

import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import dayjs from "dayjs";
import { common } from "../mixin";

export default {
  props: ["cpnt"],
  mixins: [common],
  components: {
    commonPanel,
    codemirror
  },
  data() {
    return {
      digit: ["3", "4", "5", "6"],
      dateFormat: [
        { n: "年月日", v: "YYYYMMDD" },
        { n: "年月日时", v: "YYYYMMDDHH" }
      ],
      options: [
        { n: "日期", v: "date" },
        { n: "编号", v: "no" }
      ],
      showDrop: false,
      mirrorCursor: {
        cursorHeight: 0.8
      },
      coding: false,
      code: "",
      show: false
    };
  },
  computed: {
    sample() {
      return this.cpnt.data._source
        .replace(/#date#/g, `${dayjs().format(this.cpnt.data._format || this.dateFormat[0].v)}`)
        .replace(/#no#/g, `${new Array(parseInt(this.cpnt.data._digit) - 1).fill(0).join("") + "1"}`);
    },
    fieldOptions() {
      return this.cpnt.store.search({
        options: { componentid: "tag" },
        onlyData: true,
        beforePush: item => {
          if (item.fid === this.cpnt.fid) return false;
          if (item.parent.CPNT.host_db) return false;
          return true;
        }
      });
    }
  },
  watch: {
    "cpnt.data._source"() {
      this.format();
    },
    "cpnt.data._digit"() { 
      this.format();
    },
    "cpnt.data._format"() {
      this.format();
    }
  },
  created() {
    if (!this.cpnt.data._format) {
      this.cpnt.data._format = this.dateFormat[0].v;
    }
  },
  mounted() {
    if (this.cpnt.data._source) {
      this.decorate();
    }
  },
  methods: {
    digitName(d) {
      return `${d}位数`;
    },
    format() {
      if (this.cpnt.data._source) {
        this.cpnt.data._outputFormat = this.cpnt.data._source
          .replace(/#date#/g, `[date(${this.cpnt.data._format})]`)
          .replace(/#no#/g, `%0${this.cpnt.data._digit}d`);
      } else {
        this.cpnt.data._outputFormat = "";
      }
    },
    dropClickHandler(cpnt) {
      this.coding = true;
      this.mirrorCursor = this.$refs.codemirror.codemirror.getCursor();
      const text = `#${cpnt.v}#`;
      this.$refs.codemirror.codemirror.replaceSelection(text);
      this.$refs.codemirror.codemirror.markText(
        this.mirrorCursor,
        { line: this.mirrorCursor.line, ch: this.mirrorCursor.ch + text.length },
        {
          replacedWith: $(`<span class="code-cpnt">${cpnt.n}</span>`)[0],
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
        const cpnt = _.find(this.options, { v: match[0].replace(/#/g, "") });
        if (cpnt) {
          this.$refs.codemirror.codemirror.markText(
            { line: n, ch: match.index },
            { line: n, ch: match.index + match[0].length },
            {
              replacedWith: $(`<span class="code-cpnt">${cpnt.n}</span>`)[0],
              selectLeft: true,
              selectRight: true
            }
          );
        }
      }
    },
    focusHandler(doc) {
      this.showDrop = true;
    },
    blurHandler() {
      setTimeout(() => {
        if (this.coding) return (this.coding = false);
        this.showDrop = false;
      }, 150);
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
@{deep} {
  .code-cpnt {
    background-color: #fd8647;
    color: #fff;
    font-size: 12px;
    padding: 0 10px;
    border-radius: 14px;
    margin: 0 2px;
    display: inline-block;
  }
  .CodeMirror-line {
    line-height: 24px !important;
  }
  .CodeMirror {
    border-radius: 5px;
    border: 1px solid #dcdfe6;
    height: 80px !important;
    font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  }
  .CodeMirror-widget {
    margin: 0 2px;
  }
}
.mirror-wrapper {
  position: relative;
}
.dropdown {
  position: absolute;
  top: 80px;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
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