<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="可输入脚本，根据脚本返回值填充表单" :needDefaultValue="false">
      <el-form-item label="脚本" required>
        <el-button @click="showScript = true" size="mini">设置脚本</el-button>
      </el-form-item>
      <el-form-item label="多选单选" required>
        <el-select size="mini" v-model="cpnt.data._selectType" placeholder="请选择">
          <el-option label="单选" value="radio"></el-option>
          <el-option label="多选" value="checkbox"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展示方式" required>
        <el-select size="mini" v-model="cpnt.data._type" placeholder="请选择">
          <el-option label="自动填充" value="1"></el-option>
          <el-option label="列表选择" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="赋值方式" required>
        <el-select size="mini" v-model="cpnt.data._copyType" placeholder="请选择">
          <el-option label="自动赋值" value="1"></el-option>
          <el-option label="导入子表" value="2"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="cpnt.data._copyType === '2'">
        <el-form-item label="赋值目标字段">
          <el-select v-model="cpnt.data._copyTarget" size="mini" placeholder="请选择" clearable>
            <el-option v-for="f in fieldOptions" :key="f.fid" :label="f._fieldName" :value="f._fieldValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赋值自动生成来源字段">
          <el-select v-model="cpnt.data._copySource" size="mini" placeholder="请选择" clearable>
            <el-option v-for="f in fieldOptions" :key="f.fid" :label="f._fieldName" :value="f._fieldValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赋值目标自动生成字段">
          <el-select v-model="cpnt.data._copyTargetAutoGen" size="mini" placeholder="请选择" clearable>
            <el-option v-for="f in autoGenFields" :key="f.fid" :label="f._fieldName" :value="f._fieldValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赋值目标自动生成限制字段">
          <el-select v-model="cpnt.data._copyTargetAutoLimit" size="mini" placeholder="请选择" multiple clearable>
            <el-option v-for="f in autoGenFields" :key="f.fid" :label="f._fieldName" :value="f._fieldValue"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="只保存一次" required>
        <el-switch v-model="cpnt.data._saveOnce" size="mini"></el-switch>
      </el-form-item>
      <el-form-item label="参数字段">
        <el-select v-model="cpnt.data._option" size="mini" placeholder="请选择" multiple>
          <el-option v-for="item in fieldOptions" :key="item.fid" :label="item._fieldName" :value="item.fid"></el-option>
        </el-select>
      </el-form-item>
      <pso-title title="设置列"></pso-title>
      <el-button @click="showColum = true" size="mini">设置列参数</el-button>
      <el-form-item label="保存字段" required>
        <el-select v-model="cpnt.data._saveField" size="mini" placeholder="请选择">
          <el-option v-for="item in cpnt.data._column" :key="item.field" :label="item.name" :value="item.field"></el-option>
        </el-select>
      </el-form-item>
    </common-panel>
    <el-dialog title="设置列参数" append-to-body :visible.sync="showColum" :width="'80%'">
      <column-editor :data="cpnt.data._column" :formulable="false"></column-editor>
    </el-dialog>
    <el-dialog title="设置脚本" append-to-body :visible.sync="showScript" :width="'80%'">
      <div class="pso-table-controller">
        <el-button size="small" type="primary" plain @click="addScript">添加脚本</el-button>
      </div>
      <el-table key="status" :data="cpnt.data._script" style="width: 100%">
        <el-table-column label="参数">
          <template slot-scope="scope">
            <el-dropdown @command="addScriptItem($event, scope.row)" size="mini" trigger="click">
              <span class="el-dropdown-link">
                添加字段
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="f in fieldOptions" :key="f._fieldValue" :command="f._fieldValue">{{
                  f._fieldName
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="pscript-item" v-for="(value, key) of scope.row.param" :key="key">
              <span>{{ getName(key) }}</span>
              <el-input size="mini" v-model="scope.row.param[key]"></el-input>
              <i class="el-icon-delete" @click="delScriptItem(scope.row.param, key)"></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="goDesigner(scope.$index)">设计脚本</el-button>
            <el-button size="mini" type="danger" @click="delScript(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <sql-designer :opener="showDeisgner" :scode="cpnt.store.data_code" :sql="curSql"></sql-designer>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import columnEditor from "../../templete-mgt/column";
import SqlDesigner from "../../sql-designer";
export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    columnEditor,
    SqlDesigner,
  },
  data() {
    return {
      showColum: false,
      showScript: false,
      curSql: null,
      showDeisgner: { show: false },
    };
  },
  computed: {
    fieldOptions() {
      return this.cpnt.store.search({
        options: { db: true },
        onlyData: true,
        beforePush: (item) => {
          if (item.fid === this.cpnt.fid) return false;
          if (item.parent.CPNT.host_db) return false;
          return true;
        },
      });
    },
    autoGenFields() {
      if (!this.cpnt.data._copyTarget) return [];
      const cpnt = this.cpnt.store.searchByField(this.cpnt.data._copyTarget);
      if (cpnt && cpnt.cache.fieldOptions) {
        return cpnt.cache.fieldOptions;
      }
    },
  },
  methods: {
    addScript() {
      this.cpnt.data._script.push({ sql: [], param: {} });
    },
    delScript(index) {
      this.cpnt.data._script.splice(index, 1);
    },
    delScriptItem(data, key) {
      this.$delete(data, key);
    },
    addScriptItem(field, row) {
      if (!field) {
        return this.$message.error("未设置字段");
      }
      this.$set(row.param, field, "");
    },
    getName(key) {
      return _.find(this.fieldOptions, { _fieldValue: key })._fieldName;
    },
    goDesigner(index) {
      if (typeof this.cpnt.data._script[index].sql === "string") {
        this.$set(this.cpnt.data._script[index], "sql", []);
      }
      this.curSql = this.cpnt.data._script[index].sql;
      this.showDeisgner.show = true;
    },
  },
};
</script>
<style lang="less">
.pscript-item {
  display: flex;
  align-items: center;
  margin-top: 5px;
  span {
    width: 200px;
  }
  i {
    width: 100px;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
  }
}
</style>
