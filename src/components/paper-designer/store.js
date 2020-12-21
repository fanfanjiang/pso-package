import { CPNT, DEFAULT } from "./const";
import Module from "../plugin-module/store";

export default class Paper extends Module {

    static CPNT = CPNT;

    static DEFAULT = DEFAULT;

    constructor(options) {
        super(options);

        this.authRequired = false;
        this.nameRequired = true;
        this.IDRequired = false;
        this.phoneRequired = false;
        this.addressRequired = false;
        this.order = [];
    }
}