<template>
  <div>
    <el-divider content-position="left">更新设置</el-divider>
    <div class="pso-wf-update" v-for="(upItem,index) of node.update" :key="index">
      <div class="pso-wf-update__body">
        <el-form-item label="将字段">
          <el-select v-model="upItem.fid" placeholder="请选择" @change="fieldChangeHandler(upItem)">
            <el-option
              v-for="item in options"
              :key="item.fid"
              :label="item.displayName"
              :value="item.fid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置为" v-if="upItem.fid">
          <template v-if="upItem.type===1">
            <div class="pso-wf-update__l">
              <div class="pso-wf-update__l-cpnt">
                <pso-form-component
                  :cpnt="upItem.cpnt"
                  @value-change="valueChangeHandler($event,upItem)"
                ></pso-form-component>
                <!-- <el-input
                  v-if="getCpnt(upItem).componentid==='time'"
                  v-model="input"
                  placeholder="请输入内容"
                ></el-input>
                <el-input v-else v-model="upItem.value"></el-input>-->
              </div>
              <el-dropdown trigger="click" @command="commandHandler($event,upItem)">
                <span class="el-dropdown-link">
                  <i class="el-icon-plus el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="dItem.fid"
                    v-for="dItem in options"
                    :key="dItem.fid"
                  >{{dItem.displayName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
          <template v-else>
            <el-select
              v-model="upItem.value"
              clearable
              placeholder="请选择"
              @clear="clearHandler(upItem)"
            >
              <el-option
                v-for="item in options"
                :key="item.fid"
                :label="item.displayName"
                :value="item.fid"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
      </div>
      <i class="pso-wf-update__del el-icon-delete-solid" @click="deleteOption(index)"></i>
    </div>
    <div class="pso-wf-update__btn">
      <el-button icon="el-icon-plus" plain size="small" @click="addOption">添加字段</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PsoFormComponent from "@/components/form-interpreter/cpnt";
import FormStore from "@/components/form-designer/model/store.js";

export default {
  props: ["node"],
  components: { PsoFormComponent },
  data() {
    return {
      store: {}
    };
  },
  computed: {
    ...mapState(["workflowEditor"]),
    options() {
      return this.workflowEditor.formStore.search({
        onlyData: true,
        options: { db: true },
        beforePush: item => {
          if (item.parent.CPNT.host_db) return false;
          item.data.displayName = `[${item.CPNT.name}]${item.data._fieldName}`;
          return true;
        }
      });
    }
  },
  created() {
    for (let upItem of this.node.update) {
      const cpnt = this.getCpnt(upItem);
      if (!upItem.cpnt) upItem.cpnt = this.makeCpnt(upItem, { [cpnt.data._fieldValue]: upItem.value });
    }
  },
  methods: {
    addOption() {
      this.node.update.push({ fid: "", type: 1, value: "" });
    },
    deleteOption(index) {
      this.node.update.splice(index, 1);
    },
    getCpnt(updateItem) {
      return this.workflowEditor.formStore.search({ options: { fid: updateItem.fid } });
    },
    makeCpnt(updateItem, data) {
      this.$set(updateItem, "store", new FormStore(this.workflowEditor.formStore.getBaseInfo()));
      updateItem.store.updateInstance(data);
      const cpnt = updateItem.store.search({ options: { fid: updateItem.fid } });
      cpnt.data._hideForever = false;
      cpnt.data._hideOnNew = false;
      delete cpnt.data._fieldName;
      return cpnt;
    },
    fieldChangeHandler(upItem) {
      upItem.cpnt = this.makeCpnt(upItem);
    },
    valueChangeHandler({ value }, upItem) {
      upItem.value = value;
    },
    commandHandler(command, update) {
      update.type = 2;
      update.value = command;
    },
    clearHandler(update) {
      update.type = 1;
      update.value = "";
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable";

.pso-wf-update {
  display: flex;
  .pso-wf-update__body {
    flex: 1;
  }
}
.pso-wf-update__del {
  font-size: 20px;
  color: rgb(182, 182, 182);
  margin-left: 5px;
  margin-top: 40px;
  height: 30px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #f56c6c;
    transition: color 0.2s ease-in-out;
  }
}
.pso-wf-update__l {
  display: flex;
  .pso-wf-update__l-cpnt {
    flex: 1;
  }
}
@{deep} {
  .el-input,
  .el-select {
    width: 100%;
  }
}
</style>
