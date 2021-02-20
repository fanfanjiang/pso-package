<template>
  <pso-grid-wrapper :cpnt="cpnt">
    <template v-slot:action>
      <el-dropdown @command="typeChangeHandler" size="mini" trigger="click">
        <span class="el-dropdown-link">
          {{ curType }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <template v-for="t in types">
            <el-dropdown-item :key="t.map_key1" :command="t.map_key1">{{ t.map_key1 }}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <div class="pso-grid-entrance" v-if="!initializing">
      <div v-loading="e.loading" class="pso-grid-entrance__item" v-for="e in trueEntrance" :key="e.auto_no" @click="handleClick(e)">
        <span :class="e.map_key1"></span>
        <div class="pso-grid-entrance__item-title">{{ e.map_key0 }}</div>
      </div>
    </div>
    <div v-else style="padding: 15px">
      <pso-skeleton :lines="6"></pso-skeleton>
    </div>
    <pso-dialog :visible="showExecutor" width="96%" @close="showExecutor = false">
      <template #title>
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>{{ curWf.name }}</span>
            </div>
          </div>
        </div>
      </template>
      <pso-wf-executor ref="executor" :params="executorParams" @excuted="showExecutor = false"> </pso-wf-executor>
    </pso-dialog>
    <pso-form-executor :params="formExecutorParams" :title="curForm.name" :opener="opener"></pso-form-executor>
  </pso-grid-wrapper>
</template>
<script>
import { mapState } from "vuex";
import { BaseMixin } from "../mixin";
import { analyzeMenu } from "../../../tool/app";

export default {
  mixins: [BaseMixin],
  data() {
    return {
      initializing: true,
      curWf: {},
      curForm: {},
      showExecutor: false,
      opener: { showExecutor: false },
      entrance: [],
      types: [{ map_key1: "全部", map_key2: 10, map_key3: "全部" }],
      curType: "全部",
    };
  },
  computed: {
    ...mapState(["base"]),
    executorParams() {
      return {
        node_id: this.curWf.code,
        instance: { instanceId: "" },
        displayMode: "",
      };
    },
    formExecutorParams() {
      return {
        formId: this.curForm.code,
      };
    },
    trueEntrance() {
      if (this.curType === "全部") {
        return this.entrance;
      } else if (this.curType === "其它") {
        return this.entrance.filter((f) => !f.map_key4);
      } else {
        return this.entrance.filter((f) => f.map_key4 === this.curType);
      }
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;

      const cfgRet = await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { type: 4, value: "13,12" } }) });
      const cfgData = _.groupBy(cfgRet.data, "config_type");
      if (cfgData[13] && cfgData[13].length) {
        this.types = this.types.concat(cfgData[13]);
      }

      this.types = _.orderBy(this.types, ["map_key2"], ["desc"]);
      this.curType = this.types[0].map_key1;
      this.types.forEach((t) => {
        if (t.map_key3) {
          try {
            const cfg = JSON.parse(t.map_key3);
            if (cfg.includes(this.base.user.user_type)) {
              this.curType = t.map_key1;
            }
          } catch (error) {}
        }
      });

      //获取入口总配置
      const allEntrance = cfgData[12];

      //获取用户自定义配置
      const userCfgRet = await this.API.getUserConfig({
        keys: JSON.stringify({ config_user: { value: this.base.user.user_id, type: 1 } }),
      });

      let userEntrance = {};
      if (userCfgRet.data.length) {
        userEntrance = userCfgRet.data[0];
      }

      //角色配置
      const roleCfgRet = await this.API.getUserType();
      const releCfg = _.find(roleCfgRet.data, { user_type: this.base.user.user_type });

      //角色默认模块
      if (releCfg.setting_block) {
        const roleEntrance = releCfg.setting_block.split(",");

        let selectedRoleEntrance = [];
        if (userEntrance.map_key1) {
          selectedRoleEntrance = userEntrance.map_key1.split(",");
        } else {
          selectedRoleEntrance = roleEntrance;
        }

        roleEntrance.forEach((auto_no) => {
          const exist = _.find(allEntrance, { auto_no });
          if (exist && selectedRoleEntrance.indexOf(auto_no) !== -1) {
            this.entrance.push({ ...exist, loading: false });
          }
        });
      }

      //用户自定义配置
      if (userEntrance.map_key2) {
        const selectedUserEntrance = this.data.map_key1.split(",");
        selectedUserEntrance.forEach((auto_no) => {
          const exist = _.find(allEntrance, { auto_no });
          const existInRole = _.find(this.entrance, { auto_no });
          if (exist && !existInRole) {
            this.entrance.push({ ...exist, loading: false });
          }
        });
      }

      this.entrance = _.orderBy(this.entrance, ["map_key5"], ["desc"]);

      this.initializing = false;
    },
    async handleClick(data) {
      const { map_key0, map_key2, map_key3 } = data;
      if (map_key2 === "workflow") {
        this.curWf = { code: map_key3, name: map_key0 };
        this.showExecutor = true;
      } else if (map_key2 === "form") {
        this.curForm = { code: map_key3, name: map_key0 };
        this.opener.showExecutor = true;
      } else if (map_key2 === "menu") {
        //解析菜单
        data.loading = true;
        await analyzeMenu({ menu_code: map_key3, uid: this.base.user.user_id, router: this.$router });
        data.loading = false;
      }
    },
    typeChangeHandler(type) {
      this.curType = type;
    },
  },
};
</script>
