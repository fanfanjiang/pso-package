
//组件本身需要有displayRow和bottomHeight来定义布局方式
export const SplitLayoutMixin = {
    computed: {
        layoutClass() {
            return {
                "display-row": this.displayRow,
                'lay-vv': true,
            };
        },
        topStyle() {
            if (this.displayRow) {
                return {
                    height: '100%',
                    width: `calc(100% - ${this.bottomHeight})`
                }
            } else {
                return {
                    height: `calc(100% - ${this.bottomHeight})`,
                    width: '100%',
                }
            }
        },
        bottomStyle() {
            if (this.displayRow) {
                return {
                    height: '100%',
                    width: `${this.bottomHeight}`
                }
            } else {
                return {
                    height: `${this.bottomHeight}`,
                    width: '100%',
                }
            }
        }
    },
}

export const FormAsMainMixin = {
    mixins: [SplitLayoutMixin],
    data() {
        return {
            initializingAst: false,
            vStore: null,
            astStore: null,
            mainCfg: null,
            mainDefForm: null,
            mainCurRow: null,
            asstables: [],
            activeAst: '',//决定页面中显示哪个关联表
        }
    },
    computed: {
        mainDataId() {
            return this.mainCurRow && this.mainCurRow.leaf_id;
        },
        displayRow() {
            return this.params.displayRow !== "1";
        },
        bottomHeight() {
            return this.params.bottomHeight || '50%';
        },
        bodyEditable() {
            return this.vStore.getEditableByStatus(this.mainCurRow);
        }
    },
    methods: {
        async mainInitedHandler({ vStore, cfg, defForm }) {
            this.vStore = vStore;
            //获取表单参数
            this.mainDefForm = defForm;
            this.mainCfg = cfg;
        },
        mainLoadedHandler(data) {
            //初始加载列表后自动选中
            let selected = null;
            if (data && data.length) {
                selected = data[0];
                if (this.mainDataId) {
                    const exist = _.find(data, { leaf_id: this.mainDataId });
                    if (exist) {
                        selected = exist;
                    }
                }
                this.vStore.setClickRow(selected);
            }
            this.mainRowClickHandler(selected);
        },
        mainRowClickHandler(row) {
            this.initializingAst = true;
            this.mainCurRow = row;
            this.onMainRowClick && this.onMainRowClick();
            this.$nextTick(() => (this.initializingAst = false));
            return true;
        },
        async analyzeAsts(store) {
            const asstables = store.search({
                options: { componentid: "asstable" },
                onlyData: true,
                beforePush: (cpnt) => {
                    if (this.astFilter) {
                        return this.astFilter.includes(cpnt.data._fieldValue);
                    }
                    return true;
                },
            });

            this.asstables = asstables.map((item) => {
                return { id: item._fieldValue, name: item._fieldName, type: "asstable" };
            });
        },
        astLoadedHandler(store) {
            this.astStore = store;
            this.changeAst();
        },
        changeAst() {
            if (!this.astStore) return;
            this.astStore._forEach((cpnt) => {
                cpnt.data._hideFieldName = true;
                cpnt.data._hideForever = cpnt.data._hideOnNew = cpnt.data._fieldValue !== this.activeAst;
                this.$set(cpnt.data, "forceShow", cpnt.data._fieldValue === this.activeAst);
            });
        },
        mainChangeHandler({ leaf_id, op }) {

        },
        astChangeHandler({ cpnt }) {
            if (cpnt.data.componentid === "asstable") {
                this.$nextTick(() => {
                    this.saveAst();
                })
            }
        },
        async saveAst() {
            if (!this.mainDataId) return;
            const formData = await this.$refs.formImage.makeData();
            return await this.vStore.addOrUpdate({ leaf_id: this.mainDataId, formData }, false);
        }
    }
}

export const TagMixin = {
    props: {
        params: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            curNode: null,
            curTag: null,
            tpCfg: null,
            cpntParams: {},//组件参数
        }
    },
    computed: {
        treeOptions() {
            return {
                dimen: 5,
                data_type: this.params.data_type,
            };
        },
        currentCpnt() {
            if (this.tpCfg && this.tpCfg.tp_component) {
                return this.tpCfg.tp_component;
            } else {
                return "";
            }
        },
    },
    methods: {
        async fetchNodes() {
            return (await this.API.trees({ data: { rootable: true, lazy: false, ...this.treeOptions } })).data.tagtree;
        },
        async nodeClickHandler(node) {
            if (node.is_leaf) {
                this.curNode = node;
                await this.fetchTags();
            }
        },
        async fetchTags() {
            this.loading = true;
            const ret = await this.API.tag({ data: { tag_code: this.curNode.node_id } });
            if (ret.success) {
                this.tags = ret.data;
                await this.handleTagClick({ name: this.tags[0].tag_no });
            }
            this.loading = false;
        },
        reset() {
            this.cpntParams = {};
        },
        async handleTagClick({ name }) {
            this.reset();
            this.curTagTab = name;
            this.initializing = true;
            this.curTag = _.find(this.tags, { tag_no: name });

            if (this.curTag.tag_config) {
                const cfg = JSON.parse(this.curTag.tag_config);

                if (cfg.tag_source) {
                    this.$set(this.cpntParams, "plug_code", cfg.tag_source);
                    this.$set(this.cpntParams, "viewAuth", parseInt(this.curNode.leaf_auth || 0));

                    const ret = await this.API.templates({ data: { tp_code: cfg.tag_source }, method: "get" });

                    if (ret.success && ret.data.tp) {
                        cfg.tag_set.forEach((item) => this.$set(this.cpntParams, item.field, item.value));
                        this.tpCfg = ret.data.tp;
                    }
                    if (this.cpntParams.where) {
                        this.cpntParams.defForm = { [this.cpntParams.where]: this.curTag.tag_no };
                    }

                    this.initializing = false;
                }
            }
        },
    },
}