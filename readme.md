# Tailwindcss + webpack 导出单个 html 文件

这是一个集合 tailwindcss、webpack 的项目模板，最终导出单个html。非常适合小型工具编写
使用。

### 1、编写代码

在 src 目录中的 app.js 文件中编写逻辑代码。在 app.css 文件中编写样式， 直接编写
tailwindcss 代码样式。在 app.ejs 中编写布局。

### 2、编译

所有代码编写完成后，可以运行 npm run build 进行编译。编译结果只有一个 html 文件，
所有的样式、JavaScript代码会全部打包在该html文件中。
