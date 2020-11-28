import API from '../../service/api'
import dayjs from "dayjs";
import Cursor from "../../utils/dom/cursor";

export default class Chat {
    constructor(options) {
        this.$vue = null;
        this.initializing = false;
        this.relatedId = '';
        this.extend = {};
        this.messages = [];
        this.curUser = {};
        this.input = '';
        this.inputAttach = '';
        this.sending = false;
        this.opener = { show: false, offset: { top: 0, left: 0 }, keywords: '', startIndex: undefined, data: [] };

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }
    }

    async initialize() {
        this.initializing = true;
        const ret = await API.searchUsers({
            duty_id: "",
            limit: 999,
            node_id: "",
            post_id: "",
            search_type: "0",
            start: 0,
            type: "UserPage",
            user_rel: "0",
        });
        this.opener.data = ret.data.data;

        const msgRet = await API.message({ data: { leaf_id: this.relatedId }, method: 'get' });
        if (msgRet.success) {
            this.messages = msgRet.data;
            this.$vue.$emit('messages-loaded', msgRet.data);
        }

        this.initializing = false;
    }

    async createMsg() {
        if (!this.inputAttach && !this.input) return;
        this.sending = true;
        const data = {
            leaf_id: this.relatedId,
            com_user: this.curUser.user_id,
            user_name: this.curUser.user_name,
            com_content: this.input,
            att_id: this.inputAttach,
            com_time: dayjs().format('YYYY-MM-DD HH:mm'),
            optype: 0,
            ...this.extend
        };
        this.$vue.$set(data, 'submitting', true);
        this.messages.push(data);
        this.refresh();
        this.sending = false;

        this.$vue.$nextTick(() => {
            $(this.refHistory).scrollTop($(this.refHistory).prop("scrollHeight"));
        })

        const ret = await API.message({ data, method: 'post' });
        if (ret.success) {
            data.submitting = false;
        }
    }

    refresh() {
        this.input = '';
        this.inputAttach = '';
        this.closeUserPopper();
    }

    closeUserPopper() {
        this.opener.show = false;
        this.opener.startIndex = undefined;
    }

    openUserPopper(index) {
        this.opener.show = true;
        this.opener.startIndex = index;
    }

    get startMatching() {
        return this.opener.startIndex !== undefined;
    }

    analyzeInput(cursorPosition) {
        if (this.input) {
            const curIndex = (cursorPosition || this.input.length) - 1;
            const lastChar = this.input[curIndex];
            if (this.startMatching && curIndex < this.opener.startIndex) {
                this.closeUserPopper();
            }
            if (lastChar === '@') {
                this.openUserPopper(curIndex);
            }
            if (this.opener.show || this.startMatching) {
                this.opener.keywords = this.input.slice(this.opener.startIndex + 1, curIndex + 1);
            }
            this.setCursorOffset();
        } else {
            this.closeUserPopper();
        }
    }

    insertUser({ user_name }) {
        if (this.startMatching) {
            this.insert(this.opener.startIndex + 1, this.opener.keywords.length, user_name);
        } else {
            this.input += user_name;
        }
        this.opener.show = false;
    }

    insert(start, length, text) {
        const input = this.input.split('');
        input.splice(start, length, text);
        this.input = input.join('');
        setTimeout(() => {
            this.setCursorPosition(start + length + text.length);
        }, 100);
    }

    getCursorPosition() {
        this.cursor = this.inputEl.selectionStart;
        return this.cursor;
    }

    setCursorOffset() {
        const cursorReact = Cursor.getInputPositon(this.inputEl);
        const inputReact = Cursor._offset(this.inputEl);
        const inputFixedHeight = $(this.inputEl).prop("scrollHeight") - $(this.inputEl).height();

        this.opener.offset.top = cursorReact.top - inputReact.top - inputFixedHeight;
        this.opener.offset.left = cursorReact.left - inputReact.left + 24;
    }

    setCursorPosition(position) {
        this.inputEl.selectionStart = position;
        this.inputEl.selectionEnd = position;
        this.setCursorOffset();
    }
}