<template>
  <div class="pso-notify-index pso-container">
    <div class="pso-notify-index__aside" v-loading="store.fetching">
      <div class="pso-notify-index__aside-header">消息中心</div>
      <div class="pso-notify__aside-item">
        <ul class="pso-notify__aside-item-sub">
          <li class="pso-notify__aside-item-subitem" :class="{ active: !store.mine }" @click="fetchCommon({ mine: false })">
            <i class="el-icon-message-solid"></i>
            <span>我收到的</span>
          </li>
          <li class="pso-notify__aside-item-subitem" :class="{ active: store.mine }" @click="fetchCommon({ mine: true })">
            <i class="el-icon-s-promotion"></i>
            <span>我发出的</span>
          </li>
        </ul>
      </div>
      <template v-if="!__isMobile__">
        <div class="pso-notify__aside-item" v-if="store.catTree.length">
          <ul class="pso-notify__aside-item-sub">
            <li class="pso-notify__aside-item-subitem" :class="{ active: !store.curCat }" @click="fetchCommon({ curCat: null })">
              <i class="el-icon-s-home"></i>
              <span>全部分类</span>
            </li>
          </ul>
        </div>
        <div class="pso-notify__aside-item" :style="{ 'border-width': i === 0 ? '0' : '1px' }" v-for="(pcat, i) in store.catTree" :key="i">
          <span class="pso-notify__aside-item-title">{{ pcat.map_key2 }}</span>
          <ul class="pso-notify__aside-item-sub" v-if="pcat.children">
            <li
              class="pso-notify__aside-item-subitem"
              :class="{ active: cat === store.curCat }"
              v-for="(cat, j) in pcat.children"
              :key="j"
              @click="fetchCommon({ curCat: cat })"
            >
              <span>{{ cat.map_key2 }}</span>
            </li>
          </ul>
        </div>
      </template>
    </div>
    <div class="pso-notify-index__body">
      <div class="pso-notify-index__menu" v-loading="store.fetching">
        <el-checkbox v-model="store.unreadable" @change="refresh">只看未读</el-checkbox>
        <el-button size="mini" type="primary" round @click="transAll" :loading="store.updating" :disabled="transAllDisabled">
          全部转为已读
        </el-button>
      </div>
      <div class="pso-notify-index__view">
        <notify-view v-if="store" :store="store" pagination></notify-view>
      </div>
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
  computed: {
    transAllDisabled() {
      return this.store.instances.every(({ msg_status }) => msg_status !== 0) || this.store.updating || this.store.mine;
    },
  },
  methods: {
    async initialize() {
      this.store = new Store({ $vue: this });
      await this.store.getCategory();
    },
    fetchCommon(data) {
      this.store.fetchCommon(data);
    },
    refresh() {
      this.store.refresh();
    },
    transAll() {
      this.store.updateList();
    },
  },
};
</script>
<style lang="less">
.pso-notify-index__body {
  display: flex;
  flex-direction: column;
  .pso-notify-index__menu {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
      margin-left: 20px;
    }
  }
  .pso-notify-index__view {
    flex: 1;
    height: calc(100% - 40px);
  }
}
</style>