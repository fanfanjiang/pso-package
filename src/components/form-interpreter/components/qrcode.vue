<template>
  <pso-label :cpnt="cpnt">
    <img v-if="cpnt.data.__showVal__" :src="cpnt.data.__showVal__" alt="二维码" />
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
  computed: {
    qrText() {
      let text = "";
      if (this.cpnt.data._option) {
        for (let field of this.cpnt.data._option) {
          const target = this.cpnt.store.searchByField(field);
          if (target) {
            text += `${target.data._fieldName}：${target.data._val}；`;
          }
        }
      }
      return text;
    },
  },
  watch: {
    qrText() {
      this.genQRcode();
    },
  },
  created() {
    this.$set(this.cpnt.data, "__showVal__", "");
    this.genQRcode();
  },
  methods: {
    async genQRcode() {
      this.cpnt.data.__showVal__ = await QRCode.toDataURL(this.qrText);
      this.cpnt.data._val = !this.cpnt.data._val;
    },
  },
};
</script>