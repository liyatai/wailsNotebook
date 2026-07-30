package DB

import (
	"fmt"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB
var err error

func init() {
	// dsn := config.GetConfig("mysql.user") + ":" + config.GetConfig("mysql.password") + "@tcp(" + config.GetConfig("mysql.url") + ":" + config.GetConfig("mysql.port") + ")/" + config.GetConfig("mysql.name") + "?charset=utf8mb4&parseTime=True&loc=Local"
	dsn := "./notebook.db"
	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println(err)
	}
}
