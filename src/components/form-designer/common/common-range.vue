<template>
  <div>
    <el-form-item label="限制数值范围">
      <el-switch size="mini" v-model="cpnt.data._useRange"></el-switch>
    </el-form-item>
    <div v-if="cpnt.data._useRange">
      <div>
        <el-input-number size="mini" v-model="cpnt.data._min" :controls="false"></el-input-number>
        <span style="margin: 0 10px">~</span>
        <el-input-number size="mini" v-model="cpnt.data._max" :controls="false"></el-input-number>
      </div>
      <div style="display: flex; margin-top: 10px">
        <el-select v-model="cpnt.data._minField" size="mini" placeholder="最小值" clearable filterable>
          <el-option v-for="(f, i) in fieldOptions" :key="i" :label="f._fieldName" :value="f._fieldValue"></el-option>
        </el-select>
        <span style="margin: 0 10px">~</span>
        <el-select v-model="cpnt.data._maxField" size="mini" placeholder="最大值" clearable filterable>
          <el-option v-for="(f, i) in fieldOptions" :key="i" :label="f._fieldName" :value="f._fieldValue"></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cpnt: {
      type: Object,
    },
  },
  computed: {
    fieldOptions() {
      return this.cpnt.store.search({
        options: { db: true },
        onlyData: true,
        beforePush: (item) => {
          if (item.fid === this.cpnt.fid) return false;
          return true;
        },
      });
    },
  },
};
</script>