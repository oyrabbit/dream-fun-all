package routes

import (
	"dream-fun-admin/api/v1"
	"dream-fun-admin/middleware"
	"dream-fun-admin/utils"
	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
)

func createMyRender() multitemplate.Renderer {
	p := multitemplate.NewRenderer()
	p.AddFromFiles("admin", "web/admin/dist/index.html")
	p.AddFromFiles("front", "web/front/dist/index.html")
	return p
}

func InitRouter() {
	gin.SetMode(utils.AppMode)
	r := gin.New()
	// 设置信任网络 []string
	// nil 为不计算，避免性能消耗，上线应当设置
	_ = r.SetTrustedProxies(nil)

	r.HTMLRender = createMyRender()
	r.Use(middleware.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.Cors())

	r.Static("/static", "./web/front/dist/static")
	r.Static("/admin", "./web/admin/dist")
	r.StaticFile("/favicon.ico", "/web/front/dist/favicon.ico")

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "front", nil)
	})

	r.GET("/admin", func(c *gin.Context) {
		c.HTML(200, "admin", nil)
	})

	/*
		后台管理路由接口
	*/
	auth := r.Group("api/v1")
	auth.Use(middleware.JwtToken())
	{
		// 用户模块的路由接口
		auth.GET("admin/users", v1.GetUsers)
		auth.PUT("user/:id", v1.EditUser)
		auth.DELETE("user/:id", v1.DeleteUser)
		//修改密码
		auth.PUT("admin/changepw/:id", v1.ChangeUserPassword)
		// 网站模块的路由接口
		auth.GET("admin/website", v1.GetWebsite)
		auth.POST("website/add", v1.AddWebsite)
		auth.PUT("website/:id", v1.EditWebsite)
		auth.DELETE("website/:id", v1.DeleteWebsite)
		// 分类模块的路由接口
		auth.GET("admin/category", v1.GetCate)
		auth.GET("admin/category/f", v1.GetCateByFid)
		auth.POST("category/add", v1.AddCategory)
		auth.PUT("category/:id", v1.EditCate)
		auth.DELETE("category/:id", v1.DeleteCate)

		// 分类模块的路由接口
		auth.GET("user/category", v1.GetCustomCategory)
		auth.POST("user/category/add/:username", v1.AddCustomCategory)
		auth.PUT("user/category/:id", v1.EditCustomCate)
		auth.DELETE("user/category/:id", v1.DeleteCustomCategory)

		// 网站模块的路由接口
		auth.GET("user/website", v1.GetWebsites)
		auth.POST("user/website/add/:username", v1.AddCustomWebsite)
		auth.PUT("user/website/:id/:username", v1.EditCustomWebsite)
		auth.DELETE("user/website/:id/:username", v1.DeleteCustomWebsite)

		// 大分类模块的路由接口
		auth.GET("admin/f_category", v1.GetFCate)
		auth.POST("f_category/add", v1.AddFCategory)
		auth.PUT("f_category/:id", v1.EditFCate)
		auth.DELETE("f_category/:id", v1.DeleteFCate)

		// 上传文件
		auth.POST("upload", v1.UpLoad)
		// 更新个人设置
		auth.GET("admin/profile/:id", v1.GetProfile)
		auth.PUT("profile/:id", v1.UpdateProfile)
	}

	/*
		前端展示页面接口
	*/
	router := r.Group("api/v1")
	{
		// 用户信息模块
		router.POST("user/add", v1.AddUser)
		router.GET("user/:id", v1.GetUserInfo)
		router.GET("users", v1.GetUsers)

		// 文章分类信息模块
		router.GET("category", v1.GetCate)
		router.GET("category/:id", v1.GetCateInfo)

		// 登录控制模块
		router.POST("login", v1.Login)
		router.POST("loginfront", v1.LoginFront)

		// 获取个人设置信息
		router.GET("profile/:id", v1.GetProfile)

		router.GET("category/all", v1.GetAllCate)

		router.GET("website/default/:id", v1.GetDefaultWebsite)
	}

	_ = r.Run(utils.HttpPort)

}
