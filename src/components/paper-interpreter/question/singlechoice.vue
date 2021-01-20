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
          <el-radio-group :disabled="!cpnt.store.paperEditable" v-model="data.result" @change="choiceChangeHandler">
            <el-radio :size="cpnt.store.size" :label="o" v-for="(o, i) in data.option" :key="i">
              <span :class="getRightClass(o)">{{ String.fromCharCode(65 + i) }}. {{ o }}</span>
            </el-radio>
          </el-radio-group>
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
    this.initialize();
  },
  methods: {
    initialize() {
      this.analyzeBase();
      this.analyzeOption();
    },
    getRightClass(option) {
      return {
        "question-choice-right": this.cpnt.store.showAnswer && option == this.data.answer,
      };
    },
    choiceChangeHandler(value) {
      const { score } = this.cpnt.data;
      if (value === this.data.answer) {
        this.data.score = score;
      } else {
        this.data.score = 0;
      }
    },
  },
};
</script>