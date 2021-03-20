<template>
  <div class="pso-ftr">
    <div class="pso-ftr-wrapper pso-container" v-if="store">
      <div class="pso-ftr-header" v-if="inputable">
        <div class="pso-ftr-search">
          <el-input v-model="fetchParams.keywords"></el-input>
          <i class="el-icon-search" @click="fetch"></i>
        </div>
      </div>
      <div class="pso-ftr-tabs" v-show="store.categories.length > 1">
        <el-tabs v-model="store.activeCate">
          <el-tab-pane v-for="(ct, i) in store.categories" :key="i" :label="ct.solr_name" :name="ct.solr_id"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="pso-ftr-body" v-if="store.instances.length">
        <div class="pso-ftr-item" v-for="(d, i) in store.instances" :key="i">
          <div class="pso-ftr-item-main">
            <ftr-item :data="d" :fields="store.curCateFields" :store="store" @clickfield="mainClickHandler"></ftr-item>
          </div>
          <div class="pso-ftr-sub">
            <el-timeline>
              <el-timeline-item :timestamp="m.child_name" placement="top" v-for="(m, j) in store.modules" :key="j">
                <template v-if="getModuleData(m, d).length">
                  <ftr-item
                    v-for="(md, k) in getModuleData(m, d)"
                    :key="k"
                    :data="md"
                    :fields="m.child_content"
                    :store="store"
                    @clickfield="subClickHandler($event, m)"
                  ></ftr-item>
                </template>
                <span v-else>无</span>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div class="pso-ftr-footer" v-if="store.dataTotal && !store.fetching">
          <el-pagination
            background
            layout="total,prev, pager, next"
            :page-sizes="[20, 30, 50, 100]"
            :total="store.dataTotal"
            :page-size="fetchParams.limit"
            :current-page="fetchParams.start"
            @size-change="sizeChangeHandler"
            @current-change="currentChangeHandler"
            @prev-click="prevClickHandler"
            @next-click="nextClickHandler"
          ></el-pagination>
        </div>
      </div>
      <pso-empty v-else :text="fetchParams.keywords ? '暂无数据' : '请输入查询条件'"></pso-empty>
    </div>
  </div>
</template>
<script>
import debounce from "throttle-debounce/debounce";
import FtrItem from "./ftr-item";
import FTRStore from "./store";
import { PagingMixin, AuthViewMixin } from "../../mixin/view";
import { judgeByRules } from "../../tool/form";

export default {
  components: { FtrItem },
  mixins: [PagingMixin, AuthViewMixin],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    inputable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      store: null,
    };
  },
  async created() {
    const { viewAuth, auth_config = [], q = "" } = this.params;
    if (viewAuth) {
      this.analyzeAuthView(viewAuth, auth_config);
    }
    this.fetchParams.keywords = q;

    this.store = new FTRStore({ $vue: this, activeView: this.activeView });
    await this.store.initialize();

    if (q) {
      await this.fetch();
    }

    this.deFetch = debounce(200, (params) => {
      this.fetch(params);
    });
    this.startWatch();
    this.$on("load", () => {
      this.deFetch();
    });
    this.$watch("activeView", () => {
      this.fetchParams.start = 1;
      this.store.setActiveView(this.activeView);
      this.deFetch();
    });

    this.$emit("initialized");
  },
  methods: {
    setKeywords(keywords) {
      this.fetchParams.keywords = keywords;
    },
    async fetch() {
      await this.store.fetch(this.fetchParams);
    },
    mainClickHandler({ field, data }) {
      const cate = this.store.getCategory();
      if (field.titled === "1") {
        this.checkLink({ data, proxy: cate, fields: cate.solr_field, links: cate.solr_link });
      }
    },
    checkLink({ data, proxy, fields, links }) {
      this.store.makeMockStore(proxy, fields);
      let link;
      for (let item of links) {
        if (judgeByRules({ datas: [data], ruleOptions: item, store: proxy.mockStore })) {
          link = item;
          break;
        }
      }
      if (!link) {
        const defLink = _.find(links, { rule: [] });
        if (defLink) {
          link = defLink;
        }
      }
      console.log(link);
      if (link && data[link.id]) {
        this.goLink(link.link, data[link.id]);
      }
    },
    getModuleData(mod, data) {
      return this.store.getModuleData(mod, data);
    },
    subClickHandler({ field, data }, sub) {
      if (field.titled === "1") {
        this.checkLink({ data, proxy: sub, fields: sub.child_content, links: sub.child_url });
      }
    },
    goLink(link, id) {
      window.open(`${link}?insttogo=${id}`);
    },
  },
};
</script>