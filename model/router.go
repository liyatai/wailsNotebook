package model

type RouteMap struct {
	ID      int    `gorm:"column:id;primaryKey"`
	Path    string `gorm:"column:path;unique;not null"`
	MenuID  int    `gorm:"column:menu_id"`
	Enabled int    `gorm:"column:enabled;default:1"`
}

func (RouteMap) TableName() string {
	return "route_map"
}
