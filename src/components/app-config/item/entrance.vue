<template>
  <div v-loading="initializing">
    <el-form-item label="快捷入口名称">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="快捷入口图标">
      <el-input size="small" v-model="data.map_key1">
        <template slot="prepend">
          <el-button icon="el-icon-edit" @click="showIconBox = true"></el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="自定义分类">
      <el-select size="small" v-model="data.map_key4">
        <el-option :label="t.map_key1" :value="t.map_key1" v-for="t in types" :key="t.map_key1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="快捷入口类型">
      <el-select size="small" v-model="data.map_key2" @change="typeChange">
        <el-option :label="t.n" :value="t.v" v-for="t in type" :key="t.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="排序">
      <el-input-number size="mini" v-model="data.map_key5" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="快捷入口" v-if="data.map_key2">
      <el-select v-if="data.map_key2 === 'form'" filterable clearable size="small" v-model="data.map_key3">
        <el-option v-for="item in forms" :key="item.node_name" :label="item.node_display" :value="item.node_name"></el-option>
      </el-select>
      <el-select v-if="data.map_key2 === 'workflow'" filterable clearable size="small" v-model="data.map_key3">
        <el-option v-for="item in workflows" :key="item.node_name" :label="item.node_display" :value="item.node_name"></el-option>
      </el-select>
      <el-select v-if="data.map_key2 === 'menu'" filterable clearable size="small" v-model="data.map_key3">
        <el-option v-for="item in menus" :key="item.node_name" :label="item.node_display" :value="item.node_name"></el-option>
      </el-select>
    </el-form-item>
    <el-dialog title="选择图标" append-to-body :visible.sync="showIconBox" width="80%">
      <pso-picker-icon @select="pickIcon"></pso-picker-icon>
    </el-dialog>
  </div>
</template>
<script>
import { ENTRANCE_TYPE } from "../../../const/app";
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      type: ENTRANCE_TYPE,
      initializing: false,
      showIconBox: false,
      forms: [],
      workflows: [],
      menus: [],
      types: [],
    };
  },
  async created() {
    this.initializing = true;
    this.forms = await this.API.getFormTree();
    //加载表单列表
    this.workflows = await this.API.getWfTree();
    this.menus = await this.API.getMenuTree();

    //加载自定义分类
    const typeRet = await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 13, type: 1 } }) });
    this.types = typeRet.data;

    this.initializing = false;
  },
  methods: {
    pickIcon(value) {
      this.data.map_key1 = value;
      this.showIconBox = false;
    },
    typeChange() {
      this.data.map_key3 = "";
    },
  },
};
</script>
