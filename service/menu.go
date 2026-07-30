package service

import (
	"fmt"
	"notebook/DB"
	"notebook/model"
	"strings"
)

// GetMenuTree 获取树形菜单（给前端动态渲染Antd Menu）
func GetMenuTree() ([]model.MenuTreeDto, error) {
	var list []model.SysMenu
	err := DB.DB.Order("sort asc").Find(&list).Error
	if err != nil {
		return nil, err
	}

	// id -> 菜单映射
	menuMap := make(map[int]*model.SysMenu)
	for i := range list {
		menuMap[int(list[i].ID)] = &list[i]
	}

	var tree []model.MenuTreeDto
	// 筛选一级菜单 parent_id=0
	for _, item := range list {
		if item.ParentID == 0 {
			tree = append(tree, buildChildren(item, menuMap))
		}
	}
	return tree, nil
}

// 递归构建子节点
func buildChildren(node model.SysMenu, allMap map[int]*model.SysMenu) model.MenuTreeDto {
	dto := model.MenuTreeDto{
		Key:   node.MenuKey,
		Label: node.Label,
		Type:  node.MenuType,
	}
	// 查找所有子菜单
	for _, child := range allMap {
		if child.ParentID == int(node.ID) {
			dto.Children = append(dto.Children, buildChildren(*child, allMap))
		}
	}
	return dto

}

// GetFirstLevelMenuOption 获取一级菜单（parent_id=0）
func GetFirstLevelMenuOption() ([]model.SelectOption, error) {
	// 黑名单label，直接写数组
	blackList := []string{"数据管理", "菜单管理", "刷新数据"}

	var list []model.SysMenu
	err := DB.DB.
		Where("parent_id = ? AND enabled = ?", 0, 1).
		Order("sort asc").
		Find(&list).Error
	if err != nil {
		return nil, err
	}

	var options []model.SelectOption
	for _, item := range list {
		// 判断当前label是否在黑名单
		isBlack := false
		for _, blackName := range blackList {
			if item.Label == blackName {
				isBlack = true
				break
			}
		}
		if isBlack {
			continue
		}
		options = append(options, model.SelectOption{
			Label: item.Label,
			Value: item.ID,
		})
	}
	return options, nil
}

// GetSecondLevelMenuOption 根据一级菜单ID查询二级菜单
func GetSecondLevelMenuOption(parentId uint) ([]model.SelectOption, error) {
	var list []model.SysMenu
	err := DB.DB.
		Where("parent_id = ? AND enabled = ?", parentId, 1).
		Order("sort asc").
		Find(&list).Error
	if err != nil {
		return nil, err
	}

	var options []model.SelectOption
	for _, item := range list {
		options = append(options, model.SelectOption{
			Label: item.Label,
			Value: item.ID,
		})
	}
	return options, nil
}

// AddSysMenu 新增菜单
func AddSysMenu(dto model.AddSysMenuDto) error {
	if dto.ParentID == 0 {
		return fmt.Errorf("不允许新增一级菜单")
	}

	pathParts := strings.Split(dto.MenuKey, "/")
	if len(pathParts) < 3 {
		return fmt.Errorf("路由格式错误，正确示例：/父ID/子路由")
	}

	// 查询父菜单
	var parentMenu model.SysMenu
	parentIdStr := pathParts[1]
	if err := DB.DB.Where("id = ?", parentIdStr).First(&parentMenu).Error; err != nil {
		return fmt.Errorf("未查询到父菜单: %w", err)
	}

	childPath := strings.Join(pathParts[2:], "/")
	newMenuKey := fmt.Sprintf("%s/%s", parentMenu.MenuKey, childPath)

	menu := model.SysMenu{
		ParentID: dto.ParentID,
		MenuKey:  newMenuKey,
		Label:    dto.Label,
		MenuType: "menu",
		Enabled:  1,
	}

	// ========== 开启事务，保证两张表原子操作 ==========
	tx := DB.DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// 1. 先创建菜单
	if err := tx.Create(&menu).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 2. 同步插入 route_map
	route := model.RouteMap{
		Path:    newMenuKey,   // 访问路径，和前端路由一致
		MenuID:  int(menu.ID), // 刚插入菜单的ID
		Enabled: 1,
	}
	if err := tx.Create(&route).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("创建路由映射失败: %w", err)
	}

	// 提交事务
	return tx.Commit().Error
}
