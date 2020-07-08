<template>
  <div class="act-panel-body">
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" :info="info"></panel-header>
    <el-form :label-position="'top'" label-width="80px" :model="cpnt.data">
      <el-form-item label="名称">
        <el-input size="small" v-model.trim="cpnt.data._fieldName" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="needPlaceholder" label="引导文字">
        <el-input size="small" v-model="cpnt.data._placeholder" clearable></el-input>
      </el-form-item>
      <el-form-item label="字段长度">
        <el-input-number
          size="small"
          v-model="cpnt.data._fieldLen"
          controls-position="right"
          :min="3"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="字段类型">
        <el-select size="small" v-model="cpnt.data._fieldFormat" placeholder="请选择">
          <el-option
            v-for="item in FIELD_FORMAT"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段存储类型">
        <el-select size="small" v-model="cpnt.data._fieldType" placeholder="请选择">
          <el-option label="字符串" value="String"></el-option>
          <el-option label="Text" value="Text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="needDefaultValue" :label="defalutValueLabel">
        <el-input size="small" v-model="cpnt.data._defaultValue" clearable></el-input>
      </el-form-item>
      <slot></slot>
      <el-form-item label="验证">
        <el-checkbox
          size="small"
          v-model="cpnt.data._required"
          :true-label="true"
          :false-label="false"
        >必填</el-checkbox>
        <el-checkbox
          size="small"
          v-if="needUnique"
          v-model="cpnt.data._unique"
          :true-label="true"
          :false-label="false"
        >不允许重复</el-checkbox>
        <el-input size="small" placeholder="正则验证" v-model="cpnt.data._regular" clearable></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <div class="act-panel_check">
          <el-checkbox
            size="small"
            v-model="cpnt.data._read"
            :true-label="true"
            :false-label="false"
          >用户只读</el-checkbox>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">
              设为只读的字段将不允许被用户直接编辑。
              <br />但仍可以在自定义按钮和工作流中填写或更新
            </div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="act-panel_check">
          <el-checkbox
            size="small"
            v-model="cpnt.data._hideOnNew"
            :true-label="true"
            :false-label="false"
          >新增记录时隐藏</el-checkbox>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">
              通常用于隐藏一些不需要在新增记录时显示的字段。
              <br />如：用于新订单的后续处理的字段，可以在新增记录时隐藏。
              <br />但仍可以在自定义按钮和工作流中填写或更新
            </div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="act-panel_check">
          <el-checkbox
            size="small"
            v-model="cpnt.data._hideForever"
            :true-label="true"
            :false-label="false"
          >永久隐藏</el-checkbox>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">通常用于隐藏一些不需要用户填入的字段。</div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="字典名称">
        <el-input
          size="small"
          v-model.trim="cpnt.data._fieldValue"
          :disabled="!cpnt.data._fvEditable||(!!cpnt.store.data_id&&!cpnt.add)"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="输出格式">
        <el-input
          size="small"
          :clearable="true"
          type="textarea"
          v-model.trim="cpnt.data._outputFormat"
        ></el-input>
      </el-form-item>
      <el-form-item label="转换字段集">
        <el-input
          size="small"
          :clearable="true"
          type="textarea"
          v-model.trim="cpnt.data._transFields"
        ></el-input>
      </el-form-item>
      <el-form-item label="字段说明">
        <el-input size="small" type="textarea" :rows="2" v-model="cpnt.data._fieldInfo" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";
import { FIELD_FORMAT } from "../../../const/form";

export default {
  props: {
    cpnt: {
      type: Object
    },
    info: {
      type: String,
      default: ""
    },
    needDefaultValue: {
      type: Boolean,
      default: true
    },
    defalutValueLabel: {
      type: String,
      default: "默认值"
    },
    needPlaceholder: {
      type: Boolean,
      default: false
    },
    needUnique: {
      type: Boolean,
      default: true
    }
  },
  components: {
    panelHeader
  },
  data() {
    return {
      FIELD_FORMAT: FIELD_FORMAT
    };
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.act-panel_check {
  .tip {
    margin-left: 5px;
    color: #999;
  }
}
@{deep} {
  .el-form-item__label {
    line-height: 20px;
    color: #000;
  }
  .el-select {
    width: 100%;
  }
}
</style>