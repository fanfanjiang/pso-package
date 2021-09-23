<template>
  <div style="padding: 0 0 100px 15px; height: 100%; overflow: auto">
    <div style="font-size: 17px; font-weight: bold; margin: 0 0 0 15px 0">动作设置</div>
    <el-form label-position="top" size="mini">
      <el-form-item label="按钮名称">
        <el-input size="small" v-model="action.name"></el-input>
      </el-form-item>
      <el-form-item label="按钮颜色">
        <div class="action-color-picker">
          <span
            v-for="(c, i) in COLORS"
            :key="i"
            :class="{ active: c === action.color }"
            :style="getColorStyle(c)"
            @click="action.color = c"
          >
            <i class="el-icon-check"></i>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="按钮图标">
        <el-button type="primary" icon="el-icon-edit" circle @click="showIcon = true"></el-button>
      </el-form-item>
      <el-form-item label="按钮说明">
        <el-input type="text" v-model="action.remark"> </el-input>
      </el-form-item>
      <el-form-item label="按钮放置位置">
        <el-radio-group :disabled="action.id === 'add'" v-model="action.location">
          <el-radio label="1">数据表格上方</el-radio>
          <el-radio label="2">每行数据中</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="启用按钮">
        <el-radio-group :disabled="action.id === 'add'" v-model="action.method" @change="checkMethod">
          <el-radio label="1">一直（需要选择数据）</el-radio>
          <el-radio label="2">满足条件（需要选择数据）</el-radio>
          <el-radio label="3">全局（不需要选择数据）</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="form-action-panel" v-if="action.method === '2'">
        <div class="form-action-panel__info">
          <div>设置按钮条件</div>
          <div>只有数据满足条件时，才可以使用按钮</div>
        </div>
        <div style="width: 500px">
          <dynamic-rule
            :rules="action.rule"
            :type="action.ruleType"
            :options="options"
            sysable
            @typechange="rtChangeHandler"
          ></dynamic-rule>
        </div>
      </div>
      <el-form-item label="点击前执行脚本">
        <el-switch v-model="action.beforeScriptable"> </el-switch>
        <el-button
          style="margin-left: 10px"
          v-if="action.beforeScriptable"
          type="primary"
          icon="el-icon-edit"
          circle
          @click="openScript('beforeScript')"
        ></el-button>
      </el-form-item>
      <div class="form-action-panel" v-if="action.beforeScriptable">
        <el-form-item label="显示提示信息">
          <el-switch v-model="action.showBefMsg"> </el-switch>
        </el-form-item>
      </div>
      <template v-if="action.id !== 'add'">
        <el-form-item label="点击后">
          <el-radio-group :disabled="action.id === 'add'" v-model="action.mode" @change="checkMode">
            <el-radio label="1">立即执行</el-radio>
            <el-radio label="2">需要二次确认</el-radio>
            <el-radio label="3">填写指定内容</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="form-action-panel" v-if="action.mode === '3'">
          <div class="form-action-panel__info">
            <div>设置填写内容</div>
            <div>用户点击按钮后，立即弹出表单并填写指定的内容。</div>
          </div>
          <el-form-item>
            <el-radio-group v-model="action.modeTarget">
              <el-radio label="1">当前表单</el-radio>
              <el-radio label="2" disabled="disabled">关联表单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="action.modeContent">
              <el-radio label="1">填写指定字段</el-radio>
              <el-radio label="2" disabled="disabled">新建关联记录</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="action.modeContent === '1'">
            <el-button class="el-dropdown-link" size="small" icon="el-icon-plus" @click="showFields = true">设置字段</el-button>
            <div>
              <div class="action-fields" v-for="(v, k, i) in action.fields" :key="i">
                <div v-if="getField(k)">{{ getField(k)._fieldName }}</div>
                <div>
                  <field-check :data="action.fields" :field="k"></field-check>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-form-item label="禁止编辑">
          <el-switch v-model="action.diseditable"> </el-switch>
        </el-form-item>
        <el-form-item label="是否可批量执行">
          <el-radio-group v-model="action.batchable">
            <el-radio label="1">否</el-radio>
            <el-radio label="2">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item label="点击后保存数据前执行脚本(暂不可用)">
        <el-switch v-model="action.befSaveScriptable"> </el-switch>
        <el-button
          style="margin-left: 10px"
          v-if="action.befSaveScriptable"
          type="primary"
          icon="el-icon-edit"
          circle
          @click="openScript('befSaveScript')"
        ></el-button>
      </el-form-item>
      <el-form-item label="点击后保存数据后(如果有数据)执行脚本">
        <el-switch v-model="action.scriptable"> </el-switch>
        <el-button
          style="margin-left: 10px"
          v-if="action.scriptable"
          type="primary"
          icon="el-icon-edit"
          circle
          @click="openScript('script')"
        ></el-button>
      </el-form-item>
      <el-form-item label="点击后打开表单视图">
        <el-switch v-model="action.linkFormView"> </el-switch>
      </el-form-item>
      <div class="form-action-panel" v-if="action.linkFormView">
        <el-form-item label="配置视图">
          <el-button size="small" type="primary" plain @click="showFV = true">配置视图</el-button>
        </el-form-item>
        <el-form-item label="视图权限">
          <auth-edit v-model="action.FormViewAuth" :data="MENU_LEAF_AUTH"></auth-edit>
        </el-form-item>
        <div class="pso-table-controller">
          <el-button size="small" type="primary" plain @click="addHandler">添加动作参数</el-button>
        </div>
        <el-table key="status" size="small" border :data="action.formViewField" style="width: 100%">
          <el-table-column label="原字段" width="160">
            <template slot-scope="scope">
              <el-select size="small" clearable v-model="scope.row.s">
                <el-option v-for="(o, i) in optionsWithsys" :label="o._fieldName" :key="i" :value="o._fieldValue"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="目标字段" width="160">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.t" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="delHandler(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form-item label="点击后打开页面">
        <el-switch v-model="action.linkable"> </el-switch>
      </el-form-item>
      <div class="form-action-panel" v-if="action.linkable">
        <el-form-item label="绑定插件">
          <el-select size="small" clearable filterable v-model="action.bindPlugin">
            <el-option v-for="(p, i) in plugins" :key="i" :label="p.node_display" :value="p.node_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input size="small" v-model="action.openLink"></el-input>
        </el-form-item>
        <el-form-item label="参数">
          <el-select size="small" multiple clearable filterable v-model="action.linkParams">
            <el-option v-for="(o, i) in optionsWithsys" :key="i" :label="o._fieldName" :value="o._fieldValue"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <sql-designer ref="designer" :opener="sqlOpener" :sql="curScript" :scode="code"></sql-designer>
    <el-dialog title="选择图标" append-to-body :visible.sync="showIcon" width="80%">
      <pso-picker-icon @select="pickIcon"></pso-picker-icon>
    </el-dialog>
    <el-dialog title="选择字段" append-to-body :visible.sync="showFields" width="50%">
      <el-checkbox-group v-model="checkedFields">
        <el-checkbox v-for="(o, i) in options" :label="o._fieldValue" :key="i">{{ o._fieldName }}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
    <pso-dialog :visible="showFV" width="70%" @close="showFV = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>表单视图配置</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <f-setter v-if="fvcode" :node="action" :code="fvcode.node_name" :data="action.formViewOpts" :sources="optionsWithsys"></f-setter>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import SqlDesigner from "../../sql-designer";
import PsoPickerIcon from "../../picker/pso-picker-icon";
import DynamicRule from "../../dynamic-rule";
import FieldCheck from "./field-check";
import FSetter from "../../plugin-setter/setter";
import AuthEdit from "../../common-auth/edit";
import { MENU_LEAF_AUTH } from "../../../const/menu";

const COLORS = ["#409EFF", "#67C23A", "#E6A23C", "#F56C6C", "#9C27B0"];

export default {
  components: { SqlDesigner, PsoPickerIcon, DynamicRule, FieldCheck, FSetter, AuthEdit },
  props: {
    action: Object,
    options: Array,
    code: String,
    plugins: Array,
    optionsWithsys: Array,
  },
  data() {
    this.COLORS = COLORS;
    this.MENU_LEAF_AUTH = MENU_LEAF_AUTH;
    return {
      sqlOpener: { show: false },
      showIcon: false,
      curScript: [],
      showFields: false,
      showFV: false,
      checkedFields: [],
    };
  },
  computed: {
    fvcode() {
      return _.find(this.plugins, { node_display: "表单视图" });
    },
  },
  watch: {
    checkedFields: {
      deep: true,
      handler() {
        this.checkActionField();
      },
    },
  },
  async created() {
    this.curScript = this.action.script;
    for (let key in this.action.fields) {
      this.checkedFields.push(key);
    }
    this.checkActionField();
    this.action.color = this.action.color || COLORS[0];
    if (this.action.id === "add") {
      this.action.method = "3";
      this.action.mode = "3";
    }
  },
  methods: {
    getColorStyle(color) {
      return {
        background: color,
      };
    },
    pickIcon(icon) {
      this.action.icon = icon;
      this.showIcon = false;
    },
    openScript(script) {
      this.curScript = this.action[script];
      this.sqlOpener.show = true;
    },
    getField(_fieldValue) {
      return _.find(this.options, { _fieldValue });
    },
    checkActionField() {
      for (let o of this.options) {
        if (this.checkedFields.indexOf(o._fieldValue) !== -1) {
          if (typeof this.action.fields[o._fieldValue] === "undefined") {
            this.$set(this.action.fields, o._fieldValue, 2);
          }
        } else {
          this.$delete(this.action.fields, o._fieldValue);
          delete this.action.fields[o._fieldValue];
        }
      }
      for (let f in this.action.fields) {
        const exist = _.find(this.options, { _fieldValue: f });
        if (!exist) {
          this.$delete(this.action.fields, f);
          delete this.action.fields[f];
        }
      }
    },
    checkMethod(value) {
      if (value === "1") {
        this.action.rule.splice(0);
      }
    },
    checkMode(value) {
      if (value !== "3") {
        this.action.fields = {};
      } else {
        this.action.batchable = "1";
      }
    },
    rtChangeHandler(type) {
      this.action.ruleType = type;
    },
    addHandler() {
      this.action.formViewField.push({ t: "", s: "" });
    },
    delHandler(index) {
      this.action.formViewField.splice(index, 1);
    },
  },
};
</script>
<style lang="less">
.action-color-picker {
  display: flex;
  height: 40px;
  align-items: center;
  span {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    display: block;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &.active {
      i {
        transition: all 0.3s ease;
        opacity: 1;
      }
    }
    &:hover {
      width: 40px;
      height: 40px;
      transition: all 0.3s ease;
      i {
        font-size: 24px;
        transition: all 0.3s ease;
      }
    }
    & + span {
      margin-left: 10px;
    }
  }
  i {
    color: #fff;
    transition: all 0.3s ease;
    opacity: 0;
  }
}
.form-action-panel {
  background: #f8fafd;
  padding: 15px;
  margin-bottom: 20px;
  .form-action-panel__info {
    margin-bottom: 10px;
    div:last-child {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
    }
  }
}
.action-fields {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
</style>