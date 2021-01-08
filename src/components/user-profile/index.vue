<template>
  <div class="user-profile pso-container">
    <div class="user-profile-aside">
      <ul>
        <li v-for="(d, i) in ASIDE" :key="i">
          <a href="">
            <i :class="d.icon"></i><span>{{ d.name }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="user-profile-body">
      <pro-preference></pro-preference>
    </div>
  </div>
</template>
<script>
import ProPreference from "./preference";
const ASIDE = [
  {
    name: "偏好设置",
    icon: "el-icon-star-off",
  },
];
export default {
  components: { ProPreference },
  data() {
    this.ASIDE = ASIDE;
    return {};
  },
};
</script>