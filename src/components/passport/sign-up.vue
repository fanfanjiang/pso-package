<template>
  <div class="passport-box">
    <div class="passport-box-header">
      <div class="passport-box-title">注册</div>
    </div>
    <div class="passport-form">
      <el-tabs v-if="modes.length" class="tabs" v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane v-for="(t, i) in modes" :label="t.n" :name="t.v" :key="i"></el-tab-pane>
      </el-tabs>
      <el-form v-if="activeTab" ref="form" :rules="rules" :model="passport" label-width="0">
        <el-form-item v-if="activeTab === 'phone' || activeTab === 'ID'" prop="phone">
          <el-input placeholder="请输入手机号" v-model.trim="passport.phone" class="input-with-select">
            <el-select v-model="passport.areacode" slot="prepend" placeholder="请选择">
              <el-option label="+86" value="86">+86</el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <template v-if="activeTab === 'ID'">
          <el-form-item prop="name">
            <el-input placeholder="请输入姓名" v-model.trim="passport.name"></el-input>
          </el-form-item>
          <el-form-item prop="ID">
            <el-input placeholder="请输入身份证号" v-model.trim="passport.ID"></el-input>
          </el-form-item>
        </template>
        <el-form-item v-if="activeTab === 'email'" prop="email">
          <el-input placeholder="请输入邮箱地址" v-model.trim="passport.email"></el-input>
        </el-form-item>
        <el-form-item prop="captcha" class="captcha">
          <el-input placeholder="请输入图片验证码" v-model="passport.captcha">
            <img :src="captchaUrl" alt="图片验证码" @click="reloadCaptcha" slot="append" />
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="activeTab === 'phone' || activeTab === 'email'">
          <el-input placeholder="请输入验证码" v-model="passport.code" show-password>
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
          <el-input type="text" placeholder="请输入用户名" v-model.trim="passport.user_name"></el-input>
        </el-form-item>
        <el-button class="wider" type="primary" @click="submit" :loading="submiting">注册</el-button>
      </el-form>
      <div class="passport-box-redirect">
        <a :href="`/login?appid=${appid}`">登录已有账号 <i class="el-icon-arrow-right"></i></a>
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
  props: {
    appConfig: Object,
    appid: String,
    appName: String,
    platform: String,
    captchable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (["phone", "ID"].includes(this.activeTab) && !value) {
        callback(new Error("请输入手机号"));
      } else {
        callback();
      }
    };
    const checkEmail = (rule, value, callback) => {
      if (this.activeTab === "email" && !value) {
        callback(new Error("请输入邮箱地址"));
      } else {
        callback();
      }
    };
    const checkID = (rule, value, callback) => {
      if (this.activeTab === "ID" && !value) {
        callback(new Error("请输入身份证号"));
      } else {
        callback();
      }
    };
    const checkName = (rule, value, callback) => {
      if (this.activeTab === "ID" && !value) {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    return {
      initializing: true,
      activeTab: "",
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
        user_name: "",
        ID: "",
        name: "",
      },
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        phone: [{ validator: checkPhone, trigger: "blur" }],
        email: [{ validator: checkEmail, type: "email", trigger: "blur" }],
        ID: [{ validator: checkID, trigger: "blur" }],
        name: [{ validator: checkName, trigger: "blur" }],
      },
      modes: [],
    };
  },
  created() {
    if (this.appConfig.base) {
      const { map_key3 } = this.appConfig.base;
      if (map_key3.search("1") !== -1) {
        this.modes.push({ n: "手机注册", v: "phone" });
      }
      if (map_key3.search("2") !== -1) {
        this.modes.push({ n: "邮箱注册", v: "email" });
      }
      if (map_key3.search("3") !== -1) {
        this.modes.push({ n: "实名注册", v: "ID" });
      }
    }
    if (this.modes.length) {
      this.activeTab = this.modes[this.modes.length - 1].v;
    }
  },
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

        const data = {
          user_pwd: md5(this.passport.password),
          codeId: this.passport.codeId,
          code: this.passport.code,
          user_name: this.passport.user_name,
          appid: this.appid,
          appName: this.appName,
          platform: this.platform,
          signtype: this.activeTab,
        };

        if (this.activeTab === "phone") {
          data.user_phone = this.passport.phone;
        } else if (this.activeTab === "email") {
          data.user_email = this.passport.email;
        } else if (this.activeTab === "ID") {
          data.ID = this.passport.ID;
          data.user_phone = this.passport.phone;
          data.name = this.passport.name;
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

