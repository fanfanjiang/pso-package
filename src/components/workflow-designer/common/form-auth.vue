<template>
  <div class="wf-auth">
    <div class="wf-auth-item wf-auth-item__header">
      <div class="wf-auth-item__name">字段</div>
      <div class="wf-auth-item__ctl">
        <el-checkbox-group v-model="controls" @change="handleGroupChecked">
          <el-checkbox v-for="AU in WF_FIELD_AUTH" :label="AU.v" :key="AU.n">{{ AU.n }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="wf-auth-item" v-for="(fa, i) in node.fieldsAuth" :key="i">
      <div class="wf-auth-item__name">{{ getField(fa.id)._fieldName }}</div>
      <div class="wf-auth-item__ctl">
        <el-checkbox-group v-model="fa.proxy" @change="handleChecked(fa)">
          <el-checkbox v-for="AU in WF_FIELD_AUTH" :label="AU.v" :key="AU.n">{{ AU.n }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { WF_FIELD_AUTH } from "../../../const/workflow";
export default {
  props: ["node"],
  computed: {
    ...mapState(["wfDesigner"]),
  },
  data() {
    this.WF_FIELD_AUTH = WF_FIELD_AUTH;
    return {
      controls: [],
    };
  },
  created() {
    if (!this.node.fieldsAuth) {
      this.$set(this.node, "fieldsAuth", []);
    }

    this.wfDesigner.formStore._forEach((n) => {
      if (n.CPNT.db) {
        const exist = _.find(this.node.fieldsAuth, { id: n.data._fieldValue });
        if (!exist) {
          this.node.fieldsAuth.push({ id: n.data._fieldValue, value: "" });
        }
      }
    });

    for (let i = this.node.fieldsAuth.length - 1; i >= 0; i--) {
      const f = this.node.fieldsAuth[i];
      if (!f) {
        this.node.fieldsAuth.splice(i, 1);
      }
      if (f) {
        const exist = this.getField(f.id);
        if (!exist) {
          this.node.fieldsAuth.splice(i, 1);
        } else {
          if (!f.proxy) {
            this.$set(f, "proxy", this.figureToList(f.value));
          }
        }
      }
    }
  },
  methods: {
    getField(f) {
      return this.wfDesigner.formStore.searchByField(f, true);
    },
    handleChecked(field) {
      const max = _.max(field.proxy);
      WF_FIELD_AUTH.forEach((a) => {
        if (a.v < max && field.proxy.indexOf(a.v) === -1) {
          field.proxy.push(a.v);
        }
      });
      field.value = _.sum(field.proxy);
    },
    figureToList(value) {
      const list = [];
      WF_FIELD_AUTH.forEach((a) => {
        if (a.v & (value === a.v)) list.push(a.v);
      });
      return list;
    },
    handleGroupChecked() {
      const max = _.max(this.controls);
      WF_FIELD_AUTH.forEach((a) => {
        if (a.v < max && this.controls.indexOf(a.v) === -1) {
          this.controls.push(a.v);
        }
      });

      this.controls.forEach((v) => {
        this.node.fieldsAuth.forEach((f) => {
          if (f.proxy.indexOf(v) === -1) {
            f.proxy.push(v);
          }
          this.handleChecked(f);
        });
      });
    },
  },
};
</script>