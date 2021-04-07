<template>
  <pso-label :cpnt="cpnt">
    <img v-if="cpnt.data.__showVal__" :src="cpnt.data.__showVal__" alt="二维码" />
    <span>{{ QRtext }}</span>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
import { cpntFix } from "../mixins";
export default {
  mixins: [cpntMixin, cpntFix],
  data() {
    return {
      QRtext: "",
    };
  },
  created() {
    this.$set(this.cpnt.data, "__showVal__", "");
    this.genQRcode();

    if (this.cpnt.data._datasource) {
      this.$watch("fixValue", (val) => {
        this.QRtext = val;
        this.genQRcode();
      });
      this.startWatch();
    }
  },
  methods: {
    async genQRcode() {
      if (this.QRtext) {
        this.cpnt.data.__showVal__ = await QRCode.toDataURL(this.QRtext);
        console.log(JSON.parse(this.QRtext))
        this.cpnt.data._val = !this.cpnt.data._val;
      }
    },
  },
};
</script>