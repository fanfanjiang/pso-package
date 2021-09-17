<template>
  <div class="form-column-shit">
    <el-row :gutter="10">
      <el-col :xs="8" :sm="8" :md="6" v-for="(d, i) in data.column" :key="i">
        <c-item :instance="d" @edit="editCol(d)"></c-item>
      </el-col>
      <el-col :xs="8" :sm="8" :md="6">
        <div class="pso-card-item" style="height: 192px; margin-bottom: 10px" @click="newCol">
          <div class="pso-card-item-plus">
            <i class="el-icon-plus"></i>
            <span>添加视图</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <pso-drawer
      size="65%"
      title="视图设置"
      :modal="true"
      :destroy="true"
      :visible="opener.show"
      @close="opener.show = false"
      customclass="design-drawer withoutmodel"
    >
      <c-edit :instance="curInst" :store="store" :isnew="isnew" :actions="actions"></c-edit>
      <template #footer>
        <div class="form-column-shit-footer">
          <el-button size="large" type="primary" @click="saveColumn">保 存</el-button>
        </div>
      </template>
    </pso-drawer>
  </div>
</template>
<script>
import CItem from "./item";
import CEdit from "./edit";
import { formatJSONList } from "../../../utils/util";
import { FORM_COLUMN_FIELDS } from "../../../const/sys";

const BASE = {
  name: "",
  id: "",
  actions: [],
  data: [],
  fieldTitle: "",
  fieldPic: "",
  fieldContent: [],
  fieldTime: "",
  timeAgo: true,
  expanding: false,
  limit: 20,
  defAction: [],
  topAction: [],
  rowAction: [],
  qsearch: [],
  tsearch: "",
  searchposition: "left",
};

export default {
  components: { CItem, CEdit },
  props: {
    data: Object,
    defCol: Array,
    store: Object,
    actions: Array,
  },
  data() {
    return {
      opener: { show: false },
      curInst: null,
      isnew: false,
    };
  },
  created() {
    formatJSONList(this.data.column, BASE);
  },
  methods: {
    newCol() {
      this.curInst = {
        ..._.cloneDeep(BASE),
        id: psodataid(),
        data: formatJSONList(_.cloneDeep(this.defCol), FORM_COLUMN_FIELDS),
      };
      this.opener.show = true;
      this.isnew = true;
    },
    editCol(data) {
      this.curInst = data;
      this.opener.show = true;
      this.isnew = false;
    },
    saveColumn() {
      if (!this.curInst.name) {
        return this.$message({ message: "请填写视图名称", type: "warning" });
      }
      if (this.isnew) {
        this.data.column.push(this.curInst);
      }
      this.$emit("save");
      this.opener.show = false;
    },
  },
};
</script>
<style lang="less">
.form-column-shit {
}
.form-column-shit-footer {
  padding: 20px;
  background: #fff;
  text-align: left;
}
.pso-card-item-plus {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  i {
    font-weight: bold;
    font-size: 50px;
    color: #666;
  }
  span {
    color: #666;
    margin-top: 15px;
    font-size: 16px;
  }
}
</style>