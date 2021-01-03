<template>
  <div class="passport-box">
    <div class="passport-box-header">
      <div class="passport-box-title">注册</div>
      <div class="passport-box-user">
        <el-avatar :src="portrait"></el-avatar>
        <p>{{ nickname }}</p>
      </div>
    </div>
    <div class="passport-form">
      <el-tabs class="tabs" v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane v-for="(t, i) in modes" :label="t.n" :name="t.v" :key="i"></el-tab-pane>
      </el-tabs>
      <el-form ref="form" :rules="rules" :model="passport" label-width="0">
        <el-form-item v-if="activeTab === 'phone'" prop="user_phone">
          <el-input
            @blur="checkExist('user_phone')"
            placeholder="请输入手机号"
            v-model.trim="passport.user_phone"
            class="input-with-select"
          >
            <el-select v-model="passport.areacode" slot="prepend" placeholder="请选择">
              <el-option label="+86" value="86">+86</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item v-else-if="activeTab === 'email'" prop="user_email">
          <el-input
            @blur="checkExist('user_email')"
            placeholder="请输入邮箱地址"
            v-model.trim="passport.user_email"
            class="input-with-select"
          ></el-input>
        </el-form-item>
        <el-form-item v-else prop="username">
          <el-input placeholder="手机号/邮箱/用户名" v-model.trim="passport.username" class="input-with-select"></el-input>
        </el-form-item>
        <div v-if="isComplex">
          <el-form-item prop="captcha" class="captcha">
            <el-input placeholder="请输入图片验证码" v-model="passport.captcha" class="input-with-select">
              <img :src="captchaUrl" alt="图片验证码" @click="reloadCaptcha" slot="append" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input type="password" placeholder="请输入验证码" v-model="passport.code" class="input-with-select">
              <div class="count-down" slot="append" @click="sendCode">
                <pso-count-down ref="countDown" format="s" :time="time">
                  <template v-slot:default="slotProps">{{ setCodeStr(slotProps.timeData) }}</template>
                </pso-count-down>
              </div>
            </el-input>
          </el-form-item>
          <el-form-item v-if="!usere_xist">
            <el-input type="text" placeholder="用户名" v-model.trim="passport.user_id"></el-input>
          </el-form-item>
        </div>
        <el-form-item v-if="!usere_xist" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model.trim="passport.password"></el-input>
        </el-form-item>
        <el-button class="wider" type="primary" @click="submit" :loading="submiting">绑定</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import { CaptchaMixin, SignInMixin } from "../../mixin/passport";
import { md5 } from "../../utils/md5";
import shortid from "shortid";

export default {
  mixins: [CaptchaMixin, SignInMixin],
  props: {
    tid: String,
    portrait: String,
    nickname: String,
    appConfig: Object,
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (this.activeTab === "phone" && !value) {
        callback(new Error("请输入手机号"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (this.activeTab === "email" && !value) {
        callback(new Error("请输入邮箱地址"));
      } else {
        callback();
      }
    };
    return {
      activeTab: "exist",
      codeInfo: "获取验证码",
      time: 5000,
      submiting: false,
      notBinding: false,
      usere_xist: false,
      passport: {
        user_phone: "",
        user_email: "",
        user_id: "",
        username: "",
        areacode: "86",
        password: "",
        captcha: "",
        code: "",
        codeId: "",
      },
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        user_phone: [{ validator: checkPhone, trigger: "blur" }],
        user_email: [{ validator: checkEmail, type: "email", trigger: "blur" }],
        username: [
          {
            required: true,
            message: "请输入手机号/邮箱/用户名",
            trigger: "blur",
          },
        ],
      },
      modes: [],
    };
  },
  computed: {
    isComplex() {
      return this.activeTab === "phone" || this.activeTab === "email";
    },
    checkField() {
      return this.activeTab === "phone" ? "user_phone" : this.activeTab === "email" ? "user_email" : "";
    },
  },
  created() {
    if (!this.tid) return this.$router.push({ name: "login" });
    if (this.appConfig.regByPhone) {
      this.modes.push({ n: "绑定手机", v: "phone" });
    }
    if (this.appConfig.regByPhone) {
      this.modes.push({ n: "绑定邮箱", v: "email" });
    }
    this.modes.push({ n: "绑定已有账号", v: "exist" });
  },
  methods: {
    handleTabClick(tab, event) {
      this.passport.code = "";
      this.passport.user_phone = "";
      this.passport.user_email = "";
      this.usere_xist = false;
      this.$refs.form.resetFields();
    },
    async sendCode() {
      if (this.$refs.countDown.counting) return;
      let successCount = 2;
      this.$refs.form.validateField(["user_phone", "user_email", "captcha"], async (formError) => {
        if (formError) return;
        successCount--;
        if (!successCount) {
          this.passport.codeId = shortid.generate();
          let ret = await this.API.sendCode({
            id: this.captchaId,
            captcha: this.passport.captcha,
            codeId: this.passport.codeId,
          });
          if (!ret.success) return;
          this.reloadCaptcha();
          this.$refs.countDown.start();
        }
      });
    },
    setCodeStr(time) {
      return time.counting ? `${time.format}秒后重新发送` : "获取验证码";
    },
    async submit() {
      await this.checkExist(this.checkField);
      this.$refs.form.validate(async (formError) => {
        if (!formError) return;
        let data = {
          user_pwd: md5(this.passport.password),
          codeId: this.passport.codeId,
          code: this.passport.code,
          user_id: this.passport.userId,
          tid: this.tid,
          ...this.$store.state.base.appConfig,
        };
        if (this.activeTab === "phone") {
          data.user_phone = this.passport.user_phone;
        } else if (this.activeTab === "phone") {
          data.user_email = this.passport.user_email;
        } else {
          data.username = this.passport.username;
        }
        this.submiting = true;
        let ret = await this.API.regThird(data);
        this.submiting = false;
        if (!ret.success) return;
        this.signIn(ret.data);
      });
    },
    async checkExist(field) {
      if (!this.passport[field]) return;
      let ret = await this.API.checkExist({ [field]: this.passport[field], ...this.$store.state.base.appConfig });
      if (ret.data && ret.data.exist) this.usere_xist = true;
    },
    async notBind() {
      this.notBinding = true;
      let ret = await this.API.regThird({ tid: this.tid });
      this.notBinding = false;
      if (!ret.success) return;
      this.signIn(ret.data);
    },
  },
};
</script>

