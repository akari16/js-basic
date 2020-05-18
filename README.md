# myTemplate

---
备注：
- 项目使用nodejs:express搭建本地服务器

---


目录结构

- bin                   项目端口配置
- node_modules          node相关包目录
- public                项目静态资源文件
- - html5               运维平台html界面和相关代码都在里面
- - images              本地服务器自带目录，与业务代码无关，不用管
- - javascripts         本地服务器自带目录，与业务代码无关，不用管
- - stylesheets         本地服务器自带目录，与业务代码无关，不用管
- routes                express自带路由，映射页面，与业务代码无关，不用管
- views                 express自带页面模板，映射页面，与业务代码无关，不用管
- package.json          项目依赖以及配置文件
- nodemon.json          nodejs自启动，无需重新启动服务器才能看到修改效果，可以直接刷新界面查看修改效果
- readme.md             项目说明文件
- yarn.lock             项目安装方式 yarn add



---

启动项目命令 : 
- - yarn auto
- - 访问首页
http://localhost:8081/html/index.html
