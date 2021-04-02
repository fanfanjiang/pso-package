<template>
  <el-row>
    <el-col :span="1">
      <div class="pso-icon-picker__item" @click="$emit('select', '')">
        <i>无</i>
      </div>
    </el-col>
    <el-col :span="1" v-for="i in ICON" :key="i">
      <div class="pso-icon-picker__item" @click="$emit('select', i)">
        <i :class="i"></i>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import ICON from "../../const/icon";
export default {
  data() {
    return {
      ICON: ICON,
    };
  },
};
</script>