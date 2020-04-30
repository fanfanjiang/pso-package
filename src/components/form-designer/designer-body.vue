<template>
  <div class="form-designer">
    <div class="form-designer-body">
      <!-- 固定组件菜单和中心区域 -->
      <div class="form-designer-body-fixer" v-bar @click="stageClickHandler">
        <div>
          <div class="form-designer__menu">
            <div class="form-designer__menu-bar" v-bar>
              <div class="form-designer__menu-body">
                <div class="fd__menu-section" v-for="cpnList in menu" :key="cpnList.title">
                  <div class="fd__menu-section-title">{{cpnList.title}}</div>
                  <div class="fd__menu-section-body" v-if="!roloadingMenu">
                    <el-row
                      :gutter="20"
                      class="dropable"
                      id="formDesignerMenu"
                      put="false"
                      pull="clone"
                      sort="false"
                    >
                      <el-col
                        :span="12"
                        :class="['dragable',...cpnt.class]"
                        v-for="cpnt in cpnList.children"
                        :key="cpnt.name"
                        :componentid="cpnt.componentid"
                      >
                        <div
                          class="fd__menu-section-item"
                          @click.stop="menuClickHandler(cpnt,$event)"
                        >
                          <i :class="cpnt.icon"></i>
                          <span class="fd__menu-section-item-title">{{cpnt.name}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-designer__stage">
            <div class="form-designer__stage-title">{{stageName}}</div>
            <div
              class="form-designer__stage-body dropable"
              fid="0"
              componentid="0"
              put="true"
              pull="true"
              sort="true"
            >
              <designer-cpnt v-for="cpnt in root.childComponents" :key="cpnt.fid" :cpnt="cpnt"></designer-cpnt>
            </div>
          </div>
        </div>
      </div>
      <!-- 固定组件菜单和中心区域 -->
      <div class="form-designer__panel" v-bar>
        <designer-panel :store="store"></designer-panel>
      </div>
    </div>
  </div>
</template>
<script>
import FormStore from "./model/store.js";
import DesignerCpnt from "./designer-cpnt";
import DesignerPanel from "./designer-panel";
import { CPNT } from "../../const/form";

import DragAndDrop from "./drag-drop/index";
import { isMenu, isRoot, getRoot, getDropableByFid, getDragableByFid, getComponentParams } from "./helper/dom.js";

export default {
  components: { DesignerCpnt, DesignerPanel },
  props: {
    data: {
      type: Object
    },
    components: {
      type: Object,
      default: () => {
        return {
          常用控件: [
            "text",
            "number",
            "money",
            "select",
            "checkbox",
            "cascader",
            "time",
            "phone",
            "email",
            "area",
            "attachment",
            "user",
            "department"
          ],
          布局控件: ["row", "div"],
          高级控件: [
            "table",
            "asstable",
            "summary",
            "assfield",
            "formula",
            "tag",
            "autoid",
            "unit",
            "rate",
            "timerange",
            "credential",
            "rich",
            "signature"
          ],
          特殊控件: ["section", "remark", "aiw"]
        };
      }
    },
    stageName: {
      type: String,
      default: "表单设计"
    }
  },
  data() {
    return {
      store: null,
      root: null,
      dragAndDrop: null,
      roloadingMenu: false
    };
  },
  computed: {
    menu() {
      const menus = [];
      for (let key in this.components) {
        menus.push({
          title: key,
          children: this.components[key].map(cpntName => _.cloneDeep(CPNT[cpntName]))
        });
      }
      return menus;
    }
  },
  created() {
    this.store = new FormStore(this.data);
    this.root = this.store.root;
    this.$emit("store-ready", this.store);

    this.dragAndDrop = DragAndDrop.init({
      onAdd: evt => {
        this.cpntAddHandler(evt);
        $(evt.item).remove();
      },
      onUpdate: evt => {
        this.cpntAddHandler(evt);
      },
      onShowclone: evt => {
        this.reloadMenu();
      }
    });
  },
  methods: {
    cpntAddHandler(evt) {
      this.store.append({
        oldIndex: evt.oldIndex,
        newIndex: evt.newIndex,
        to: getComponentParams(evt.to),
        from: isMenu(evt.from) ? null : getComponentParams(evt.from),
        target: getComponentParams(evt.item)
      });
    },
    reloadMenu() {
      this.roloadingMenu = true;
      this.$nextTick(() => {
        this.roloadingMenu = false;
      });
    },
    stageClickHandler() {
      this.store.setCurrentCpnt(this.root);
    },
    menuClickHandler(cpnt, evt) {
      const target = $(evt.target)
        .parents(".dragable")
        .get(0);

      const tParent = $(evt.target)
        .parents(".dropable")
        .get(0);

      const clone = $(target).clone(true);

      clone.addClass("ghost");
      tParent.insertBefore(clone[0], target);
      this.dragAndDrop.captureAnimationState(tParent, clone[0]);

      const dragContainer = getDragableByFid(this.store.fid);
      let dropContainer = getDropableByFid(this.store.fid);
      if (!dropContainer) {
        dropContainer = $(dragContainer)
          .parents(".dropable")
          .get(0);

        if (!isRoot(dropContainer) && $(dropContainer).children().length > 1) {
          dropContainer = getRoot();
        }
      }

      if ($(target).hasClass($(dropContainer).attr("anticlass"))) {
        dropContainer = getRoot();
      }

      dropContainer.appendChild(clone[0]);

      this.dragAndDrop.animateAll(dropContainer, () => {
        $(clone).remove();

        this.store.append({
          oldIndex: 0,
          newIndex: $(dropContainer).children().length,
          to: getComponentParams(dropContainer),
          from: null,
          target: getComponentParams(target)
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";

.form-designer {
  height: 100%;
  width: 100%;
  position: relative;
  .form-designer-body {
    height: 100%;
    display: flex;
    .form-designer-body-fixer {
      flex: 1;
      > div {
        display: flex;
      }
    }
  }
  .form-designer__panel {
    width: 350px;
    border-left: 1px solid rgb(219, 220, 221);
  }

  .form-designer__stage {
    flex: 1;
    margin-left: 300px;
    height: 100%;
    .form-designer__stage-title {
      font-size: 14px;
      font-weight: bold;
      padding: 30px 30px 10px 30px;
      color: #666;
    }
    .form-designer__stage-body {
      min-height: calc(100% - 60px);
      padding: 15px;
      @{deep} .dragable {
        width: 100%;
        display: block;
        float: none;
      }
    }
  }
  .form-designer__menu {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 300px;
    display: flex;
    .form-designer__menu-bar {
      width: 300px;
      background-color: #f1f2f3;
      .form-designer__menu-body {
        padding: 15px 20px;
        .fd__menu-section {
          margin-top: 15px;
          .fd__menu-section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #666;
          }
          .fd__menu-section-body {
            .dragable {
              margin-bottom: 15px;
              &:active {
                padding: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.fd__menu-section-item {
  background-color: #fff;
  color: #666;
  padding: 0 10px;
  line-height: 38px;
  height: 38px;
  cursor: grab;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in;
  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease-in;
  }
  > i {
    font-size: 16px;
    width: 25px;
    text-align: left;
    color: #999;
  }
  > span {
    font-size: 14px;
  }
}
.dragable {
  &.ghost {
    &:not([fid]) {
      padding-left: 0px !important;
      padding-right: 0px !important;
      .fd__menu-section-item {
        width: 200px;
        line-height: 50px;
        height: 50px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        border-bottom: 2px solid #409eff;
      }
    }
  }
}
</style>