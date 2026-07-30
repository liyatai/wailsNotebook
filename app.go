package main

import (
	"context"
	"notebook/model"
	"notebook/service"
)

// App Wails应用主结构体
// 所有绑定给前端JS调用的方法，都定义在此结构体上
type App struct {
	ctx context.Context // Wails运行时上下文，框架内部使用

}

// NewApp 创建App实例，Wails框架自动调用
func NewApp() *App {
	return &App{}
}

// startup 应用启动生命周期钩子
// Wails程序启动时自动执行，保存全局上下文，供框架内部API使用
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// GetMenuTree 获取完整菜单树形结构
// 【前端调用方式】window.go.App.GetMenuTree()
// 返回：组装好的树形菜单，用于页面菜单渲染
func (a *App) GetMenuTree() ([]model.MenuTreeDto, error) {
	return service.GetMenuTree()
}

// AddErrorQuestion 新增错题记录【核心业务接口】
// 【前端调用方式】window.go.App.AddErrorQuestion(reqObject)
// req：前端传递错题结构体（菜单ID、题目图片路径、答案图片路径等）
// return：成功返回新增记录数据库主键ID，失败返回error
func (a *App) AddErrorQuestion(req model.AddErrorQuestionReq) (uint, error) {
	return service.AddErrorQuestion(req)
}

// GetFirstLevelMenuOption 获取一级菜单下拉选项
// 【前端调用方式】window.go.App.GetFirstLevelMenuOption()
// 用途：新增错题页面，级联下拉第一个选择框（一级菜单）
// 返回：适配antd Select组件的选项数组
func (a *App) GetFirstLevelMenuOption() ([]model.SelectOption, error) {
	return service.GetFirstLevelMenuOption()
}

func (a *App) GetAllValidErrorQuestion() ([]model.SysErrorQuestion, error) {
	return service.GetAllValidErrorQuestion()
}

func (a *App) DeleteErrorQuestionById(id uint) error {
	return service.DeleteErrorQuestionById(id)
}

func (a *App) DeleteMenuById(id uint) error {
	return service.DeleteMenuById(id)
}

// GetSecondLevelMenuOption 根据一级菜单ID查询二级菜单
// 【前端调用方式】window.go.App.GetSecondLevelMenuOption(parentId)
// parentId：一级菜单id
// 用途：一级菜单选中后，动态加载二级下拉列表
func (a *App) GetSecondLevelMenuOption(parentId uint) ([]model.SelectOption, error) {
	return service.GetSecondLevelMenuOption(parentId)
}
func (a *App) GetErrorQuestionByMenuId(menuId uint) ([]model.SysErrorQuestion, error) {
	return service.GetErrorQuestionByMenuId(menuId)
}

// AddSysMenu 新增菜单
func (a *App) AddSysMenu(menu model.AddSysMenuDto) error {
	return service.AddSysMenu(menu)
}

// GetMenuIdByPath 根据路由path查询对应的菜单ID
func (a *App) GetMenuIdByPath(path string) (int, error) {
	return service.GetMenuIdByPath(path)
}
