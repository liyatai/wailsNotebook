package model

import "gorm.io/gorm"

// 错题数据表模型
type SysErrorQuestion struct {
	gorm.Model
	MenuID      uint   `gorm:"not null"`
	QuestionImg string `gorm:"not null"`
	AnswerImg   string `gorm:"not null"`
	Remark      string
	MasterLevel int `gorm:"default:0"`
	Enabled     int `gorm:"default:1"`
}

func (SysErrorQuestion) TableName() string {
	return "sys_error_question"
}

// 新增错题 请求结构体（前端入参）
type AddErrorQuestionReq struct {
	MenuID      uint   `json:"menuId"`
	QuestionImg string `json:"questionImg"`
	AnswerImg   string `json:"answerImg"`
	QuestBase   string `json:"questBase"`
	AnswerBase  string `json:"answerBase"`
	Remark      string `json:"remark"`
	MasterLevel int    `json:"masterLevel"`
}

// Antd下拉统一DTO（建议放menu.go，如果你没写我放这，你可以移动过去）
type SelectOption struct {
	Label string `json:"label"`
	Value uint   `json:"value"`
}
