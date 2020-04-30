<template>
  <div>
    <pso-card-graphic
      :form-id="cpnt.data._selectedTable"
      :title="cpnt.data._fieldName"
      :title-field="cpnt.data._titleField"
      :img-field="cpnt.data._imgField"
      :info-field="cpnt.data._infoField"
    ></pso-card-graphic>
  </div>
</template>
<script>
export default {
  name: "pso-graphiccard-actor",
  props: ["cpnt"]
};
</script>