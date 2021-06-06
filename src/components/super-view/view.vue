<template>
  <div ref="container" :class="vewStyle" @scroll="scrollHandler">
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
                :newable="checkNewable(d) && !d.__unnewable__"
                :downloadable="false"
                :checkable="false"
                picmode
                @click="detailHandler(d)"
              ></view-field>
            </span>
          </div>
          <div class="pso-sv-view-item__c" v-if="params.fieldPic || params.fieldContent.length">
            <div class="pso-sv-view-item__c-l">
              <div class="pso-sv-view-pic" v-if="params.fieldPic">
                <view-field :field="params.fieldPic" :store="store" :data="d"></view-field>
              </div>
              <div class="pso-sv-view-abs" v-if="params.fieldAbs" v-html="d[params.fieldAbs]"></div>
              <div class="pso-sv-view-info" v-if="params.fieldContent">
                <view-field v-for="(f, i) in params.fieldContent" :key="i" :field="f" :store="store" :data="d" titleable></view-field>
              </div>
            </div>
          </div>
          <div class="pso-sv-view-item__b" v-if="store.actionMGR.actions.length || params.fieldTime">
            <div class="pso-sv-view-actions" v-if="actionable">
              <action-group :store="store" :data="[d]" location="2"></action-group>
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
import ViewField from "./field";
import ActionGroup from "../form-view/action-group";
import { judgeByRules } from "../../tool/form";

export default {
  components: { ViewField, ActionGroup },
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
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    scrollDisabled() {
      return this.store.fetchFinished || this.store.starting || this.store.fetching;
    },
    vewStyle() {
      return {
        vertical: !!this.vertical,
        "pso-sv-view": true,
      };
    },
  },
  created() {
    this.$nextTick(() => {
      this.scrollHandler();
    });
  },
  methods: {
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
      }
      this.$set(data, "__unnewable__", true);
      this.$emit("click-inst", data);
    },
    checkHandler() {
      this.store.checkSelectByShit();
    },
    checkNewable(data) {
      const { newable, newRuleType, newRule } = this.params;
      if (!newable) {
        return false;
      }
      return judgeByRules({ datas: [data], ruleOptions: { rule: newRule, ruleType: newRuleType }, store: this.store.store });
    },
  },
};
</script>