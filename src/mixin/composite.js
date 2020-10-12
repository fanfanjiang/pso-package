export const FormAsMainMixin = {
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

            const formNodes = await this.API.getFormTree();
            this.asstables = asstables.map((item) => {
                const node = _.find(formNodes, { node_name: item._option });
                return { id: item._option, name: node.node_display, type: "asstable" };
            });
        },
        astLoadedHandler(store) {
            this.astStore = store;
            this.changeAst();
        },
        changeAst() {
            if (!this.astStore) return;
            this.astStore._forEach((cpnt) => {
                cpnt.data._fieldName = "";
                cpnt.data._hideForever = cpnt.data._hideOnNew = cpnt.data._option !== this.activeAst;
                this.$set(cpnt.data, "forceShow", cpnt.data._option === this.activeAst);
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
            return await this.vStore.addOrUpdate({ leaf_id: this.mainDataId, formData });
        }
    }
}
