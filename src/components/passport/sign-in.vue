<template>
  <div class="passport-box">
    <div class="passport-box-header">
      <div class="passport-box-title">登录</div>
    </div>
    <div class="passport-form">
      <el-tabs class="tabs" v-model="activeTab">
        <el-tab-pane v-for="(t, i) in modes" :label="t.n" :name="t.v" :key="i"></el-tab-pane>
      </el-tabs>
      <el-form v-if="activeTab" ref="form" :rules="rules" :model="passport" label-width="0">
        <template v-if="activeTab === 'def'">
          <el-form-item prop="username">
            <el-input placeholder="手机号/邮箱/用户名" v-model="passport.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="密码" v-model="passport.password" show-password></el-input>
          </el-form-item>
        </template>
        <template v-if="activeTab === 'org'">
          <el-form-item>
            <el-select v-model="curOrg" filterable placeholder="请选择部门">
              <el-option v-for="(r, i) in orgs" :key="i" :label="r.node_display" :value="r.node_id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="passport.username" filterable placeholder="请选择用户">
              <el-option v-for="(u, i) in orgUsers" :key="i" :label="u.user_name" :value="u.user_id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" v-model="passport.password" show-password></el-input>
          </el-form-item>
        </template>
        <el-form-item prop="captcha" class="captcha">
          <el-input placeholder="请输入图片验证码" v-model="passport.captcha">
            <img :src="captchaUrl" alt="图片验证码" @click="reloadCaptcha" slot="append" />
          </el-input>
        </el-form-item>
        <el-button class="wider" type="primary" @click="submit" :loading="submiting" :disabled="submiting">登录</el-button>
      </el-form>
      <div class="passport-box-redirect" v-if="base && base.map_key3">
        <a :href="`/reg?appid=${appid}`">注册 <i class="el-icon-arrow-right"></i></a>
      </div>
      <div class="passport-box-social">
        <social :appid="appid"></social>
      </div>
    </div>
  </div>
</template>
<script>
import { CaptchaMixin, SignInMixin } from "../../mixin/passport";
import { md5 } from "../../utils/md5";
import Social from "./social";

export default {
  components: { Social },
  mixins: [CaptchaMixin, SignInMixin],
  props: {
    base: Object,
    orgs: Array,
    users: Array,
    defSignIn: {
      type: Boolean,
      default: true,
    },
    appid: String,
    appName: String,
    platform: String,
    redirect: String,
  },
  data() {
    this.orgUsers = [];
    return {
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        username: [
          {
            required: true,
            message: "请输入手机号/邮箱/用户名",
            trigger: "blur",
          },
        ],
      },
      modes: [],
      activeTab: "",
      curOrg: "",
      passport: {
        username: "",
        password: "",
        captcha: "",
      },
      submiting: false,
    };
  },
  watch: {
    curOrg: {
      handler() {
        this.passport.username = "";
        this.getUsersByOrg();
      },
    },
  },
  created() {
    if (this.defSignIn) {
      this.modes.push({ n: "登录", v: "def" });
    }
    if (this.orgs && this.orgs.length) {
      this.modes.push({ n: "组织登录", v: "org" });
    }
    if (this.modes.length) {
      this.activeTab = this.modes[this.modes.length - 1].v;
    }
  },
  methods: {
    getUsersByOrg() {
      this.orgUsers = this.users.filter((u) => u.node_id === this.curOrg);
    },
    submit() {
      this.$refs.form.validate(async (formError) => {
        if (!formError) return;
        const data = {
          user_pwd: md5(this.passport.password),
          captcha: this.passport.captcha,
          username: this.passport.username,
          captchaId: this.captchaId,
          appid: this.appid,
          appName: this.appName,
          platform: this.platform,
        };
        this.submiting = true;
        const ret = await this.API.login(data);
        this.submiting = false;
        if (!ret.success) return;
        ret.data.redirect = this.redirect || "";
        this.signIn(ret.data);
      });
    },
  },
};
</script>