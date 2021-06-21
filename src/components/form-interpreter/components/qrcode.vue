<template>
  <pso-label :cpnt="cpnt">
    <pso-file-list :files="fileProxy" :remove="false" :downloadable="false"></pso-file-list>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
import { cpntFix } from "../mixins";
import { makeFiles } from "../../../tool/file";

export default {
  mixins: [cpntMixin, cpntFix],
  data() {
    return {
      QRtext: "",
      fileProxy: [],
    };
  },
  computed: {
    host() {
      return `http://${window.location.host}`;
    },
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
        this.QRtext = this.QRtext.replace(/__HOST__/g, this.host);
        this.QRtext = this.QRtext.replace(/__APPID__/g, this.$store.state.base.user.appid);
        console.log(this.QRtext);
        this.cpnt.data.__showVal__ = await QRCode.toDataURL(this.QRtext);
        this.cpnt.data._val = this.QRtext;
        this.fileProxy = [{ res_path: this.cpnt.data.__showVal__, res_name: this.cpnt.data._fieldName, isSrcImg: true }];
        makeFiles({ files: this.fileProxy, urlField: "res_path", nameField: "res_name" });
      }
    },
  },
};
</script>