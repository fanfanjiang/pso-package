<template>
  <div class="form-col-table">
    <div class="form-col-table_preview" ref="preview">
      <div class="form-col-eidt__subtitle">预览</div>
      <el-table border size="mini" style="width: 100%" :data="[]" @header-dragend="onHeaderDrag">
        <el-table-column
          v-for="d in show_fields"
          :key="d.field_name"
          :prop="d.field_name"
          :label="d.display"
          :width="d.width"
          :align="d.align"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="form-col-table_content">
      <div class="form-col-table_aside">
        <div class="form-col-eidt__subtitle">显示字段</div>
        <div class="form-col-table_aside-search">
          <mu-text-field v-model="filterText" placeholder="搜索字段">
            <template v-slot:prepend>
              <i class="el-icon-search"></i>
            </template>
          </mu-text-field>
        </div>
        <div class="form-col-table_aside-body">
          <ul>
            <li v-for="(d, i) in fields" :key="i">
              <el-checkbox v-model="d.using" true-label="1" false-label="0">{{ d.display }}</el-checkbox>
            </li>
          </ul>
          <div style="margin: 15px 0; color: #999">系统字段</div>
          <ul>
            <li v-for="(d, i) in sys_fields" :key="i">
              <el-checkbox v-model="d.using" true-label="1" false-label="0">{{ d.display }}</el-checkbox>
            </li>
          </ul>
        </div>
      </div>
      <div class="form-col-table_body">
        <div class="form-col-table_detail">
          <div class="form-col-eidt__subtitle">详细信息</div>
          <el-table size="mini" border :data="show_fields" style="width: 100%" :sort-by="['number']" @row-dblclick="rowClickHandler">
            <el-table-column prop="display" label="显示名称" fixed="left"></el-table-column>
            <el-table-column prop="field_name" label="字段" width="120" fixed="left"></el-table-column>
            <el-table-column prop="searchable" label="筛选" width="60" align="center">
              <template slot-scope="scope">{{ YESNO[scope.row.searchable] }}</template>
            </el-table-column>
            <el-table-column prop="sortable" label="手动排序" width="100" align="center">
              <template slot-scope="scope">{{ YESNO2[scope.row.sortable] }}</template>
            </el-table-column>
            <el-table-column prop="editable" label="编辑" width="70" align="center">
              <template slot-scope="scope">{{ YESNO[scope.row.editable] }}</template>
            </el-table-column>
            <el-table-column prop="cal" label="统计" width="70" align="center">
              <template slot-scope="scope">{{ YESNO2[scope.row.sortable] }}</template>
            </el-table-column>
            <el-table-column prop="align" label="对齐方式" width="100" align="center">
              <template slot-scope="scope">{{ ALIGN[scope.row.align] }}</template>
            </el-table-column>
            <el-table-column prop="defSort" label="默认排序类型" width="120"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <pso-dialog title="编辑" :visible="opener.show" @close="opener.show = false" width="40%">
      <el-form size="medium" label-position="left" label-width="120px" v-if="curRow" style="padding: 20px; overflow: auto; height: 100%">
        <el-form-item label="显示名称">
          <el-input v-model="curRow.display"></el-input>
        </el-form-item>
        <el-form-item label="自适应宽度">
          <el-switch v-model="curRow.widthAuto"></el-switch>
        </el-form-item>
        <el-form-item label="占满剩余宽度">
          <el-switch v-model="curRow.fillRemain"></el-switch>
        </el-form-item>
        <el-form-item label="打印列宽">
          <el-input-number v-model="curRow.docWidth" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="编辑">
          <el-switch v-model="curRow.editable"></el-switch>
        </el-form-item>
        <el-form-item label="排序">
          <el-switch v-model="curRow.sortable" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="统计">
          <el-switch v-model="curRow.cal" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="清除多余零">
          <el-switch v-model="curRow.clearZero"></el-switch>
        </el-form-item>
        <el-form-item label="默认排序类型">
          <el-select clearable v-model="curRow.defSort">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认排序顺序">
          <el-input-number v-model="curRow.defSortOrder" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="对齐方式">
          <el-select v-model="curRow.align">
            <el-option v-for="(v, k) in ALIGN" :key="k" :label="v" :value="k"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联显示字段">
          <el-select clearable v-model="curRow.relatedShowField">
            <el-option v-for="(f, i) in curColumn" :key="i" :label="f.display || f.field_name" :value="f.field_name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </pso-dialog>
  </div>
</template>
<script>
import { Search } from "../mixin";
import Sortable from "sortablejs";
const YESNO = {
  true: "是",
  false: "否",
};
const YESNO2 = {
  1: "是",
  0: "否",
};
const ALIGN = {
  center: "居中",
  left: "居左",
  right: "居右",
};
export default {
  mixins: [Search],
  props: {
    isnew: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.YESNO = YESNO;
    this.YESNO2 = YESNO2;
    this.ALIGN = ALIGN;
    return {
      sortable: null,
      curRow: null,
      opener: { show: false },
    };
  },
  computed: {
    show_fields() {
      return _.orderBy(
        this.instance.data.filter((d) => d.using === "1"),
        ["number"],
        ["asc"]
      );
    },
  },
  created() {
    for (let d of this.instance.data) {
      const f = this.store.searchByField(d.field_name);
      if (!f && this.isnew) {
        d.using = "0";
      }
      if (/\S+_s$/.test(d.field_name) || /\S+_x$/.test(d.field_name)) {
        d.using = "0";
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.columnDrop();
    });
  },
  destroyed() {
    if (this.sortable) {
      this.sortable.destroy();
    }
  },
  methods: {
    onHeaderDrag(newWidth, oldWidth, column) {
      const exist = _.find(this.instance.data, { field_name: column.property });
      if (exist) {
        exist.width = parseInt(newWidth);
      }
    },
    rowClickHandler(data) {
      this.curRow = data;
      this.opener.show = true;
    },
    columnDrop() {
      const wrapperTr = $(this.$refs.preview).find(".el-table__header-wrapper tr").get(0);
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: (evt) => {
          const item = this.show_fields[evt.oldIndex];
          const newItem = this.show_fields[evt.newIndex];
          const preItem = this.show_fields[evt.newIndex - 1];
          const nexItem = this.show_fields[evt.newIndex + 1];

          const newOrder = evt.newIndex > evt.oldIndex ? newItem.number + 1 : newItem.number - 1;

          if (evt.newIndex > evt.oldIndex && nexItem && nexItem.number <= newOrder) {
            this.show_fields.forEach((d, i) => {
              if (i > evt.newIndex) {
                d.number = d.number + (nexItem.number === newOrder ? 1 : 2);
              }
            });
          }

          if (evt.newIndex < evt.oldIndex && preItem && preItem.number >= newOrder) {
            this.show_fields.forEach((d, i) => {
              if (i < evt.newIndex) {
                d.number = d.number - (preItem.number === newOrder ? 1 : 2);
              }
            });
          }

          item.number = newOrder;
        },
      });
    },
  },
};
</script>
<style lang="less">
.form-col-table {
  .form-col-table_content {
    display: flex;
  }
  .form-col-table_aside {
    width: 150px;
    height: 500px;
    .form-col-table_aside-search {
      overflow: hidden;
    }
    .form-col-table_aside-body {
      height: calc(100% - 85px);
      overflow: auto;
      li {
        margin-bottom: 5px;
      }
    }
  }
  .form-col-table_body {
    width: calc(100% - 150px);
    padding-left: 20px;
  }
  .form-col-table_preview {
    margin-bottom: 30px;
    .el-table__empty-block {
      height: 1px !important;
      min-height: 1px !important;
    }
    .el-table__empty-text {
      display: none;
    }
  }
}
</style>