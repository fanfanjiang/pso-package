<template>
  <div style="margin-top:15px">
    <div class="pso-table-controller">
      <el-button size="small" type="primary" plain @click="addHandler()">新增</el-button>
    </div>
    <el-table key="field" :data="data" style="width: 100%" height="600" v-loading="loading">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column prop="wf_filetype" label="文件类型"></el-table-column>
      <el-table-column prop="wf_font_script" label="文件脚本"></el-table-column>
      <el-table-column prop="wf_note" label="文件描述"></el-table-column>
      <el-table-column prop="font_auto_no" label="启用键数"  width="100"></el-table-column>
      <el-table-column prop="font_auto_key1" label="自增键1" width="100"></el-table-column>
      <el-table-column prop="font_auto_key2" label="自增键2" width="100"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="editHandler(scope.$index)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="设置文件类型" append-to-body :visible.sync="showEditor" :width="'400px'">
      <el-form label-width="80px" v-if="showEditor">
        <el-form-item label="文件类型">
          <el-input size="small" v-model="curData.wf_filetype" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件脚本">
          <el-input size="small" v-model="curData.wf_font_script" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件描述">
          <el-input size="small" v-model="curData.wf_note" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="启用键数">
          <el-input-number
            size="small"
            v-model="curData.font_auto_no"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="自增键1">
          <el-input-number
            size="small"
            v-model="curData.font_auto_key1"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="自增键2">
          <el-input-number
            size="small"
            v-model="curData.font_auto_key2"
            controls-position="right"
            :min="0"
          ></el-input-number>
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
  props: ["node"],
  data() {
    return {
      curIndex: -1,
      data: [],
      loading: false,
      showEditor: false,
      curData: {
        wf_filetype: "",
        wf_font_script: "",
        wf_note: "",
        font_auto_no: 1,
        font_auto_key1: 1,
        font_auto_key2: 1
      }
    };
  },
  watch: {
    "node.node_name": {
      immediate: true,
      handler() {
        this.fetch();
      }
    }
  },
  methods: {
    async fetch() {
      this.loading = true;
      const ret = await this.API.wfFileType();
      if (ret.success) {
        this.data = ret.data;
      }
      this.loading = false;
    },
    delHandler(index) {
      this.submitHandler({ ...this.data[index], optype: 2 });
    },
    editHandler(index) {
      this.curIndex = index;
      this.curData = Object.assign(this.curData, this.data[index]);
      this.$nextTick(() => {
        this.showEditor = true;
      });
    },
    addHandler() {
      this.curIndex = -1;
      this.showEditor = true;
    },
    async saveHandler() {
      const data = this.curData;
      if (this.curIndex !== -1) {
        data.optype = 1;
      } else {
        data.optype = 0;
      }
      this.showEditor = false;
      this.submitHandler(data);
    },
    async submitHandler(data) {
      const ret = await this.API.wfFileType(data, "put");
      this.fetch();
    }
  }
};
</script>