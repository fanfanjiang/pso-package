<template>
  <div class="paper-interpreter-question question-choice">
    <pso-empty v-if="error" :text="error"></pso-empty>
    <template v-else>
      <div class="paper-interpreter-question__stem">
        <div class="stem-index">{{ index }}.</div>
        <div class="stem-body">{{ data.stem }}</div>
      </div>
      <div class="paper-interpreter-question__body">
        <div class="paper-interpreter-radio">
          <el-checkbox-group v-model="data.result" @change="choiceChangeHandler">
            <el-checkbox :size="cpnt.store.size" :label="o" v-for="(o, i) in data.option" :key="i">
              <span :class="getRightClass(o)">{{ String.fromCharCode(65 + i) }}. {{ o }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { QuestionMixin } from "../mixin";
export default {
  mixins: [QuestionMixin],
  created() {
    if (typeof this.data.result === "string") {
      this.data.result = this.data.result ? this.data.result.split(this.splitSymbol) : [];
    }
    this.initialize();
  },
  computed: {
    answers() {
      return this.data.answer.split(this.splitSymbol);
    },
  },
  methods: {
    initialize() {
      this.analyzeBase();
      this.analyzeOption();
    },
    getRightClass(option) {
      return {
        "question-choice-right": this.cpnt.store.mode === "preview" && this.answers.includes(option),
      };
    },
    choiceChangeHandler(value) {
      const { score } = this.cpnt.data;
      if (value.length && value.length === this.answers.length && !_.difference(value, this.answers).length) {
        this.data.score = score;
      } else {
        this.data.score = 0;
      }
    },
  },
};
</script>