<template>
  <div style="height: 100vh; width: 100%" v-loading="loading"></div>
</template>
<script>
import { SignInMixin } from "../../mixin/passport";

export default {
  mixins: [SignInMixin],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  async created() {
    const access_code = this.params.code;
    if (!access_code) return this.$router.push({ name: "login" });
    const ret = await this.API.accessLogin({ access_code });
    if (!ret.success) return this.$router.push({ name: "login" });
    this.signIn(ret.data);
  },
};
</script>
