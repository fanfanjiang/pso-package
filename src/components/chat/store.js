import API from '../../service/api'
import dayjs from "dayjs";

export default class Chat {
    constructor(options) {
        this.$vue = null;
        this.messages = [];
        this.curUser = {};
        this.input = '';
        this.inputAttach = '';
        this.sending = false;

        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }
    }

    createMsg() {
        this.sending = true;
        const data = {
            message: this.input,
            attach: this.inputAttach,
            // attach: 'P000000134239480,P000000249803797,P000000878963206',
            user_id: this.curUser.user_id,
            nick: this.curUser.user_nick, 
            time: dayjs().format('YYYY-MM-DD HH:mm')
        };
        // const ret = API.message({ data });
        this.messages.push(data);
        this.refresh();
        this.sending = false;

        this.$vue.$nextTick(() => {
            $(this.refHistory).scrollTop($(this.refHistory).prop("scrollHeight"));
        })
    }

    refresh() {
        this.input = '';
        this.inputAttach = '';
    }
}