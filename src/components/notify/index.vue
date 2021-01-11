<template>
  <div class="pso-notify-index pso-container">
    <div class="pso-notify-index__aside">
      <div class="pso-notify-index__aside-header">消息中心</div>
      <div class="pso-notify__aside-item">
        <ul class="pso-notify__aside-item-sub">
          <li class="pso-notify__aside-item-subitem" :class="{ active: store.unreadable }" @click="checkUnread">
            <i class="el-icon-bell"></i>
            <span>未读消息</span>
          </li>
          <li class="pso-notify__aside-item-subitem" :class="{ active: !store.curCat && !store.unreadable }" @click="setCurCat(null)">
            <i class="el-icon-message-solid"></i>
            <span>全部消息</span>
          </li>
        </ul>
      </div>
      <div class="pso-notify__aside-item" v-for="(pcat, i) in store.catTree" :key="i">
        <span class="pso-notify__aside-item-title">{{ pcat.map_key2 }}</span>
        <ul class="pso-notify__aside-item-sub" v-if="pcat.children">
          <li
            class="pso-notify__aside-item-subitem"
            :class="{ active: cat === store.curCat }"
            v-for="(cat, j) in pcat.children"
            :key="j"
            @click="setCurCat(cat)"
          >
            <span>{{ cat.map_key2 }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="pso-notify-index__body">
      <notify-view v-if="store" :store="store" pagination></notify-view>
    </div>
  </div>
</template>
<script>
import Store from "./store";
import NotifyView from "./view";
export default {
  components: { NotifyView },
  props: {},
  data() {
    return {
      store: null,
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.store = new Store({ $vue: this, unreadable: true });
      await this.store.getCategory();
    },
    async setCurCat(data) {
      this.store.fetchByCat(data);
    },
    async checkUnread() {
      this.store.fetchUnread();
    },
  },
};
</script>