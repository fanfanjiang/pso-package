import { clearSelections, on, off } from "../utils/dom.js";

export default function (stage = "stage", target = "target") {
    return {
        data() {
            return {
                stageTrans: {
                    draging: false,
                    top: 0,
                    left: 0,
                    initX: 0,
                    initY: 0,
                    X: 0,
                    y: 0
                }
            }
        },
        mounted() {
            on(this.$refs[stage], "mousedown", this.dragstart);
            on(document, "mouseup", this.onDrop);
        },
        beforeDestroy() {
            off(this.$refs[stage], "mousedown", this.dragstart);
            off(document, "mouseup", this.onDrop);
            this.onDrop();
        },
        methods: {
            dragstart(event) {
                clearSelections();
                event.preventDefault();

                if (!event.cancelable) return;

                if (/mousedown|pointerdown/.test(event.type) && event.button !== 0) {
                    return;
                }

                if (this.stageTrans.draging) return;
                this.stageTrans.draging = true;
                this.stageTrans.left = this.$refs[target].offsetLeft;
                this.stageTrans.top = this.$refs[target].offsetTop;
                this.stageTrans.initX = this.stageTrans.x = event.clientX;
                this.stageTrans.initY = this.stageTrans.y = event.clientY;

                on(this.$refs[stage], "mousemove", this.dragover);
            },
            dragover(event) {
                this.stageTrans.x = event.clientX;
                this.stageTrans.y = event.clientY;

                $(this.$refs[target]).css("left", `${this.stageTrans.x - this.stageTrans.initX + this.stageTrans.left}px`);
                $(this.$refs[target]).css("top", `${this.stageTrans.y - this.stageTrans.initY + this.stageTrans.top}px`);
            },
            onDrop() {
                this.stageTrans.draging = false;
                off(this.$refs[stage], "mousemove", this.dragover);
            }
        }
    }
}
