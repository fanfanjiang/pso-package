import BaseMixin from '../../mixin/base';
import ResizeObserver from '../pc-resize-observer';
import { addTargetListener, getTargetRect, getFixedTop, getFixedBottom } from './util';

const AffixState = {
    none: 'none',
    ready: 'ready'
}

const Affix = {
    mixins: [BaseMixin],
    props: {
        top: Number,
        bottom: Number,
        target: {
            type: Function,
            default: () => window
        }
    },
    data() {
        return {
            state: AffixState.none,
            affixStyle: undefined,
            placeholderStyle: undefined,
        }
    },
    created() {

    },
    mounted() {
        if (this.target) {
            setTimeout(() => {
                addTargetListener(this.target(), this);
            })
        }
    },
    updated() {
        this.mesure();
    },
    render() {
        const { affixStyle, placeholderStyle } = this;
        return (
            <ResizeObserver onResize={(e) => {
                this.updatePosition(e);
            }}>
                <div ref="placeholder" style={placeholderStyle}>
                    <div ref="affix" style={affixStyle}>
                        {this.$slots.default}
                    </div>
                </div>
            </ResizeObserver>
        )
    },
    methods: {
        mesure() {
            if (this.state !== AffixState.ready || !this.target || !this.$refs.placeholder) {
                return
            }

            const targetNode = this.target();
            const targetRect = getTargetRect(targetNode);
            const affixRect = getTargetRect(this.$refs.placeholder);
            const fixedTop = getFixedTop(affixRect, targetRect, this.top);
            const fixedBottom = getFixedBottom(affixRect, targetRect, this.bottom);

            const newState = { state: AffixState.none };

            if (fixedTop !== undefined) {
                newState.affixStyle = {
                    position: 'fixed',
                    top: fixedTop,
                    width: `${affixRect.width}px`,
                    height: `${affixRect.height}px`,
                }
                newState.placeholderStyle = {
                    width: `${affixRect.width}px`,
                    height: `${affixRect.height}px`,
                }
            } else if (fixedBottom !== undefined) {
                newState.affixStyle = {
                    position: 'fixed',
                    bottom: fixedBottom,
                    width: `${affixRect.width}px`,
                    height: `${affixRect.height}px`,
                }
                newState.placeholderStyle = {
                    width: `${affixRect.width}px`,
                    height: `${affixRect.height}px`,
                }
            }
            this.setState(newState);
        },
        prepareMesure() {
            this.setState({
                state: AffixState.ready,
                affixStyle: undefined,
                placeholderStyle: undefined,
            })
        },
        updatePosition() {
            // 修改定位
            this.prepareMesure();
        },
        lazyUpdatePosition() {
            const { affixStyle, target } = this;
            if (affixStyle && target) {
                const targetNode = this.target();
                if (targetNode && this.$refs.placeholder) {
                    const targetRect = getTargetRect(targetNode);
                    const affixRect = getTargetRect(this.$refs.placeholder);
                    const fixedTop = getFixedTop(affixRect, targetRect, this.top);
                    const fixedBottom = getFixedBottom(affixRect, targetRect, this.bottom);

                    if (fixedTop !== undefined) {
                        return affixStyle.top = fixedTop;
                    } else if (fixedBottom !== undefined) {
                        return affixStyle.bottom = fixedBottom;
                    }
                }
            }
            this.updatePosition();
        }
    }
}

export default Affix;