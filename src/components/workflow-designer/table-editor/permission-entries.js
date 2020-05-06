import { Node } from 'tiptap'
import { TextSelection } from 'prosemirror-state'
export default class Permission extends Node {

    get name() {
        return 'permission'
    }

    get schema() {
        return {
            inline: true,
            draggable: true,
            group: 'inline',
            attrs: {
                permission: {
                    default: '',
                },
                permissiontext: {
                    default: '',
                }
            },
            parseDOM: [{
                tag: 'span[permission]',
                getAttrs: dom => ({
                    permission: dom.getAttribute('permission'),
                    permissiontext: dom.getAttribute('permissiontext'),
                }),
            }],
            toDOM: function (node) {
                return ['span', node.attrs, node.attrs.permissiontext]
            }
        }
    }

    commands({ type, schema }) {
        return {
            createPermission: ({ value, name }) => (
                (state, dispatch) => {
                    const offset = state.tr.selection.anchor + 1
                    const node = type.create({ permission: value, permissiontext: name })
                    const tr = state.tr.replaceSelectionWith(node).scrollIntoView()
                    const resolvedPos = tr.doc.resolve(offset)
                    tr.setSelection(TextSelection.near(resolvedPos))
                    dispatch(tr)
                }
            )
        }
    }
}