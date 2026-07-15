# 浅舟排盘

这是一个可直接发布到 GitHub Pages 的静态网站版本。

## 文件说明

- `index.html`：网站首页
- `style.css`：页面样式
- `app.js`：排盘、易经占卜、命理数据库等功能
- `.nojekyll`：让 GitHub Pages 按普通静态网站发布

## GitHub Pages 发布方法

1. 登录 GitHub。
2. 新建一个仓库，例如 `qianzhou-paipan`。
3. 把本文件夹里的所有文件上传到仓库根目录。
4. 进入仓库的 `Settings`。
5. 左侧选择 `Pages`。
6. `Build and deployment` 选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
7. 点击 `Save`。
8. 等 1-3 分钟，GitHub 会生成网站链接。

链接通常长这样：

`https://你的GitHub用户名.github.io/qianzhou-paipan/`

## 注意

命盘数据库使用浏览器本地存储。换手机、换浏览器、清理缓存后，已保存的命盘不会自动同步。
