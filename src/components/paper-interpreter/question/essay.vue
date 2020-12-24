<template>
  <div class="paper-interpreter-question question-input">
    <pso-empty v-if="error" :text="error"></pso-empty>
    <template v-else>
      <div class="paper-interpreter-question__stem">
        <div class="stem-index">{{ index }}.</div>
        <div class="stem-body">{{ data.stem }}</div>
      </div>
      <div class="paper-interpreter-question__body">
        <el-input type="textarea" :rows="3" v-model="data.result"> </el-input>
        <div v-if="cpnt.store.mode === 'preview'" class="question-input-tip">参考答案：{{ data.answer }}</div>
      </div>
    </template>
  </div>
</template>
<script>
import { QuestionMixin } from "../mixin";
export default {
  mixins: [QuestionMixin],
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.analyzeBase();
    },
  },
};
</script>