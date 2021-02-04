<template>
  <div class="view-field" @click="$emit('click')">
    <span v-if="titleable">{{ f.display }}：</span>
    <column-tag v-if="f.componentid === 'tag' && !store.fetching" :store="store" :data="data" :field="f"></column-tag>
    <column-ast v-else-if="f.componentid === 'asstable' && !store.fetching" :store="store" :data="data" :field="f"></column-ast>
    <span v-else :title="getFinal()">{{ getFinal() }}</span>
  </div>
</template>
<script>
import ColumnTag from "../form-view/column-tag";
import ColumnAst from "../form-view/column-ast";
import { makeTimeAgo } from "../../utils/util";
export default {
  components: { ColumnTag, ColumnAst },
  props: {
    store: Object,
    data: Object,
    field: Object,
    formatTime: {
      type: Boolean,
      default: false,
    },
    titleable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    f() {
      return this.store.getField(this.field);
    },
  },
  methods: {
    getFinal() {
      const value = this.store.formatListVal(this.data, this.f);
      if (this.formatTime) {
        return makeTimeAgo(value);
      }
      return value;
    },
  },
};
</script>