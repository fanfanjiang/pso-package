<template>
  <div class="pso-data-mgt__column" style="padding:0 0 30px 0">
    <div class="pso-table-controller">
      <el-button size="small" @click="$emit('save')">保存</el-button>
    </div>
    <el-table key="list" size="small" :data="data" style="width: 100%" height="500">
      <el-table-column type="index" :index="1" fixed="left"></el-table-column>
      <el-table-column prop="field_name" label="字段" width="100" fixed="left"></el-table-column>
      <el-table-column label="显示名名称" width="140" fixed="left">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.display" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="顺序" width="160">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="scope.row.number"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="列宽" width="160">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="scope.row.width"
            controls-position="right"
            :min="0"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="启用" width="60">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.using" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="显示" width="60">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.show" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="60">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.sortable" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="统计" width="60">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.cal" active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="对齐方式" width="100">
        <template slot-scope="scope">
          <el-select size="small" v-model="scope.row.align">
            <el-option label="居中" value="center"></el-option>
            <el-option label="居左" value="left"></el-option>
            <el-option label="居右" value="right"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="响应地址" width="200">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.url" placeholder></el-input>
        </template>
      </el-table-column>
      <el-table-column label="响应维度" width="160">
        <template slot-scope="scope">
          <el-select
            size="mini"
            filterable
            clearable
            v-model="scope.row.res_dimen"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dimens"
              :key="item.dimen_tag"
              :label="item.tag_name"
              :value="item.dimen_tag"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="setParamsHandler(scope.row)">响应参数</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="设置参数"
      append-to-body
      :visible.sync="showEditor"
      :width="'1000px'"
      v-if="curRow"
    >
      <div style="height:600px">
        <menu-mgt :params="{data_type:curRow.res_dimen,hide:true}" v-if="showEditor">
          <template v-slot:default="slotProps">
            <div :key="slotProps.data.node_name">
              <div style="display:none">{{deGetFormFields(slotProps.data)}}</div>
              <div>接收参数设置</div>
              <el-button size="mini" @click="addParamsHandler(slotProps.data.node_name)">添加参数</el-button>
              <el-table
                key="list"
                size="small"
                v-if="curRow.target_form[slotProps.data.node_name]"
                :data="curRow.target_form[slotProps.data.node_name]"
                style="width: 100%"
                height="200"
              >
                <el-table-column label="源字段" width="160">
                  <template slot-scope="scope">
                    <el-select
                      size="mini"
                      filterable
                      clearable
                      v-model="scope.row.source_field"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in data"
                        :key="item.field_name"
                        :label="item.display"
                        :value="item.field_name"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="目标字段" width="160">
                  <template slot-scope="scope">
                    <el-select
                      size="mini"
                      filterable
                      clearable
                      v-model="scope.row.target_field"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in fields"
                        :key="item.field_name"
                        :label="item.field_display"
                        :value="item.field_name"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="delHandler(scope.$index,slotProps.data.node_name)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" size="mini" @click="$emit('save')">保存</el-button>
            </div>
          </template>
        </menu-mgt>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formOp } from "../form-designer/mixin.js";
import MenuMgt from "../menu-mgt";
import debounce from "throttle-debounce/debounce";
export default {
  mixins: [formOp],
  components: { MenuMgt },
  props: ["data"],
  data() {
    return {
      dimens: [],
      forms: [],
      fields: [],
      curRow: null,
      showEditor: false,
      deGetFormFields: null
    };
  },
  async created() {
    const ret = await this.API.getTreeDimen({ limit: 99999, page: 0 });
    this.dimens = ret.data;

    this.forms = await this.API.getFormTree();
    this.deGetFormFields = debounce(500, this.getFormFields);
  },
  methods: {
    setParamsHandler(row) {
      this.curRow = row;
      this.showEditor = true;
      if (typeof this.curRow.target_form !== "object") {
        this.curRow.target_form = {};
      }
    },
    addParamsHandler(node_name) {
      this.curRow.target_form[node_name].push({ source_field: "", target_field: "" });
    },
    async getFormFields({ node_name, set }) {
      if (!this.curRow.target_form[node_name]) {
        this.curRow.target_form[node_name] = [];
      }

      let { value, picker } = set;
      if (value && (picker === "picker-form" || picker === "picker-wf")) {
        if (picker === "picker-wf") {
          const wfRet = await this.API.workflowcfg({ data: { node_id: value } });
          value = wfRet.data.map_data_code;
        }
        const formStore = await this.makeFormStore(value);
        const ret = await this.API.getFormDict({ data_code: value });
        ret.data.forEach(item => {
          const field = formStore.search({ options: { fid: item.field_name }, onlyData: true });
          item.field_display = (field ? field._fieldName : "系统字段") + `(${item.field_name})`;
        });
        this.fields = ret.data;
      }
    },
    delHandler(index, node_name) {
      this.curRow.target_form[node_name].splice(index, 1);
    }
  }
};
</script>