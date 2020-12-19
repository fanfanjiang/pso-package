import ButtonTabs from "../button-tabs";

export const BaseMixin = {
    components: { ButtonTabs },
    props: {
        cpnt: Object
    },
    data() {
        return {
            curTab: 0,
            TABS: [{ label: '数据源', icon: 'el-icon-cpu' }, { label: '设置', icon: 'el-icon-setting' }]
        }
    },
    computed: {
    },
    methods: {
        async saveCpnt() {
            await this.cpnt.store.saveCpnt(this.cpnt);
        }
    }
} 