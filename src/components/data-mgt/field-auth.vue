<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-end"
    width="300"
    @show="opened=true"
    @after-leave="opened=false"
    v-model="show"
  >
    <div class="field-auth" v-if="opened">
      <div class="field-auth__item" v-for="(auth,index) in auths" :key="index">
        <div class="field-auth__item-option">
          <el-select size="small" v-model="auth.access_type" @change="typeChange(index)">
            <el-option v-for="item in accessTypes" :key="item.v" :label="item.n" :value="item.v"></el-option>
          </el-select>
          <el-tag
            v-if="auth.post_id||auth.user_id||auth.duty_id"
            closable
            @close="handleClose(index)"
          >{{auth.name}}</el-tag>
          <div v-show="!!!auth.name">
            <pso-picker-user
              v-if="auth.access_type===accessTypes[0].v"
              @confirm="handlePick($event,index,'user_id')"
            ></pso-picker-user>
            <pso-picker-position
              v-if="auth.access_type===accessTypes[1].v"
              @confirm="handlePick($event,index,'duty_id')"
            ></pso-picker-position>
            <pso-picker-post
              v-if="auth.access_type===accessTypes[2].v"
              @confirm="handlePick($event,index,'post_id')"
            ></pso-picker-post>
          </div>
        </div>
        <i class="field-auth__item-del el-icon-delete-solid" @click="delOption(index)"></i>
      </div>
      <div class="field-auth__add">
        <el-button size="mini" @click="addAuth">添加权限</el-button>
      </div>
      <div class="field-auth__footer">
        <el-button @click="show=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" size="mini">提 交</el-button>
      </div>
    </div>
    <template slot="reference">
      <slot>
        <el-button icon="el-icon-plus" plain size="small">设置权限</el-button>
      </slot>
    </template>
  </el-popover>
</template>
<script>
import PsoPickerUser from "../picker/pso-picker-user";
import PsoPickerPost from "../picker/pso-picker-post";
import PsoPickerPosition from "../picker/pso-picker-position";

export default {
  components: { PsoPickerUser, PsoPickerPost, PsoPickerPosition },
  props: {
    field_name: String,
    data_code: String
  },
  data() {
    return {
      opened: false,
      auths: [],
      accessTypes: [
        { n: "用户", v: "0" },
        { n: "职位", v: "1" },
        { n: "岗位", v: "2" }
      ],
      show: false
    };
  },
  created() {
    this.addAuth();
  },
  methods: {
    addAuth() {
      this.auths.push({
        access_type: "0",
        name: "",
        post_id: "",
        user_id: "",
        duty_id: "",
        field_name: this.field_name,
        data_code: this.data_code
      });
    },
    handlePick(data, index, field) {
      this.resetAuthItem(index);
      this.auths[index][field] = data[0][field];
      this.auths[index].name = data[0].user_name || data[0].duty_name || data[0].post_name;
    },
    resetAuthItem(index) {
      this.auths[index].post_id = "";
      this.auths[index].user_id = "";
      this.auths[index].duty_id = "";
      this.auths[index].name = "";
    },
    typeChange(index) {
      this.resetAuthItem(index);
    },
    handleClose(index) {
      this.resetAuthItem(index);
    },
    delOption(index) {
      this.auths.splice(index, 1);
    },
    handleSubmit() {}
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable.less";
.field-auth {
  .field-auth__item {
    display: flex;
    margin-bottom: 15px;
    .field-auth__item-option {
      flex: 1;
    }
  }

  .field-auth__add + .field-auth__item {
    margin-top: 20px;
  }

  .field-auth__item-del {
    font-size: 20px;
    color: rgb(182, 182, 182);
    margin-left: 5px;
    padding-top: 5px;
    height: 30px;
    cursor: pointer;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #f56c6c;
      transition: color 0.2s ease-in-out;
    }
  }

  .field-auth__footer {
    margin-top: 20px;
    text-align: right;
  }
}
@{deep} {
  .el-select {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>