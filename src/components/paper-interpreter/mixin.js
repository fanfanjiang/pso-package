
export const BaseMixin = {
    props: {
        cpnt: Object
    },
    data() {
        return {
            initializing: true
        }
    },
    async created() {
        this.initializing = true;
        const { start = 0, num = 0 } = this.cpnt.data;
        const data = await this.cpnt.store.fetchScriptData(this.cpnt, { limit: num, start });
        data.forEach(d => {
            const entity = {};

            this.$set(entity, 'source', d); //数据源
            this.$set(entity, 'stem', '');
            this.$set(entity, 'option', []);
            this.$set(entity, 'answer', '');
            this.$set(entity, 'result', '');
            this.$set(entity, 'score', 0);

            this.cpnt.questions.push(entity)
        })
        this.initializing = false;
    },
}

export const QuestionMixin = {
    props: {
        cpnt: Object,
        data: Array,
        index: Number
    },
    data() {
        return {
            error: ''
        }
    },
    computed: {
        splitSymbol() {
            return this.cpnt.store.splitSymbol;
        }
    },
    methods: {
        analyzeBase() {
            this.error = '';
            const { stem, answer } = this.cpnt.data;
            if (!stem || !answer) {
                return this.error = '请设置题干或答案';
            }
            if (typeof this.data.source[stem] !== 'undefined') {
                this.data.stem = this.data.source[stem];
            }
            if (typeof this.data.source[answer] !== 'undefined') {
                this.data.answer = this.data.source[answer];
            }
        },
        analyzeOption() {
            const { option } = this.cpnt.data;
            if (!option) {
                return (this.error = "请设置选项字段");
            }

            const source = this.data.source;
            if (typeof source[option] !== "string" || !source[option]) {
                return (this.error = "选项数据不合法");
            }

            this.data.option = source[option].split(this.splitSymbol);
        }
    },
} 