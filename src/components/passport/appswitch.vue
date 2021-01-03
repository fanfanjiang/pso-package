<template>
  <div class="appswitch">
    <div class="appswitch-body">
      <el-menu>
        <el-submenu :index="i" v-for="(ps, i) in sites" :key="i">
          <template slot="title">
            <span>{{ ps.site_name }}</span>
          </template>
          <el-menu-item-group v-for="(subs, i) in ps.children" :key="i">
            <template slot="title">{{ subs.site_name }}</template>
            <template v-if="subs.children">
              <el-menu-item :disabled="!s.site_app" :index="s.site_app" v-for="(s, i) in subs.children" :key="i" @click="selectSite(s)">
                {{ s.site_name }}
              </el-menu-item>
            </template>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sites: Array,
  },
  methods: {
    selectSite(site) {
      this.$emit("change", site);
    },
  },
};
</script>