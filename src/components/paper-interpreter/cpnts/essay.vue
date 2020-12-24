<template>
  <question-section :cpnt="cpnt">
    <template v-slot:default="{ data, index }">
      <essay :data="data" :cpnt="cpnt" :index="index + 1"></essay>
    </template>
  </question-section>
</template>
<script>
import QuestionSection from "../section";
import Essay from "../question/essay";
export default {
  components: { QuestionSection, Essay },
  props: {
    cpnt: Object,
  },
};
</script>