export const DEFAULT = {
    child_id: "",
    child_name: "",
    child_cate: "",
    child_cate: "",
    child_status: 1,
    child_content: "",
    child_data: "",
    child_design: "",
}

export const CPNT = {
    singlechoice: {
        id: "singlechoice",
        name: "单选题",
        icon: 'el-icon-turn-off',
        data: {
            stem: '',
            option: '',
            answer: '',
            score: 0,
            start: 0,
            num: 10
        }
    },
    multichoice: {
        id: "multichoice",
        name: "多选题",
        icon: 'el-icon-set-up',
        data: {
            stem: '',
            option: '',
            answer: '',
            score: 0,
            start: 0,
            num: 10
        }
    },
    essay: {
        id: "essay", 
        name: "问答题",
        icon: 'el-icon-edit-outline',
        data: {
            stem: '',
            answer: '',
            score: 0,
            start: 0,
            num: 10
        }
    }
}