<template>
  <div
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    :class="{'wf-table-editor__icon-item':true, 'is-active': isActive }"
    @click="$emit('click')"
  >
    <img src="@/assets/images/editor-icon/bold.png" :alt="tip" v-if="type==='bold'" />
    <img src="@/assets/images/editor-icon/italic.png" :alt="tip" v-if="type==='italic'" />
    <img src="@/assets/images/editor-icon/strike.png" :alt="tip" v-if="type==='strike'" />
    <img src="@/assets/images/editor-icon/underline.png" :alt="tip" v-if="type==='underline'" />
    <img src="@/assets/images/editor-icon/paragraph.png" :alt="tip" v-if="type==='paragraph'" />
    <img src="@/assets/images/editor-icon/bullet_list.png" :alt="tip" v-if="type==='bullet_list'" />
    <img src="@/assets/images/editor-icon/table.png" :alt="tip" v-if="type==='table'" />
    <img src="@/assets/images/editor-icon/undo.png" :alt="tip" v-if="type==='undo'" />
    <img src="@/assets/images/editor-icon/redo.png" :alt="tip" v-if="type==='redo'" />
    <img src="@/assets/images/editor-icon/deleteTable.png" :alt="tip" v-if="type==='deleteTable'" />
    <img
      src="@/assets/images/editor-icon/addColumnBefore.png"
      :alt="tip"
      v-if="type==='addColumnBefore'"
    />
    <img
      src="@/assets/images/editor-icon/addColumnAfter.png"
      :alt="tip"
      v-if="type==='addColumnAfter'"
    />
    <img src="@/assets/images/editor-icon/deleteColumn.png" :alt="tip" v-if="type==='deleteColumn'" />
    <img src="@/assets/images/editor-icon/addRowBefore.png" :alt="tip" v-if="type==='addRowBefore'" />
    <img src="@/assets/images/editor-icon/addRowAfter.png" :alt="tip" v-if="type==='addRowAfter'" />
    <img src="@/assets/images/editor-icon/deleteRow.png" :alt="tip" v-if="type==='deleteRow'" />
    <img
      src="@/assets/images/editor-icon/toggleCellMerge.png"
      :alt="tip"
      v-if="type==='toggleCellMerge'"
    />
    <img src="@/assets/images/editor-icon/ordered_list.png" :alt="tip" v-if="type==='ordered_list'" />
    <img src="@/assets/images/editor-icon/blockquote.png" :alt="tip" v-if="type==='blockquote'" />
    <img src="@/assets/images/editor-icon/h1.png" :alt="tip" v-if="src==='h1'" />
    <img src="@/assets/images/editor-icon/h2.png" :alt="tip" v-if="src==='h2'" />
    <img src="@/assets/images/editor-icon/h3.png" :alt="tip" v-if="src==='h3'" />
    <img src="@/assets/images/editor-icon/h4.png" :alt="tip" v-if="src==='h4'" />
    <img src="@/assets/images/editor-icon/h5.png" :alt="tip" v-if="src==='h5'" />
    <img src="@/assets/images/editor-icon/left.png" :alt="tip" v-if="src==='left'" />
    <img src="@/assets/images/editor-icon/right.png" :alt="tip" v-if="src==='right'" />
    <img src="@/assets/images/editor-icon/center.png" :alt="tip" v-if="src==='center'" />

  </div>
</template>
<script>
export default {
  props: {
    type: String,
    tip: String,
    src: String,
    isActive: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="less" scoped>
.wf-table-editor__icon-item {
  width: 50px;
  padding: 14px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  img {
    height: 22px;
    width: 22px;
  }
  &.is-active {
    background-color: #fd8647;
  }
}
</style>