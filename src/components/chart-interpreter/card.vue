<template>
  <div class="pso-chart-card">
    <div class="pso-chart-card-body">
      <div class="pso-chart-card__top" v-if="cardData.length">
        <div class="pso-chart-card__top-title">{{cardData[0].name}}</div>
        <div class="pso-chart-card__top-num">{{cardData[0].value}}</div>
      </div>
      <div class="pso-chart-card__bottom" v-if="cardData.length>1">
        <span class="pso-chart-card__bottom-title">{{cardData[1].name}}</span>
        <span class="pso-chart-card__bottom-num">{{cardData[1].value}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["chartConfig", "data"],
  computed: {
    cardData() {
      const cardData = [];
      try {
        const data = this.data.rows[0];
        this.chartConfig.metrics.forEach(m => {
          let value = data[m._fieldValue];
          if (typeof value !== "undefined") {
            cardData.push({ name: m.alias || m._fieldName, value: `${value} ${m.unit || ""}` });
          }
        });
      } catch (error) {
        return [];
      }
      return cardData;
    }
  }
};
</script>
