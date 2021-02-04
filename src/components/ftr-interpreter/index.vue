<template>
  <div class="pso-ftr">
    <div class="pso-ftr-wrapper pso-container" v-if="store">
      <div class="pso-ftr-header">
        <div class="pso-ftr-search">
          <el-input v-model="fetchParams.keywords"></el-input>
          <i class="el-icon-search" @click="fetch"></i>
        </div>
      </div>
      <div class="pso-ftr-tabs"></div>
      <div class="pso-ftr-body" v-if="store.instances.length">
        <div class="pso-ftr-item" v-for="(d, i) in store.instances" :key="i">
          <div class="pso-ftr-item-main" @click="mainClickHandler(d)">
            <ftr-item :data="d" :fields="FIELDS" :store="store"></ftr-item>
          </div>
          <div class="pso-ftr-sub">
            <el-timeline>
              <el-timeline-item :timestamp="m.child_name" placement="top" v-for="(m, j) in store.modules" :key="j">
                <template v-if="getModuleData(m, d).length">
                  <ftr-item
                    v-for="(md, k) in getModuleData(m, d)"
                    :key="k"
                    :data="md"
                    :fields="JSON.parse(m.child_content)"
                    :store="store"
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
import { FIELDS } from "./const";

export default {
  components: { FtrItem },
  mixins: [PagingMixin, AuthViewMixin],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.FIELDS = FIELDS;
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
  },
  methods: {
    async fetch() {
      await this.store.fetch(this.fetchParams);
    },
    mainClickHandler(data) {
      const cate = this.store.getCategory();
      if (cate.solr_link) {
        window.open(`${cate.solr_link}?insttogo=${data.id}`);
      }
    },
    getModuleData(mod, data) {
      console.log(data["id"]);
      return this.store.getModuleData(mod, data);
    },
  },
};
</script>