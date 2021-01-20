<template>
  <div class="paper-board">
    <div class="paper-board-header"><i class="el-icon-s-order"></i><span>结果</span></div>
    <div class="paper-board-body">
      <div class="paper-board-item" v-for="(d, i) in store.data" :key="i">
        <div class="paper-board-item__header">
          {{ d.urine.child_name }}
        </div>
        <div class="paper-board-question">
          <div class="paper-board-question-item" v-for="(qus, j) in d.questions" :key="j">
            <span>{{ j + 1 }}、</span>
            <span>{{ qus.score }} 分</span>
          </div>
        </div>
      </div>
      <div class="paper-board-total">
        <span>总分：</span>
        <span>{{ store.score }} 分</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    store: Object,
  },
};
</script>