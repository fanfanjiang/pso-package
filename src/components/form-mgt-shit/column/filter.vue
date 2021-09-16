<template>
  <div class="form-col-filter">
    <div class="form-col-filter_aside">
      <div class="form-col-filter_aside-search">
        <mu-text-field v-model="filterText" placeholder="搜索字段">
          <template v-slot:prepend>
            <i class="el-icon-search"></i>
          </template>
        </mu-text-field>
      </div>
      <div class="form-col-filter_aside-body">
        <ul>
          <li v-for="(d, i) in fields" :key="i">
            <el-checkbox v-model="d.searchable">{{ d.display }}</el-checkbox>
          </li>
        </ul>
        <div style="margin: 15px 0; color: #999">系统字段</div>
        <ul>
          <li v-for="(d, i) in sys_fields" :key="i">
            <el-checkbox v-model="d.searchable">{{ d.display }}</el-checkbox>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-col-filter_body">
      <el-table size="mini" border :data="show_fields" style="width: 100%" :sort-by="['number']" @row-dblclick="rowClickHandler">
        <el-table-column prop="display" label="显示名称" fixed="left"></el-table-column>
        <el-table-column prop="field_name" label="字段" width="120" fixed="left"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { Search } from "../mixin";
import Sortable from "sortablejs";
export default {
  mixins: [Search],
  props: {
    isnew: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show_fields() {
      return _.orderBy(
        this.instance.data.filter((d) => d.searchable),
        ["searchorder"],
        ["asc"]
      );
    },
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
};
</script>
<style lang="less">
.form-col-filter {
  display: flex;
  .form-col-filter_aside {
    width: 150px;
    height: 500px;
    .form-col-filter_aside-search {
      overflow: hidden;
    }
    .form-col-filter_aside-body {
      height: calc(100% - 85px);
      overflow: auto;
      li {
        margin-bottom: 5px;
      }
    }
  }
  .form-col-filter_body {
    width: calc(100% - 150px);
    padding-left: 20px;
  }
}
</style>