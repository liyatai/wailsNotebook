package service

import (
	"encoding/base64"
	"errors"
	"fmt"
	"notebook/DB"
	"notebook/model"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// AddErrorQuestion 新增错题
// 逻辑：接收base64 → 创建时间戳文件夹 → 保存题目、答案图片 → 获取路径 → 入库
func AddErrorQuestion(req model.AddErrorQuestionReq) (uint, error) {

	// fmt.Println(req.AnswerBase)
	// 当前错题唯一文件夹名称：毫秒时间戳 int64
	ts := time.Now().UnixMilli()
	subDir := filepath.Join("img", fmt.Sprintf("%d", ts))

	var questionPath string
	var answerPath string
	var err error

	// 如果传入题目base64，保存图片
	if req.QuestBase != "" {
		questionPath, err = saveImageByBase64(req.QuestBase, subDir, "question")
		if err != nil {
			return 0, err
		}
	}

	// 如果传入答案base64，保存图片
	if req.AnswerBase != "" {
		answerPath, err = saveImageByBase64(req.AnswerBase, subDir, "answer")
		if err != nil {
			return 0, err
		}
	}

	// 组装数据库实体
	// model.SysErrorQuestion 内嵌gorm.Model，自动填充created_at、updated_at，无需手动赋值
	entity := model.SysErrorQuestion{
		MenuID:      req.MenuID,
		QuestionImg: questionPath,
		AnswerImg:   answerPath,
		Remark:      req.Remark,
		MasterLevel: req.MasterLevel,
		Enabled:     1,
	}

	err = DB.DB.Create(&entity).Error
	if err != nil {
		return 0, err
	}
	return entity.ID, nil
}

// GetErrorQuestionByMenuId 根据菜单ID查询对应所有错题
func GetErrorQuestionByMenuId(menuId uint) ([]model.SysErrorQuestion, error) {
	var list []model.SysErrorQuestion

	// MenuID匹配，排除软删除，创建时间倒序
	err := DB.DB.
		Where("menu_id = ?", menuId).
		Order("created_at DESC").
		Find(&list).Error
	if err != nil {
		return nil, err
	}

	// 遍历替换路径中的反斜杠 \ → /
	for i := range list {
		list[i].QuestionImg = strings.ReplaceAll(list[i].QuestionImg, "\\", "/")
		list[i].AnswerImg = strings.ReplaceAll(list[i].AnswerImg, "\\", "/")
	}

	return list, nil
}

// GetAllValidErrorQuestion 获取所有有效错题（未软删除、启用状态）
func GetAllValidErrorQuestion() ([]model.SysErrorQuestion, error) {
	var list []model.SysErrorQuestion

	err := DB.DB.
		Where("deleted_at IS NULL AND enabled = 1").
		Order("created_at DESC").
		Find(&list).Error
	if err != nil {
		return nil, err
	}

	// 统一路径分隔符：Windows反斜杠 \ 转为 前端通用正斜杠 /
	for i := range list {
		list[i].QuestionImg = filepath.ToSlash(list[i].QuestionImg)
		list[i].AnswerImg = filepath.ToSlash(list[i].AnswerImg)
	}
	fmt.Println(list)
	return list, nil
}

// DeleteErrorQuestionById 根据ID物理删除错题，并删除本地图片资源
func DeleteErrorQuestionById(id uint) error {
	var eq model.SysErrorQuestion
	// 先查询这条记录
	err := DB.DB.First(&eq, id).Error
	if err != nil {
		return err
	}

	// 删除图片文件夹：图片路径格式 upload/img/时间戳/xxx.png
	var folderPath string
	if eq.QuestionImg != "" {
		folderPath = filepath.Dir(eq.QuestionImg)
	} else if eq.AnswerImg != "" {
		folderPath = filepath.Dir(eq.AnswerImg)
	}

	// 如果文件夹存在，删除整个目录
	if folderPath != "" {
		_ = os.RemoveAll(folderPath)
	}

	// 【改动】原生SQL物理删除，绕过GORM软删除机制
	err = DB.DB.Exec("DELETE FROM sys_error_question WHERE id = ?", id).Error
	return err
}

// DeleteMenuById 根据ID物理删除子菜单
func DeleteMenuById(id uint) error {
	var menu model.SysMenu
	// 查询菜单记录
	err := DB.DB.First(&menu, id).Error
	if err != nil {
		return err
	}

	// 原生SQL物理删除
	err = DB.DB.Exec("DELETE FROM sys_menu WHERE id = ?", id).Error
	return err
}

// saveImageByBase64 内部图片保存方法
// base64Str: 完整带前缀base64 data:image/png;base64,xxxx
// subDir: upload下级子目录 例如 img/1754412312123
// tag: 文件名标识 question / answer
// return: 文件相对路径 upload/img/1754412312123/question.png
func saveImageByBase64(base64Str string, subDir string, tag string) (string, error) {
	parts := strings.Split(base64Str, ",")
	if len(parts) != 2 {
		return "", errors.New("base64格式错误，缺少前缀data:image")
	}
	prefix := parts[0]
	imgData, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return "", err
	}

	// 根据图片前缀自动识别后缀
	var ext string
	switch {
	case strings.Contains(prefix, "image/jpeg"):
		ext = ".jpg"
	case strings.Contains(prefix, "image/gif"):
		ext = ".gif"
	case strings.Contains(prefix, "image/webp"):
		ext = ".webp"
	default:
		ext = ".png"
	}

	// 目标文件夹 upload/img/xxx
	targetDir := filepath.Join("upload", subDir)
	// 创建多级目录
	err = os.MkdirAll(targetDir, 0755)
	if err != nil {
		return "", err
	}

	fileName := fmt.Sprintf("%s%s", tag, ext)
	fullSavePath := filepath.Join(targetDir, fileName)

	// 写入文件
	err = os.WriteFile(fullSavePath, imgData, 0644)
	if err != nil {
		return "", err
	}

	// 返回数据库存储的相对路径
	relPath := filepath.Join("upload", subDir, fileName)
	return relPath, nil
}
