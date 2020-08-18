import { Node } from 'tiptap'
import { TextSelection } from 'prosemirror-state';
import emitter from "../../../mixin/emitter";

export default class FieldNode extends Node {

    get name() {
        return 'field'
    }

    get schema() {
        return {
            inline: true,
            group: 'inline',
            draggable: true,
            attrs: {
                field: {
                    default: '',
                },
                fieldtext: {
                    default: '',
                },
                format: {
                    default: '',
                },
                display: {
                    default: '',
                },
                sequence: {
                    default: '0',
                }
            },
            parseDOM: [{
                tag: 'span[field]',
                getAttrs: dom => {
                    return {
                        field: dom.getAttribute('field'),
                        fieldtext: dom.getAttribute('fieldtext'),
                        format: dom.getAttribute('format'),
                        display: dom.getAttribute('display'),
                        sequence: dom.getAttribute('sequence'),
                    }
                },
            }],
            toDOM: function (node) {
                return ['span', node.attrs, node.attrs.fieldtext]
            }
        }
    }

    get view() {
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
            watch: {
                'node.attrs.format'(format) {
                    this.updateAttrs({ format })
                },
                'node.attrs.display'(display) {
                    this.updateAttrs({ display })
                },
                'node.attrs.sequence'(sequence) {
                    this.updateAttrs({ sequence })
                }
            },
            template: `
            <span :field="node.attrs.field" :fieldtext="node.attrs.fieldtext" :sequence="node.attrs.sequence" :format="node.attrs.format" :display="node.attrs.display" @click="nodeClick">{{node.attrs.fieldtext}}</span>
          `,
            methods: {
                nodeClick() {
                    this.dispatch('PsoWfEditorTable', 'field-click', this.node);
                }
            }
        }
    }

    commands({ type, schema }) {
        return {
            createField: ({ name, value, format, display, sequence }) => (
                (state, dispatch) => {
                    const offset = state.tr.selection.anchor + 1
                    const node = type.create({ field: value, fieldtext: name, format, display, sequence })
                    const tr = state.tr.replaceSelectionWith(node).scrollIntoView()
                    const resolvedPos = tr.doc.resolve(offset)
                    tr.setSelection(TextSelection.near(resolvedPos))
                    dispatch(tr)
                }
            )
        }
    }
}