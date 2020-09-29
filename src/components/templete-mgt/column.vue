<template>
  <div v-loading="initializing">
    <el-button size="mini" type="primary" plain @click="handleAdd">添加列</el-button>
    <el-table key="list" :data="data" style="width: 100%" height="500">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column label="字段" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.field" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示名名称" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="列宽" width="140">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.width" controls-position="right" :min="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="顺序" width="160">
        <template slot-scope="scope">
          <el-input-number
            size="mini"
            v-model="scope.row.number"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="显示" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.show" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="统计" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.cal" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="计算字段" width="100" v-if="formulable">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.formulable" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否查询" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.searchable" active-value="1" inactive-value="0"></el-switch>
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
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="handleParams(scope.$index)">参数</el-button>
          <el-button size="mini" plain @click="handleDrill(scope.$index)">钻取</el-button>
          <el-button v-if="formulable" size="mini" plain @click="formulaHandler(scope.$index)">公式</el-button>
          <el-button size="mini" plain @click="handleDel(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="header">
      <pso-title>表头设置</pso-title>
      <el-tree
        :data="header"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        draggable
      >
        <span class="tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">添加</el-button>
            <el-button v-if="data.id!=='0'" type="text" size="mini" @click="() => edit(data)">编辑</el-button>
            <el-button
              v-if="data.id!=='0'"
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog
      v-if="header"
      title="设置表头"
      append-to-body
      :visible.sync="showHEditor"
      :width="'400px'"
    >
      <el-form label-width="80px" v-if="showHEditor">
        <el-form-item label="真实字段">
          <el-switch size="mini" v-model="hData.isField" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="名称">
          <el-input size="mini" v-model="hData.label" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择字段" v-if="hData.isField==='1'">
          <el-select filterable size="mini" v-model="hData.field">
            <el-option
              v-for="item in data"
              :key="item.field"
              :label="item.name"
              :value="item.field"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showHEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置钻取参数" append-to-body :visible.sync="showDrill" :width="'600px'">
      <el-form label-width="110px" v-if="showDrill">
        <el-form-item label="统计插件">
          <el-select
            clearable
            filterable
            size="mini"
            v-model="curCol.drillTarget"
            @change="drillChange"
          >
            <el-option
              v-for="tp in menus"
              :key="tp.menu_link"
              :label="tp.node_display"
              :value="tp.menu_link"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-if="curCol&&curCol.drillTarget">
        <el-button size="mini" plain @click="drillAdd()">添加参数</el-button>
        <el-table key="params" :data="curCol.drillParams" style="width: 100%" height="300">
          <el-table-column label="原字段">
            <template slot-scope="scope">
              <el-select clearable filterable size="mini" v-model="scope.row.s">
                <el-option
                  v-for="item in data"
                  :key="item.field"
                  :label="item.name"
                  :value="item.field"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="目标字段">
            <template slot-scope="scope">
              <el-select clearable filterable size="mini" v-model="scope.row.t">
                <el-option
                  v-for="item in tempFields"
                  :key="item.field"
                  :label="item.name"
                  :value="item.field"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="mini" plain @click="drillDel(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showDrill = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveDrill()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置查询参数" append-to-body :visible.sync="showParamsditor" :width="'600px'">
      <template v-if="curCol">
        <pso-title>{{curCol.name}}</pso-title>
        <el-form label-position="left" label-width="80px">
          <el-form-item label="值类型">
            <el-select filterable size="mini" v-model="curCol.searchType">
              <el-option
                v-for="item in FILTER_TYPE_ARY"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作" v-if="curCol.searchType">
            <el-select filterable size="mini" v-model="curCol.searchOp">
              <el-option
                v-for="item in getOpTypes(curCol.searchType)"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认值" v-if="curCol.searchType">
            <el-input size="mini" v-model="curCol.defaultVal"></el-input>
          </el-form-item>
        </el-form>
        <template>
          <el-button size="mini" plain @click="handleParamsAdd()">添加参数</el-button>
          <el-table key="params" :data="curCol.searchList" style="width: 100%" height="300">
            <el-table-column label="参数名" width="140">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.n" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="参数值" width="140">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.v" placeholder></el-input>
              </template>
            </el-table-column>
            <el-table-column label="作为默认" width="140">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.d"></el-switch>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="90">
              <template slot-scope="scope">
                <el-button size="mini" plain @click="handleParamsDel(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="$emit('save')">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <pso-drawer
      v-if="formulable"
      size="50%"
      :visible="showDesigner"
      title="设计脚本"
      @close="showDesigner=false"
    >
      <template v-slot:whole>
        <formula-designer
          v-if="curCol"
          :value="curCol.formula"
          :cpnts="cpnts"
          @cancel="showDesigner=false"
          @confirm="handleConfirm"
        ></formula-designer>
      </template>
    </pso-drawer>
  </div>
</template>
<script>
import formulaDesigner from "../form-designer/formula-designer";
import { genComponentData } from "../form-designer/helper";
import { STATIC_COLUMN_FIELDS } from "../../const/sys";
import { FILTER_TYPE_ARY } from "../../../share/const/filter";
import { formatJSONList } from "../../utils/util";
import { MENU_TYPE } from "../../const/menu";

import shortid from "shortid";
export default {
  props: {
    data: {
      type: Array,
    },
    header: {
      type: Array,
    },
    formulable: {
      type: Boolean,
      default: true,
    },
    extend: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { formulaDesigner },
  data() {
    return {
      initializing: true,
      showDesigner: false,
      showHEditor: false,
      showParamsditor: false,
      showDrill: false,
      cpnts: [],
      curCol: null,
      curNode: null,
      hData: {
        isField: "1",
        label: "",
        field: "",
      },
      op: "",
      templetes: [],
      tempFields: [],
      tempCache: {},
      menus: [],
      FILTER_TYPE_ARY: FILTER_TYPE_ARY,
    };
  },
  async created() {
    this.initializing = true;
    if (this.header && !this.header.length) {
      this.header.push({ label: "表头", id: "0", field: "0", children: [] });
    }

    const templetes = (await this.API.getTempleteTree()).filter((i) => i.tp_type === 1);
    const menus = await this.API.getAllMenu();
    this.menus = menus.data.nav.filter((m) => {
      return m.is_leaf && m.menu_type === MENU_TYPE[0].v && _.find(templetes, { node_name: m.menu_link });
    });

    for (let d of this.data) {
      if (d.drillTarget) {
        await this.drillChange(d.drillTarget);
      }
    }

    this.initializing = false;
  },
  methods: {
    handleAdd() {
      this.data.push({
        ...STATIC_COLUMN_FIELDS,
        ...this.extend,
      });
    },
    handleDel(index) {
      this.data.splice(index, 1);
    },
    makeCpnts() {
      const cpnts = [];
      this.data.forEach((item) => {
        if (item.formulable === "0") {
          if (!item.field) throw new Error("请填写字段");
          cpnts.push(genComponentData({ componentid: "text", fid: item.field, _fieldName: item.name }));
        }
      });
      this.cpnts = cpnts;
    },
    handleConfirm(val) {
      this.curCol.formula = val;
      this.showDesigner = false;
    },
    formulaHandler(index) {
      this.curCol = this.data[index];
      try {
        this.makeCpnts();
      } catch (error) {
        return this.$message(error.message);
      }
      this.showDesigner = true;
    },
    append(data) {
      this.op = "1";
      this.curNode = data;
      this.showHEditor = true;
    },
    edit(data) {
      this.op = "2";
      this.curNode = data;
      Object.assign(this.hData, data);
      delete this.hData.children;
      this.showHEditor = true;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    save() {
      if (this.op === "1") {
        const newChild = { id: shortid.generate(), ...this.hData };
        if (this.hData.isField === "1" && this.hData.field) {
          const f = _.find(this.data, { field: this.hData.field });
          if (f) {
            newChild.label = f.name;
          }
        }
        if (!this.curNode.children) {
          this.$set(this.curNode, "children", []);
        }
        this.curNode.children.push(newChild);
      } else if (this.op === "2") {
        if (this.hData.isField === "1" && this.hData.field) {
          const f = _.find(this.data, { field: this.hData.field });
          if (f) {
            this.hData.label = this.hData.label || f.name;
          }
        }
        Object.assign(this.curNode, { ...this.hData });
      }

      this.showHEditor = false;
    },
    handleParams(index) {
      this.curCol = this.data[index];
      if (this.curCol.searchList.length && typeof this.curCol.searchList[0] === "string") {
        this.curCol.searchList = [];
      }
      this.showParamsditor = true;
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
    handleDrill(index) {
      this.curCol = this.data[index];
      this.showDrill = true;
    },
    drillAdd() {
      this.curCol.drillParams.push({ s: "", t: "" });
    },
    drillDel(index) {
      this.curCol.drillParams.splice(index, 1);
    },
    saveDrill() {
      this.$emit("save");
      this.showDrill = false;
    },
    async drillChange(code) {
      if (this.curCol) {
        this.curCol.drillParams.forEach((d) => (d.t = ""));
      }
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
<style scoped>
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>