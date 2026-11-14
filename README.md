# 冯先生 AI工程实验室 · 静态网站

纯静态站点，不需要数据库、Node.js、PHP 或任何后端环境；文案集中在 `content/site.json`，配 `admin/` 可视化后台，改完 1 分钟上线。
**部署与后台的完整步骤见 [部署说明.md](部署说明.md)。**

## 目录结构

```text
index.html          页面骨架（内容由 js/main.js 渲染）
css/styles.css      全站样式
js/main.js          渲染层
content/site.json   ★ 全站文案（后台改这个）
content/site.js     同一份内容的 JS 版本（file:// 直开兜底 + 首屏秒渲染）
admin/index.html    可视化内容后台
assets/             logo、图标、3 张小程序码（当前为占位图）
404.html robots.txt sitemap.xml
```

## 本地预览

```bash
python -m http.server 8123
```

打开 <http://localhost:8123/>。也可直接双击 `本地预览.bat`。

## 上线（域名未备案）

走 **Cloudflare Pages**：GitHub 仓库 → Pages Connect to Git（Framework None、Build command 留空、输出目录 `/`）→ 域名 NS 交给 Cloudflare 或加 CNAME。全程免备案、自动 HTTPS。

## 上线后必换的素材

- [ ] `assets/qr-little-helper.svg`（主推：冯先生的小助手）、`assets/qr-assistant.svg`、`assets/qr-quantity.svg` → 真实小程序码
- [ ] `assets/avatar-placeholder.svg` → 个人职业照

换图后记得同步 `content/site.json` 里 `contact.qrCards[].img` 与 `about.portrait` 的路径（后台可直接改）。

## 发布前检查

- 手机 / 电脑端首屏与产品区是否正常
- 三张小程序码能否扫码进入
- 邮箱、电话、网址是否正确
- 域名 HTTPS 是否生效
- 首页标题、描述、分享封面是否符合公开展示需求
- 若不准备公开电话，可在 `contact.contactInfo` 删掉电话项
