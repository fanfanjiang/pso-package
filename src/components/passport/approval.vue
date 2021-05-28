<template>
  <el-dialog
    width="500px"
    append-to-body
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="base.appAuth.unapproved"
  >
    <div class="approve-header" slot="title">
      <svg
        t="1613707380711"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="25778"
        width="48"
        height="48"
      >
        <path
          d="M511.598 65.428c247.122 0 447.454 200.332 447.454 447.454S758.72 960.336 511.598 960.336 64.144 760.004 64.144 512.882 264.476 65.428 511.598 65.428z"
          fill="#FFF1B8"
          p-id="25779"
        ></path>
        <path
          d="M735.215 319.109l-22.721-0.376c-0.524 0-51.477-1.06-104.07-21.592-53.971-21.107-88.741-45.305-89.069-45.547l-13.711-9.538-13.645 9.559c-0.329 0.221-35.099 24.442-89.069 45.526-52.549 20.577-103.523 21.592-104.005 21.592l-22.83 0.376v222.749c0 111.827 149.315 230.079 229.592 230.079 80.344 0 229.637-118.252 229.637-230.079l-0.109-222.749zM408.267 641.784V425.968h-20.382V406.34h81.524v98.116l102.605-98.116h80.824L408.267 641.784z"
          fill="#FAAD14"
          p-id="25780"
        ></path>
      </svg>
      <span>认证</span>
    </div>
    <div>
      <div class="approve-waring" v-if="base.appAuth._expire">
        <i class="el-icon-warning"></i>
        <span>系统已过有效使用时间：{{ base.appAuth.expire_time }}</span>
      </div>
      <div class="approve-waring" v-if="overRes">
        <i class="el-icon-warning"></i>
        <span
          >系统容量不足： <span>{{ figur(base.appAuth.ressize) }}</span> / {{ figur(base.appAuth.res_limit) }} MB</span
        >
      </div>
      <div class="approve-waring" v-if="overUser">
        <i class="el-icon-warning"></i>
        <span
          >超过最大用户数：<span>{{ base.appAuth.usernum }}</span> / {{ base.appAuth.user_num }} 个</span
        >
      </div>
      <div class="approve-waring" v-if="overSite">
        <i class="el-icon-warning"></i>
        <span
          >超过最大建站数：<span>{{ base.appAuth.sitenum }}</span> / {{ base.appAuth.plat_num }} 个</span
        >
      </div>
    </div>
    <div>
      <el-input type="textarea" :rows="3" v-model="password" size="normal" placeholder="请输入认证码"></el-input>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="small" type="primary" @click="approve" :disabled="approving" :loading="approving">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      password: "",
      approving: false,
    };
  },
  computed: {
    ...mapState(["base"]),
    overRes() {
      return this.checkOver(this.base.appAuth.res_limit, this.base.appAuth.ressize);
    },
    overSite() {
      return this.checkOver(this.base.appAuth.plat_num, this.base.appAuth.sitenum);
    },
    overUser() {
      return this.checkOver(this.base.appAuth.user_num, this.base.appAuth.usernum);
    },
  },
  methods: {
    async approve() {
      if (!this.password) return;
      this.approving = true;
      const ret = await this.API.request("/api/approval/approve/center", { data: { key: this.password } });
      if (ret.success) {
        this.ResultNotify(ret);
        this.base.appAuth.unapproved = false;
      }
      this.approving = false;
    },
    checkOver(limit, num) {
      if (typeof limit !== "undefined" && typeof num !== "undefined") {
        return parseInt(limit || 0) < parseInt(num || 0);
      }
    },
    figur(num) {
      return (parseFloat(num || 0) / 1024 / 1024).toFixed(2);
    },
  },
};
</script>
<style lang="less">
.approve-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  span {
    margin-left: 10px;
  }
}
.approve-waring {
  margin-bottom: 12px;
  letter-spacing: 1px;
  color: #999;
  i {
    color: red;
    margin-right: 6px;
  }
  span {
    span {
      color: red;
    }
  }
}
</style>