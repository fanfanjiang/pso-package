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
      tags: []
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

    if (this.node[this.field] && !this.data.length) {
      this.getTpDetail(this.node[this.field]);
    }
    this.initializing = false;
  },
  methods: {
    async getTpDetail(tp_code) {
      if (tp_code) {
        const ret = await this.API.templates({ data: { tp_code }, method: "get" });
        if (ret.success && ret.data.tp.route_setting) {
          this.data = JSON.parse(ret.data.tp.route_setting);
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