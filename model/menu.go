package model

import "gorm.io/gorm"

type SysMenu struct {
	gorm.Model
	ParentID int    `gorm:"column:parent_id;default:0"`
	MenuKey  string `gorm:"column:menu_key;unique;not null"`
	Label    string `gorm:"column:label;not null"`
	MenuType string `gorm:"column:menu_type;not null"`
	Sort     int    `gorm:"column:sort;default:0"`
	Enabled  int    `gorm:"column:enabled;default:1"`
}

func (SysMenu) TableName() string {
	return "sys_menu"
}

// 输出给前端的树形DTO（携带Children）
type MenuTreeDto struct {
	Key      string        `json:"key"`
	Label    string        `json:"label"`
	Type     string        `json:"type,omitempty"`
	Children []MenuTreeDto `json:"children,omitempty"`
}

type AddSysMenuDto struct {
	MenuKey  string
	Label    string
	Type     string
	ParentID int
}
