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
                type: Object,
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
                    label: "node_name",
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
            nodeEditLable: {
                type: String,
                default: ''
            },
            defaultNodeData: [Object, Function],
            filter: [Array, Function],
            searchable: {
                type: Boolean,
                default: true
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
                }
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
        created() {
            //检查树参数
            this.requestOptionHandler(this.requestOptions);

            if (!this.lazyLoad) {
                this.loadWholeTree();
            } else {
                //懒加载时关闭自动展开全部
                this.defaultExpendAll = false;
            }
        },
        methods: {
            async  loadWholeTree(loading = true) {
                //加载整颗静态树
                this.loadingWholeTree = loading;

                this.treeData = await this.getNodeData();

                this.loadingWholeTree = false;

                if (this.checkAfterLoad) {
                    this.$nextTick(() => {
                        this.setCurrentNode(this.treeData, 2);
                    });
                }
            },
            setCurrentNode(data, level = 1) {
                //设置默认节点
                const setNode = (nodeData) => {
                    level -= 1;
                    for (let n of nodeData) {
                        if (!(this.folderMode && n.is_leaf === 0)) {
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

                if (node) {
                    options.node_level = node.level
                }

                if (!node || (node && node.level === 0)) {
                    if (!options.node_id) {
                        if (!options.node_dimen) throw new Error('node_dimen required!')
                        options.node_id = this.appid;
                        options.appid = this.appid;
                    }
                } else {
                    options.node_id = node.data.node_id;
                }

                const ret = await this.API.trees({ data: options });

                let treeList = ret.data;

                //树节点过滤
                if (this.nodeDataFilter) {
                    treeList = await this.nodeDataFilter(ret.data);
                }

                //将列表数据转化为树结构数据
                const data = listToTree({
                    list: treeList,
                    pid: "node_pid",
                    id: "node_id",
                    afterPush: (node, pnode) => {
                        pnode.children = _.orderBy(pnode.children, ...this.sortOptions);
                    }
                });

                //如果是懒加载
                if (resolve) {
                    resolve(data);

                    if (this.checkAfterLoad) {
                        this.setCurrentNode(data);
                    }
                }

                return data;
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
                return `${this.nodeIconUri}${(this.folderMode && !this.isLeaf(node)) ? 'folder' : node.data.data_type}${
                    this.folderMode && !this.isLeaf(node)
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
                        this.setNodePayload({ parent: node, node: this.getEmptyNode() });
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
                const { node_id, children } = data;
                if (typeof node_id === "undefined") return;
                if (children && children.length) return this.$message({ message: "此节点有子节点，不能删除", type: "warning" });

                this.loading = true;
                const ret = await this.API.trees({ data: { node_id }, method: "delete" });
                this.loading = false;

                if (!ret.success) return;
                this.$refs[treeRef].remove(node_id);
                this.$notify({ title: "成功", message: "成功删除", type: "success" });
                this.$emit("after-node-delete", data);
            },
            async editNode() {

                const data = this.nodePayload.node.data;
                const parent = this.nodePayload.parent;
                const IS_NEW = typeof data.node_id === 'undefined';

                if (typeof data.node_dimen === 'undefined') data.node_dimen = this.where.node_dimen;

                //新增
                if (IS_NEW) {
                    Object.assign(data, { node_pid: parent.data.node_id, node_path: `${parent.data.node_path}-${parent.data.node_id}` });
                }

                this.nodePayload.loading = true;

                this.$emit("before-edit-submit", data);

                if (!data.node_dimen) {
                    throw new Error('node_dimen required!');
                }

                if (!data.data_type) {
                    throw new Error('data_type required!');
                }

                data.node_display = data.node_display || data.node_name;
                const ret = await this.API.trees({ data, method: IS_NEW ? "post" : "put" });

                if (!ret.success) return;

                if (!IS_NEW) {
                    //编辑节点
                    this.nodePayload.nodeRef.data = Object.assign(this.nodePayload.nodeRef.data, data);
                } else {
                    //新增节点
                    data.node_id = parseInt(ret.data);
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
            async moveNode(data) {

                if (!data.node_id || !data.node_pid) {
                    console.log(data);
                    return this.$message({ message: "不能移动", type: "warning" });
                }

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
                let keys = ['node_name'];
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
            }
        },
    }
} 