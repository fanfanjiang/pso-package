<template>
  <div class="pso-data-mgt__column" style="padding: 0 0 30px 0">
    <div class="pso-table-controller">
      <el-button size="mini" @click="addCol(null)">添加列表</el-button>
    </div>
    <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeCol">
      <el-tab-pane :label="col.name" :name="index + ''" v-for="(col, index) in data.column" :key="index">
        <el-form label-position="left" label-width="120px">
          <el-form-item label="列表名称">
            <el-input size="mini" v-model="col.name"></el-input>
          </el-form-item>
        </el-form>
        <el-table
          key="list"
          size="mini"
          :data="col.data"
          style="width: 100%"
          height="500"
          :sort-by="['number']"
          @row-dblclick="rowClickHandler"
        >
          <el-table-column type="index" :index="1" fixed="left"></el-table-column>
          <el-table-column prop="field_name" label="字段" width="100" fixed="left"></el-table-column>
          <el-table-column prop="display" label="显示名称" fixed="left"></el-table-column>
          <el-table-column prop="number" label="顺序" width="160" sortable>
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.number" controls-position="right" :min="0"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="width" label="列宽" width="60"></el-table-column>
          <el-table-column prop="using" label="启用" width="70" sortable>
            <template slot-scope="scope">
              <el-switch size="mini" v-model="scope.row.using" active-value="1" inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="show" label="显示" width="70" sortable>
            <template slot-scope="scope">
              <el-switch size="mini" v-model="scope.row.show" active-value="1" inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="searchable" label="筛选" width="70" sortable>
            <template slot-scope="scope">{{ scope.row.searchable }}</template>
          </el-table-column>
          <el-table-column prop="sortable" label="手动排序" width="100" sortable></el-table-column>
          <el-table-column prop="editable" label="编辑" width="70" sortable>
            <template slot-scope="scope">{{ scope.row.editable }}</template>
          </el-table-column>
          <el-table-column prop="cal" label="统计" width="70" sortable></el-table-column>
          <el-table-column prop="align" label="对齐方式" width="100" sortable></el-table-column>
          <el-table-column prop="defSort" label="默认排序类型" width="120" sortable></el-table-column>
          <el-table-column prop="defSortOrder" label="默认排序顺序" width="120" sortable></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="编辑列表"
      width="40%"
      custom-class="worksheet-dialog"
      :append-to-body="true"
      :center="true"
      :visible.sync="showEditor"
    >
      <el-form label-position="left" label-width="120px" v-if="curRow" style="padding: 20px">
        <el-form-item label="显示名称">
          <el-input size="mini" v-model="curRow.display"></el-input>
        </el-form-item>
        <el-form-item label="列宽">
          <el-input-number size="mini" v-model="curRow.width" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="筛选">
          <el-switch size="mini" v-model="curRow.searchable"></el-switch>
        </el-form-item>
        <el-form-item label="编辑">
          <el-switch size="mini" v-model="curRow.editable"></el-switch>
        </el-form-item>
        <el-form-item label="排序">
          <el-switch size="mini" v-model="curRow.sortable" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="统计">
          <el-switch size="mini" v-model="curRow.cal" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="清除多余零">
          <el-switch size="mini" v-model="curRow.clearZero"></el-switch>
        </el-form-item>
        <el-form-item label="默认排序类型">
          <el-select size="mini" clearable v-model="curRow.defSort">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认排序顺序">
          <el-input-number size="mini" v-model="curRow.defSortOrder" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="对齐方式">
          <el-select size="mini" v-model="curRow.align">
            <el-option label="居中" value="center"></el-option>
            <el-option label="居左" value="left"></el-option>
            <el-option label="居右" value="right"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { formOp } from "../form-designer/mixin.js";
import debounce from "throttle-debounce/debounce";
import { FORM_COLUMN_FIELDS } from "../../const/sys";
import shortid from "shortid";
import { formatJSONList } from "../../utils/util";

export default {
  mixins: [formOp],
  props: ["data", "defCol"],
  data() {
    return {
      forms: [],
      fields: [],
      curRow: null,
      showEditor: false,
      activeTab: "",
    };
  },
  async created() {
    this.forms = await this.API.getFormTree();
    if (!this.data.column.length) {
      this.addCol(formatJSONList(_.cloneDeep(this.defCol), FORM_COLUMN_FIELDS));
    } else {
      this.activeTab = "0";
    }
  },
  methods: {
    addCol(data) {
      this.data.column.push({
        name: shortid.generate(),
        data: data || (this.data.column.length ? _.cloneDeep(this.data.column[0].data) : _.cloneDeep(this.defCol)),
      });
      this.activeTab = this.data.column.length - 1 + "";
    },
    rowClickHandler(row) {
      this.curRow = row;
      this.showEditor = true;
    },
    removeCol(index) {
      if (parseInt(index) !== 0) {
        this.data.column.splice(index, 1);
      }
    },
  },
};
</script>