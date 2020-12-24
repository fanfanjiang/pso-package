<template>
  <div class="paper-interpreter-cpnt">
    <template v-if="!initializing">
      <div class="paper-interpreter-cpnt__item" v-for="(d, i) in cpnt.questions" :key="i">
        <slot :data="d" :index="i"></slot>
      </div>
    </template>
    <pso-skeleton v-else :lines="5"></pso-skeleton>
  </div>
</template>
<script>
import { BaseMixin } from "./mixin";
export default {
  mixins: [BaseMixin],
};
</script>