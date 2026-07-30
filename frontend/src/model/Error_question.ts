export interface SelectOption {
    value: number
    label: string
}
// 新增错题 请求结构体（前端入参）
export interface AddErrorQuestionReq {
    menuId: number;
    questionImg: string;
    answerImg: string;
    questBase: string;
    answerBase: string;
    remark: string;
    masterLevel: number;
}

// 错题实体，和后端对齐
export interface ErrorQuestion {
    ID: number;
    MenuID: number;
    QuestionImg: string;
    AnswerImg: string;
    Remark: string;
    MasterLevel: number;
    Enabled: number;
    CreatedAt: string;
}