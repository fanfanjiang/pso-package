<template>
  <div
    class="pso-wf-executor"
    :class="executorClass"
    v-loading="wfExecutor.loading||wfExecutor.steping"
  >
    <transition name="el-zoom-in-top">
      <div class="pso-wf-executor__body" v-show="showBody">
        <div class="pso-wf-executor__main" v-bar>
          <div>
            <div class="pso-wf-executor__main-header">
              <pso-wf-overview></pso-wf-overview>
            </div>
            <div
              v-if="!isMobile"
              ref="wfTable"
              class="pso-wf-executor__main-content"
              id="executorMain"
              v-html="wfExecutor.cfg.wf_body_tp"
            ></div>
          </div>
          <transition name="el-zoom-in-bottom">
            <pso-wfop-user v-if="showUserOp" @close="showUserOp=false" @confirm="append"></pso-wfop-user>
          </transition>
        </div>
        <div class="pso-wf-executor__footer">
          <div class="pso-wf-executor__op">
            <div v-if="wfExecutor.curStep">
              <el-button
                v-if="showCommand(REVIEW_OP_TYPE.save.value)"
                type="primary"
                plain
                size="small"
                @click="saveForm"
              >暂存</el-button>
              <pso-wfop
                v-if="showCommand(REVIEW_OP_TYPE.confirm.value)"
                :op="REVIEW_OP_TYPE.confirm"
                :text="wfExecutor.data.instanceId?'通过':'提交'"
                @confirm="confirm"
              ></pso-wfop>
              <pso-wfop
                v-if="showCommand(REVIEW_OP_TYPE.end.value)"
                :op="REVIEW_OP_TYPE.end"
                text="结束"
                @confirm="end"
              ></pso-wfop>
              <el-button
                v-if="showCommand(REVIEW_OP_TYPE.pickreject.value)"
                type="primary"
                plain
                size="small"
                @click="goPickreject"
              >指定</el-button>
              <pso-wfop
                v-if="showCommand(REVIEW_OP_TYPE.rollback.value)"
                :op="REVIEW_OP_TYPE.rollback"
                type="danger"
                text="回退"
                @confirm="rollback"
              ></pso-wfop>
              <pso-wfop
                v-if="showCommand(REVIEW_OP_TYPE.reject.value)"
                :op="REVIEW_OP_TYPE.reject"
                type="danger"
                text="打回"
                @confirm="reject"
              ></pso-wfop>
            </div>
            <el-dropdown @command="handleCommand">
              <el-button size="small">
                更多
                <i class="el-icon-more"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <template v-if="superable&&wfExecutor.curStep">
                  <el-dropdown-item command="copy">抄送</el-dropdown-item>
                  <el-dropdown-item command="distribute">分发</el-dropdown-item>
                  <el-dropdown-item command="addSign">加签</el-dropdown-item>
                </template>
                <el-dropdown-item command="print">打印</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </transition>
    <div class="pso-wf-executor__extend" :class="extendClass">
      <div class="pso-wf-executor__extend-header">
        <el-tabs v-model="wfExecutor.activeExtendTab">
          <el-tab-pane v-if="showBody" label="数据" name="data"></el-tab-pane>
          <el-tab-pane v-if="showBody" label="附件" name="attach"></el-tab-pane>
          <el-tab-pane label="流程图" name="flowchart"></el-tab-pane>
          <el-tab-pane v-if="showBody" label="日志" name="log"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="pso-wf-executor__extend-body" v-bar>
        <div>
          <div class="pso-wf-executor__content" v-show="wfExecutor.activeExtendTab==='data'">
            <pso-wf-form></pso-wf-form>
            <pso-form-interpreter
              @value-change="formChangeHandler"
              @data-loaded="handleFormDataLoaded"
              ref="formImage"
              v-if="wfExecutor.cfg.map_data_code"
              :key="wfExecutor.cfg.map_data_code"
              :form-id="wfExecutor.cfg.map_data_code"
              :data-id="instanceId"
              :editable="isFormWriteable"
            ></pso-form-interpreter>
          </div>
          <div class="pso-wf-executor__attach" v-show="wfExecutor.activeExtendTab==='attach'">
            <el-form label-width="80px" size="medium">
              <pso-form-attach :cpnt="{data:wfExecutor.data.attach}" @delete="deleteFile">
                <el-button icon="el-icon-paperclip" plain size="small">上传附件</el-button>
              </pso-form-attach>
            </el-form>
          </div>
          <div class="pso-wf-executor__flowchart" v-show="wfExecutor.activeExtendTab==='flowchart'">
            <pso-wf-stage
              @clickNode="selectedNode"
              :workflowData="wfExecutor.cfg.wf_map_tp"
              :readMode="true"
              v-if="wfExecutor.cfg.wf_map_tp"
            ></pso-wf-stage>
            <transition name="el-zoom-in-center">
              <el-card class="pso-wf__flowchart-card" v-if="!showBody">
                <div slot="header" class="clearfix">
                  <span>指定流程节点</span>
                  <el-button type="text" @click="cancelPickreject(false)">取消</el-button>
                </div>
                <div
                  class="pso-wf__flowchart-card-body"
                >已选择节点：{{wfExecutor.appointStep&&wfExecutor.appointStep.name}}</div>
                <div class="pso-wf__flowchart-card-footer" v-if="wfExecutor.appointStep">
                  <el-button type="success" size="mini" @click="pickreject">确定</el-button>
                </div>
              </el-card>
            </transition>
          </div>
          <div class="pso-wf-executor__log" v-show="wfExecutor.activeExtendTab==='log'">
            <el-timeline>
              <el-timeline-item
                v-for="(log,index) of wfExecutor.log"
                :key="index"
                :timestamp="log.op_time"
                placement="top"
              >
                <el-card>
                  <h4>{{log.step_name}}</h4>
                  <p>操作人：{{log.op_user}}</p>
                  <p>评论：{{log.op_note}}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import shortid from "shortid";

import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import {
  WFINS_DATA_RESET,
  WFINS_DATA_GET,
  WFINS_INSTANCE_GET,
  WFINS_INSTANCE_SET,
  WFINS_NEXTSETP,
  WFINS_SAVE
} from "../../store/mutation-types";
import { REVIEW_OP_TYPE, REVIEW_OP_APPEND } from "../../const/workflow";

import PsoFormInterpreter from "../form-interpreter";
import PsoWfForm from "./main-form";
import PsoWfStage from "../workflow-designer/stage";
import PsoFormAttach from "../form-interpreter/components/attachment";
import PsoWfop from "./op/index";
import PsoWfopUser from "./op/user";
import PsoWfOverview from "./overview";
const UAParser = require("../../../share/util/u-agent");

export default {
  components: { PsoFormInterpreter, PsoWfForm, PsoWfStage, PsoFormAttach, PsoWfop, PsoWfopUser, PsoWfOverview },
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      REVIEW_OP_TYPE: REVIEW_OP_TYPE,
      showBody: true,
      showUserOp: false,
      formStore: null,
      isMobile: false
    };
  },
  computed: {
    ...mapState(["wfExecutor"]),
    extendClass() {
      return {
        "pso-wf-executor__extend__expend": !this.showBody
      };
    },
    executorClass() {
      return {
        "pso-wf-executor__m": this.isMobile
      };
    },
    isFormWriteable() {
      return this.wfExecutor.curStep && this.wfExecutor.curStep.atype === "form";
    },
    superable() {
      //只有分发才隐藏
      return this.wfExecutor.data.msg_tag === 1 ? false : true;
    },
    instanceId() {
      return this.wfExecutor.data.instanceId || (this.params.copy && this.params.instance && this.params.instance.instanceId);
    }
  },
  watch: {
    "params.node_id": {
      immediate: true,
      async handler() {
        //如果state里有数据，则重新初始化
        if (this.wfExecutor.cfg.wf_code) this.$store.commit(WFINS_DATA_RESET);
        //加载流程配置
        await this.getWorkflowCfg();
      }
    },
    "params.instance.instanceId": {
      immediate: true,
      async handler() {
        //加载流程实例数据
        await this.getInstance();
      }
    },
    "wfExecutor.data": {
      deep: true,
      handler(data) {
        this.changeTableData(data);
      }
    },
    "wfExecutor.cfg.wf_body_tp": {
      handler(val) {
        this.$nextTick(() => {
          val && this.changeTableData(this.wfExecutor.data);
        });
      }
    },
    "wfExecutor.log": {
      deep: true,
      handler(data) {
        //替换主体审核日志部分
        const groupData = _.groupBy(data, "step_code");
        for (let key in groupData) {
          const logWrapper = $('<div class="pso-wf-logs"></div>');

          groupData[key].forEach(item => {
            logWrapper.append(`<div class="pso-wf-logs__item">
                                  <div>步骤：${item.step_name}</div>
                                  <div>审核人：${item.op_user}</div>
                                  <div>审核时间：${item.op_time}</div>
                                  <div>审核结果：${item.op_result}</div>
                                  <div>审核意见：${item.op_note}</div>
                               </div>`);
          });

          $("#executorMain")
            .find(`[field=${key}]`)
            .empty()
            .append(logWrapper);
        }
      }
    }
  },
  created() {
    const parser = new UAParser();
    this.isMobile = parser.getResult().device.type === "mobile";
  },
  destroyed() {
    //重新初始化state
    this.$store.commit(WFINS_DATA_RESET);
  },
  methods: {
    ...mapActions([WFINS_DATA_GET]),
    changeTableData(data) {
      for (let key in data) {
        if (typeof data[key] === "string") {
          this.formChangeHandler({ cpnt: { data: { _fieldValue: `wf_${key}` } }, value: data[key] });
        }
      }
    },
    async formChangeHandler({ cpnt, value, proxy }) {
      const { data } = cpnt;
      if (!data._fieldValue) return;

      //人员和部门
      if (cpnt.componentid === "user" || cpnt.componentid === "department") {
        const name = cpnt.componentid === "user" ? "user_name" : "node_name";
        if (proxy && proxy.list.length) {
          value = _.map(proxy.list, name).join(",");
        } else {
          value = "";
        }
      }

      $("#executorMain")
        .find(`[field=${data._fieldValue}]`)
        .html(value);
    },
    async handleFormDataLoaded(store) {
      //替换表格文字
      this.formStore = store;
      const maps = this.formStore.cpntsMap;

      for (let key in maps) {
        if (maps[key].data._fieldValue) {
          await this.formChangeHandler({ cpnt: maps[key], value: maps[key].data._val });
        }
      }
    },
    async getWorkflowCfg() {
      Object.keys(this.wfExecutor.show).forEach(key => {
        if (typeof this.params[key] !== "undefined") this.wfExecutor.show[key] = this.params[key];
      });

      await this.$store.dispatch(WFINS_DATA_GET, {
        cfgId: this.params.node_id,
        readLevel: this.params.readLevel,
        copy: this.params.copy,
        extend: this.params.extend
      });
      this.wfExecutor.formStore = this.$refs.formImage.store;
    },
    async getInstance() {
      this.$store.dispatch(WFINS_INSTANCE_SET, this.params.instance);
      if (!this.wfExecutor.loading) await this.$store.dispatch(WFINS_INSTANCE_GET);
    },
    showCommand(command) {
      if (this.wfExecutor.curStep.atype === "sign") {
        return command === 2;
      } else if (this.wfExecutor.data.msg_tag === 0) {
        return false;
      } else if (this.wfExecutor.data.msg_tag === 1) {
        return command === 2;
      } else {
        return (this.wfExecutor.curStep.op & command) === command;
      }
    },
    handleCommand(command) {
      this[command] && this[command]();
    },
    selectedNode(node) {
      //只有在指定模式下才执行
      if (this.showBody) return;
      if (node.nid === this.wfExecutor.curStep.nid) return this.$message({ message: "不能选择当前执行节点", type: "warning" });
      if (this.wfExecutor.appointStep && node.nid === this.wfExecutor.appointStep.nid) return this.cancelPickreject(true);
      this.wfExecutor.appointStep = this.wfExecutor.cfg.wf_map_tp.clickedNode = node;
    },
    async saveForm() {
      //暂存
      try {
        const formData = await this.getFormData();
        this.$emit("before-save", { formData });
        formData && this.excuted(await this.$store.dispatch(WFINS_SAVE, { formData }));
      } catch (error) {}
    },
    async nextStep(optype) {
      try {
        const formData = await this.getFormData();
        this.$emit("before-next", { optype, formData });
        formData && this.excuted(await this.$store.dispatch(WFINS_NEXTSETP, { optype, formData }));
      } catch (error) {
        this.wfExecutor.steping = false;
        this.$message({ message: error.message, type: "warning" });
      }
    },
    async getFormData() {
      try {
        const formData = await this.$refs.formImage.makeData();
        if (this.wfExecutor.copy && formData) {
          formData.dataArr[0].leaf_id = shortid.generate();
        }
        return formData;
      } catch (error) {
        return null;
      }
    },
    excuted(ret) {
      const { success } = ret;
      this.$notify({ title: success ? "执行成功" : "执行失败", type: success ? "success" : "warning" });
      this.$emit("excuted");
    },
    async confirm() {
      await this.nextStep(this.REVIEW_OP_TYPE.confirm.type);
    },
    async reject() {
      await this.nextStep(this.REVIEW_OP_TYPE.reject.type);
    },
    async pickreject() {
      await this.nextStep(this.REVIEW_OP_TYPE.pickreject.type);
      this.cancelPickreject();
    },
    goPickreject() {
      this.showBody = false;
      this.wfExecutor.activeExtendTab = "flowchart";
    },
    cancelPickreject(cancel) {
      if (!cancel) this.showBody = true;
      this.wfExecutor.appointStep = this.wfExecutor.cfg.wf_map_tp.clickedNode = null;
    },
    async end() {
      await this.nextStep(this.REVIEW_OP_TYPE.end.type);
    },
    async rollback() {
      await this.nextStep(this.REVIEW_OP_TYPE.rollback.type);
    },
    async append() {
      await this.nextStep(REVIEW_OP_APPEND);
    },
    copy() {
      this.openUserOp({ text: "抄送", op: "Copy" });
    },
    distribute() {
      this.openUserOp({ text: "分发", op: "Distribute" });
    },
    addSign() {
      this.openUserOp({ text: "加签", op: "AddSign" });
    },
    openUserOp({ text, op }) {
      this.wfExecutor.userOp.text = text;
      this.wfExecutor.userOp.appendType = op;
      this.showUserOp = true;
    },
    async deleteFile(file) {
      if (!this.wfExecutor.data.instanceId) return;
      let ret = await this.API.file({
        data: { att_id: file.res_id, mtype: "Flow", mkey: "InstAtt", keys: { att_id: file.res_id } },
        method: "delete"
      });
      this.$notify({ title: ret.success ? "成功删除" : "删除失败", type: ret.success ? "success" : "warning" });
    },
    async bindFile(file) {},
    print() {
      this.getPdf(this.$refs.wfTable, this.wfExecutor.data.name);
    }
  }
};
</script>
<style lang="less">
@import "../../assets/less/component/wf-executor.less";
</style>
<style lang="less" scoped>
.pso-wf-logs {
  font-size: 12px;
  & + .pso-wf-logs {
    margin-top: 5px;
  }
  .pso-wf-logs__item {
    font-size: 12px;
    margin-bottom: 5px;
    > div {
      margin-bottom: 2px;
      font-size: 12px;
    }
  }
}
</style>
