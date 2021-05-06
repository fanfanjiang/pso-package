<template>
  <div class="printgod-designer-menubody font-size-9" v-if="print">
    <el-tooltip effect="dark" content="字体" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-dropdown @command="familyHandler" trigger="click">
          <span class="el-dropdown-link">{{ fontFamily }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(d, i) in _CONST.FONT_FAMILY" :key="i" :command="d.v">{{ d.n }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="字号" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-dropdown size="small" @command="sizeHandler" trigger="click">
          <span class="el-dropdown-link">{{ print.menu.fontSize }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(d, i) in _CONST.FONT_SIZE" :key="i" :command="d">{{ d }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="字体颜色" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-popover placement="bottom" trigger="click" v-model="showColor">
          <div class="printgod-menu-btn" slot="reference">
            <div style="text-align: center">
              <span class="fa fa-font"></span>
              <icon-color :color="print.menu.color" :h="2"></icon-color>
            </div>
            <i class="el-icon-arrow-down"></i>
          </div>
          <div class="printgod-menu-panel">
            <div v-for="(d, i) in _CONST.COLOR" :key="i" @click="fontColorHandler(d)">
              <icon-color :color="d"></icon-color>
            </div>
          </div>
        </el-popover>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="加粗" placement="bottom">
      <div class="printgod-designer-menu-item" :class="{ active: print.menu.bold }">
        <div class="printgod-menu-btn" @click="styleHandler('bold', 'font-weight')">
          <span class="title fa fa-bold"></span>
        </div>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="倾斜" placement="bottom">
      <div class="printgod-designer-menu-item" :class="{ active: print.menu.italic }">
        <div class="printgod-menu-btn" @click="styleHandler('italic', 'font-style')">
          <span class="title fa fa-italic"></span>
        </div>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="下划线" placement="bottom">
      <div class="printgod-designer-menu-item" :class="{ active: print.menu.underline }">
        <div class="printgod-menu-btn" @click="styleHandler('underline', 'text-decoration')">
          <span class="title fa fa-underline"></span>
        </div>
      </div>
    </el-tooltip>
    <el-divider direction="vertical"></el-divider>
    <el-tooltip effect="dark" content="水平对齐方式" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-popover placement="bottom" trigger="click" v-model="showAlignh">
          <div class="printgod-menu-btn" slot="reference">
            <icon-alignh :index="print.menu.alignh" w="16" h="16"></icon-alignh>
            <i class="el-icon-arrow-down"></i>
          </div>
          <div class="printgod-menu-panel">
            <div v-for="(d, i) in _CONST.FONT_ALIGN_H" :key="i" @click="alignHandler(d.v, 'text-align')">
              <icon-alignh :index="d.v"></icon-alignh>
            </div>
          </div>
        </el-popover>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="垂直对齐方式" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-popover placement="bottom" trigger="click" v-model="showAlignv">
          <div class="printgod-menu-btn" slot="reference">
            <icon-alignv :index="print.menu.alignv" w="16" h="16"></icon-alignv>
            <i class="el-icon-arrow-down"></i>
          </div>
          <div class="printgod-menu-panel">
            <div v-for="(d, i) in _CONST.FONT_ALIGN_V" :key="i" @click="alignHandler(d.v, 'vertical-align')">
              <icon-alignv :index="d.v"></icon-alignv>
            </div>
          </div>
        </el-popover>
      </div>
    </el-tooltip>
    <el-divider direction="vertical"></el-divider>
    <el-tooltip effect="dark" content="边框" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-popover placement="bottom" trigger="click" v-model="showBorder">
          <div class="printgod-menu-btn" slot="reference">
            <icon-border :index="print.menu.border" w="16" h="16"></icon-border>
            <i class="el-icon-arrow-down"></i>
          </div>
          <div class="printgod-menu-panel">
            <div v-for="(d, i) in _CONST.BORDER_TYPE" :key="i" @click="borderHandler(d)">
              <icon-border :index="d"></icon-border>
            </div>
          </div>
        </el-popover>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="边框宽度" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-popover placement="bottom" trigger="click" v-model="showBorderWidth">
          <div class="printgod-menu-btn" slot="reference">
            <icon-borderw :w="print.menu.borderWidth"></icon-borderw>
            <i class="el-icon-arrow-down"></i>
          </div>
          <div class="printgod-menu-panel-column">
            <div v-for="(d, i) in _CONST.BORDER_WIDTH" :key="i" @click="borderWidthHandler(d)">
              <icon-borderw :w="d"></icon-borderw>
            </div>
          </div>
        </el-popover>
      </div>
    </el-tooltip>
    <el-divider direction="vertical"></el-divider>
    <el-tooltip effect="dark" content="合并" placement="bottom">
      <div class="printgod-designer-menu-item">
        <div class="printgod-menu-btn" @click="mergeHandler">
          <icon-merge :merge="print.menu.merge"></icon-merge>
        </div>
      </div>
    </el-tooltip>
    <el-divider direction="vertical"></el-divider>
    <el-tooltip effect="dark" content="背景" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-popover placement="bottom" trigger="click" v-model="showBack">
          <div class="printgod-menu-btn" slot="reference">
            <span class="el-icon-picture" style="font-size: 20px"></span>
            <i class="el-icon-arrow-down"></i>
          </div>
          <background-setter v-if="print.sheet" :print="print"></background-setter>
        </el-popover>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="纸张" placement="bottom">
      <div class="printgod-designer-menu-item">
        <el-popover placement="bottom" trigger="click" v-model="showPaper">
          <div class="printgod-menu-btn" slot="reference">
            <span class="el-icon-document" style="font-size: 20px"></span>
            <i class="el-icon-arrow-down"></i>
          </div>
          <paper-set :print="print"></paper-set>
        </el-popover>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
import _CONST from "./const";
import IconBorder from "./icon/border";
import IconMerge from "./icon/merge";
import IconBorderw from "./icon/borderw";
import IconColor from "./icon/color";
import IconAlignh from "./icon/align-h";
import IconAlignv from "./icon/align-v";
import PaperSet from "./paper";
import backgroundSetter from "./background-setter";
export default {
  components: { IconBorder, IconMerge, IconBorderw, IconColor, PaperSet, backgroundSetter, IconAlignh, IconAlignv },
  props: {
    print: Object,
  },
  data() {
    this._CONST = _CONST;
    return {
      showColor: false,
      showBorder: false,
      showBorderWidth: false,
      showPaper: false,
      showBack: false,
      showAlignh: false,
      showAlignv: false,
    };
  },
  computed: {
    fontFamily() {
      return _.find(_CONST.FONT_FAMILY, { v: this.print.menu.fontFamily }).n;
    },
  },
  methods: {
    familyHandler(command) {
      this.print.sheet.setFontFamilyCls(command);
    },
    sizeHandler(command) {
      this.print.sheet.setFontSizeCls(command);
    },
    borderHandler(value) {
      this.print.sheet.setBorder(value);
      this.showBorder = false;
    },
    mergeHandler() {
      this.print.sheet.mergeOrUnmerge();
    },
    borderWidthHandler(value) {
      this.print.sheet.setBorderWidthCls(value);
      this.showBorderWidth = false;
    },
    fontColorHandler(value) {
      this.print.sheet.setFontColorCls(value);
      this.showColor = false;
    },
    alignHandler(value, align) {
      this.print.sheet.setCommonCls(value, align);
      this.showAlignv = false;
      this.showAlignh = false;
    },
    styleHandler(type, prefix) {
      this.print.sheet.setOrRemoveCommonCls(type, prefix);
    },
  },
};
</script>
<style lang="less">
.printgod-menu-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  i {
    font-size: 14px;
    margin-left: 5px;
  }
  .borderw {
    width: 20px;
  }
  .title {
    font-size: 14px;
    padding: 0 10px;
  }
}
.printgod-menu-panel {
  display: flex;
  > div {
    cursor: pointer;
    & + div {
      margin-left: 10px;
    }
  }
}
.printgod-menu-panel-column {
  display: flex;
  flex-direction: column;
  > div {
    padding: 10px 0;
    cursor: pointer;
    & + div {
      margin-top: 10px;
    }
  }
}
</style>
