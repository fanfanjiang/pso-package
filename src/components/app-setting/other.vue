<template>
  <div class="Lay-setting">
    <div class="header">
      <el-tabs v-model="curTab">
        <el-tab-pane label="资源配置" name="resource"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="body">
      <div style="padding: 0px 15px 15px 15px">
        <res-set v-if="curTab === 'resource'"></res-set>
      </div>
    </div>
  </div>
</template>
<script>
import ResSet from "./resource";
export default {
  components: { ResSet },
  data() {
    return {
      curTab: "resource",
    };
  },
};
</script>
