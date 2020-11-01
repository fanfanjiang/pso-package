import PsoFormAttach from "../components/form-interpreter/components/attachment";
import { genComponentData } from "../components/form-designer/helper";

export const Attach = {
    components: { PsoFormAttach },
    data() {
        return {
            attach: { data: {} },
        };
    },
    methods: {
        createCpnt(ids = "") {
            this.attach.data = genComponentData({ componentid: "attachment", _fieldName: "", _val: ids });
            this.attach.data._fieldName = "";
        }
    }
};