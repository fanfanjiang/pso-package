<template>
  <div class="paper-interpreter-question question-input">
    <pso-empty v-if="error" :text="error"></pso-empty>
    <template v-else>
      <div class="paper-interpreter-question__stem">
        <div class="stem-index">{{ index }}.</div>
        <div class="stem-body">{{ data.stem }}</div>
      </div>
      <div class="paper-interpreter-question__body">
        <el-input type="textarea" :rows="3" :readonly="!cpnt.store.paperEditable" v-model="data.result"> </el-input>
        <div v-if="cpnt.store.showAnswer" class="question-input-tip">参考答案：{{ data.answer }}</div>
        <el-form v-if="cpnt.store.gradeMode" size="mini" label-position="left" label-width="40px" style="margin-top: 20px">
          <el-form-item label="打分">
            <el-input-number size="mini" v-model="data.score" controls-position="right" :min="0" :max="cpnt.data.score"></el-input-number>
          </el-form-item>
        </el-form>
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