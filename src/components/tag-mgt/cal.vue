<template>
  <div style="margin-top:15px">
    <div class="pso-table-controller">
      <el-button size="small" type="primary" plain @click="addHandler()">新增</el-button>
    </div>
    <el-table
      key="field"
      :data="data"
      style="width: 100%"
      height="600"
      v-loading="loading"
      @row-click="editHandler"
    >
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column prop="c_name" label="计量名"></el-table-column>
      <el-table-column prop="is_base" label="是否基类"></el-table-column>
      <el-table-column prop="c_multiple" label="倍数"></el-table-column>
      <el-table-column prop="c_price" label="单价"></el-table-column>
      <el-table-column prop="c_specs" label="规格"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delHandler(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="设置计量参数" append-to-body :visible.sync="showEditor" :width="'400px'">
      <el-form label-width="80px" v-if="showEditor">
        <el-form-item label="计量名">
          <el-input size="small" v-model="form.c_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否基类">
          <el-switch v-model="form.is_base" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="倍数">
          <el-input-number
            size="small"
            v-model="form.c_multiple"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="单价">
          <el-input size="small" v-model="form.c_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input size="small" v-model="form.c_specs" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveHandler()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["tag"],
  data() {
    return {
      showEditor: false,
      data: [],
      loading: false,
      form: {
        c_name: "",
        is_base: 0,
        c_multiple: 0,
        c_price: "",
        c_specs: "",
        tag_no: this.tag.tag_no
      }
    };
  },
  watch: {
    "tag.tag_no": {
      immediate: true,
      handler() {
        this.fetch();
      }
    }
  },
  methods: {
    async fetch() {
      this.loading = true;
      const ret = await this.API.getTagAttribute({ tag_no: this.tag.tag_no });
      if (ret.success) {
        this.data = ret.data.calc;
      }
      this.loading = false;
    },
    delHandler(data) {
      this.submitHandler({ ...data, optype: 2 });
    },
    editHandler(data) {
      this.form = data;
      this.$nextTick(() => {
        this.showEditor = true;
      });
    },
    addHandler() {
      this.form.tag_code = "";
      this.showEditor = true;
    },
    async saveHandler() {
      if (this.form.c_code) {
        this.form.optype = 1;
      } else {
        this.form.optype = 0;
      }
      this.showEditor = false;
      this.submitHandler(this.form);
    },
    async submitHandler(data) {
      const ret = await this.API.updateUnit(data);
      this.fetch();
    }
  }
};
</script>