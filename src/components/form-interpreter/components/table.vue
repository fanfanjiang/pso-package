<template>
  <div class="pso-form-table">
    <div class="pso-form-table__wrapper">
      <el-divider content-position="left">{{cpnt.data._fieldName}}</el-divider>
      <el-table
        v-loading="loadingTable"
        v-if="!loadingTable"
        :data="cpnt.data._val.dataArr"
        style="width: 100%"
        size="small"
        @row-click="instanceClick"
      >
        <el-table-column
          :prop="tableItem._fieldValue"
          :label="tableItem._fieldName"
          v-for="tableItem of cpnt.data.children"
          :key="tableItem.fid"
        >
          <template slot-scope="scope">
            <el-tag v-if="tableItem.componentid === 'attachment'" size="mini">附件</el-tag>
            <div v-else>{{scope.row[tableItem._fieldValue]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.optype===2"
              else
              size="mini"
              type="success"
              @click.stop.prevent="restoreData(scope.$index)"
            >恢复</el-button>
            <el-button
              v-else
              size="mini"
              type="danger"
              @click.stop.prevent="deleteData(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pso-skeleton v-else :lines="5"></pso-skeleton>
    </div>
    <div class="pso-form-table__footer">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addSubData">添加数据</el-button>
    </div>
    <pso-drawer size="40%" :visible="show" :title="cpnt.data._fieldName" @close="show=false">
      <div class="pso-form-table__sub">
        <pso-form-interpreter
          v-if="!loadingTable"
          :key="cpnt.data.fid"
          ref="formImage"
          :form-entity="store"
          :data-instance="currentData"
        ></pso-form-interpreter>
      </div>
      <template v-slot:footer>
        <div class="pso-drawer-footer__body">
          <el-button type="primary" size="small" @click="confirm">确认</el-button>
        </div>
      </template>
    </pso-drawer>
  </div>
</template> 
<script>
import PsoFileList from "../../file-list/index.vue";
import cpntMixin from "../mixin";
import FormStore from "../../form-designer/model/store.js";

export default {
  name: "pso-form-table",
  components: { PsoFormInterpreter: () => import("../index"), PsoFileList },
  mixins: [cpntMixin],
  data() {
    return {
      show: false,
      currentData: null,
      loadingTable: false,
      oriData: [],
      store: {}
    };
  },
  created() {
    this.store = new FormStore({ data_code: this.cpnt.fid, data_config: this.cpnt.data.children });
    this.$set(this.cpnt.data, "_val", { datacode: this.cpnt.fid, dataArr: [] });
  },
  watch: {
    "cpnt.store.instance_id": {
      immediate: true,
      handler(val) {
        if (val) this.getSubFormData();
      }
    }
  },
  methods: {
    async getSubFormData() {
      this.loadingTable = true;
      let ret = await this.API.form({ data: { parent_id: this.cpnt.store.instance_id, form_code: this.cpnt.fid }, method: "get" });
      this.loadingTable = false;
      if (ret.success) {
        //默认都没修改
        ret.data.forEach(item => (item.optype = 3));

        this.oriData = _.cloneDeep(ret.data);
        this.cpnt.data._val.dataArr = ret.data;
        this.notify();
      }
    },
    async confirm() {
      try {
        let data = (await this.$refs.formImage.makeData()).dataArr[0];
        let { leaf_id } = data;
        let index = _.findIndex(this.cpnt.data._val.dataArr, { leaf_id });

        //默认都是新增
        data.optype = 0;
        this.cpnt.store.instance_id && (data.parent_id = this.cpnt.store.instance_id);

        if (index === -1) {
          this.addData(data);
        } else {
          this.updateData(index, data);
        }
        this.show = false;
      } catch (error) {}
    },
    addData(data) {
      this.cpnt.data._val.dataArr.push(data);
      this.notify();
    },
    updateData(index, data) {
      //如果是原数据，则
      this.isOriData(data) && (data.optype = this.isDataChanged(data) ? 1 : 3);
      this.cpnt.data._val.dataArr.splice(index, 1, data);
      this.notify();
    },
    deleteData(index) {
      let data = this.cpnt.data._val.dataArr[index];
      if (this.isOriData(data)) {
        data.optype = 2;
      } else {
        this.cpnt.data._val.dataArr.splice(index, 1);
      }
      this.notify();
    },
    notify() {
      this.dispatch("PsoformInterpreter", "table-selected", { cpnt: this.cpnt, store: this.store });
    },
    restoreData(index) {
      this.cpnt.data._val.dataArr[index].optype = this.isDataChanged(this.cpnt.data._val.dataArr[index]) ? 1 : 3;
    },
    isDataChanged({ leaf_id }) {
      let curDataItem = _.find(this.cpnt.data._val.dataArr, { leaf_id });
      let oriDataItem = _.find(this.oriData, { leaf_id });
      let isChanged = false;
      Object.keys(curDataItem).forEach(key => {
        if (key !== "optype" && curDataItem[key] !== oriDataItem[key]) isChanged = true;
      });
      return isChanged;
    },
    isOriData({ leaf_id }) {
      return this.oriData.length && _.find(this.oriData, { leaf_id });
    },
    instanceClick(row, column, event) {
      this.currentData = row;
      this.show = true;
    },
    addSubData() {
      this.currentData = null;
      this.show = true;
    }
  }
};
</script>
<style lang="less" scoped>
.pso-form-table__sub {
  padding: 15px;
}
</style>
