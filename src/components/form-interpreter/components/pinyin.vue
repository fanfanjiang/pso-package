<template>
  <pso-label :cpnt="cpnt">
    <el-input :size="size" type="text" :disabled="true" :value="transWords"></el-input>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
import Pinyin from "tiny-pinyin";

export default {
  mixins: [cpntMixin],
  computed: {
    transWords() {
      const { _source, _type } = this.cpnt.data;
      if (_source) {
        const SF = this.cpnt.store.search({ options: { fid: _source }, onlyData: true });
        if (SF) {
          if (!SF._val) return (this.cpnt.data._val = "");

          try {
            const result = Pinyin.convertToPinyin((SF._val + "").replace("~", ""), _type === "1" ? "" : "~", _type === "1");

            if (_type === "1") {
              this.cpnt.data._val = result.replace("~", "");
            } else {
              this.cpnt.data._val = result
                .split("~")
                .map((d) => d.slice(0, 1))
                .join("");
            }
          } catch (error) {
            console.log(error);
            this.cpnt.data._val = "";
          }
        }
      }

      return this.cpnt.data._val;
    },
  },
};
</script>