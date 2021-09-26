<template>
  <div class="form-col-eidt">
    <div class="form-col-eidt__aside">
      <div class="form-col-eidt__aside-item">
        <ul class="form-col-eidt__aside-item-sub">
          <li
            class="form-col-eidt__aside-item-subitem"
            v-for="(d, i) in ASIDE"
            :key="i"
            :class="{ active: d.v === curIndex }"
            @click="onAsideClick(d)"
          >
            <i :class="d.i"></i>
            <span>{{ d.n }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-col-eidt__body" ref="scrollcontainer">
      <div class="form-col-eidt__section" ref="section1">
        <div class="form-col-eidt__title">基础设置</div>
        <el-form label-position="left" size="medium" label-width="100px">
          <el-form-item label="视图名称" required>
            <el-input size="medium" v-model="instance.name"></el-input>
          </el-form-item>
          <el-form-item label="默认视图">
            <el-switch v-model="instance.asdef"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-col-eidt__section" ref="section2">
        <div class="form-col-eidt__title">表格设置</div>
        <div class="form-col-eidt__tip">勾选字段设置表格显示列，在预览中可以拖动表头排序和调整列宽。</div>
        <c-table :instance="instance" :store="store" :isnew="isnew"></c-table>
      </div>
      <div class="form-col-eidt__section" ref="section3">
        <div class="form-col-eidt__title">动作设置</div>
        <div class="form-col-eidt__tip">在当前视图中选择默认功能按钮和添加自定义按钮。</div>
        <el-form label-position="left" size="medium" label-width="100px">
          <el-form-item label="默认动作">
            <el-checkbox-group v-model="instance.defAction">
              <el-checkbox v-for="(v, k) in DEFACTION" :key="k" :label="k">{{ v }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="视图顶部动作" v-if="topActions.length">
            <el-checkbox-group v-model="instance.topAction">
              <el-checkbox v-for="(d, i) in topActions" :key="i" :label="d.id">{{ d.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="表格记录动作" v-if="rowActions.length">
            <el-checkbox-group v-model="instance.rowAction">
              <el-checkbox v-for="(d, i) in rowActions" :key="i" :label="d.id">{{ d.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-col-eidt__section" ref="section4">
        <div class="form-col-eidt__title">快速检索</div>
        <div class="form-col-eidt__tip">将字段作为快速筛选器显示在视图顶部，以帮助用户快速查找记录。</div>
        <el-form label-position="left" size="medium" label-width="100px">
          <el-form-item label="模糊检索">
            <el-select multiple filterable clearable v-model="instance.qsearch">
              <el-option v-for="(d, i) in instance.data" :key="i" :label="d.display || d.field_name" :value="d.field_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围检索">
            <el-select filterable clearable v-model="instance.tsearch">
              <el-option v-for="(d, i) in instance.data" :key="i" :label="d.display || d.field_name" :value="d.field_name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-col-eidt__section" ref="section5">
        <div class="form-col-eidt__title">高级检索</div>
        <div class="form-col-eidt__tip">勾选字段设置检索项，拖动表格行可改变显示顺序。</div>
        <c-filter :instance="instance" :store="store" :isnew="isnew"></c-filter>
      </div>
      <div class="form-col-eidt__section" ref="section6">
        <div class="form-col-eidt__title">移动端显示</div>
        <div class="form-col-eidt__tip">
          表格视图中的记录在移动端以卡片的形式呈现，为移动端设置记录的显示布局，以便于移动端的数据浏览和操作。
        </div>
        <div class="form-col-mobile">
          <div class="form-col-eidt__subtitle">选择模板</div>
          <div class="form-col-mobile_card">
            <div class="form-col-mobile_card-item">
              <div class="mobile-card active">
                <div>
                  <div class="mobile-card-bar dark" style="width: 100px; height: 18px"></div>
                </div>
                <div>
                  <i class="el-icon-picture"></i>
                  <div class="mobile-card-bar"></div>
                  <div class="mobile-card-bar" style="width: 80%"></div>
                  <div class="mobile-card-bar" style="width: 50%"></div>
                </div>
                <div>
                  <div class="mobile-card-bar" style="width: 100px"></div>
                </div>
              </div>
            </div>
          </div>
          <el-form label-position="left" size="medium" label-width="100px">
            <el-form-item label="标题字段">
              <el-select filterable clearable v-model="instance.fieldTitle">
                <el-option v-for="(d, i) in instance.data" :key="i" :label="d.display || d.field_name" :value="d.field_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="头图字段">
              <el-select filterable clearable v-model="instance.fieldPic">
                <el-option v-for="(d, i) in instance.data" :key="i" :label="d.display || d.field_name" :value="d.field_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容字段">
              <el-select multiple clearable collapse-tags filterable v-model="instance.fieldContent">
                <el-option v-for="(d, i) in instance.data" :key="i" :label="d.display || d.field_name" :value="d.field_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间字段">
              <el-select filterable clearable v-model="instance.fieldTime">
                <el-option v-for="(d, i) in instance.data" :key="i" :label="d.display || d.field_name" :value="d.field_name"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CTable from "./table";
import CFilter from "./filter";
import VueScrollTo from "vue-scrollto";
 
const DEFACTION = {
  exportCurPage: "导出EXCEL",
  makeCarbonCopy: "抄送",
  importable: "导入",
  print: "打印",
  saveFiles: "下载文件",
  downloadFormTp: "下载模板",
  saveColumn: "保存列宽",
};

export default {
  components: { CTable, CFilter },
  props: {
    instance: Object,
    store: Object,
    isnew: {
      type: Boolean,
      default: false,
    },
    actions: Array,
  },
  data() {
    this.DEFACTION = DEFACTION;
    this.ASIDE = [
      { n: "基础设置", v: "1", i: "el-icon-turn-off" },
      { n: "表格设置", v: "2", i: "fa fa-table" },
      { n: "动作设置", v: "3", i: "el-icon-news" },
      { n: "快速检索", v: "4", i: "el-icon-search" },
      { n: "高级检索", v: "5", i: "fa fa-filter" },
      { n: "移动端显示", v: "6", i: "el-icon-mobile-phone" },
    ];
    return {
      curIndex: "1",
    };
  },
  computed: {
    topActions() {
      return this.actions.filter((d) => d.location === "1");
    },
    rowActions() {
      return this.actions.filter((d) => d.location === "2");
    },
  },
  created() {
    console.log(this.instance);
  },
  methods: {
    onAsideClick(data) {
      VueScrollTo.scrollTo(this.$refs[`section${data.v}`], 200, { container: this.$refs.scrollcontainer, offset: -20 });
      this.curIndex = data.v;
    },
  },
};
</script>
<style lang="less">
.form-col-eidt {
  height: 100%;
  display: flex;
  .form-col-eidt__title {
    font-weight: 700;
    font-size: 16px;
    color: #000;
    margin-bottom: 20px;
    & + .form-col-eidt__tip {
      margin-top: -15px;
    }
  }
  .form-col-eidt__subtitle {
    font-weight: 700;
    font-size: 14px;
    color: #999;
    margin-bottom: 15px;
  }
  .form-col-eidt__tip {
    margin-bottom: 20px;
    font-size: 13px;
    color: #9e9e9e;
  }
  .form-col-eidt__body {
    width: calc(100% - 200px);
    padding: 30px 20px 300px 20px;
    background: #fff;
    height: 100%;
    overflow: auto;
    .form-col-eidt__section {
      & + .form-col-eidt__section {
        margin-top: 70px;
      }
    }
  }
  .form-col-eidt__aside {
    width: 200px;
    padding: 30px 20px;
    height: 100%;
    overflow: auto;
    .form-col-eidt__aside-item {
      .form-col-eidt__aside-item-sub {
        .form-col-eidt__aside-item-subitem {
          padding: 6px 8px;
          border-radius: 3px;
          cursor: pointer;
          margin-bottom: 20px;

          &:hover {
            background: #efeded;
          }

          &.active {
            color: #1b9aee;
            background: #efeded;

            span,
            i {
              color: #1b9aee;
            }
          }

          span {
            font-size: 13px;
            color: #000;
          }

          i {
            font-size: 16px;
            margin-right: 10px;
            color: #000;
            margin-top: 2px;
            width: 30px;
            text-align: center;
            font-weight: bold;
          }
        }
      }
    }
  }
}
.form-col-mobile_card {
  margin-bottom: 50px;
}
.mobile-card {
  width: 300px;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px 0;
  &.active {
    border: 3px solid #1b9aee;
    .mobile-card-bar {
      background: #91d1fb;
      &.dark {
        background: #1b9aee;
      }
    }
  }
  .mobile-card-bar {
    width: 100%;
    height: 14px;
    &.mobile-card-bar {
      margin-top: 3px;
    }
  }
  > div {
    i {
      font-size: 60px;
      color: #c9e0ef;
    }
    &:nth-child(1) {
      height: 30px;
      align-items: center;
      display: flex;
      padding: 0 15px;
    }
    &:nth-child(2) {
      padding: 0 15px;
    }
    &:nth-child(3) {
      height: 30px;
      padding: 0 15px;
      display: flex;
      align-items: center;
      justify-content: end;
    }
  }
}
</style>