<template>
  <div>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      height="500"
      size="small"
      :data="data"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="r_name" label="资源名"></el-table-column>
      <el-table-column prop="r_time" label="添加时间"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button size="mini" @click="$emit('go',{data:scope.row,node})">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pso-table-footer">
      <el-pagination
        background
        layout="total, prev, next"
        :total="dataTotal"
        :page-size="30"
        :current-page="page"
        @prev-click="prevClickHandler"
        @next-click="nextClickHandler"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    node: Object
  },
  data() {
    return {
      loading: false,
      data: [],
      page: 1,
      limit: 20,
      dataTotal: 0
    };
  },
  computed: {
    where() {
      return {
        start: this.page - 1,
        limit: this.limit
      };
    }
  },
  watch: {
    "node.node_id"() {
      this.fetch();
    },
    where() {
      this.fetch();
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const ret = await this.API.resource({
        data: {
          ...this.where,
          keys: JSON.stringify({ node_id: { type: 1, value: this.node.node_id } })
        }
      });
      if (ret.success) {
        this.data = ret.data;
        this.dataTotal = ret.total;
      }
      this.loading = false;
    },
    prevClickHandler() {
      this.page -= 1;
    },
    nextClickHandler() {
      this.page += 1;
    }
  }
};
</script>