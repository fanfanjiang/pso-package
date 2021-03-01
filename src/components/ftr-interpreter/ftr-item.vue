<template>
  <div class="pso-ftr-fields">
    <template v-for="(f, i) in orderdFields">
      <div v-if="f.name && data[f.field]" class="pso-ftr-field" :key="i" @click="$emit('clickfield', { [f.field]: data[f.field] })">
        <span v-if="f.titled !== '1'">{{ f.name }}：</span>
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
  computed: {
    orderdFields() {
      return _.orderBy(
        this.fields.filter((d) => d.show),
        ["titled"],
        ["desc"]
      );
    },
  },
  methods: {
    filterText(text) {
      return this.store.getFiltered(text);
    },
  },
};
</script>