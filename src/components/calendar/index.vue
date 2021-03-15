<template>
  <div class="pso-calendar">
    <div class="pso-calendar__calendar" style="background-image: url(/static/app/img/desk/calendar.png)">
      <el-calendar v-model="value" :range="rangeVal" lunarcalendar>
        <template slot="dateCell" slot-scope="{ data }">
          <p style="white-space: pre-line" @click="handlerCurrentDate(data.day)">{{ solarDate2lunar(data.day) }}</p>
        </template>
      </el-calendar>
      <div class="pso-calendar__expend" @click="setCalendar"></div>
    </div>
    <div class="pso-calendar__body">
      <div class="pso-calendar__info">
        <div class="pso-calendar__info-day">{{ currentDay }}</div>
        <div>
          <p>{{ currentWeek }}</p>
          <p>{{ currentDate }}</p>
          <p>{{ currentYear }}</p>
          <p>{{ currentMonth }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { calendar } from "../../utils/lunar"; //农历转换JS 1900-2100
import dayjs from "dayjs";
export default {
  props: {
    time: {
      type: [Date, String],
      default: new Date(),
    },
  },
  data() {
    return {
      value: "",
      resDate: [],
      rangeVal: [],
      resDate: [],
      isWeek: true,
      currentDay: "",
      currentWeek: "",
      currentDate: "",
      currentYear: "",
      currentMonth: "",
      watchFun: [],
    };
  },
  async created() {
    if (this.watchFun.length) {
      this.watchFun.forEach((f) => f());
      this.watchFun = [];
    }
    this.value = this.time;
    this.setCalendar();
    this.getCurrentDate();

    this.watchFun.push(
      this.$watch("value", (value) => {
        this.$emit("change", value);
      })
    );
  },
  methods: {
    // 农历显示
    solarDate2lunar(solarDate) {
      var solar = solarDate.split("-");
      var lunar = calendar.solar2lunar(solar[0], solar[1], solar[2]);
      return (
        solar[2] +
        "\n" +
        (lunar.festival
          ? lunar.festival
          : lunar.lunarFestival
          ? lunar.lunarFestival
          : lunar.IDayCn === "初一"
          ? lunar.IMonthCn
          : lunar.IDayCn)
      );
    },
    setCalendar() {
      if (this.isWeek) {
        var now = new Date();
        var weekFirstDay = new Date(now - (now.getDay() - 1) * 86400000);
        var firstMonth = Number(weekFirstDay.getMonth()) + 1;
        var weekLastDay = new Date((weekFirstDay / 1000 + 6 * 86400) * 1000);
        var lastMonth = Number(weekLastDay.getMonth()) + 1;
        let sRange = weekFirstDay.getFullYear() + "-" + firstMonth + "-" + weekFirstDay.getDate();
        let eRange = weekLastDay.getFullYear() + "-" + lastMonth + "-" + weekLastDay.getDate();

        this.rangeVal = [sRange, eRange];
      } else {
        this.rangeVal = [];
      }
      this.isWeek = !this.isWeek;
    },
    getCurrentDate(curDate) {
      var cdate = dayjs(curDate).format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD");
      var solar = cdate.split("-");
      var lunar = calendar.solar2lunar(solar[0], solar[1], solar[2]);
      this.currentDay = lunar.cDay;
      this.currentWeek = lunar.ncWeek;
      this.currentDate = lunar.festival
        ? lunar.festival
        : lunar.lunarFestival
        ? lunar.lunarFestival
        : "农历" + lunar.IMonthCn + lunar.IDayCn;
      this.currentYear = `${lunar.gzYear}年 【${lunar.Animal}年】`;
      this.currentMonth = `${lunar.gzMonth}月 ${lunar.gzDay}日 ${lunar.astro}`;
    },
    handlerCurrentDate(date) {
      this.getCurrentDate(date);
    },
  },
};
</script>
