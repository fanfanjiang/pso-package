<template>
  <component :is="currentView" />
</template>
<script>
// import less from "less";
import shortid from "shortid";

export default {
  props: {
    code: Object
  },
  data() {
    return {
      cssId: shortid.generate(),
      VuePreset: null
    };
  },
  async created() {
    window.onerror = function(message, source, line, column, error) {};
    const [VuePreset] = await Promise.all([import(/* webpackChunkName: "babel-stuffs" */ "babel-preset-vue/dist/babel-preset-vue")]);
    this.VuePreset = VuePreset;
  },
  computed: {
    cssCode() {
      return this.code.cssCode;
    },
    currentView() {
      let view;
      try {
        if (!this.code.jsCode) return { template: this.code.htmlCode };
        let Fn = Function;
        view = new Fn(`${this.transformEs(this.code.jsCode)}`)();
        view.template = this.code.htmlCode;
      } catch (e) {
        view = { template: this.code.htmlCode };
      }
      return view;
    }
  },
  watch: {
    cssCode(curVal, oldVal) {
      this.$el.setAttribute("class", `remote css${this.cssId}`);
      var styleDom = document.querySelector(`style[id=css${this.cssId}]`);
      if (styleDom) $(styleDom).remove();
      let cssStr = `.css${this.cssId}{${curVal}}`;
      this.createCss(cssStr);
    }
  },
  methods: {
    async createCss(lessInput) {
      try {
        // let output = await less.render(lessInput);
        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("id", "css" + this.cssId);
        if (style.styleSheet) {
          style.styleSheet.cssText = lessInput;
        } else {
          style.appendChild(document.createTextNode(lessInput));
        }
        let heads = document.getElementsByTagName("head");
        if (heads.length) {
          heads[0].appendChild(style);
        } else {
          document.documentElement.appendChild(style);
        }
      } catch (error) {}
    },
    transformEs(jsCode) {
      let tjs = window.Babel.transform(jsCode, {
        presets: [
          [
            "es2015",
            {
              modules: false
            }
          ],
          "es2016",
          "es2017",
          "stage-0",
          this.VuePreset
        ]
      }).code;
      tjs = "\n" + tjs;
      let matches = tjs.match(/\nfunction\s([^(]+)\(/gm);
      if (matches && matches.length) {
        matches.forEach(mcs => (tjs = tjs.replace(/\nfunction\s([^(]+)\(/, "\nwindow.$1=function(")));
      }
      tjs = tjs.replace(/var\s+app\s?=/, "return ");
      return tjs;
    }
  }
};
</script>