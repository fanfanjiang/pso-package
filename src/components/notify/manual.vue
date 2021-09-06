<template>
  <div class="notify-manual" v-loading="initializing">
    <div class="notify-manual-body">
      <div class="notify-manual-l">
        <el-form size="medium" label-width="115px" label-position="left">
          <el-form-item label="消息提醒方式" required>
            <el-radio-group v-model="instance.msg_way">
              <el-radio label="1">通知</el-radio>
              <el-radio label="2">填报</el-radio>
            </el-radio-group>
          </el-form-item>
          <picker-form
            v-if="formmode"
            required
            source="3"
            size="medium"
            position="left"
            from-text="查询主表"
            label-width="115px"
            form-field="data_code"
            :data="querySource"
            @loaded="sourceFormCheck"
          ></picker-form>
          <div class="form-wrapper">
            <el-form-item label="标题" required v-if="formmode">
              <option-input
                size="medium"
                :data="instance"
                o-field="_fieldValue"
                o-name="_fieldName"
                id-field="msg_title"
                t-field="title_is_field"
                :options="columns"
              ></option-input>
            </el-form-item>
            <el-form-item label="提醒方式" required>
              <el-select v-model="instance.msg_notice" filterable clearable>
                <el-option v-for="(o, i) in NOTICE_WAY" :key="i" :label="o.n" :value="o.v"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-wrapper">
            <el-form-item label="分类" required>
              <el-select v-model="instance.msg_type" filterable clearable>
                <el-option v-for="(o, i) in msgMains" :key="i" :label="o.map_key2" :value="o.map_key0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="子类" required>
              <el-select v-model="instance.msg_sub_type" filterable clearable>
                <el-option v-for="(o, i) in msgSubs" :key="i" :label="o.map_key2" :value="o.map_key0"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-wrapper" v-if="formmode">
            <el-form-item label="主体" required>
              <option-input
                size="medium"
                :data="instance"
                id-field="msg_body"
                t-field="body_is_field"
                o-field="_fieldValue"
                o-name="_fieldName"
                :options="columns"
              ></option-input>
            </el-form-item>
            <el-form-item label="数据ID" required>
              <option-input
                size="medium"
                :data="instance"
                id-field="data_id"
                t-field="data_is_field"
                o-field="_fieldValue"
                o-name="_fieldName"
                :options="columns"
              ></option-input>
            </el-form-item>
          </div>
          <div class="form-wrapper">
            <el-form-item label="URL" required>
              <el-tag style="margin-right: 10px" v-if="msgUrlProxy" size="medium" closable @close="delMsgUrl"
                >{{ msgUrlProxy.node_display || msgUrlProxy.menu_name }}
              </el-tag>
              <pso-picker-tree :request-options="{ dimen: '1' }" pattern="radio" rootable @confirm="confirmMsgUrl">
                <el-button size="mini" type="primary" plain>选择菜单</el-button>
              </pso-picker-tree>
            </el-form-item>
          </div>
          <div class="form-wrapper">
            <el-form-item label="发送主体" required>
              <el-select v-model="instance.msg_sender" filterable clearable>
                <el-option v-for="(o, i) in MSG_SENDER" :key="i" :label="o.n" :value="o.v"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消息目标" required>
              <el-select v-model="instance.msg_goal" filterable clearable>
                <el-option v-for="(o, i) in MSG_TARGET" :key="i" :label="o.n" :value="o.v"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-wrapper">
            <el-form-item label="收件人类型" required>
              <el-select v-model="instance.receiver_type" filterable clearable>
                <el-option v-for="(o, i) in MSG_RECEIVER" :key="i" :label="o.n" :value="o.v"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="到期处理方式" required>
              <el-select v-model="instance.msg_act" filterable clearable>
                <el-option v-for="(o, i) in MSG_EXPIRE_HANDLER" :key="i" :label="o.n" :value="o.v"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="form-wrapper" v-if="instance.receiver_type !== '4'">
            <msg-receiver :block="instance" :columns="columns"></msg-receiver>
          </div>
          <div class="form-wrapper">
            <el-form-item label="到期日期" required>
              <el-date-picker v-model="instance.msg_expire" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
            </el-form-item>
            <el-form-item label="提醒日期" required>
              <el-date-picker v-model="instance.msg_call" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
            </el-form-item>
          </div>
          <div class="form-wrapper">
            <el-form-item label="消息模板" required>
              <el-input v-model="instance.msg_other"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="notify-manual-r">
        <template v-if="formmode && config">
          <h3>表单内容</h3>
          <pso-form-interpreter ref="formImage" v-bind="formParams"></pso-form-interpreter>
        </template>
        <el-form v-else size="medium" label-width="90px" label-position="left">
          <el-form-item label="消息标题" required>
            <el-input v-model="instance.msg_notice"></el-input>
          </el-form-item>
          <el-form-item label="消息主体" required>
            <rich-editor :proxy="instance" vfield="“msg_body" :height="500"></rich-editor>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="notify-manual-footer">
      <el-button size="medium" type="primary">立即发送</el-button>
      <el-button size="medium" type="primary" plain @click="showEditor = true">定时发送</el-button>
    </div>
    <el-dialog title="选择时间" append-to-body :visible.sync="showEditor" :width="'400px'">
      <el-date-picker size="large" v-model="time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="showEditor = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="confirmSave()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PickerForm from "../picker/pso-picker-form";
import OptionInput from "../sql-designer/option-input";
import MsgReceiver from "../sql-designer/msg-receiver";
import RichEditor from "../rich-editor";
import { NOTICE_WAY, MSG_SENDER, MSG_TARGET, MSG_RECEIVER, MSG_EXPIRE_HANDLER } from "../sql-designer/const";

export default {
  components: { PickerForm, OptionInput, MsgReceiver, RichEditor },
  data() {
    this.NOTICE_WAY = NOTICE_WAY;
    this.MSG_SENDER = MSG_SENDER;
    this.MSG_TARGET = MSG_TARGET;
    this.MSG_RECEIVER = MSG_RECEIVER;
    this.MSG_EXPIRE_HANDLER = MSG_EXPIRE_HANDLER;
    return {
      initializing: true,
      showEditor: false,
      querySource: { data_code: "" },
      instance: {
        msg_way: "1",
        msg_title: "",
        title_is_field: "0",
        msg_type: "",
        msg_sub_type: "",
        msg_body: "",
        body_is_field: "1",
        msg_notice: "",
        msg_url: "",
        msg_sender: "",
        msg_goal: "0",
        msg_receiver: "",
        receiver_is_field: "0",
        receiver_type: "4",
        msg_expire: "",
        msg_act: "0",
        data_id: "",
        data_is_field: "0",
        msg_call: "",
        msg_other: "",
      },
      msgMains: [],
      msgSubs: [],
      columns: [],
      msgUrlProxy: null,
      config: null,
      time: "",
    };
  },
  computed: {
    formmode() {
      return this.instance.msg_way === "2";
    },
    formParams() {
      return {
        formEntity: this.config,
      };
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const data = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: "9,10", type: 4 } }) })).data;
      const grouped = _.groupBy(data, "config_type");
      if (grouped["9"]) {
        this.msgMains = grouped["9"];
      }
      if (grouped["10"]) {
        this.msgSubs = grouped["10"];
      }
      this.initializing = false;
    },
    confirmMsgUrl(data) {
      if (data.length) {
        this.msgUrlProxy = data[0];
        this.instance.msg_url = this.msgUrlProxy.node_name || this.msgUrlProxy.menu_code;
      }
    },
    sourceFormCheck({ config, fields }) {
      this.columns = fields;
      this.config = config;
    },
    delMsgUrl() {
      this.msgUrlProxy = null;
      this.instance.msg_url = "";
    },
  },
};
</script>
<style lang="less">
.notify-manual {
  height: 100%;
  background: #fff;
  position: relative;
  .notify-manual-body {
    display: flex;
    height: 100%;
    > div {
      flex: 1;
      height: 100%;
      padding: 20px 30px 100px 30px;
      overflow: auto;
    }
    .notify-manual-r {
      h3 {
        margin-top: 0;
      }
    }
  }

  .notify-manual-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    text-align: center;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 999999;
  }
}
</style>