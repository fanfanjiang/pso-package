<template>
  <div class="appswitch">
    <div class="appswitch-body">
      <el-menu>
        <template v-for="(ps, i) in sites">
          <el-submenu :index="i" :key="i" v-if="ps.site_type !== '0'">
            <template slot="title">
              <span>{{ ps.site_name }}</span>
            </template>
            <el-menu-item-group v-for="(subs, i) in ps.children" :key="i">
              <template slot="title">{{ subs.site_name }}</template>
              <template v-if="subs.children">
                <template v-for="(s, i) in subs.children">
                  <el-menu-item v-if="s.site_type !== '0'" :disabled="!s.site_app" :index="s.site_app" :key="i" @click="selectSite(s)">
                    {{ s.site_name }}
                  </el-menu-item>
                </template>
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
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