<template>
  <div ref="carousel" :class="carouselStyle" style="height: 100%">
    <el-carousel :height="height" v-if="!initializing">
      <el-carousel-item v-for="(d, i) in store.instances" :key="i">
        <div v-if="d.__picture__" class="pso-carousel-item" :style="`background-image:url(${d.__picture__})`">
          <div v-if="d[cpnt.data.fieldTitle]">
            <span>{{ d[cpnt.data.fieldTitle] }}</span>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import SuperViewStore from "../../super-view/store";
import { BaseMixin } from "../mixin";

export default {
  mixins: [BaseMixin],
  data() {
    return {
      initializing: true,
      store: null,
      watchFun: [],
      height: `200px`,
    };
  },
  computed: {
    carouselStyle() {
      const { styleType } = this.cpnt.data;
      return {
        "pso-carousel": true,
        "pso-carousel-1": styleType === "0",
        "pso-carousel-2": styleType === "1",
        "pso-carousel-3": styleType === "2",
      };
    },
  },
  created() {
    this.initialize();
  },
  mounted() {
    console.log(this.height);
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const { viewAuth, useCloumn, source, sourceType, limit, fieldPic } = this.cpnt.data;

      if (this.watchFun.length) {
        this.watchFun.forEach((f) => f());
        this.watchFun = [];
      }

      const options = {
        $vue: this,
        sourceType,
        limit,
        urine: this.urine,
      };
      this.store = new SuperViewStore(options);
      this.store.analyzeAuthView(viewAuth, []);

      this.makeKeys();
      await this.store.initialize(source, useCloumn);
      await this.store.fetchStatus();
      this.height = `${$(this.$refs.carousel).height()}px`;

      for (let item of this.store.instances) {
        if (item[fieldPic]) {
          const ret = await this.API.file({ data: { ids: item[fieldPic] }, method: "get" });
          if (ret.data && ret.data.length > 0) {
            this.$set(item, "__picture__", ret.data[0].res_path);
          }
        }
      }
      this.initializing = false;
    },
    makeKeys() {
      const { defKeys, defComplexity } = this.cpnt.data;
      this.store.makeDefkeys({ defKeys, defComplexity });
    },
  },
};
</script>
<style lang="less">
.pso-carousel {
  &.pso-carousel-1 {
    .pso-carousel-item {
      background-size: auto 100%;
    }
  }
  &.pso-carousel-2 {
    .pso-carousel-item {
      background-size: 100% auto;
    }
  }
  &.pso-carousel-3 {
    .pso-carousel-item {
      background-size: cover;
    }
  }
  .pso-carousel-item {
    height: 100%;
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    > div {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
      text-align: center;
      span {
        color: #fff;
        display: inline-block;
        padding: 2px 5px;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 8px;
      }
    }
  }
}
</style>
