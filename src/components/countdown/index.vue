<template>
  <div>
    <slot v-bind:timeData="timeData">{{remainTime}}</slot>
  </div>
</template>
<script>
import { raf, cancelRaf } from "../../utils/raf";
import dayjs from "dayjs";
export default {
  props: {
    time: {
      type: Number,
      default: 60000
    },
    ml: {
      type: Boolean,
      default: false
    },
    auto: {
      type: Boolean,
      default: false
    },
    autoReset: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: "s"
    }
  },
  data() {
    return {
      countId: "",
      remain: 0,
      counting: false,
      end: 0
    };
  },
  computed: {
    remainTime() {
      return dayjs(this.remain).format(this.format);
    },
    timeData() {
      return {
        counting: this.counting,
        remain: this.remain,
        format: this.remainTime
      };
    }
  },
  created() {
    this.reset();
  },
  methods: {
    start() {
      if (this.counting) return;
      this.counting = true;
      this.end = Date.now() + this.remain;
      this.tick();
    },
    pause() {
      this.counting = false;
      cancelRaf(this.countId);
    },
    reset() {
      this.remain = this.time;
      this.pause();
      if (this.auto) {
        this.start();
      }
    },
    tick() {
      if (this.ml) {
        this.countMl();
      } else {
        this.count();
      }
    },
    count() {
      this.countId = raf(() => {
        this.setRemain();
        if (!this.isFinished()) {
          this.count();
        }
      });
    },
    countMl() {
      this.countId = raf(() => {
        this.setRemain();
        if (!this.isFinished()) {
          this.countMl();
        }
      });
    },
    setRemain() {
      this.remain = Math.max(0, this.end - Date.now());
      if (this.isFinished()) {
        if (this.autoReset) {
          this.reset();
        } else {
          this.pause();
        }
        this.$emit("finished");
      }
    },
    isFinished() {
      return this.remain === 0;
    }
  }
};
</script>