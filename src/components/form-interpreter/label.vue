<template>
  <el-form-item :required="cpnt.data._required">
    <template v-slot:label>
      <template v-if="name">
        {{ name }}
        <el-tooltip v-if="cpnt.data._fieldInfo" effect="dark" placement="top-start">
          <div slot="content" v-html="PSODOMPurify.sanitize(cpnt.data._fieldInfo)"></div>
          <i class="tip el-icon-question"></i>
        </el-tooltip>
      </template>
    </template>
    <slot></slot>
  </el-form-item>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    name() {
      return this.cpnt.data._hideFieldName ? "" : this.cpnt.data._fieldName;
    },
  },
};
</script>