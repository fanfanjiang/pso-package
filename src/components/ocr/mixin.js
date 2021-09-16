import GreatPanel from "../great-panel";
import OcrResult from "./ocr-result";
import OcrUpload from "./upload";

export const OcrTest = {
    components: { GreatPanel, OcrResult, OcrUpload },
    data() {
        return {
            initializing: true,
            templates: [],
            api: "/api/ocr/upload",
            cmOptions: {
                tabSize: 4,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                lineWrapping: true,
            },
            upData: {
                cert_code: "",
                api: ""
            },
            output: "",
            ocrResults: []
        }
    },
    computed: {
        ocrRet() {
            return this.ocrResults[this.ocrResults.length - 1];
        }
    },
    created() {
        this.initializ();
    },
    methods: {
        async initializ() {
            this.initializing = true;
            const ret = await this.API.request("/api/ocr/template", { data: { limit: 99999 }, method: "get" });
            this.initializing = false;
            this.templates = ret.data.data;
        },
        onSuccess(ret) {
            if (!ret || !ret.data) return;

            if (ret.success) {
                if (ret.data._type) {
                    const exist = _.find(this.templates, { cert_code: ret.data._type });
                    ret._template = exist;
                }
            }

            this.ocrResults.push(ret);

            if (this.onOutput) {
                this.output = this.onOutput(ret);
            } else {
                this.output = ret.success ? JSON.stringify(ret.data) : (ret.message || "无信息");
            }

            if (this.afterSuccess) {
                this.afterSuccess(ret);
            }
        }
    }
}