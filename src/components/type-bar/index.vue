<template>
  <div class="pso-typebar">
    <pso-skeleton v-if="loading" :lines="1"></pso-skeleton>
    <div v-else class="pso-typebar-wrapper">
      <el-tabs v-model="selectedType" @tab-click="typeClickHandler">
        <el-tab-pane
          :label="getTabName(typeItem)||'未命名'"
          :name="typeItem.feildname"
          v-for="typeItem of types"
          :key="typeItem.feildvalue"
        ></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    skey: String,
    keys: Object,
    filter: [Function, Object],
    defBar: Array
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      loading: false,
      selectedType: "",
      types: []
    };
  },
  watch: {
    selectedType: {
      handler(val) {
        this.$emit("change", _.find(this.types, { feildname: val }));
      }
    }
  },
  async created() {
    this.loading = true;
    let data = [];

    if (this.defBar) {
      data = this.defBar;
    } else {
      //参数配置
      const options = { skey: this.skey };
      if (this.keys) {
        options.keys = this.keys;
      }
      const ret = await this.API.getCommonType(options);
      data = ret.data;
    }

    if (this.filter) {
      if (typeof this.filter === "function") {
        data = this.filter(ret.data);
      } else if (this.filter.value) {
        if (this.filter.include) {
          if (typeof this.filter.include === "string") {
            this.filter.include = this.filter.include.join(",");
            data = data.filter(item => this.filter.include.indexOf(item[this.filter.value]) !== -1);
          }
        }
        if (this.filter.exclude) {
          if (typeof this.filter.exclude === "string") {
            this.filter.exclude = this.filter.exclude.join(",");
            data = data.filter(item => this.filter.exclude.indexOf(item[this.filter.value]) === -1);
          }
        }
      }
    }

    this.types = data;
    if (this.types.length) {
      this.$emit("change", this.types[0]);
      this.selectedType = this.types[0].feildname;
    }

    this.loading = false;
  },
  methods: {
    getTabName(data) {
      return data.total ? `${data.feildname} (${data.total})` : `${data.feildname}`;
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.pso-typebar {
  padding: 0 15px;
  height: 40px;
}
@{deep} {
  .el-tabs__header {
    margin: 0;
  }
  .pso-skeleton {
    padding-top: 10px;
  }
  .pso-skeleton-text__line {
    margin: 0;
  }
}
</style>