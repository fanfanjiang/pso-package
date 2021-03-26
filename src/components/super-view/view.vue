<template>
  <div ref="container" class="pso-sv-view" @scroll="scrollHandler">
    <div v-if="store.instances.length">
      <div class="pso-sv-view-item" v-for="(d, i) in store.instances" :key="i">
        <div v-if="checkable" class="pso-sv-view-item-check">
          <el-checkbox v-model="d.__checkedshit__" @change="checkHandler"></el-checkbox>
        </div>
        <div class="pso-sv-view-item-body">
          <div class="pso-sv-view-item__t">
            <span class="pso-sv-view-title" :class="{ clickable: clickable }">
              <view-field
                v-if="params.fieldTitle"
                :field="params.fieldTitle"
                :store="store"
                :data="d"
                @click="detailHandler(d)"
              ></view-field>
            </span>
          </div>
          <div class="pso-sv-view-item__c" v-if="params.fieldPic || params.fieldContent.length">
            <div class="pso-sv-view-item__c-l">
              <div class="pso-sv-view-pic" v-if="params.fieldPic">
                <pso-attachment :ids="d[params.fieldPic]"></pso-attachment>
              </div>
              <div class="pso-sv-view-abs" v-if="params.fieldAbs" v-html="d[params.fieldAbs]"></div>
              <div class="pso-sv-view-info" v-if="params.fieldContent">
                <view-field v-for="(f, i) in params.fieldContent" :key="i" :field="f" :store="store" :data="d" titleable></view-field>
              </div>
            </div>
          </div>
          <div class="pso-sv-view-item__b" v-if="actionabled || params.fieldTime">
            <div class="pso-sv-view-actions">
              <div class="pso-sv-view-actions-item" v-for="(a, i) in store.actions" :key="i">
                <el-popconfirm
                  v-if="a.mode === '2'"
                  confirmButtonText="确定"
                  cancelButtonText="取消"
                  icon="el-icon-info"
                  iconColor="red"
                  title="你确认要执行吗？"
                  @confirm="checkAction(a, d)"
                >
                  <action-btn slot="reference" :action="a" :store="store" :checkable="false"></action-btn>
                </el-popconfirm>
                <action-btn v-else :action="a" :store="store" :checkable="false" @click="checkAction(a, d)"></action-btn>
              </div>
            </div>
            <span class="pso-sv-view-time">
              <view-field
                v-if="params.fieldTime"
                :data="d"
                :store="store"
                :field="params.fieldTime"
                :format-time="!!params.timeAgo"
              ></view-field>
            </span>
          </div>
        </div>
      </div>
    </div>
    <pso-empty v-if="!store.fetching && !store.instances.length"></pso-empty>
    <pso-skeleton v-if="store.fetching" :lines="3" :s-style="{ padding: '10px' }"></pso-skeleton>
  </div>
</template>
<script>
import PsoAttachment from "../attachment";
import ViewField from "./field";
import ActionBtn from "../form-view/action-btn";

export default {
  components: { PsoAttachment, ViewField, ActionBtn },
  props: {
    store: Object,
    params: Object,
    checkable: {
      type: Boolean,
      default: false,
    },
    actionable: {
      type: Boolean,
      default: true,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
    clickShow: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    scrollDisabled() {
      return this.store.fetchFinished || this.store.starting || this.store.fetching;
    },
    actionabled() {
      return this.actionable && this.store.actions.length;
    },
  },
  created() {
    this.$nextTick(() => {
      this.scrollHandler();
    });
  },
  methods: {
    checkAction(action, data) {
      this.store.selectedList = [data];
      this.store.checkAction(action);
    },
    checkLoading() {
      return this.store.fetchFinished || this.store.starting || this.store.fetching;
    },
    loadHandler() {
      if (this.checkLoading()) return;
      this.store.page += 1;
      this.store.fetch();
    },
    scrollHandler() {
      if (this.checkLoading()) return;
      const $el = $(this.$refs.container);
      const scrollBottom = $el.scrollTop() + $el.get(0).clientHeight;
      const shouldTrigger = $el.get(0).scrollHeight - scrollBottom <= 5;
      if (shouldTrigger) {
        this.loadHandler();
      }
      return shouldTrigger;
    },
    detailHandler(data) {
      if (!this.clickable) return;
      if (this.store.sourceType === "0" && this.clickShow) {
        this.store.showInstance(data);
      } else {
        this.$emit("click-inst", data);
      }
    },
    checkHandler() {
      this.store.checkSelectByShit();
    },
  },
};
</script>