import { listToTree } from "../utils/util";

export function TreeMixin({ treeRef = 'tree' } = {}) {
    return {
        props: {
            appid: {
                type: String,
                default: '3'
            },
            rootable: {
                type: Boolean,
                default: true
            },
            defaultNodeData: {
                type: Object,
                default: () => ({})
            },
            requestOptions: {
                type: Object,
                default: () => ({})
            },
            sortOptions: {
                type: Array,
                default: () => ([["node_serial", "create_time"], ["asc", "asc"]])
            },
            nodeDataFilter: Function,
            emptyText: {
                type: String,
                default: '无数据'
            },
            treeProps: {
                type: Object,
                default: () => ({
                    children: "children",
                    label: "node_display",
                    isLeaf: (data) => data.is_leaf === 1
                })
            },
            nodeKey: {
                type: String,
                default: 'node_id'
            },
            defaultExpend: {
                type: Boolean,
                default: true
            },
            lazy: {
                type: Boolean,
                default: false
            },
            nodeIconUri: {
                type: String,
                default: "/static/app/img/file-icon/"
            },
            folderMode: { //文件夹模式,非子节点都是文件夹
                type: Boolean,
                default: true
            },
            editMode: {
                type: Boolean, //编辑模式
                default: true
            },
            draggable: {
                type: Boolean,
                default: true
            },
            deletable: {
                type: Boolean,
                default: true
            },
            autoDelete: {
                type: Boolean,
                default: true
            },
            autoEdit: {
                type: Boolean,
                default: true
            },
            checkAfterLoad: { //加载后自动选择可选节点
                type: Boolean,
                default: true
            },
            showCheckbox: {
                type: Boolean,
                default: false
            },
            checkAuth: {
                type: Boolean,
                default: false
            },
            nodeEditLable: {
                type: String,
                default: ''
            },
            defaultNodeData: [Object, Function],
            filter: [Array, Function],
            searchable: {
                type: Boolean,
                default: true
            },
            defaultNodeid: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                loadingWholeTree: false,
                loading: false,
                defaultExpendAll: this.defaultExpend,
                lazyLoad: this.lazy,
                filterText: '',//树搜索字段,
                where: {},    //查询数据
                treeData: [],
                nodePayload: {
                    parent: null,
                    node: null,
                    nodeRef: null,
                    showForm: false,
                    loading: false,
                    formTitle: '编辑',
                    nameLable: '名称'
                },
                isCopy: false,
                dimens: [],
                trash: [],
                selectedTrash: [],
                trashCfg: null,
                treeList: [],
                checkedDefaultNodeid: ''
            }
        },
        computed: {
            canTrash() {
                return !this.selectedTrash.length
            }
        },
        watch: {
            requestOptions: {
                deep: true,
                handler(val) {
                    this.requestOptionHandler(val);
                    this.loadWholeTree();
                }
            },
            filterText(val) {
                this.$refs[treeRef].filter(val);
            }
        },
        async created() {
            //检查树参数
            this.requestOptionHandler(this.requestOptions);

            if (!this.lazyLoad) {
                this.loadWholeTree();
            } else {
                //懒加载时关闭自动展开全部
                this.defaultExpendAll = false;
            }

            const ret = await this.API.getTreeDimen();
            if (ret.success) {
                this.dimens = ret.data;
            }
        },
        methods: {
            async loadWholeTree(loading = true) {
                //加载整颗静态树
                this.loadingWholeTree = loading;

                this.treeData = await this.getNodeData();

                this.loadingWholeTree = false;

                if (this.checkAfterLoad) {
                    this.$nextTick(() => {
                        if (this.checkedDefaultNodeid) {
                            this.setCurrentNode([this.$refs[treeRef].getNode(this.checkedDefaultNodeid).data]);
                        } else {
                            this.setCurrentNode(this.treeData, 3);
                        }
                    });
                }
            },
            setCurrentNode(data, level = 1) {
                //设置默认节点
                const setNode = (nodeData) => {
                    level -= 1;
                    for (let n of nodeData) {
                        if (!(this.folderMode && n.is_leaf === 0) && this.$refs[treeRef]) {
                            this.$refs[treeRef].setCurrentKey(n.node_id);
                            this.nodeClickHandler(n);
                            return n;
                        }
                        level && n.children && setNode(n.children);
                    }
                }
                setNode(data);
            },
            async getNodeData(node, resolve) {
                const options = { ...this.where, rootable: this.rootable, lazy: this.lazy };

                if (this.checkAuth) {
                    options.authtype = ''
                }

                if (node) {
                    options.node_level = node.level
                }
                options.appid = this.appid;

                const ret = await this.API.trees({ data: options });

                let treeList = ret.data.tagtree;

                if (!this.trashCfg && ret.data.rubbish) {
                    const trashRet = await this.API.getTreeTrash({ code: ret.data.rubbish.NameCode });
                    if (trashRet.success) {
                        this.trash = trashRet.data;
                    }
                }

                //树节点过滤
                if (this.nodeDataFilter) {
                    treeList = await this.nodeDataFilter(ret.data);
                }

                //将列表数据转化为树结构数据
                const data = listToTree({
                    list: treeList,
                    pid: "node_pid",
                    id: "node_id",
                    each: (node) => {
                        if (this.defaultNodeid == node.node_name) {
                            this.checkedDefaultNodeid = node.node_id;
                        }
                    },
                    afterPush: (node, pnode) => {
                        pnode.children = _.orderBy(pnode.children, ...this.sortOptions);
                    },
                    beforePush: (node, pnode) => {
                        if (this.checkAuth && node.node_auth === '0') return false;
                        return true;
                    }
                });

                //如果是懒加载
                if (resolve) {
                    resolve(data);

                    if (this.checkAfterLoad) {
                        this.setCurrentNode(data);
                    }
                }

                if (!this.rootable && data.length) {
                    return data[0].children;
                } else {
                    return data;
                }
            },
            requestOptionHandler(options) {
                this.where = _.cloneDeep(options);
            },
            nodeMenuChangeHandler(node) {
                node.showMenu ? (node.showMenu = false) : node.showMenu = true;
            },
            isLeaf({ data }) {
                return data.is_leaf === 1;
            },
            getNodeIcon(node) {
                return `${this.nodeIconUri}${(this.folderMode && !this.isLeaf(node)) ? 'folder' : node.data.node_icon}${this.folderMode && !this.isLeaf(node)
                    ? node.data.children && node.data.children.length && node.expanded
                        ? "_expand"
                        : ""
                    : node.isCurrent
                        ? "_expand"
                        : ""
                    }.png`;

            },
            treeFunHandler(command, node) {
                switch (command) {
                    case 'newFolder':
                        this.$emit("before-folder-set", this.nodePayload);
                        this.setNodePayload({ parent: node, node: this.getEmptyNode({ node_pid: node.data.node_id }) });
                        this.$emit("before-folder-new", this.nodePayload);
                        this.nodePayload.showForm = true;
                        break;
                    case 'newNode':
                        this.$emit("before-node-set", this.nodePayload);
                        this.setNodePayload({ parent: node, node: this.getEmptyNode({ is_leaf: 1 }) });
                        this.$emit("before-node-new", this.nodePayload);
                        this.nodePayload.showForm = this.autoEdit;
                        break;
                    case 'edit':
                        this.setNodePayload({ node });
                        this.$emit("before-node-edit", this.nodePayload);
                        this.nodePayload.showForm = true;
                        break;
                    case 'delete':
                        this.$emit("before-node-delete", node.data);
                        if (this.autoDelete) {
                            this.deleteNode(node.data);
                        }
                        break;
                }
            },
            getEmptyNode(data = {}) {
                if (this.defaultNodeData) {
                    if (typeof this.defaultNodeData === 'function') {
                        data = this.defaultNodeData(data, this.requestOptions);
                    } else {
                        Object.assign(data, this.defaultNodeData);
                    }
                }

                data.node_name = data.node_name || '';
                data.data_type = data.data_type || '';
                typeof data.is_leaf === 'undefined' && (data.is_leaf = 0);
                typeof data.is_pass === 'undefined' && (data.is_pass = 0);
                return { data };
            },
            setNodePayload({ parent, node }) {
                this.nodePayload.parent = parent;
                this.nodePayload.node = _.cloneDeep(node);
                this.nodePayload.nodeRef = node;
                this.nodePayload.formTitle = node.node_id ? '编辑' : '新增';
            },
            async deleteNode(data) {
                return this.moveToTrash(data);
            },
            async editNode() {

                const data = this.nodePayload.node.data;
                const parent = this.nodePayload.parent;
                const IS_NEW = typeof data.node_id === 'undefined';

                if (typeof data.node_dimen === 'undefined') data.node_dimen = this.where.node_dimen;

                //新增
                if (IS_NEW) {
                    Object.assign(data, { node_pid: parent.data.node_id });
                }

                this.nodePayload.loading = true;

                this.$emit("before-edit-submit", data);

                if (!data.node_dimen) {
                    throw new Error('node_dimen required!');
                }

                data.data_name = data.node_display;
                data.code = data.node_name;

                const ret = await this.API.trees({ data, method: IS_NEW ? "post" : "put" });

                if (!ret.success) return;

                if (!IS_NEW) {
                    //编辑节点
                    this.nodePayload.nodeRef.data = Object.assign(this.nodePayload.nodeRef.data, data);
                } else {
                    //新增节点
                    const { node_id, node_name } = ret.data;
                    Object.assign(data, ret.data);
                    data.node_id = parseInt(node_id);
                    data.node_name = node_name;
                    data.children = [];
                    this.$refs[treeRef].append(data, data.node_pid);
                }

                this.$nextTick(() => {
                    this.nodePayload.loading = false;
                    this.nodePayload.showForm = false;


                    this.$notify({ title: "成功", message: "添加成功", type: "success" });
                    this.$emit(data.node_id ? "after-node-edit" : "after-node-new", data);
                    this.setCurrentNode([data]);
                });
            },
            nodeDragStart(node, event) {
                this.isCopy = event.ctrlKey;
            },
            async moveNode(data) {

                if (!data.node_id || !data.node_pid) {
                    return this.$message({ message: "不能移动", type: "warning" });
                }
                data.move = this.isCopy ? '1' : '0';
                this.loading = true;
                //用的是update接口，这里加个操作类型
                data.op = "move";
                this.loading = true;
                await this.API.trees({ data, method: "put" });
                await this.loadWholeTree(false);
                this.loading = false;

                this.$notify({ title: "成功", message: "移动成功", type: "success" });
                this.$emit("after-node-move", data);
            },
            allowDropHandler(draggingNode, dropNode, type) {
                if (type === "inner" && this.isLeaf(dropNode)) return false;
                if (this.rootable && dropNode.level === 1 && type !== "inner") return false;
                return true;
            },
            allowDragHandler(node) {
                return (this.rootable ? node.level !== 1 : true) && this.editMode;
            },
            nodeClickHandler(data) {
                this.$emit("node-click", data);
            },
            async nodeDropHandler(draggingNode, dropNode, dropType, ev) {
                let parentNode, children;
                if (dropType === "before" || dropType === "after") {
                    parentNode = this.$refs[treeRef].getNode(dropNode.data.node_pid);
                    children = parentNode.data.children;
                } else {
                    parentNode = dropNode;
                    children = dropNode.data.children;
                }
                await this.moveNode({ node_id: draggingNode.data.node_id, node_pid: parentNode.data.node_id, ids: _.map(children, "node_id").join(",") });
            },
            getCheckedNodes() {
                return this.$refs[treeRef].getCheckedNodes();
            },
            getCheckedKeys() {
                return this.$refs[treeRef].getCheckedNodes();
            },
            getElementTreeRef() {
                return this.$refs[treeRef];
            },
            checkChangeHandler() {
                this.$emit('node-checked', this.getCheckedNodes());
            },
            filterNodeHandler(value, data, node) {
                let keys = ['node_display'];
                if (this.filter) {
                    if (typeof this.filter === 'function') {
                        return this.filter(value, data, node);
                    }
                    keys = this.filter;
                }

                for (let key of keys) {
                    if ((data[key] + '').indexOf(value) !== -1) return true;
                }
                return false;
            },
            async moveToTrash(data) {
                this.updateTrash({ code: data.node_name, method: 'WasteNode' });
            },
            async restoreTrash() {
                this.updateTrash({ ...this.getOpTrashData(), method: 'RecoverNode' });
            },
            async emptyTrash() {
                this.updateTrash({ ...this.getOpTrashData(), method: 'WasteClear' });
            },
            getOpTrashData() {
                return { code: this.selectedTrash[0].node_name, ids: this.selectedTrash.map(item => item.node_id).join(',') };
            },
            async updateTrash(data) {
                this.loading = true;
                const ret = await this.API.updateTreeTrash(data);
                await this.loadWholeTree(false);
                this.$notify({ title: "成功", message: ret.message, type: "success" });
                this.loading = false;
            },
            handleTrashSelect(data) {
                this.selectedTrash = data;
            }
        },
    }
} 