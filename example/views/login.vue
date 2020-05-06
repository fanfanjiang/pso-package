<template>
  <div class="sign-page">
    <div class="sign-form">
      <el-tabs class="tabs" v-model="activeTab">
        <el-tab-pane label="密码登录" name="pass"></el-tab-pane>
      </el-tabs>
      <el-form ref="form" :rules="rules" :model="formData" label-width="0">
        <div v-if="activeTab==='phone'">
          <el-form-item>
            <el-input placeholder="请输入手机号" v-model="formData.phone" class="input-with-select">
              <el-select v-model="formData.areacode" slot="prepend" placeholder="请选择">
                <el-option label="+86" value="86">+86</el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              type="password"
              placeholder="请输入手机验证密码"
              v-model="formData.code"
              class="input-with-select"
            >
              <countdown slot="append" ref="countDown" :time="60" :auto="true"></countdown>
            </el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item prop="username">
            <el-input
              placeholder="手机号/邮箱/用户名"
              v-model="formData.username"
              class="input-with-select"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" v-model="formData.password" show-password></el-input>
          </el-form-item>
          <el-form-item prop="captcha" class="captcha">
            <el-input placeholder="请输入图片验证码" v-model="formData.captcha" class="input-with-select">
              <img :src="captchaUrl" alt="图片验证码" @click="reloadCaptcha" slot="append" />
            </el-input>
          </el-form-item>
        </div>
        <el-button class="wider" type="primary" @click="submit" :loading="submiting">登录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import countdown from "@/components/countdown";
import { md5 } from "@/utils/md5";
import shortid from "shortid";
import Auth from "@/tool/auth";

export default {
  components: {
    countdown
  },
  data() {
    return {
      activeTab: "pass",
      codeInfo: "获取验证码",
      submiting: false,
      formData: {
        phone: "",
        username: "",
        areacode: "86",
        password: "",
        code: "",
        captcha: ""
      },
      captchaId: shortid.generate(),
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        username: [
          {
            required: true,
            message: "请输入手机号/邮箱/用户名",
            trigger: "blur"
          }
        ],
        captcha: [{ required: true, message: "请输入图片验证码", trigger: "blur" }]
      }
    };
  },
  computed: {
    captchaUrl() {
      return `${this.APIURL}/captcha?id=${this.captchaId}`;
    }
  },
  methods: {
    async submit() {
      this.$refs.form.validate(async formError => {
        if (!formError) return;
        let data = {
          user_pwd: md5(this.formData.password),
          captcha: this.formData.captcha,
          username: this.formData.username,
          captchaId: this.captchaId
        };
        this.submiting = true;
        let ret = await this.API.login(data);
        this.submiting = false;
        if (!ret.success) return;
        this.loginSuccess(ret.data);
      });
    },
    reloadCaptcha() {
      this.captchaId = shortid.generate();
    },
    loginSuccess({ token, user }) {
      Auth.setToken(token);
    }
  }
};
</script>

