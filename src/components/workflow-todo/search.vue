<template>
  <div class="todo-search">
    <el-autocomplete
      size="mini"
      placeholder="流程"
      prefix-icon="el-icon-search"
      clearable
      v-model="keywords.wf_name"
      :fetch-suggestions="getWorkflows"
    ></el-autocomplete>
    <el-divider direction="vertical"></el-divider>
    <el-input size="mini" prefix-icon="el-icon-search" placeholder="搜索事项" clearable v-model="keywords.d_name"></el-input>
    <el-divider direction="vertical"></el-divider>
    <el-select size="mini" multiple collapse-tags v-model="keywords.instance_status" placeholder="流程状态">
      <el-option v-for="(r, i) in REVIEW_STATUS_LIST" :key="i" :label="r.name" :value="r.value"> </el-option>
    </el-select>
    <el-divider direction="vertical"></el-divider>
    <el-autocomplete
      size="mini"
      placeholder="创建人"
      clearable
      v-model="keywords.user_name"
      prefix-icon="el-icon-search"
      :fetch-suggestions="getUsers"
    ></el-autocomplete>
    <el-divider direction="vertical"></el-divider>
    <el-autocomplete
      size="mini"
      placeholder="创建部门"
      clearable
      v-model="keywords.dept_name"
      prefix-icon="el-icon-search"
      :fetch-suggestions="getOrgs"
    ></el-autocomplete>
    <el-divider direction="vertical"></el-divider>
    <el-date-picker
      size="mini"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      format="yyyy-MM-dd"
      v-model="keywords.create_time"
    >
    </el-date-picker>
  </div>
</template>
<script>
import { REVIEW_STATUS } from "../../const/workflow";
const REVIEW_STATUS_LIST = Object.values(REVIEW_STATUS);

export default {
  props: {
    keywords: Object,
    users: Array,
    orgs: Array,
    workflows: Array,
  },
  data() {
    this.REVIEW_STATUS_LIST = REVIEW_STATUS_LIST;
    return {};
  },
  methods: {
    getUsers(query, cb) {
      cb(this.getResults(query, this.users));
    },
    getOrgs(query, cb) {
      cb(this.getResults(query, this.orgs));
    },
    getWorkflows(query, cb) {
      cb(this.getResults(query, this.workflows));
    },
    getResults(query, entity) {
      return query ? entity.filter(this.createFilter(query)) : entity;
    },
    createFilter(query, vfield) {
      return (data) => {
        return data.value.toLowerCase().indexOf(query.toLowerCase()) === 0;
      };
    },
  },
};
</script>
