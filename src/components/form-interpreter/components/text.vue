<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required" class="cpnt-text">
    <el-input
      ref="cpnt"
      size="small"
      :type="type || cpnt.data._type || 'text'"
      :clearable="true"
      :disabled="!cpntEditable"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
      :autofocus="cpnt.data._autofocus"
      :maxlength="cpnt.data._fieldLen"
      show-word-limit
      autosize
      @focus="focusing = true"
      @blur="handleInputBlur"
    ></el-input>
    <transition name="el-zoom-in-top">
      <div class="text-search__result" v-if="showResult">
        <template v-if="!searching">
          <div
            @click="handleSelect(r)"
            class="text-search__result-item"
            v-for="(r, i) in searchRet"
            :key="i"
            v-html="r[cpnt.data._searchField]"
          ></div>
        </template>
        <pso-skeleton v-else :lines="1" :s-style="{ padding: '0 15px' }"></pso-skeleton>
      </div>
    </transition>
  </el-form-item>
</template> 
<script>
import cpntMixin from "../mixin";
import debounce from "throttle-debounce/debounce";

export default {
  mixins: [cpntMixin],
  props: {
    type: { 
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searching: false,
      focusing: false,
      searchRet: [],
    };
  },
  computed: {
    showResult() {
      return this.cpnt.data._searchable && this.focusing && this.searchRet.length;
    },
  },
  created() {
    if (this.cpnt.data._searchable && this.cpnt.data._searchForm && this.cpnt.data._searchField) {
      this.fetch = debounce(this.getFormData, 500);
      this.$watch("cpnt.data._val", async (val) => {
        if (_.trim(val)) {
          this.searching = true;
          const ret = await this.getFormData(val);
          if (ret.success) {
            this.searchRet = ret.data;
          }
          this.searching = false;
        } else {
          this.searchRet = [];
        }
      });
    }
  },
  mounted() {
    if (this.cpnt.data._autofocus) {
      this.$refs.cpnt.focus();
    }
  },
  methods: {
    handleInputBlur() {
      setTimeout(() => {
        this.focusing = false;
      }, 200);
    },
    async getFormData(value) {
      return await this.API.formSearch({
        form_code: this.cpnt.data._searchForm,
        limit: 10,
        start: 0,
        leaf_auth: 4,
        keys: {
          [this.cpnt.data._searchField]: {
            type: 2,
            value,
          },
        },
      });
    },
    handleSelect(data) {
      this.cpnt.data._val = data[this.cpnt.data._searchField];
      if (this.cpnt.data._bindFields) {
        this.cpnt.data._bindFields.forEach(({ tid, sid }) => {
          const exist = this.cpnt.store.searchByField(tid);
          if (exist) {
            if (exist.__setDataByIds) {
              exist.__setDataByIds(data[sid]);
            } else {
              exist.data._val = data[sid];
            }
          }
        });
      }
    },
  },
};
</script>
