<template>
  <pso-label :cpnt="cpnt" v-loading="initializing || loading">
    <div class="pso-ip__ast" v-if="!initializing">
      <div class="pso-ip__ast-header" v-if="cpntEditable">
        <div class="pso-ip__ast-l">
          <template v-if="cpnt.data._relate">
            <div class="cpnt-text" v-if="cpnt.data._selectMode === '2'">
              <el-input
                size="mini"
                autosize
                v-model="searchProxy"
                :placeholder="cpnt.data._fieldName"
                @focus="focusing = true"
                @blur="inputBlurHandler"
              ></el-input>
              <transition name="el-zoom-in-top">
                <div class="text-search__result" v-if="showResult">
                  <template v-if="!searching">
                    <div
                      @click="selectSearchRet(r)"
                      class="text-search__result-item"
                      v-for="(r, i) in searchRet"
                      :key="i"
                      v-html="searchDisplay(r)"
                    ></div>
                  </template>
                  <pso-skeleton v-else :lines="1" :s-style="{ padding: '0 15px' }"></pso-skeleton>
                </div>
              </transition>
            </div>
            <el-button v-if="cpnt.data._selectMode !== '2'" type="primary" plain icon="el-icon-plus" size="mini" @click="showTable = true">
              选择{{ cpnt.data._fieldName }}
            </el-button>
          </template>
          <el-button v-if="showAddBtn" type="primary" plain icon="el-icon-plus" size="mini" @click="handleClickAdd">
            添加{{ cpnt.data._fieldName }}
          </el-button>
          <transition name="el-zoom-in-center">
            <el-button
              v-show="cpnt.data._relate && (!justShowOne || displayTable) && astStore.selectedList.length"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelList(astStore.selectedList)"
            >
              取消所选数据
            </el-button>
          </transition>
        </div>
        <div class="pso-ip__ast-r" style="padding-top: 5px">
          <data-fun
            :store="astStore"
            :addable="false"
            :selectable="false"
            :changable="false"
            :stageable="false"
            :copyable="false"
            :moreable="false"
            :exportable="false"
            :wipeable="false"
          ></data-fun>
        </div>
      </div>
      <div class="pso-form-asstable-table">
        <el-tag
          v-show="justShowOne && !displayTable && instances.length"
          :closable="cpntEditable"
          @click="$refs.viewTable.rowdbClickHandler(instances[0])"
          @close="handleDelList(instances)"
          >{{ firstInstanceDisplay }}
        </el-tag>
        <view-table
          v-show="(!justShowOne || displayTable) && instances.length"
          ref="viewTable"
          :store="astStore"
          :params="tableParams"
          :dragable="false"
          :pagination="false"
          :refresh="false"
        ></view-table>
      </div>
      <pso-dialog
        width="70%"
        append-to-body
        close-on-click-modal
        custom-class="form-table-dialog"
        title="选择关联数据"
        @close="showTable = false"
        :close-on-modal="true"
        :visible="showTable"
      >
        <pso-form-view
          checkbox
          selectable
          expanding
          :cfgId="cpnt.data._option"
          :deletable="false"
          :selection-type="selectionType"
          :view-auth="formTableViewAuth"
          :addable="false"
          :edtail-editable="false"
          :changable="false"
          :stageable="false"
          :params="formTableCfg"
          :def-keys="devKeysCfg"
          @selection-confirm="handleAddSelection"
        ></pso-form-view>
      </pso-dialog>
      <pso-form-executor
        :params="executorParams"
        :title="store.data_name"
        :opener="astStore"
        :instanceids="astStore.instanceids"
        :auto-submit="astStore.autoSubmit"
        :switchable="astStore.switchable"
        :keepable="keepable"
        @data-changed="beforeDataChangeHandler"
        @prev="astStore.showPrev.call(astStore, $event)"
        @next="astStore.showNext.call(astStore, $event)"
      ></pso-form-executor>
    </div>
  </pso-label>
</template> 
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";

import ASTStore from "../astStore";
import ViewTable from "../../form-view/table";
import DataFun from "../../form-view/data-fun";
import debounce from "throttle-debounce/debounce";

export default {
  components: { PsoFormInterpreter: () => import("../index"), ViewTable, DataFun },
  mixins: [
    cpntMixin,
    pickerMixin({
      baseObjName: "proxy",
      showName: "showTable",
      dataListName: "valList",
      typeName: "_type",
      idName: "leaf_id",
      radioVal: 1,
      checkboxVal: 2,
    }),
  ],
  props: {
    deletable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    this.clearDefFormOnClose = false;
    return {
      initializing: true,
      loading: false,
      showTable: false,
      astStore: null,
      store: {},
      proxy: {
        valList: [],
        _type: this.cpnt.data._type,
      },
      fields: [],
      defForm: null,
      unsavedSelf: null,
      subAsstables: [],
      addDataCallback: null,
      cachedIds: [],
      watchFun: [],
      searching: false,
      focusing: false,
      searchRet: [],
      searchProxy: "",
      trigger: "",
    };
  },
  computed: {
    keepable() {
      return typeof this.cpnt.data._keepable !== "undefined" ? this.cpnt.data._keepable : !this.justShowOne;
    },
    selectionType() {
      return this.cpnt.data._type === 1 ? "radio" : "checkbox";
    },
    justShowOne() {
      return this.selectionType === "radio";
    },
    displayTable() {
      return this.cpnt.data._displayType === "2";
    },
    showAddBtn() {
      return this.cpnt.data._new && (!this.cpnt.data._relate && this.justShowOne ? !this.instances.length : true);
    },
    instances() {
      if (this.astStore) {
        return this.astStore.instances;
      } else {
        return [];
      }
    },
    dataId() {
      return this.astStore.dataId;
    },
    firstInstanceDisplay() {
      if (this.instances.length) {
        const data = this.instances[0];
        const field = this.cpnt.data._radioField;
        return data[`${field}_x`] || data[field || "leaf_id"];
      }
    },
    tableParams() {
      return {
        selectionType: this.selectionType,
        modifiable: this.cpntEditable,
        checkbox: this.cpntEditable && (this.cpnt.data._relate || this.cpnt.data._actionable),
        tableSize: "small",
      };
    },
    editable() {
      return this.cpnt.data._new && this.cpntEditable;
    },
    executorParams() {
      return {
        formId: this.astStore.store.data_code,
        dataId: this.astStore.dataId,
        dataInstance: this.astStore.curInstance,
        dataDefault: this.defForm,
        addable: this.cpnt.data.__forceAdd__ || this.editable,
        editable: this.editable,
        deletable: this.editable && !this.cpnt.data._relate && !this.astStore.actioning,
        mockAsstables: this.unsavedSelf,
        parentInstanceId: this.cpnt.store ? this.cpnt.store.instance_id : "",
        extendAuth: this.astStore.fieldsRule,
        befSaveFunc: this.astStore.checkBefActionScript.bind(this.astStore),
      };
    },
    authCfg() {
      if (this.cpnt.store && this.cpnt.store.sub_config) {
        return _.find(this.cpnt.store.sub_config, { id: this.cpnt.data._fieldValue }) || {};
      }
      return {};
    },
    formTableViewAuth() {
      if (this.authCfg.authable) {
        return this.cpnt.data.__auth__ || 0;
      } else {
        return 4;
      }
    },
    devKeysCfg() {
      const params = [];
      if (this.authCfg.status && this.authCfg.status.length) {
        params.push(`d_status#${this.authCfg.status.join(",")}#4`);
      }
      if (this.cpnt.data._filter && this.cpnt.store) {
        this.cpnt.data._filter.forEach((f) => {
          if (f.value !== "" || f.sid) {
            let value = f.value;
            if (f.sid) {
              const source = this.cpnt.store.searchByField(f.sid);
              if (source && source.data._val) {
                value = source.data._val;
              } else {
                value = this.cpnt.store.instance[f.sid];
              }
            }
            if (typeof value !== "undefined") {
              params.push(`${f.tid}#${value}#${f.op}`);
            }
          }
        });
      }
      return params.join(";");
    },
    formTableCfg() {
      return {
        searchType: this.authCfg.searchType,
        auth_config: this.authCfg.authCfg,
      };
    },
    showResult() {
      return this.focusing && this.searchRet.length;
    },
  },
  watch: {
    "cpnt.data._type": {
      handler(val) {
        this.proxy._type = val;
      },
    },
    "astStore.showExecutor"(val) {
      if (!val && this.clearDefFormOnClose) {
        this.defForm = null;
      }
    },
  },
  async created() {
    this.clearWatch();

    this.searchByKeysBounce = debounce(200, this.searchByKeys);

    await this.initialize();

    this.$watch("searchProxy", (val) => {
      this.searchByKeysBounce(val);
    });

    //初始赋值
    if (this.cpnt.data._val && typeof this.cpnt.data._val === "string") {
      await this.setDataByIds(this.cpnt.data._val.split(","));

      //只有在请求后没有取到数据，且父级数据没有生成前，才可以设置模拟数据
      if (!this.proxy.valList.length && this.cpnt.store && !this.cpnt.store.parentInstanceId) {
        this.setMockData();
      }
    } else {
      this.setMockData();
    }

    await this.handleCached();

    this.cpnt._handleClickAdd = this.handleClickAdd;
    this.cpnt._setDefForm = this.setDefForm;

    //提示
    const tip = this.cpnt.data._fieldInfo;
    const defaultTip = "操作提示：双击或单击数据可查看详情或编辑，在弹出的窗口右上角可删除数据，删除时请谨慎操作。";
    this.cpnt.data._fieldInfo = tip + (tip ? `<br><br>${defaultTip}` : defaultTip);

    this.prepareByProxy(this.proxy.valList);

    //1、初始化的时候发出通知
    this.dispatch("PsoformInterpreter", "cpnt-asstable-initialized", this.getChangeEntity());

    this.watchFun.push(
      this.$watch("proxy.valList", {
        handler(data, preData) {
          this.prepareByProxy(data);

          //2、只要proxy发生变化就发出通知，此时_val可能发生变化也可能不变
          this.dispatch("PsoformInterpreter", "asstable-selected", this.getChangeEntity());

          //3、只有_val发生变化才发出通知（mixin中）

          //4、当proxy发生变化但是_val并没有发生变化时才发出通知
          //删除时和新增时 获取到新旧值的长度是不一样的，新增时可以正确获取到长度不同的新旧值，但是删除时不行
          if (data.length === preData.length && data === preData) {
            this.dispatch("PsoformInterpreter", "asstable-change", this.getChangeEntity());
          }
        },
      })
    );

    this.$on("data-changed", async (evt) => {
      this.astStore.dataId = evt.leaf_id;
      await this.dataChangeHandler(evt);
      this.astStore.dataId = "";
    });

    this.$on("actioned", async ({ data }) => {
      this.trigger = "action";
      for (let item of data) {
        this.astStore.dataId = item.leaf_id;
        await this.dataChangeHandler({ leaf_id: item.leaf_id, formData: { dataArr: [item] }, op: 2 });
        this.astStore.dataId = "";
      }
      this.$nextTick(() => {
        this.trigger = "";
      });
    });
  },
  methods: {
    searchDisplay(data) {
      const fields = this.cpnt.data._selectFields;
      let text = data[fields[0]];
      if (fields.length > 1) {
        text =
          text +
          `<span class="text-search-sub">${fields
            .slice(1)
            .map((field) => `<span>${data[field]}</span>` || "")
            .join("")}<span>`;
      }
      return text;
    },
    async searchByKeys(value) {
      if (_.trim(value)) {
        this.searching = true;
        const ret = await this.API.searchForm({
          form_code: this.cpnt.data._option,
          leaf_auth: 4,
          keys: {
            [this.cpnt.data._selectFields[0]]: {
              type: 2,
              value,
            },
          },
        });
        if (ret.success) {
          this.searchRet = ret.data;
        }
        this.searching = false;
      } else {
        this.searchRet = [];
      }
    },
    selectSearchRet(data) {
      this.handleAddSelection([data]);
    },
    inputBlurHandler() {
      setTimeout(() => {
        this.focusing = false;
      }, 200);
    },
    clearWatch() {
      //清除监听器
      if (this.watchFun.length) {
        this.watchFun.forEach((f) => f());
        this.watchFun = [];
      }
    },
    prepareByProxy(data) {
      this.astStore.instances = data;
      if (this.astStore.$table) {
        this.astStore.$table.clearSelection();
        this.astStore.selectedList = [];
      }
      const shouldSavedIdList = data.filter((d) => !d.__dump__);
      this.cpnt.data._val = _.map(shouldSavedIdList, "leaf_id").join(",");
    },
    getChangeEntity() {
      return {
        data: this.proxy.valList,
        value: this.cpnt.data._val,
        cpnt: this.cpnt,
        proxy: this.proxy,
        fields: this.astStore ? this.astStore.fields : [],
        printFields: this.astStore && this.cpnt.data._printFields ? this.astStore.getColumnByName(this.cpnt.data._printFields) : [],
        store: this.store,
        trigger: this.trigger,
      };
    },
    async initialize() {
      this.initializing = true;
      if (!this.cpnt.data._option) return;

      const ret = await this.API.formsCfg({ data: { id: this.cpnt.data._option, auth: 1 }, method: "get" });

      this.astStore = new ASTStore({ $vue: this, limit: 10, disabledFetch: true, relatedWF: this.cpnt.data._relatedWF });
      this.cpnt.astStore = this.astStore;

      this.astStore.analyzeFormCfg(ret.data, this.cpnt.store && this.cpnt.store.ignoreAstColumn ? "" : this.cpnt.data._showFields);
      this.store = this.astStore.store;
      this.fields = this.astStore.fields;

      if (this.cpnt.store) {
        this.subAsstables = this.astStore.store.search({
          options: { componentid: "asstable" },
          onlyMain: true,
          onlyData: true,
          beforePush: (item) => {
            return item.data._option === this.cpnt.store.data_code;
          },
        });

        if (this.subAsstables.length) {
          if (this.cpnt.store.instance_id) {
            this.defForm = { [this.subAsstables[0]._fieldValue]: this.cpnt.store.instance_id };
          }
        }
      }

      this.initializing = false;
    },
    async handleCached() {
      for (let cached of this.cachedIds) {
        if (cached.options) {
          cached.options.afterDataLoaded = false;
        }
        await this.setDataByIds(cached.ids, cached.options);
      }
      this.cachedIds = [];
    },
    setMockData() {
      if (this.cpnt.store && this.cpnt.store.mockAsstables && this.cpnt.store.mockAsstables[this.cpnt.data._fieldValue]) {
        this.handleAddSelection([this.cpnt.store.mockAsstables[this.cpnt.data._fieldValue]]);
      } else {
        this.proxy.valList = [];
      }
    },
    async setDataByIds(idList, options = {}) {
      const { callback, bindId = "leaf_id" } = options;
      if (idList && typeof idList === "string") {
        idList = idList.split(",");
      }
      if (this.astStore && this.astStore.findById && !this.initializing) {
        this.loading = true;
        let list = [];
        if (idList.length) {
          if (typeof idList[0] === "string") {
            list = list.concat(await this.astStore.findById(idList.join(","), bindId));
          } else {
            list = list.concat(idList);
          }
        }
        if (callback) {
          await callback(list, this);
        }
        this.handleAddSelection(list);
        this.loading = false;
      } else {
        this.cachedIds.push({ ids: idList, options });
      }
    },
    handleClickAdd(callback) {
      //设置数据修改回调
      this.addDataCallback = typeof callback === "function" ? callback : null;

      //设置提前数据
      if (this.subAsstables.length) {
        if (!this.cpnt.store.instance_id) {
          const data = { leaf_id: this.cpnt.store.beInstanceId };
          for (let cpnt of Object.values(this.cpnt.store.cpntsMap)) {
            if (cpnt.CPNT.layout || cpnt.componentid === "stage") continue;
            data[cpnt.data._fieldValue] = cpnt.data._val;
          }
          this.unsavedSelf = { [this.subAsstables[0]._fieldValue]: data };
        }
      } else {
        this.unsavedSelf = null;
      }

      this.astStore.newInstance(true);
    },
    async beforeDataChangeHandler(evt) {
      await this.astStore.checkDataChange(evt, true);
      this.dataChangeHandler(evt);
    },
    async dataChangeHandler(evt) {
      const { leaf_id, op, formData } = evt;

      if (op === 1 || op === 2) {
        const isTemporary = formData.dataArr[0]["__temporary__"];
        let data;

        if (isTemporary) {
          data = formData.dataArr[0];
        } else {
          const ret = await this.astStore.findById(this.dataId || leaf_id);
          if (ret && ret.length) {
            data = ret[0];
          }
        }

        if (this.dataId && data) {
          //删除列表中修改的数据
          this.proxy.valList.splice(_.findIndex(this.proxy.valList, { leaf_id }), 1, data);
        }

        if (!this.dataId && data) {
          this.handleAddSelection([data]);

          //新增数据回调
          if (this.addDataCallback) {
            this.$nextTick(() => {
              this.addDataCallback(data);
            });
          }
        }
      } else if (op === 3) {
        const newProxy = [];
        for (let item of this.proxy.valList) {
          if (leaf_id !== item.leaf_id) {
            newProxy.push(item);
          }
        }
        this.proxy.valList = newProxy;
        this.astStore.removeInstance(leaf_id);
      }
    },
    setDefForm(data, clearOnClose = true) {
      //一般用于外部强制设定表单数据
      this.defForm = data;
      this.clearDefFormOnClose = clearOnClose;
    },
  },
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.pso-form-asstable {
  background-color: #f7f7f7;
}
.pso-form-asstable-table {
  margin-bottom: 5px;
}
</style>
<style lang="less">
.form-table-dialog {
  .el-dialog__body {
    padding: 0;
  }
}
.pso-ip__ast-header {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>