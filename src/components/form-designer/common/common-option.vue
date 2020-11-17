<template>
  <draggable
    tag="transition-group"
    v-model="cpnt.data._option"
    :componentData="dragOption"
    :animation="100"
    handle=".act-select__option__handle"
  >
    <div
      class="act-select__option flex-row-center-between"
      v-for="(option,idx) in cpnt.data._option"
      :key="idx"
    >
      <i class="el-icon-sort act-select__option__handle"></i>
      <el-input size="mini" v-model="option._optionName" placeholder="选项名"></el-input>
      <el-input size="mini" v-model="option._optionValue" placeholder="选项值"></el-input>
      <el-tooltip
        effect="dark"
        content="设为默认"
        placement="top-end"
        :enterable="false"
        :hide-after="500"
      >
        <el-radio
          size="mini"
          v-if="!multiple"
          v-model="cpnt.data._defaultValue"
          :label="option._optionValue"
        ></el-radio>
        <el-checkbox
          size="mini"
          v-else
          :true-label="option._optionValue"
          v-model="cpnt.data._defaultValueList[idx]"
          :label="option._optionValue"
        ></el-checkbox>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="删除"
        placement="top-end"
        :enterable="false"
        :hide-after="500"
      >
        <i class="act-select__option__del el-icon-close" @click="delOption(idx)"></i>
      </el-tooltip>
    </div>
    <div slot="footer" key="footer">
      <el-button @click="addOption" type="success" icon="el-icon-plus" size="mini" round plain>添加选项</el-button>
    </div>
  </draggable>
</template> 
<script>
import draggable from "vuedraggable";

export default {
  props: {
    cpnt: {
      type: Object,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  components: { draggable },
  data() {
    return {
      dragOption: {
        props: {
          type: "transition",
          name: "flip-list",
        },
      },
    };
  },
  created() {
    if (this.cpnt.data._defaultValue) {
      this.cpnt.data._defaultValueList = this.cpnt.data._defaultValue.split(",");
    }
  },
  watch: {
    "cpnt.data._defaultValueList": {
      deep: true,
      handler(val) {
        this.cpnt.data._defaultValue = val.join(",");
      },
    },
  },
  methods: {
    addOption() {
      this.cpnt.data._option.push({ _defaultValue: "" });
    },
    delOption(index) {
      this.cpnt.data._option.splice(index, 1);
      this.cpnt.data._defaultValueList.splice(index, 1);
    },
  },
};
</script>
<style lang="less" scoped>
@deep: ~">>>";

.flip-list-move {
  transition: transform 0.2s;
}

.act-select__option {
  .act-select__option__handle {
    font-size: 18px;
    cursor: grab;
  }
  .act-select__option__del {
    color: #f56c6c;
    font-size: 24px;
    cursor: pointer;
    margin-right: 5px;
  }

  @{deep} {
    .el-input {
      flex: 1;
      & + .el-input {
        margin-left: 5px;
      }
      > input {
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0;
      }
    }
    .el-radio {
      margin: 0 10px;
      .el-radio__label {
        display: none;
      }
    }
    .el-checkbox {
      .el-checkbox__input {
        margin: 0 10px;
      }
      .el-checkbox__label {
        display: none;
      }
    }
    .el-input__inner {
      background-color: transparent;
    }
  }
}
</style>