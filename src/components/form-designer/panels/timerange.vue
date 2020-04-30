<template>
  <div class="act-select-body">
    <common-panel :cpnt="cpnt" info="时间选择组件，需要填写者选择起止日期与时刻。" :needPlaceholder="false" need-unique>
      <el-form-item label="选择关联字段" v-if="cpnt.data._unique">
        <el-select multiple v-model="relatedField" placeholder="请选择">
          <el-option
            v-for="item in fieldOptions"
            :key="item.fid"
            :label="item._fieldName"
            :value="item.fid"
          ></el-option>
        </el-select>
      </el-form-item>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  data() {
    return {
      watchOptProxy: []
    };
  },
  computed: {
    fieldOptions() {
      this.watchOptProxy = this.cpnt.store.search({
        options: { db: true },
        beforePush: item => !item.parent.CPNT.host_db && item.fid !== this.cpnt.fid,
        onlyData: true
      });
      return this.watchOptProxy;
    },
    relatedField: {
      get() {
        return !this.cpnt.data._relatedField ? [] : this.cpnt.data._relatedField.split(",");
      },
      set(val) {
        this.cpnt.data._relatedField = val.join(",");
      }
    }
  },
  watch: {
    watchOptProxy: {
      deep: true,
      handler() {
        this.cpnt.data._relatedField = "";
      }
    }
  }
};
</script>
