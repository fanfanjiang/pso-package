<template>
  <div ref="carousel" :class="carouselStyle" style="height: 100%">
    <div class="pso-carousel-cal">
      <el-carousel ref="cal" v-if="!initializing" :height="height" :direction="cpnt.data.scrDrt" @change="carouselChange">
        <el-carousel-item v-for="(d, i) in store.instances" :key="i">
          <div v-if="d.__picture__" class="pso-carousel-item" :style="{ 'background-image': `url(${d.__picture__})` }">
            <div v-if="d[cpnt.data.fieldTitle] && !cpnt.data.showBody">
              <span>{{ d[cpnt.data.fieldTitle] }}</span>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="pso-carousel-timer" v-if="cpnt.data.fieldTime">
        <div
          v-for="(d, i) in store.instances"
          :key="i"
          :class="{ 'pso-carousel-timer-item': true, active: curIndex === i }"
          :style="getTimerStyle(i)"
          @mouseenter="setCurInst(i)"
        >
          <span>{{ getDay(d[cpnt.data.fieldTime]) }}</span>
          <span>{{ getMonth(d[cpnt.data.fieldTime]) }}</span>
          <span class="pso-carousel-bg" :style="getBgStyle(i)"></span>
        </div>
      </div>
    </div>
    <div class="pso-carousel-body" :style="bodyStyle" v-if="cpnt.data.showBody">
      <transition name="el-fade-in">
        <div class="pso-carousel-body-content" v-if="curCarl">
          <div class="pso-carousel-title" v-html="curCarl[cpnt.data.fieldTitle]"></div>
          <div class="pso-carousel-abs" v-html="curCarl[cpnt.data.fieldAbs]"></div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import SuperViewStore from "../../super-view/store";
import { BaseMixin } from "../mixin";
import { Resource } from "../../../mixin/resource";
import dayjs from "dayjs";

export default {
  mixins: [BaseMixin, Resource],
  data() {
    return {
      initializing: true,
      store: null,
      watchFun: [],
      height: `200px`,
      curIndex: 0,
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
    curCarl() {
      return this.store.instances[this.curIndex];
    },
    bodyStyle() {
      return {
        height: `${this.cpnt.data.carBodyH}px`,
      };
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const { viewAuth, useCloumn, source, sourceType, limit, fieldPic, fetchAPI } = this.cpnt.data;

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
      if (fetchAPI) {
        options.fetchAPI = fetchAPI;
      }
      this.store = new SuperViewStore(options);
      this.store.analyzeAuthView(viewAuth, []);

      this.makeKeys();
      await this.store.initialize(source, useCloumn);
      await this.store.fetchStatus();

      this.height = `${$(this.$refs.carousel).height() - (this.cpnt.data.showBody ? this.cpnt.data.carBodyH : 0)}px`;

      const attachCpnt = this.store.getField(fieldPic);

      for (let item of this.store.instances) {
        if (item[fieldPic]) {
          const pics = await this.fetchAndMakeAttach(item[fieldPic], attachCpnt._splitSymbol || ",");
          if (pics.length > 0) {
            this.$set(item, "__picture__", encodeURI(pics[0].res_path));
          }
        }
      }
      this.initializing = false;
    },
    makeKeys() {
      const { defKeys, defComplexity } = this.cpnt.data;
      this.store.makeDefkeys({ defKeys, defComplexity });
    },
    carouselChange(index) {
      this.curIndex = -1;
      this.$nextTick(() => {
        this.curIndex = index;
      });
    },
    getDay(t) {
      return this.getTime(t).split("-")[2];
    },
    getMonth(t) {
      return this.getTime(t, "YYYY-MM");
    },
    getTime(t, fomt = "YYYY-MM-DD") {
      return dayjs(t).format(fomt);
    },
    getTimerStyle(i) {
      return {
        color: i === this.curIndex ? this.cpnt.data.timerColor : "#fff",
      };
    },
    setCurInst(i) {
      this.$refs.cal.setActiveItem(i);
    },
    getBgStyle(i) {
      return {
        "background-color": i === this.curIndex ? "#fff" : this.cpnt.data.timerColor,
      };
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
  .pso-carousel-cal {
    position: relative;
    .pso-carousel-timer {
      position: absolute;
      bottom: 0;
      display: flex;
      align-items: center;
      .pso-carousel-timer-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 5px 2px 5px;
        padding: 5px;
        z-index: 2;
        color: #fff;
        cursor: pointer;
        position: relative;
        .pso-carousel-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.7;
          z-index: 0;
        }
        & + .pso-carousel-timer-item {
          margin-left: 2px;
        }
        span {
          z-index: 1;
          &:first-child {
            font-size: 24px;
            font-weight: bold;
            font-style: italic;
          }
          &:nth-child(2) {
            font-size: 12px;
          }
        }
      }
    }
  }
  .pso-carousel-body {
    background-color: #fff;
    overflow-y: auto;
    padding: 10px;
    .pso-carousel-title {
      font-weight: bold;
    }
  }
}
</style>
