package service

import (
	"errors"
	"notebook/DB"
	"notebook/model"

	"gorm.io/gorm"
)

// GetMenuIdByPath 根据路由path查询对应的菜单ID
func GetMenuIdByPath(path string) (int, error) {
	var route model.RouteMap
	err := DB.DB.Where("path = ? AND enabled = 1", path).First(&route).Error
	if err != nil {
		// 记录不存在 返回0，无错误，前端区分用
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, nil
		}
		return 0, err
	}
	return route.MenuID, nil
}
