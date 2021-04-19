import { clearSelections, on, off } from "../utils/dom.js";
const UAParser = require('../../share/util/u-agent');

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
        },
        isMobile: false
      }
    },
    computed: {
      mousedown() {
        return this.isMobile ? 'touchstart' : 'mousedown'
      },
      mouseup() {
        return this.isMobile ? 'touchend' : 'mouseup'
      },
      mousemove() {
        return this.isMobile ? 'touchmove' : 'mousemove'
      }
    },
    created() {
      const parser = new UAParser();
      this.isMobile = parser.getResult().device.type === 'mobile'
    },
    mounted() {
      try {
        on(this.$refs[stage], this.mousedown, this.dragstart);
        on(document, this.mouseup, this.onDrop);
      } catch (error) {
        console.log('自由移动创建出错');
      }
    },
    beforeDestroy() {
      try {
        off(this.$refs[stage], this.mousedown, this.dragstart);
        off(document, this.mouseup, this.onDrop);
        this.onDrop();
      } catch (error) {
        console.log('自由移动销毁出错');
      }
    },
    methods: {
      getClientX(evt) {
        return this.isMobile ? evt.changedTouches[0].clientX : evt.clientX;
      },
      getClientY(evt) {
        return this.isMobile ? evt.changedTouches[0].clientY : evt.clientY;
      },
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
        this.stageTrans.initX = this.stageTrans.x = this.getClientX(event);
        this.stageTrans.initY = this.stageTrans.y = this.getClientY(event);

        on(this.$refs[stage], this.mousemove, this.dragover);
      },
      dragover(event) {
        this.stageTrans.x = this.getClientX(event);
        this.stageTrans.y = this.getClientY(event);

        $(this.$refs[target]).css("left", `${this.stageTrans.x - this.stageTrans.initX + this.stageTrans.left}px`);
        $(this.$refs[target]).css("top", `${this.stageTrans.y - this.stageTrans.initY + this.stageTrans.top}px`);

        this.$emit('drag-move');
      },
      onDrop() {
        this.stageTrans.draging = false;
        off(this.$refs[stage], this.mousemove, this.dragover);
        this.$emit('drag-stop');
      }
    }
  }
}
