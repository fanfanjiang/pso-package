<template>
  <div class="act-panel-body">
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" :info="info"></panel-header>
    <el-form size="small" label-position="top" label-width="80px" :model="cpnt.data">
      <el-form-item label="名称">
        <el-input size="mini" v-model.trim="cpnt.data._fieldName" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="needPlaceholder" label="引导文字">
        <el-input size="mini" v-model="cpnt.data._placeholder" clearable></el-input>
      </el-form-item>
      <el-form-item label="字段长度">
        <el-input-number size="mini" v-model="cpnt.data._fieldLen" controls-position="right" :min="3"></el-input-number>
      </el-form-item>
      <el-form-item label="字段类型">
        <el-select size="mini" v-model="cpnt.data._fieldFormat" placeholder="请选择">
          <el-option v-for="item in FIELD_FORMAT" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字段存储类型">
        <el-select size="mini" v-model="cpnt.data._fieldType" placeholder="请选择">
          <el-option label="字符串" value="String"></el-option>
          <el-option label="Text" value="Text"></el-option>
          <el-option label="数值" value="Int"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="needDefaultValue" :label="defalutValueLabel">
        <el-input size="mini" v-model="cpnt.data._defaultValue" clearable></el-input>
      </el-form-item>
      <el-form-item label="动态默认值">
        <el-select size="mini" v-model="cpnt.data._association" filterable clearable>
          <el-option-group v-for="(g, index) in fieldsCollection" :key="index" :label="g.n">
            <el-option v-for="opt in g.v" :key="opt.fid" :label="opt._fieldName" :value="opt.fid"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <slot></slot>
      <el-form-item label="验证">
        <div class="act-panel_check">
          <el-switch size="mini" v-model="cpnt.data._required" active-text="必填"></el-switch>
        </div>
        <div class="act-panel_check">
          <el-switch v-if="needUnique" size="mini" v-model="cpnt.data._unique" active-text="不允许重复"></el-switch>
        </div>
        <el-input size="mini" placeholder="正则验证" v-model="cpnt.data._regular" clearable></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <div class="act-panel_check">
          <el-switch size="mini" v-model="cpnt.data._read" active-text="用户只读"></el-switch>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">
              设为只读的字段将不允许被用户直接编辑。
              <br />但仍可以在自定义按钮和工作流中填写或更新
            </div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="act-panel_check">
          <el-switch size="mini" v-model="cpnt.data._hideOnNew" active-text="新增记录时隐藏"></el-switch>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">
              通常用于隐藏一些不需要在新增记录时显示的字段。
              <br />如：用于新订单的后续处理的字段，可以在新增记录时隐藏。 <br />但仍可以在自定义按钮和工作流中填写或更新
            </div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="act-panel_check">
          <el-switch size="mini" v-model="cpnt.data._hideForever" active-text="永久隐藏"></el-switch>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">通常用于隐藏一些不需要用户填入的字段。</div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="字典名称">
        <el-input
          size="mini"
          v-model.trim="cpnt.data._fieldValue"
          :disabled="!!(!cpnt.data._fvEditable || (!!cpnt.store.data_code && !cpnt.add && cpnt.store.is_pub))"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="是否加密">
        <el-switch size="mini" v-model="cpnt.data._encry" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="fid">
        <el-input size="mini" v-model.trim="cpnt.data.fid" clearable></el-input>
      </el-form-item>
      <el-form-item label="输出格式">
        <el-input size="mini" :clearable="true" type="textarea" v-model.trim="cpnt.data._outputFormat"></el-input>
      </el-form-item>
      <el-form-item label="转换字段集">
        <el-input size="mini" :clearable="true" type="textarea" v-model.trim="cpnt.data._transFields"></el-input>
      </el-form-item>
      <el-form-item label="字段说明">
        <el-input size="mini" type="textarea" :rows="2" v-model="cpnt.data._fieldInfo" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";
import { FIELD_FORMAT } from "../../../const/form";
import { FieldsMixin } from "../mixin";

export default {
  mixins: [FieldsMixin],
  props: {
    cpnt: {
      type: Object,
    },
    info: {
      type: String,
      default: "",
    },
    needDefaultValue: {
      type: Boolean,
      default: true,
    },
    defalutValueLabel: {
      type: String,
      default: "默认值",
    },
    needPlaceholder: {
      type: Boolean,
      default: false,
    },
    needUnique: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    panelHeader,
  },
  data() {
    this.FIELD_FORMAT = FIELD_FORMAT;
    return {};
  },
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