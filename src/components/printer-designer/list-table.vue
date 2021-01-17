<template>
  <div style="margin-bottom: 20px; display: flex">
    <div style="width: 200px">
      <div class="pso-tabs" style="width: 200px">
        <div class="pso-tabs-header">
          <div class="pso-tabs-title">
            <i class="el-icon-s-custom"></i>
            <span>行</span>
          </div>
          <div class="pso-tabs-r">
            <el-button size="mini" icon="el-icon-plus" circle @click="addHandler(true)"></el-button>
          </div>
        </div>
        <el-tabs tab-position="left" v-model="curTab">
          <el-tab-pane v-for="(n, i) in data" :label="`第${i + 1}行`" :name="i + ''" :key="i">
            <div class="pso-tabs-item" slot="label">
              <span>{{ `第${i + 1}行` }}</span>
              <div class="pso-tabs-item__ctrl">
                <el-popconfirm title="你确定要删除吗？" @confirm="delHandler(i)">
                  <i slot="reference" class="el-icon-delete"></i>
                </el-popconfirm>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs> 
      </div>
    </div>
    <div style="flex: 1; margin-left: 20px">
      <print-cell v-if="curRow" :styles="styles" :data="curRow" :fields="fields"></print-cell>
    </div>
  </div>
</template>
<script>
import PrintCell from "./list-cell";
export default {
  components: { PrintCell },
  props: {
    data: Array,
    styles: Array,
    fields: Array,
  },
  data() {
    return {
      curTab: "",
      curRow: null,
    };
  },
  watch: {
    curTab() {
      this.getRow();
    },
  },
  created() {
    this.setCurTab();
  },
  methods: {
    addHandler() {
      this.data.push([]);
      this.setCurTab();
    },
    delHandler(index) {
      this.data.splice(index, 1);
      this.setCurTab();
    },
    setCurTab() {
      this.curTab = "";
      this.$nextTick(() => {
        this.curTab = this.data.length > 0 ? this.data.length - 1 + "" : "";
      });
    },
    getRow() {
      this.curRow = null;
      this.$nextTick(() => {
        if (this.curTab) {
          this.curRow = this.data[parseInt(this.curTab)];
        }
      });
    },
  },
};
</script>