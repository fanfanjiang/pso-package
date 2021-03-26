<template>
  <pso-label :cpnt="cpnt">
    <template v-if="cpnt.data._type === '1'"> 
      <rich-editor v-if="cpntEditable" :proxy="cpnt.data"></rich-editor>
      <div v-else v-html="cpnt.data._val"></div>
    </template>
    <markdown-editor v-else :editable="cpntEditable" :proxy="cpnt.data"></markdown-editor>
  </pso-label>
</template>  
<script>
import cpntMixin from "../mixin";
import MarkdownEditor from "../../markdown-editor";
import RichEditor from "../../rich-editor";
export default {
  mixins: [cpntMixin],
  components: { MarkdownEditor, RichEditor },
};
</script>