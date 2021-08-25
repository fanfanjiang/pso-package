<template>
  <div class="printgod-sheet-tabs">
    <div
      class="sheet-tabs-item"
      @click.stop="setHandler(i)"
      :class="{ active: print.sheetId === i }"
      v-for="(d, i) in print.sheets"
      :key="i"
    >
      <span class="sheet-tabs-item-title">{{ d.name }}</span>
      <el-dropdown placement="top-start" size="small" @command="editHandler($event, i)">
        <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="edit">修改</el-dropdown-item>
          <el-dropdown-item command="del">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="sheet-tabs-add">
      <el-button size="mini" type="primary" icon="el-icon-plus" circle @click="addHandler"></el-button>
    </div>
    <el-dialog title="分页" append-to-body :visible.sync="showEditor" :width="'420px'">
      <el-form label-width="80px">
        <el-form-item label="名称" required>
          <el-input size="small" v-model="name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveHandler()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    print: Object,
  },
  data() {
    return {
      showEditor: false,
      name: "",
    };
  },
  methods: {
    addHandler() {
      this.print.addAndSetSheet();
    },
    setHandler(id) {
      this.print.setSheet(id);
    },
    editHandler(command, id) {
      if (command === "edit") {
        this.name = this.print.getSheet(id).name;
        this.showEditor = true;
      } else {
        this.print.removeAndSetSheet(id);
      }
    },
    saveHandler() {
      this.print.getSheet(this.print.sheetId).name = this.name;
      this.showEditor = false;
    },
  },
};
</script>