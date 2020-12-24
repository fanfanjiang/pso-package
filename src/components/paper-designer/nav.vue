<template>
  <div class="designer-nav">
    <draggable tag="transition-group" v-model="store.data" :componentData="dragOption" :animation="100" handle=".designer-nav-drag">
      <div class="designer-nav-item" :class="{ 'designer-nav-item-active': d === store.curCpnt }" v-for="(d, i) in store.data" :key="i">
        <div class="designer-nav-item__body" @click="$emit('edit', d)">
          <i :class="d.__cpnt__.icon"></i>
          <span>{{ d.urine.child_name }}</span>
        </div>
        <div class="designer-nav-item__ctrl">
          <el-popconfirm title="你确定要删除吗？？？" @confirm="$emit('del', d.data.i)">
            <i slot="reference" class="el-icon-close designer-nav-del"></i>
          </el-popconfirm>
          <i class="el-icon-sort designer-nav-drag"></i>
        </div> 
      </div>
    </draggable>
  </div>
</template>
<script>
export default {
  props: {
    store: Object,
  },
  data() {
    this.dragOption = {
      props: {
        type: "transition",
        name: "flip-list",
      },
    };
    return {};
  },
};
</script>