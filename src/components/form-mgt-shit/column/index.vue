<template>
  <div class="form-column-shit">
    <el-row :gutter="10">
      <el-col :xs="8" :sm="8" :md="6" v-for="(d, i) in data.column" :key="i">
        <c-item :instance="d" @edit="editCol(d)"></c-item>
      </el-col>
      <el-col :xs="8" :sm="8" :md="6">
        <div class="pso-card-item" style="height: 152px; margin-bottom: 10px" @click="newCol">
          <div class="pso-card-item-plus">
            <i class="el-icon-plus"></i>
            <span>添加视图</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <pso-drawer
      size="70%"
      title="视图设置"
      :modal="true"
      :destroy="true"
      :visible="opener.show"
      @close="opener.show = false"
      customclass="design-drawer withoutmodel"
    >
      <c-edit :instance="curInst" :store="store" :isnew="isnew" :actions="actions"></c-edit>
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
  },
};
</script>
<style lang="less">
.form-column-shit {
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
    font-size: 40px;
    color: #999;
  }
  span {
    color: #999;
    margin-top: 15px;
  }
}
</style>