<template>
  <div class="sign-page">
    <div class="sign-form">
      <el-tabs class="tabs" v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="手机注册" name="phone"></el-tab-pane>
        <el-tab-pane label="邮箱注册" name="email"></el-tab-pane>
      </el-tabs>
      <el-form ref="form" :rules="rules" :model="passport" label-width="0">
        <el-form-item v-if="activeTab === 'phone'" prop="phone">
          <el-input placeholder="请输入手机号" v-model.trim="passport.phone" class="input-with-select">
            <el-select v-model="passport.areacode" slot="prepend" placeholder="请选择">
              <el-option label="+86" value="86">+86</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item v-else prop="email">
          <el-input placeholder="请输入邮箱地址" v-model.trim="passport.email" class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item prop="captcha" class="captcha">
          <el-input placeholder="请输入图片验证码" v-model="passport.captcha" class="input-with-select">
            <img :src="captchaUrl" alt="图片验证码" @click="reloadCaptcha" slot="append" />
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" v-model="passport.code" class="input-with-select" show-password>
            <div class="count-down" slot="append" @click="sendCode">
              <pso-count-down ref="countDown" format="s" :time="time">
                <template v-slot:default="slotProps">{{ setCodeStr(slotProps.timeData) }}</template>
              </pso-count-down>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model.trim="passport.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="text" placeholder="请输入用户名" v-model.trim="passport.userId"></el-input>
        </el-form-item>
        <el-button class="wider" type="primary" @click="submit" :loading="submiting">注册</el-button>
      </el-form>
      <div class="footer">
        <a href="/login">已有账号请登录</a>
      </div>
    </div>
  </div>
</template>
<script>
import { CaptchaMixin, SignInMixin } from "../../mixin/passport";
import { md5 } from "../../utils/md5";
import shortid from "shortid";

export default {
  mixins: [CaptchaMixin, SignInMixin],
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
      activeTab: "phone",
      codeInfo: "获取验证码",
      time: 5000,
      submiting: false,
      passport: {
        phone: "",
        email: "",
        areacode: "86",
        password: "",
        captcha: "",
        code: "",
        codeId: "",
        userId: "",
      },
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
        email: [{ validator: checkEmail, type: "email", trigger: "blur" }],
      },
    };
  },
  computed: {},
  methods: {
    handleTabClick(tab, event) {
      this.passport.code = "";
      this.$refs.form.resetFields();
    },
    async sendCode() {
      if (this.$refs.countDown.counting) return;
      let successCount = 2;
      this.$refs.form.validateField(["phone", "email", "captcha"], async (formError) => {
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
      this.$refs.form.validate(async (formError) => {
        if (!formError) return;
        let data = {
          user_pwd: md5(this.passport.password),
          codeId: this.passport.codeId,
          code: this.passport.code,
          user_id: this.passport.userId,
        };
        if (this.activeTab === "phone") {
          data.user_phone = this.passport.phone;
        } else {
          data.user_email = this.passport.email;
        }
        this.submiting = true;
        let ret = await this.API.reg(data);
        this.submiting = false;
        if (!ret.success) return;
        this.signIn(ret.data);
      });
    },
  },
};
</script>

