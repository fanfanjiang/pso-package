<template>
  <div class="pso-lay-ttable-wrapper">
    <div class="pso-lay-ttable">
      <div class="pso-lay-ttable__l" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :edit-mode="false"
            :draggable="false"
            @node-click="nodeClickHandler"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-lay-ttable__r">
        <div class="pso-lay-ttable__content">
          <el-timeline v-if="timeline.length">
            <el-timeline-item
              :key="index"
              :timestamp="t.op_time"
              placement="top"
              v-for="(t,index) in timeline"
            >
              <el-card>
                <h4>{{t.op_user}}</h4>
                <p>{{t.op_note}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <pso-empty v-else></pso-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["params"],
  data() {
    return {
      initializing: true,
      curNode: {},
      timeline: []
    };
  },
  computed: {
    treeOptions() {
      return {
        data_type: this.params.data_type,
        dimen: 7
      };
    }
  },
  methods: {
    nodeClickHandler(node) {
      if (!node.is_leaf) return;
      this.curNode = node;
      this.getTimeLine();
    },
    async getTimeLine() {
      const ret = await this.API.getWfTimeline({ wf_code: this.curNode.node_name });
      this.timeline = ret.data;
    }
  }
};
</script>
