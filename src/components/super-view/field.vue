<template>
  <div class="view-field" @click="$emit('click')">
    <div class="view-field-new" v-if="newable">
      <new-tag></new-tag>
    </div>
    <span v-if="titleable && f.componentid !== 'attachment'">{{ f.display }}：</span>
    <column-tag v-if="f.componentid === 'tag' && !store.fetching" :store="store" :data="data" :field="f"> </column-tag>
    <column-ast v-else-if="f.componentid === 'asstable' && !store.fetching" :store="store" :data="data" :field="f"></column-ast>
    <pso-attachment
      v-else-if="f.componentid === 'attachment' && !store.fetching"
      :ids="data[f._fieldValue]"
      :split-symbol="f._splitSymbol"
      :downloadable="downloadable"
      :check="checkable"
      :picmode="picmode"
    ></pso-attachment>
    <span v-else-if="!store.fetching" :title="getFinal()" v-html="getFinal()"></span>
  </div>
</template>
<script>
import ColumnTag from "../form-view/column-tag";
import ColumnAst from "../form-view/column-ast";
import NewTag from "./new";
import PsoAttachment from "../attachment";
import { makeTimeAgo } from "../../utils/util";
export default {
  components: { ColumnTag, ColumnAst, PsoAttachment, NewTag },
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
    newable: {
      type: Boolean,
      default: false,
    },
    downloadable: {
      type: Boolean,
      default: true,
    },
    checkable: {
      type: Boolean,
      default: true,
    },
    picmode: {
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
<style lang="less" scoped>
.view-field {
  display: flex;
  align-items: center;
  .view-field-new {
    margin-right: 5px;
    display: flex;
    align-items: center;
  }
}
</style>