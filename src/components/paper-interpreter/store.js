import Designer from "../paper-designer/store";
import Vue from 'vue';
import API from "../../service/api";
import { PAPER_STATUS } from './const'

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
        this.start = this.mode !== 'edit';
        this.paperId = options.paperId;
        this.extension = options.extension;

        this.instResult = [];
        this.instStatus = '0';

        this.splitSymbol = '|$|';

        this.completing = false;
        this.completed = false;
        this.grading = false;
    }

    get previewMode() {
        return this.mode === 'preview';
    }

    get editMode() {
        return this.mode === 'edit';
    }

    get gradeMode() {
        return this.mode === 'grade';
    }

    get readMode() {
        return this.mode === 'read';
    }

    get showAnswer() {
        return this.previewMode || this.gradeMode || this.readMode;
    }

    get paperEditable() {
        return this.previewMode || this.editMode;
    }

    get showScoreboard() {
        return this.gradeMode || this.readMode;
    }

    get previewScore() {
        const result = {};
        for (let item of this.data) {
            result[item.urine.child_id] = { name: item.urine.child_name, score: _.sumBy(item.questions, 'score') };
        }
        return result;
    }

    get score() {
        return _.sumBy(Object.values(this.previewScore), 'score') || 0;
    }

    get paperResult() {
        const result = [];
        for (let item of this.data) {
            const { urine, questions } = item;
            const { child_id, child_name } = urine;
            for (let q of questions) {
                result.push({ child_id, child_name, score: q.score, result: q.result })
            }
        }
        return result;
    }

    async beforeInitialize() {
        if (this.editMode && !this.checkAuth()) {
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

        if (this.editMode) {
            const { authRequired } = this.paperConfig;
            if (authRequired && this.mockSignin) {
                this.$vue.$router.replace({
                    name: 'login',
                    query: { redirect: this.$vue.$router.currentRoute.fullPath }
                })
            }

            if (authRequired) {
                const ret = await API.getPapers({ keys: JSON.stringify({ exam_user: { value: this.base.userid, type: 1 }, exam_id: { value: this.code, type: 1 } }) });
                if (ret.success && ret.data.length) {
                    this.completed = true;
                }
            }
        }

        if (this.paperId) {
            await this.fetchPaperRet();
        }
    }

    async fetchPaperRet() {
        const ret = await API.getPapers({ keys: JSON.stringify({ result_id: { value: this.paperId, type: 1 }, exam_id: { value: this.code, type: 1 } }) });
        if (ret.success && ret.data.length) {
            const { exam_content, exam_user, exam_name, exam_status, exam_submit } = ret.data[0];

            if (exam_submit) {
                Object.assign(this.base, JSON.parse(exam_submit))
            }
            this.base.userid = exam_user;
            this.base.name = exam_name;

            this.instStatus = exam_status;
            this.instResult = JSON.parse(exam_content);
        }
    }

    checkAuth() {
        this.$vue.$store.commit('APP_GET_USER');
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

    checkRequired() {
        const { name, id, phone, address } = this.base;
        if (this.paperConfig.nameRequired && !this.base.name) {
            throw new Error('请填写姓名');
        }
        if (this.paperConfig.IDRequired && !this.base.id) {
            throw new Error('请填写身份证');
        }
        if (this.paperConfig.phoneRequired && !this.base.phone) {
            throw new Error('请填写手机');
        }
        if (this.paperConfig.addressRequired && !this.base.address) {
            throw new Error('请填写地址');
        }
        return { exam_name: name, id, phone, address };
    }

    async doSqlScript(sql, extension = {}) {
        const params = { script: [{ sql, param: {} }], params: { exam_id: this.code, exam_user: this.base.userid, ...extension } };
        return await API.getPscriptData(params);
    }

    async completePaper() {
        if (this.completing) return;
        this.completing = true;
        try {
            if (this.completed) {
                throw new Error('你已完成答题');
            }
            const baseParams = this.checkRequired();
            const ret = await API.addOrUpdatePaper({
                ...baseParams,
                exam_id: this.code,
                exam_user: this.base.userid,
                exam_status: PAPER_STATUS.completed.v,
                exam_submit: JSON.stringify(baseParams),
                result_score: this.score,
                exam_content: JSON.stringify(this.paperResult),
                optype: 0
            });
            if (ret.success) {
                const { examEndSqlRequired, examEndSql } = this.paperConfig;
                if (examEndSqlRequired) {
                    await this.doSqlScript(examEndSql, { ...this.getPaperRet(), result_id: ret.message || '' });
                }

                this.$vue.ResultNotify({ success: true, message: '完成答题' });
                this.completed = true;
            }
        } catch (error) {
            this.$vue.$message({ type: 'warning', message: error.message })
            this.completing = false;
        }
    }

    getPaperRet() {
        const { passScore } = this.paperConfig;
        return { result_id: this.paperId, result_score: this.score, passed: this.score >= passScore ? '1' : '0' };
    }

    async gradePaper() {
        if (this.grading) return;
        this.grading = true;
        const { gradeEndSqlRequired, gradeEndSql } = this.paperConfig;
        const paperRet = this.getPaperRet();
        const ret = await API.addOrUpdatePaper({
            exam_id: this.code,
            result_id: this.paperId,
            result_score: this.score,
            exam_status: PAPER_STATUS[paperRet.passed === '1' ? 'passed' : 'failed'].v,
            exam_content: JSON.stringify(this.paperResult),
            optype: 1
        });
        if (ret.success) {
            if (gradeEndSqlRequired) {
                await this.doSqlScript(gradeEndSql, paperRet);
            }
        }
        this.$vue.ResultNotify(ret);
        this.$vue.$emit('graded');
        this.grading = false;
    }
}