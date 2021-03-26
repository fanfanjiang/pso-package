<template>
  <div class="pso-super-detail">
    <template v-if="!initializing">
      <div class="pso-super-detail-title" v-html="title"></div>
      <div class="pso-super-detail-pic" v-if="picture">
        <pso-attachment v-show="!params.picMode" :ids="picture" @initialized="picLoaded"></pso-attachment>
        <template v-if="params.picMode">
          <img :src="p.url" alt="img" v-for="(p, i) in pictures" :key="i" />
        </template>
      </div>
      <div class="pso-super-detail-content">
        <div v-html="main"></div>
      </div>
      <div class="pso-super-detail-info" v-if="fieldContent.length && store">
        <view-field v-for="(f, i) in fieldContent" :key="i" :field="f" :store="store" :data="data" titleable></view-field>
      </div>
    </template>
    <pso-skeleton v-else :lines="10"></pso-skeleton>
  </div>
</template>
<script>
import PsoAttachment from "../attachment";
import ViewField from "./field";
import FVStore from "../form-view/store";

export default {
  components: { PsoAttachment, ViewField },
  props: {
    instance: [Object, String],
    formId: String,
    params: {
      type: Object,
      default: () => ({}),
    },
    fvStore: Object,
  },
  computed: {
    title() {
      return this.data[this.params.fieldTitle];
    },
    picture() {
      return this.data[this.params.fieldPic];
    },
    main() {
      return this.data[this.params.fieldMain] || "";
    },
    fieldContent() {
      return this.params.fieldContent || [];
    },
  },
  data() {
    return {
      initializing: true,
      data: {},
      store: null,
      pictures: [],
    };
  },
  watch: {
    instance: {
      immediate: true,
      handler() {
        this.initialize();
      },
    },
  },
  methods: {
    async initialize() {
      if (!this.instance) return;
      this.initializing = true;
      if (typeof this.instance === "string") {
        this.store = new FVStore({ $vue: this, limit: 1, defKeys: `leaf_id#${this.instance}#1` });
        this.store.analyzeAuthView(this.params.viewAuth || "4", []);
        await this.store.initialize(this.formId);
        await this.store.fetch();
        if (this.store.instances.length) {
          this.data = this.store.instances[0];
        }
      } else if (this.fvStore) {
        this.store = this.fvStore;
        this.data = this.instance;
      }
      this.initializing = false;
    },
    picLoaded(data) {
      this.pictures = data;
    },
  },
};
</script>
<style lang="less">
.pso-super-detail {
  padding: 20px;
  background: #fff;
  .pso-super-detail-title {
    font-size: 22px;
    margin-bottom: 30px;
    text-align: center;
    letter-spacing: 1.2px;
  }
  .pso-super-detail-pic {
    .pso-upload__list {
      flex-direction: column;
    }
    > img {
      display: block;
      max-width: 80%;
      height: auto;
      margin: 0 auto;
      & + img {
        margin-top: 20px;
      }
    }
  }
  .pso-super-detail-content {
    margin-top: 40px;
    p,
    span,
    div {
      font-size: 16px;
      line-height: 30px;
      text-align: left;
      margin: 16px 0;
      color: #646464;
    }
  }
}
</style>