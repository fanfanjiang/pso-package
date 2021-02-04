<template>
  <div class="pso-ftr-fields">
    <template v-for="(f, i) in fields">
      <div v-if="f.display && data[f.field]" class="pso-ftr-field" :key="i" @click="$emit('clickfield', { [f.field]: data[f.field] })">
        <span v-if="!f.title && !f.d_name">{{ f.display }}：</span>
        <span v-html="filterText(data[f.field])"></span>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    store: Object,
    data: Object,
    fields: Array,
  },
  methods: {
    filterText(text) {
      return this.store.getFiltered(text);
    },
  },
};
</script>