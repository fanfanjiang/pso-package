import Designer from "../paper-designer/store";
import Vue from 'vue';

export default class Interpreter extends Designer {
    constructor(options) {
        super(options);
        this.base = {
            userid: '',
            name: '',
            id: '',
            phone: '',
            address: '',
        }
        this.mockSignin = false;
        this.size = options.size;
        this.mode = options.mode;
        this.appid = options.appid || '';
        this.start = this.mode === 'preview';
        
        this.splitSymbol = '|$|'
    }

    get score() {
        const result = {};
        for (let item of this.data) {
            result[item.urine.child_id] = { name: item.urine.child_name, score: _.sumBy(item.questions, 'score') };
        }
        return result;
    }

    async beforeInitialize() {
        if (!this.checkAuth()) {
            //如果未登录先登录临时用户，苦笑
            const success = await this.$vue.$store.dispatch('APP_MOCKSIGNIN', { appid: this.appid });
            this.mockSignin = true;
            if (!success || !this.checkAuth()) {
                this.$vue.$message.error("获取试题失败，请联系管理员");
                return true;
            }
        }
    }

    async onInitialized() {
        super.onInitialized();
        const { authRequired } = this.paperConfig;
        console.log(authRequired);
        if (authRequired && this.mockSignin) {
            this.$vue.$router.replace({
                name: 'login',
                query: { redirect: this.$vue.$router.currentRoute.fullPath }
            })
        }
    }

    checkAuth() {
        const user = this.$vue.$store.state.base && this.$vue.$store.state.base.user;
        if (user && user.user_id) {
            this.base.userid = user.user_id;
            return user.user_id;
        }
    }

    addCpnt(cpnt = {}, urine = {}) {
        const entity = super.addCpnt(cpnt, urine);
        Vue.set(entity, 'questions', []);
        return entity;
    }

    startTest() {
        this.start = true;
    }
}