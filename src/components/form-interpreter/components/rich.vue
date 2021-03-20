<template>
  <pso-label :cpnt="cpnt">
    <rich-editor :editable="cpntEditable" :proxy="cpnt.data"></rich-editor>
  </pso-label>
</template>  
<script>
import cpntMixin from "../mixin";
import RichEditor from "../../rich-deitor";
export default {
  mixins: [cpntMixin],
  components: { RichEditor },
};
</script>