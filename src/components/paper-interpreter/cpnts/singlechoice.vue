<template>
  <question-section :cpnt="cpnt">
    <template v-slot:default="{ data, index }">
      <singlechoice :data="data" :cpnt="cpnt" :index="index + 1"></singlechoice>
    </template>
  </question-section>
</template>
<script>
import QuestionSection from "../section";
import Singlechoice from "../question/singlechoice";
export default {
  components: { QuestionSection, Singlechoice },
  props: {
    cpnt: Object,
  },
};
</script>