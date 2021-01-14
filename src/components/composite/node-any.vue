<template>
  <div class="pso-view pso-view__expand-wider pso-view__expand">
    <template>
      <div class="pso-view-extend">
        <div class="pso-badges">
          <template v-if="!initializing">
            <template v-if="tags.length">
              <pso-search v-model="keywords"></pso-search>
              <div :class="badgeClass(tag)" v-for="(tag, i) in filteredTags" :key="i" @click="loadCpnt(tag)">
                <div class="pso-badges__title">{{ tag.tag_name }}</div>
                <div class="pso-badges__num" :style="numStyle(tag.__num__)">
                  <span>{{ tag.__num__ }}</span>
                  <span v-if="tag.__total__">/{{ tag.__total__ }}</span>
                </div>
              </div>
            </template>
            <pso-empty v-else>暂无数据</pso-empty>
          </template>
          <pso-skeleton v-else :lines="10"></pso-skeleton>
        </div>
      </div>
      <div class="pso-view-body" style="padding: 0px" v-loading="cpntLoading">
        <component
          v-if="curCpnt"
          v-bind:is="curCpnt"
          v-bind="cpntParams"
          :params="{ ...cpntParams, opable: params.opable }"
          @data-changed="cpntChangeHandler"
          @status-changed="cpntChangeHandler"
          @stage-changed="cpntChangeHandler"
          @actioned="cpntChangeHandler"
        ></component>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initializing: false,
      cpntLoading: false,
      curTag: null,
      pluginCfg: null,
      tags: [],
      cpntParams: {}, //组件参数
      keywords: "",
      nodes: [],
      allTags: [],
    };
  },
  computed: {
    curCpnt() {
      if (this.pluginCfg && this.pluginCfg.tp_component) {
        return this.pluginCfg.tp_component;
      } else {
        return "";
      }
    },
    filteredTags() {
      if (this.keywords) {
        return this.tags.filter((t) => t.tag_name.indexOf(this.keywords) !== -1);
      }
      return this.tags;
    },
  },
  async created() {
    this.initializing = true;
    await this.initialize();
    this.initializing = false;
  },
  methods: {
    async initialize() {
      if (this.params.__sql__ && this.params.__sql__.length) {
        const ret = await this.API.debugSQLScript({ script: this.params.__sql__[0] });
        if (ret.success && ret.data) {
          this.allTags = (await this.API.tag({ data: {} })).data;
          this.makeTag(ret.data);
          if (this.tags.length) {
            this.nodes = (await this.API.trees({ data: { rootable: true, lazy: false, dimen: 5 } })).data.tagtree;
            this.loadCpnt(this.tags[0]);
          }
        }
      }
    },
    makeTag(sqlData) {
      this.tags = this.allTags.filter((t) => {
        const exist = _.find(sqlData, { tag_no: t.tag_no });
        if (exist) {
          this.$set(t, "__num__", exist.num);
          this.$set(t, "__total__", exist.total);
          return true;
        }
      });
    },
    reset() {
      this.cpntParams = {};
    },
    badgeClass({ tag_no }) {
      return {
        "pso-badges-item": true,
        active: this.curTag.tag_no === tag_no,
      };
    },
    async loadCpnt(tag) {
      this.cpntLoading = true;
      this.reset();

      this.curTag = tag;

      if (this.curTag.tag_config) {
        const cfg = JSON.parse(this.curTag.tag_config);

        if (cfg.tag_source) {
          const node = _.find(this.nodes, { node_id: tag.node_id });
          this.$set(this.cpntParams, "plug_code", cfg.tag_source);
          this.$set(this.cpntParams, "viewAuth", parseInt(node.leaf_auth || 0));

          const ret = await this.API.templates({ data: { tp_code: cfg.tag_source }, method: "get" });

          if (ret.success && ret.data.tp) {
            cfg.tag_set.forEach((item) => this.$set(this.cpntParams, item.field, item.value));
            this.pluginCfg = ret.data.tp;
          }
          if (this.cpntParams.where) {
            this.cpntParams.defForm = { [this.cpntParams.where]: this.curTag.tag_no };
          }
        }
      }
      this.cpntLoading = false;
    },
    numStyle(num) {
      num = num || 0;
      if (parseInt(num) > 0) {
        return {
          "background-color": "red",
        };
      }
    },
    async cpntChangeHandler() {
      const ret = await this.API.debugSQLScript({ script: this.params.__sql__[0] });
      if (ret.success && ret.data) {
        this.makeTag(ret.data);
      }
    },
  },
};
</script>