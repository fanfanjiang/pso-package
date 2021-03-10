import { Node } from 'tiptap'
import { TextSelection } from 'prosemirror-state';
import emitter from "../../mixin/emitter";

const ATTRS = [
    { v: 'field', def: '', aln: 'value' },
    { v: 'fieldtext', def: '', aln: 'name' },
    { v: 'format', def: '' },
    { v: 'display', def: '' },
    { v: 'sequence', def: '0' },
    { v: 'compareto', def: '0' },
    { v: 'direction', def: '0' }
]
export default class FieldNode extends Node {

    get name() {
        return 'field'
    }

    get schema() {
        const options = {
            inline: true,
            group: 'inline',
            draggable: true,
            attrs: {},
            parseDOM: [{
                tag: 'span[field]',
                getAttrs: dom => {
                    const objs = {};
                    for (let item of ATTRS) {
                        objs[item.v] = dom.getAttribute(item.v);
                    }
                    return objs
                },
            }],
            toDOM: function (node) {
                return ['span', node.attrs, node.attrs.fieldtext]
            }
        }
        for (let item of ATTRS) {
            options.attrs[item.v] = { default: item.def };
        }
        return options;
    }

    get view() {
        const watchOptions = {};
        let temp = '';
        for (let item of ATTRS) {
            watchOptions[`node.attrs.${item.v}`] = function (v) {
                this.updateAttrs({ [item.v]: v })
            };
            temp += ` :${item.v}="node.attrs.${item.v}"`
        }
        return {
            // there are some props available
            // `node` is a Prosemirror Node Object
            // `updateAttrs` is a function to update attributes defined in `schema`
            // `view` is the ProseMirror view instance
            // `options` is an array of your extension options
            // `selected` is a boolean which is true when selected
            // `editor` is a reference to the TipTap editor instance
            // `getPos` is a function to retrieve the start position of the node
            // `decorations` is an array of decorations around the node
            mixins: [emitter],
            props: ['node', 'updateAttrs', 'view'],
            watch: watchOptions,
            template: `<span ${temp} @click="nodeClick">{{node.attrs.fieldtext}}</span>`,
            methods: {
                nodeClick() {
                    this.dispatch('RichDesigner', 'field-click', this.node);
                }
            }
        }
    }

    commands({ type, schema }) {
        return {
            createField: (params) => (
                (state, dispatch) => {
                    const offset = state.tr.selection.anchor + 1;
                    const nodeOption = {};
                    for (let item of ATTRS) {
                        nodeOption[item.v] = params[item.aln || item.v];
                    }
                    const node = type.create(nodeOption)
                    const tr = state.tr.replaceSelectionWith(node).scrollIntoView()
                    const resolvedPos = tr.doc.resolve(offset)
                    tr.setSelection(TextSelection.near(resolvedPos))
                    dispatch(tr)
                }
            )
        }
    }
}