<template>
  <div>
    <div v-if="!initializing">
      <el-form-item label="选择插件">
        <el-select size="small" filterable v-model="node[field]" clearable @change="getTpDetail">
          <el-option
            v-for="item in templetes"
            :key="item.node_name"
            :label="item.node_display"
            :value="item.node_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <transition name="el-zoom-in-top">
        <div v-if="node[field]&&data.length">
          <pso-title>插件参数</pso-title>
          <el-form-item v-for="tpItem in data" :key="tpItem.field" :label="tpItem.name">
            <template v-if="tpItem.picker==='picker-form'||tpItem.picker==='picker-wf'">
              <el-select
                v-if="tpItem.picker==='picker-form'"
                filterable
                clearable
                size="small"
                v-model="tpItem.value"
              >
                <el-option
                  v-for="item in forms"
                  :key="item.node_name"
                  :label="item.node_display"
                  :value="item.node_name"
                ></el-option>
              </el-select>
              <el-select
                v-if="tpItem.picker==='picker-wf'"
                filterable
                clearable
                size="small"
                v-model="tpItem.value"
              >
                <el-option
                  v-for="item in workflows"
                  :key="item.node_name"
                  :label="item.node_display"
                  :value="item.node_name"
                ></el-option>
              </el-select>
              <slot v-bind:data="tpItem"></slot>
            </template>
            <el-select
              v-if="tpItem.picker==='picker-tag'"
              filterable
              clearable
              size="small"
              v-model="tpItem.value"
            >
              <el-option
                v-for="item in tags"
                :key="item.dimen_tag"
                :label="item.tag_name"
                :value="item.dimen_tag"
              ></el-option>
            </el-select>
            <el-input
              v-if="tpItem.picker==='input'"
              v-model="tpItem.value"
              size="small"
              autocomplete="off"
            ></el-input>
            <el-select
              v-if="tpItem.picker==='picker-text'"
              filterable
              clearable
              size="small"
              v-model="tpItem.value"
            >
              <el-option v-for="item in text" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </transition>
    </div>
    <pso-skeleton v-else :lines="3"></pso-skeleton>
  </div>
</template>
<script>
export default {
  props: ["data", "node", "field"],
  data() {
    return {
      initializing: true,
      forms: [],
      workflows: [],
      tags: [],
      text: []
    };
  },
  async created() {
    //加载流程列表
    this.initializing = true;
    this.templetes = await this.API.getTempleteTree();
    this.forms = await this.API.getFormTree();
    //加载表单列表
    this.workflows = await this.API.getWfTree();
    const tagRet = await this.API.getTreeDimen();
    this.tags = tagRet.data;
    this.getTpDetail(this.node[this.field], this.data);
    this.initializing = false;
  },
  methods: {
    async getTpDetail(code, originData) {
      if (code) {
        const ret = await this.API.getTreeNode({ code });
        if (ret.success) {
          const cfg = ret.data.data;
          const setting = JSON.parse(cfg.route_setting);

          if (originData) {
            const data = [];
            setting.forEach(item => {
              const exist = _.find(originData, { field: item.field }) || {};
              data.push({ ...item, ...exist });
            });
            this.data = data;
          } else {
            this.data = setting;
          }

          //加载文本组
          if (cfg.tp_text) {
            this.text = JSON.parse(cfg.tp_text);
          }
        } else {
          this.data = [];
        }
      } else {
        this.data = [];
      }
      this.$emit("change", this.data);
    }
  }
};
</script>