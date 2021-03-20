<template>
  <div class="act-panel-body">
    <panel-header :name="cpnt.store.data_name"></panel-header>
    <el-form size="small" label-position="top" label-width="80px">
      <el-form-item label="表单名称">
        <el-input size="small" v-model="cpnt.store.data_name" clearable></el-input>
      </el-form-item>
      <template v-if="cpnt.store.data_code">
        <el-divider content-position="left">快捷输入</el-divider>
        <el-form-item label="开启">
          <el-switch size="mini" v-model="quickInput.enable"></el-switch>
        </el-form-item>
        <template v-if="quickInput.enable">
          <el-form-item label="输入规则">
            <el-input size="small" v-model="quickInput.reg" clearable></el-input>
          </el-form-item>
          <el-button style="margin-bottom: 5px" size="mini" type="primary" plain @click="addHandler">添加关系</el-button>
          <el-table border size="mini" :data="quickInput.relation" style="width: 100%">
            <el-table-column label="字段">
              <template slot-scope="scope">
                <el-select size="mini" v-model="scope.row.f" clearable>
                  <el-option v-for="(f, i) in cpnt.store.cpntsDataMps" :key="i" :label="f._fieldName" :value="f._fieldValue"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="序号" prop="rule">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.i" :controls="false" :min="0"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </template>
    </el-form>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";

export default {
  components: { panelHeader },
  props: ["cpnt"],
  computed: {
    quickInput: {
      get() {
        return this.cpnt.store.ext_config.quickInput;
      },
      set(value) {
        this.cpnt.store.ext_config.quickInput = value;
      },
    },
  },
  methods: {
    addHandler() {
      this.quickInput.relation.push({ f: "", i: 0 });
    },
    delHandler(index) {
      this.quickInput.relation.splice(index, 1);
    },
  },
};
</script>
