<template>
  <el-dialog title="上传EXCEL数据" :visible.sync="showFieldUpload">
    <el-upload
      ref="excelUpload"
      :auto-upload="false"
      accept=".xlsx, .xls"
      :on-change="uploadChange"
      :headers="uploadHeader"
      :action="uploadApi"
      :limit="1"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :before-upload="onBefore"
      :data="uploadExcelData"
    >
      <el-button size="small" type="primary" plain>选择 excel 文件</el-button>
    </el-upload>
    <div v-if="fieldTable.length">
      <el-divider content-position="center">选择字段</el-divider>
      <el-table :data="fieldTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="v" label="字段名"></el-table-column>
        <el-table-column property="t" label="字段类型">
          <template slot-scope="scope">
            <el-tag disable-transitions>{{setFieldType(scope.row.t)}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showFieldUpload = false">取 消</el-button>
      <el-button
        type="primary"
        @click="uploadExcel"
        :loading="submitExcel"
        :disable="submitExcel"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Auth from "../../tool/auth";
import { parseXlsx, checkUniq } from "../../utils/util";

export default {
  components: { fieldSection, previewSection },
  data() {
    return {
      fieldTable: [],
      uploadExcelData: { a: 1 },
      selectedRable: [],
      showFieldUpload: false,
      submitExcel: false,
      excelType: [
        { text: "字符串", value: "s" },
        { text: "日期", value: "d" },
        { text: "数字", value: "n" },
        { text: "布尔", value: "b" }
      ]
    };
  },
  computed: {
    ...mapState(["dataDesign"]),
    uploadApi() {
      return `${this.APIURL}/app/dataForm/excel`;
    },
    uploadHeader() {
      var token = Auth.getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
  },
  methods: {
    setFieldType(value) {
      return _.find(this.excelType, { value }).text;
    },
    handleSelectionChange(selection) {
      this.selectedRable = selection;
    },
    async uploadChange(file, fileList) {
      if (file.status !== "ready") return (this.fieldTable = []);
      try {
        let data = await parseXlsx(file.raw);
        let key = Object.keys(data)[0];
        if (!checkUniq(data[key])) return this.$message.error("字段名称不能重复");
        if (data && data[key] && data[key][0]) this.fieldTable = data[key][0];
      } catch (error) {
        this.$message.error("文件格式错误");
      }
    },
    onSuccess(ret, file, fileList) {
      this.submitExcel = false;
      if (!ret.success) return this.$message.error("上传失败");
      this.$notify({ title: "成功", message: "上传成功", type: "success" });
    },
    onError(err, file, fileList) {
      this.$message.error("上传失败");
      this.submitExcel = false;
    },
    onRemove(file, fileList) {
      this.fieldTable = [];
    },
    uploadExcel() {
      if (!this.selectedRable.length) return this.$message.error("请选择文件并至少选择一个字段");
      let count = 1000;
      this.uploadExcelData = {
        data_type: "excel",
        optype: 0, //1是添加数据
        node_id: this.dataDesign.selected.node_id,
        name: this.dataDesign.selected.node_name,
        app_id: this.dataDesign.appid,
        data: JSON.stringify(
          this.selectedRable.map(item => {
            return { _fieldValue: `rpc${count++}`, _fieldName: item.v, _fieldLen: "1000", _fieldType: "String" };
          })
        )
      };
      this.$nextTick(() => {
        this.submitExcel = true;
        this.$refs.excelUpload.submit();
      });
    }
  }
};
</script>
