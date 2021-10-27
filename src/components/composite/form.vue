<template>
  <div class="pso-form-index" v-if="params.code && !initing">
    <div class="pso-form-index__logo">
      <img v-if="logo" :src="logo" alt />
    </div>
    <div class="pso-form-index__title">{{ cfg.name || formStore.data_name }}</div>
    <template v-if="editable">
      <div v-if="!submited">
        <pso-form-interpreter
          ref="formImage"
          :form-id="params.code"
          :editable="true"
          :data-instance="instance"
          :label-position="cfg.formLabelPosition"
          :label-width="cfg.formLabelWith"
          @data-loaded="storeReady"
        ></pso-form-interpreter>
        <div class="pso-form-index__footer" v-if="loaded && cfg.submitable">
          <el-button size="medium" type="primary" @click="submit" :disabled="saving" :loading="saving">{{ cfg.subBtnText }}</el-button>
        </div>
      </div>
      <div v-else class="pso-form-index__success">
        <div class="pso-form-index__success-info">
          <i class="success-icon el-icon-success"></i>
          <div class="success-text">{{ cfg.doneText }}</div>
          <div class="success-msg" v-if="returnMsg">{{ returnMsg }}</div>
        </div>
        <el-button type="primary" round @click="reload">返回</el-button>
      </div>
    </template>
    <div style="height: 60vh; display: flex; justify-content: center; align-items: center" v-else>
      <div style="font-size: 20px; color: #999">
        {{ cfg.errorText }}
      </div>
    </div>
  </div>
</template>
<script>
import { SignInMixin } from "../../mixin/passport";
import { formatJSONList } from "../../utils/util";
import { _DATA } from "../form-mgt/const";
import dayjs from "dayjs";
const SYSPARAMS = ["code", "appid", "ruleid"];

export default {
  mixins: [SignInMixin],
  props: ["params"],
  data() {
    return {
      initing: false,
      loaded: false,
      saving: false,
      formStore: {},
      submited: false,
      cfg: {},
      instance: {},
      editable: false,
      finished: false,
      logo: "",
      mockSignin: false,
      returnMsg: "",
    };
  },
  async created() {
    this.initing = true;

    this.$store.commit("APP_CHECKUSER", this.params);
    if (!this.$store.state.base || !this.$store.state.base.user) {
      this.mockSignin = true;
      const success = await this.$store.dispatch("APP_MOCKSIGNIN", { appid: this.params.appid || "" });
      if (!success) {
        this.$message.error("初始化失败，请联系管理员");
      }
    }

    const cfgRet = await this.API.getTreeNode({ code: this.params.code });

    if (cfgRet.data.data.pub_config) {
      this.cfg = JSON.parse(cfgRet.data.data.pub_config);
      formatJSONList([this.cfg], _DATA.pubCfg);
      const pubCfg = this.cfg;
      const { __SYSTIME__ } = cfgRet;

      if (pubCfg.authRequired && (this.mockSignin || this.$store.state.base.user.user_id === "tempuser")) {
        this.$router.replace({
          name: "login",
          query: { redirect: this.$router.currentRoute.fullPath, appid: this.params.appid },
        });
      }

      if (
        pubCfg.isPublic &&
        (pubCfg.stime ? dayjs(__SYSTIME__).isAfter(pubCfg.stime) : true) &&
        (pubCfg.etime ? dayjs(__SYSTIME__).isBefore(pubCfg.etime) : true)
      ) {
        this.editable = true;
      }

      if (pubCfg.attach) {
        const fileRet = await this.API.file({ data: { ids: pubCfg.attach }, method: "get" });
        if (fileRet.success && fileRet.data.length) {
          this.logo = fileRet.data[0].res_path;
        }
      }
      if (pubCfg.pageTitle) {
        $("title").html(pubCfg.pageTitle);
      }

      if (this.params.ruleid) {
        //默认值处理
        if (pubCfg.qrList) {
          const exist = _.find(pubCfg.qrList, { id: this.params.ruleid });
          if (exist && exist.value) {
            exist.value.split(",").forEach((i) => {
              const ruleItem = pubCfg.rules[parseInt(i) - 1];
              if (ruleItem) {
                this.instance[ruleItem.id] = ruleItem.val;
              }
            });
          }
        }
      }

      for (let key in this.params) {
        if (!SYSPARAMS.includes(key)) {
          this.instance[key] = this.params[key];
        }
      }

      this.initing = false;
    }
  },
  methods: {
    storeReady(store) {
      this.formStore = store;
      this.formStore._forEach((cpnt) => {
        if (typeof this.instance[cpnt.data._fieldValue] !== "undefined") {
          cpnt.data._read = true;
        }
      });
      this.loaded = true;
    },
    async submit() {
      try {
        this.saving = true;
        const formData = await this.$refs.formImage.makeData();
        const ret = await this.API.form({ data: { leaf_id: 1, formData }, method: "put", showMsg: false });
        if (ret.success) {
          this.submited = true;
          if (this.cfg.showReturn && ret.message) {
            this.returnMsg = ret.message;
          }
        } else {
          this.$message({ message: ret.message || "失败", type: "warning", duration: 20000, showClose: true });
        }
        this.saving = false;
      } catch (error) {
        this.saving = false;
        return null;
      }
    },
    reload() {
      window.location.reload();
    },
  },
};
</script>
<style lang="less" scoped>
.pso-form-index {
  padding: 15px 15px 60px 15px;
  position: relative;
  width: 100%;
  .pso-form-index__logo {
    width: 100%;
    margin-bottom: 5px;
    > img {
      display: block;
      margin: 0 auto;
      height: 40px;
    }
  }
  .pso-form-index__title {
    font-size: 18px;
    margin-bottom: 30px;
    text-align: center;
    font-weight: bold;
    color: #666;
  }
  .pso-form-index__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    background-color: #fff;
    text-align: center;
    z-index: 999;
  }
  .pso-form-index__success {
    text-align: center;
    .pso-form-index__success-info {
      margin: 20px 0;
      color: #999;
    }
    .success-icon {
      color: #67c23a;
      font-size: 50px;
    }
    .success-text {
      box-sizing: border-box;
      font-size: 14px;
      padding: 5px 0;
    }
    .success-msg {
      padding: 20px;
      font-weight: bold;
      font-size: 16px;
      text-align: left;
    }
  }
}
</style>
