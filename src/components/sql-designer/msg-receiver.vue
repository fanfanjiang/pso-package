<template>
  <el-form-item label="收件人" required v-if="TYPE !== '4'">
    <div class="pso-picker__showlist">
      <span v-for="(d, i) in proxy.list" :key="i">
        <el-tag size="medium" closable @close="handleDelSelection(d)">
          {{ d[IDNAME.name] }}
        </el-tag>
      </span>
    </div>
    <option-input :data="block" id-field="msg_receiver" t-field="receiver_is_field" :options="columns">
      <pso-picker-user pattern="checkbox" v-if="TYPE === '0'" @confirm="confirmReceiver"></pso-picker-user>
      <pso-picker-dept pattern="checkbox" v-if="TYPE === '1'" @confirm="confirmReceiver"></pso-picker-dept>
      <pso-picker-position pattern="checkbox" v-if="TYPE === '2'" @confirm="confirmReceiver"></pso-picker-position>
      <pso-picker-post pattern="checkbox" v-if="TYPE === '3'" @confirm="confirmReceiver"></pso-picker-post>
    </option-input>
  </el-form-item>
</template>
<script>
import { MSG_RECEIVER } from "./const";
import OptionInput from "./option-input";
import { pickerMixin } from "../../mixin/picker";
export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" })],
  components: { OptionInput },
  props: {
    block: Object,
    columns: Array,
  },
  data() {
    this.MSG_RECEIVER = MSG_RECEIVER;
    return {
      proxy: {
        list: [],
        type: "checkbox",
      },
    };
  },
  computed: {
    TYPE() {
      return this.block.receiver_type;
    },
    IDNAME() {
      const data = { idName: "", name: "" };
      switch (this.TYPE) {
        case "0":
          data.idName = "user_id";
          data.name = "user_name";
          break;
        case "1":
          data.idName = "node_id";
          data.name = "node_display";
          break;
        case "2":
          data.idName = "duty_id";
          data.name = "duty_name";
          break;
        case "3":
          data.idName = "post_id";
          data.name = "post_name";
          break;
      }
      return data;
    },
  },
  watch: {
    TYPE: {
      immediate: true,
      handler() {
        this.switchPicker();
      },
    },
    "proxy.list"(val) {
      if (val && val.length) {
        this.block.msg_receiver = _.map(val, this.IDNAME.idName).join(",");
      } else {
        this.block.msg_receiver = "";
      }
    },
  },
  async created() {
    const rers = this.block.msg_receiver;
    if (rers) {
      const list = [];
      const data = rers.split(",");
      if (this.TYPE === "0") {
        for (let user_id of data) {
          const user = await this.API.user({ data: { user_id }, method: "get" });
          if (user) {
            list.push(user);
          }
        }
      }
      if (this.TYPE === "1") {
        const orgs = await this.API.getOrgTree();
        for (let node_id of data) {
          const node = _.find(orgs, { node_id: parseInt(node_id) });
          if (node) list.push(node);
        }
      }
      if (this.TYPE === "2") {
        const ret = await this.API.getOrgs("position");
        for (let duty_id of data) {
          const duty = _.find(ret.data, { duty_id });
          if (duty) list.push(duty);
        }
      }
      if (this.TYPE === "3") {
        const ret = await this.API.getOrgs("post");
        for (let post_id of data) {
          const post = _.find(ret.data, { post_id });
          if (post) list.push(post);
        }
      }
      this.confirmReceiver(list);
    }
  },
  methods: {
    confirmReceiver(data) {
      this.handleAddSelection(data);
    },
    switchPicker() {
      const { idName } = this.IDNAME;
      if (idName) {
        this.resetPicker({ idName, reset: true });
      }
    },
  },
};
</script>