<template>
  <div class="custom-column" v-loading="initializing">
    <el-table border size="mini" key="list" :data="column" style="width: 100%">
      <el-table-column type="index" :index="1" width="40"></el-table-column>
      <el-table-column label="字段" width="140" prop="field">
        <template slot-scope="scope">
          <el-input v-if="customizable" size="mini" v-model="scope.row.field"></el-input>
          <span v-else>{{ scope.row.field }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示名名称" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="列宽" width="140">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.width" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="顺序" width="160">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.number" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="显示" width="64" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.show" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="统计" width="64" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.cal" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="查询" width="64" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.searchable" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="字段类型" width="120">
        <template slot-scope="scope">
          <el-select filterable size="mini" v-model="scope.row.searchType">
            <el-option v-for="f in FILTER_TYPE_ARY" :key="f.id" :label="f.name" :value="f.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="对齐方式" width="120">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.align">
            <el-option label="居中" value="center"></el-option>
            <el-option label="居左" value="left"></el-option>
            <el-option label="居右" value="right"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="sortable" label="手动排序" width="100" sortable>
        <template slot-scope="scope">
          <el-switch size="mini" v-model="scope.row.sortable" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="defSort" label="默认排序类型" width="120">
        <template slot-scope="scope">
          <el-select size="mini" clearable v-model="scope.row.defSort">
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="defSortOrder" label="默认排序顺序" width="140">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.defSortOrder" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="handleParams(scope.$index)">参数</el-button>
          <el-button size="mini" plain @click="handleDrill(scope.$index)">钻取</el-button>
          <el-button size="mini" plain @click="handleDel(scope.$index)" v-if="customizable">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pso-dialog :visible="showSearchEditor" @close="showSearchEditor = false" width="60%">
      <template #title>
        <div class="form-executor-header sql-designer-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>设置查询参数</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button size="mini" type="primary" icon="el-icon-upload" @click="saveSearch()">保存</el-button>
          </div>
        </div>
      </template>
      <div style="padding: 15px; overflow: auto; height: 100%" v-if="curCol">
        <pso-title>{{ curCol.name }}</pso-title>
        <el-form size="small" label-position="left" label-width="80px">
          <el-form-item label="值类型">
            <el-select filterable size="mini" v-model="curCol.searchType">
              <el-option v-for="f in FILTER_TYPE_ARY" :key="f.id" :label="f.name" :value="f.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作" v-if="curCol.searchType">
            <el-select filterable size="mini" v-model="curCol.searchOp">
              <el-option v-for="d in getOpTypes(curCol.searchType)" :key="d.id" :label="d.name" :value="d.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认值" v-if="curCol.searchType">
            <el-input size="mini" v-model="curCol.defaultVal"></el-input>
          </el-form-item>
          <el-form-item label="动态选项">
            <el-switch v-model="curCol.dyncoptions"></el-switch>
          </el-form-item>
          <template v-if="curCol.dyncoptions">
            <el-form-item label="统计插件">
              <el-select clearable filterable size="mini" v-model="curCol.dynccode" @change="fetchTemp">
                <el-option v-for="(tp, i) in templetes" :key="i" :label="tp.node_display" :value="tp.node_name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称字段">
              <el-select clearable filterable size="mini" v-model="curCol.dyncname">
                <el-option v-for="(d, i) in tempFields" :key="i" :label="d.name" :value="d.field"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="值字段">
              <el-select clearable filterable size="mini" v-model="curCol.dyncvalue">
                <el-option v-for="(d, i) in tempFields" :key="i" :label="d.name" :value="d.field"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <template v-if="!curCol.dyncoptions">
          <el-button size="mini" type="success" icon="el-icon-plus" @click="handleParamsAdd()">添加参数</el-button>
          <el-table border size="mini" key="params" :data="curCol.searchList" style="width: 100%; margin-top: 10px" height="300">
            <el-table-column label="参数名" width="220">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.n"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="参数值">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.v"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="作为默认" width="100" align="center">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.d"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90" align="center">
              <template slot-scope="scope">
                <el-button size="mini" plain @click="handleParamsDel(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showDrillEditor" @close="showDrillEditor = false" width="60%">
      <template #title>
        <div class="form-executor-header sql-designer-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>设置钻取参数</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button v-if="curCol && curCol.drillTarget" size="mini" type="success" icon="el-icon-plus" @click="drillAdd()">
              添加参数
            </el-button>
            <el-button size="mini" type="primary" @click="saveDrill()">确 定</el-button>
          </div>
        </div>
      </template>
      <div style="padding: 15px; overflow: auto; height: 100%">
        <el-form label-width="70px" v-if="showDrillEditor">
          <el-form-item label="统计插件">
            <el-select clearable filterable size="mini" v-model="curCol.drillTarget" @change="drillChange">
              <el-option v-for="tp in menus" :key="tp.menu_link" :label="tp.node_display" :value="tp.menu_link"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template v-if="curCol && curCol.drillTarget">
          <el-table border size="mini" key="params" :data="curCol.drillParams" style="width: 100%" height="300">
            <el-table-column label="原字段">
              <template slot-scope="scope">
                <el-select clearable filterable size="mini" v-model="scope.row.s">
                  <el-option v-for="item in column" :key="item.field" :label="item.name" :value="item.field"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="目标字段">
              <template slot-scope="scope">
                <el-select clearable filterable size="mini" v-model="scope.row.t">
                  <el-option v-for="item in tempFields" :key="item.field" :label="item.name" :value="item.field"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90" align="center">
              <template slot-scope="scope">
                <el-button size="mini" plain @click="drillDel(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { FILTER_TYPE_ARY } from "../../../share/const/filter";
import { STATIC_COLUMN_FIELDS } from "../../const/sys";
import { assignList, formatJSONList } from "../../utils/util";
import { MENU_TYPE } from "../../const/menu";

export default {
  props: {
    customizable: {
      type: Boolean,
      default: true,
    },
    column: Array,
  },
  data() {
    this.FILTER_TYPE_ARY = FILTER_TYPE_ARY;
    return {
      showSearchEditor: false,
      showDrillEditor: false,
      initializing: false,
      curCol: null,
      menus: [],
      tempFields: [],
      tempCache: {},
      templetes: [],
    };
  },
  async created() {
    this.initializing = true;
    this.templetes = (await this.API.getTempleteTree()).filter((i) => i.tp_type === 1);
    const menus = await this.API.getAllMenu();
    this.menus = menus.data.nav.filter((m) => {
      return m.is_leaf && m.menu_type === MENU_TYPE[0].v && _.find(this.templetes, { node_name: m.menu_link });
    });

    formatJSONList(this.column, STATIC_COLUMN_FIELDS);

    for (let d of this.column) {
      if (d.drillTarget) {
        await this.drillChange(d.drillTarget);
      }
    }
    this.initializing = false;
  },
  methods: {
    handleDel(index) {
      this.column.splice(index, 1);
    },
    handleParams(index) {
      this.curCol = this.column[index];
      if (this.curCol.searchList.length && typeof this.curCol.searchList[0] === "string") {
        this.curCol.searchList = [];
      }
      this.showSearchEditor = true;
    },
    handleParamsAdd() {
      this.curCol.searchList.push({ n: "", v: "", d: false });
    },
    handleParamsDel(index) {
      this.curCol.searchList.splice(index, 1);
    },
    getOpTypes(id) {
      return _.find(FILTER_TYPE_ARY, { id }).op;
    },
    saveSearch() {
      this.$emit("save");
      this.showSearchEditor = false;
    },
    handleDrill(index) {
      this.curCol = this.column[index];
      this.showDrillEditor = true;
    },
    drillAdd() {
      console.log(this.curCol);
      this.curCol.drillParams.push({ s: "", t: "" });
    },
    drillDel(index) {
      this.curCol.drillParams.splice(index, 1);
    },
    saveDrill() {
      this.$emit("save");
      this.showDrillEditor = false;
    },
    async drillChange(code) {
      if (this.curCol) {
        this.curCol.drillParams.forEach((d) => (d.t = ""));
      }
      this.fetchTemp(code);
    },
    async fetchTemp(code) {
      if (this.tempCache[code]) {
        this.tempFields = this.tempCache[code];
      } else {
        const ret = await this.API.getTreeNode({ code });
        if (ret.success) {
          if (ret.data.data.tp_content) {
            this.tempFields = formatJSONList(ret.data.data.tp_content, STATIC_COLUMN_FIELDS);
            return (this.tempCache[code] = this.tempFields);
          }
        }
        this.tempFields = [];
      }
    },
  },
};
</script>