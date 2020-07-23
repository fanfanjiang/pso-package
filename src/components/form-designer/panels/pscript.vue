<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="可输入脚本，根据脚本返回值填充表单" :needDefaultValue="false">
      <el-form-item label="脚本">
        <el-button @click="showScript=true" size="mini">设置脚本</el-button>
      </el-form-item>
      <el-form-item label="存储方式">
        <el-select size="small" v-model="cpnt.data._type" placeholder="请选择">
          <el-option label="自动填充" value="1"></el-option>
          <el-option label="单选" value="2"></el-option>
          <el-option label="多选" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参数字段">
        <el-select v-model="options" size="mini" placeholder="请选择" multiple>
          <el-option
            v-for="item in fieldOptions"
            :key="item.fid"
            :label="item._fieldName"
            :value="item.fid"
          ></el-option>
        </el-select>
      </el-form-item>
      <template v-if="cpnt.data._type==='2'||cpnt.data._type==='3'">
        <pso-title title="设置列"></pso-title>
        <el-button @click="showColum=true" size="mini">设置列参数</el-button>
        <el-form-item label="保存字段">
          <el-select v-model="cpnt.data._saveField" size="mini" placeholder="请选择">
            <el-option
              v-for="item in column"
              :key="item.field"
              :label="item.name"
              :value="item.field"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
    </common-panel>
    <el-dialog title="设置列参数" append-to-body :visible.sync="showColum" :width="'80%'">
      <column-editor :data="column" :formulable="false"></column-editor>
    </el-dialog>
    <el-dialog title="设置脚本" append-to-body :visible.sync="showScript" :width="'80%'">
      <div class="pso-table-controller">
        <el-button size="small" type="primary" plain @click="addScript">添加脚本</el-button>
      </div>
      <el-table key="status" :data="data" style="width: 100%">
        <el-table-column label="提交脚本" width="600">
          <template slot-scope="scope">
            <el-input type="textarea" :row="8" size="small" v-model="scope.row.sql" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="参数" width="200">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row.param" filterable clearable multiple>
              <el-option
                v-for="item in fields"
                :key="item.field_name"
                :label="showName(item)"
                :value="item.field_name"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="错误提示" width="600">
          <template slot-scope="scope">
            <el-input type="textarea" :row="8" size="small" v-model="scope.row.error" placeholder></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import columnEditor from "../../templete-mgt/column";
export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    columnEditor
  },
  data() {
    return {
      showColum: false,
      showScript: false
    };
  },
  computed: {
    options: {
      get() {
        return !this.cpnt.data._option ? [] : this.cpnt.data._option.split(",");
      },
      set(val) {
        if (val) {
          this.cpnt.data._option = val.join(",");
        }
      }
    },
    column: {
      get() {
        return !this.cpnt.data._column ? [] : JSON.parse(this.cpnt.data._column);
      },
      set(val) {
        this.cpnt.data._column = JSON.stringify(val);
      }
    },
    fieldOptions() {
      return this.cpnt.store.search({
        options: { db: true },
        onlyData: true,
        beforePush: item => {
          if (item.fid === this.cpnt.fid) return false;
          if (item.parent.CPNT.host_db) return false;
          return true;
        }
      });
    }
  },
  created() {}
};
</script>
