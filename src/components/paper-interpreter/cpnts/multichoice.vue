<template>
  <question-section :cpnt="cpnt">
    <template v-slot:default="{ data, index }">
      <multichoice :data="data" :cpnt="cpnt" :index="index + 1"></multichoice>
    </template>
  </question-section>
</template>
<script>
import QuestionSection from "../section";
import Multichoice from "../question/multichoice";
export default {
  components: { QuestionSection, Multichoice },
  props: {
    cpnt: Object,
  },
};
</script>