<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="可以输入一般文字" :needPlaceholder="true">
      <el-form-item label="显示方式">
        <el-radio v-model="cpnt.data._type" label="text">单行</el-radio>
        <el-radio v-model="cpnt.data._type" label="textarea">多行</el-radio>
      </el-form-item>
      <!-- <el-form-item label="扫码录入">
        <el-switch size="mini" v-model="cpnt.data._scannable" active-text="是否支持扫码"></el-switch>
        <div v-if="cpnt.data._scannable">
          <el-radio v-model="cpnt.data._scanType" label="qr">二维码</el-radio>
          <el-radio v-model="cpnt.data._scanType" label="bar">条形码</el-radio>
        </div>
      </el-form-item> -->
      <el-form-item label="模糊查询">
        <el-switch size="mini" v-model="cpnt.data._searchable" active-text="开启模糊查询"></el-switch>
      </el-form-item>
      <picker-form
        v-if="cpnt.data._searchable"
        :data="cpnt.data"
        form-field="_searchForm"
        :fields="[{ n: '查询字段', f: '_searchField' }]"
        @loaded="loadedHandler"
      ></picker-form>
      <el-form-item label="模糊查询显示字段" v-if="cpnt.data._searchable">
        <el-select multiple clearable filterable size="mini" v-model="cpnt.data._searchDisplay">
          <el-option v-for="u in fields" :key="u._fieldValue" :label="u.fieldDisplay" :value="u._fieldValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="绑定其它字段" v-if="cpnt.data._searchable">
        <div class="act-text-body__shit" v-for="(f, i) in cpnt.data._bindFields" :key="i">
          <el-select size="mini" v-model="f.sid" placeholder="源字段">
            <el-option v-for="u in fields" :key="u._fieldValue" :label="u.fieldDisplay" :value="u._fieldValue"></el-option>
          </el-select>
          <el-select size="mini" v-model="f.tid" placeholder="目标字段">
            <el-option v-for="u in cpnts" :key="u.fid" :label="u._fieldName" :value="u._fieldValue"></el-option>
          </el-select>
          <el-button size="mini" round @click="delShit(i)">删除</el-button>
        </div>
        <el-button @click="addOption" type="success" icon="el-icon-plus" size="mini" round plain>添加字段</el-button>
      </el-form-item>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import PickerForm from "../../picker/pso-picker-form";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    PickerForm,
  },
  data() {
    return {
      fields: [],
    };
  },
  computed: {
    isSetCurrent() {
      return this.cpnt.data._defaultValType === "current";
    },
    cpnts() {
      return this.cpnt.store.search({ options: { db: true }, onlyData: true });
    },
  },
  methods: {
    loadedHandler({ fields }) {
      this.fields = fields;
    },
    addOption() {
      this.cpnt.data._bindFields.push({ sid: "", nid: "" });
    },
    delShit(i) {
      this.cpnt.data._bindFields.splice(i, 1);
    },
  },
};
</script>
