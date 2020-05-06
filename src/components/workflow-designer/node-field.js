const reviewParams = {
    atype: "",
    authitems: "",
    authitemsList: [],
    bodyitems: "",
    bodyitemsList: [],
    confirm: "同意",
    input: "意见",
    op: '',
    opList: [],
    opa: "",
    opaitems: [],
    update: [],
    notification: { type: 2, value: '', list: [], pattern: 'checkbox' },
}

export default {
    default: {
        name: "",
    },
    branch: {
        nt: "branch",
    },
    branchitem: {
        nt: "condition",
        conditionMap: [],
        condition: '',
        has: true
    },
    review: {
        name: "审批",
        nt: "leaf",
        ...reviewParams
    },
    start: {
        name: "开始",
        nt: "leaf",
        ...reviewParams
    }
} 