import { CPNT, DEFAULT } from "../paper-designer/const";
import Designer from "../paper-designer/store";

export default class Interpreter extends Designer {
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