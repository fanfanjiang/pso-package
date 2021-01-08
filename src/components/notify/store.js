import Vue from 'vue';
import API from "../../service/api.js";
import shortid from "shortid";

export default class Notify {
    constructor(options) {

        this.$vue = {};
        this.fetching = false;
        this.instances = [];

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }
 
    async fetch() {
        this.fetching = true;
        const ret = await API.notification({ data: {} });
        if (ret.success && ret.data && ret.data.data) {
            this.instances = ret.data.data;
        }
        this.fetching = false;
    }
}