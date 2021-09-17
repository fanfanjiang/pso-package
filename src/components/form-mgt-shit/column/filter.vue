<template>
  <div class="form-col-filter">
    <div>
      <el-form label-position="left" size="medium" label-width="100px">
        <el-form-item label="显示位置">
          <el-radio-group v-model="instance.searchposition">
            <el-radio label="left">固定左侧</el-radio>
            <el-radio label="top">固定表格上侧</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-col-filter_content">
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
      <div class="form-col-filter_body" ref="table">
        <el-table
          size="mini"
          border
          :data="show_fields"
          row-key="field_name"
          style="width: 100%"
          :sort-by="['number']"
          @row-dblclick="rowClickHandler"
        >
          <el-table-column prop="display" label="显示名称"></el-table-column>
          <el-table-column prop="field_name" label="字段" width="120"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { Search, TableDrag } from "../mixin";
export default {
  mixins: [Search, TableDrag],
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
      this.initDrop($(this.$refs.table).find(".el-table__body-wrapper tbody").get(0), "searchorder");
    });
  },
};
</script>
<style lang="less">
.form-col-filter {
  .form-col-filter_content {
    display: flex;
  }
  .form-col-filter_aside {
    width: 150px;
    height: 400px;
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