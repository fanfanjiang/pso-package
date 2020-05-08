<template>
  <div class="script-designer">
    <div class="script-designer__panel">
      <div class="script-designer__panel-html">
        <monaco-editor
          class="script-monaco-editor"
          :options="options"
          v-model="store.htmlCode"
          language="html"
        />
      </div>
      <div class="script-designer__panel-css">
        <monaco-editor
          class="script-monaco-editor"
          :options="options"
          v-model="store.cssCode"
          language="less"
        />
      </div>
      <div class="script-designer__panel-js">
        <monaco-editor
          class="script-monaco-editor"
          :options="options"
          v-model="store.jsCode"
          language="javascript"
        />
      </div>
    </div>
    <div class="script-designer__output">
      <script-output :code="store"></script-output>
    </div>
  </div>
</template>
<script>
import ScriptOutput from "./output";
import VueMaker from "./vue-maker";

export default {
  components: { ScriptOutput },
  props: ["cpnts", "code"],
  data() {
    return {
      store: null,
      options: {
        contextmenu: false,
        minimap: {
          enabled: false
        }
      }
    };
  },
  created() {
    let code = this.code || {};
    console.log(this.cpnts);
    if (this.cpnts) {
      const maker = new VueMaker({ data: this.cpnts });
      code = {
        htmlCode: maker.getHtml(),
        jsCode: maker.getJs(),
        cssCode: maker.getCss()
      };
    }
    this.store = Object.assign({ htmlCode: "", cssCode: "", jsCode: "" }, code);
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";

.script-designer {
  height: 100%;
  .script-designer__panel {
    height: 40%;
    display: flex;
    > div {
      flex: 1;
    }
  }
  .script-designer__output {
    height: 60%;
    overflow: scroll;
    border-top: 2px solid #ebebeb;
  }
  .script-monaco-editor {
    height: 100%;
  }
  @{deep} {
    .monaco-editor {
      .overflow-guard {
        height: 100% !important;
        width: 100% !important;
      }
      height: 100% !important;
      width: 100% !important;
      .decorationsOverviewRuler {
        display: none;
      }
    }
  }
}
</style>