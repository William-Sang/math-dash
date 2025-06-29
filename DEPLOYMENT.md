# 🚀 GitHub Pages 部署指南

Math Dash Mania 可以轻松部署到 GitHub Pages！这里提供了两种部署方法。

## 📋 准备工作

1. **确保你的 GitHub 仓库是公开的**（或者有 GitHub Pro 账户）
2. **确认仓库名称**：修改 `vite.config.ts` 中的 `base` 路径以匹配你的仓库名称

### 修改配置文件

在 `vite.config.ts` 中，将 `base` 路径更改为你的仓库名称：

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

例如，如果你的仓库名称是 `math-dash-game`，则应该是：
```typescript
base: process.env.NODE_ENV === 'production' ? '/math-dash-game/' : '/',
```

## 🤖 方法1：自动部署（推荐）

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 下选择 **GitHub Actions**

### 2. 推送代码

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### 3. 查看部署状态

- 在仓库的 **Actions** 标签中查看部署进度
- 部署完成后，你的应用将在 `https://your-username.github.io/your-repo-name/` 可用

## 🛠️ 方法2：手动部署

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 部署到 GitHub Pages

```bash
npm run deploy
```

这将自动：
- 构建项目
- 创建 `gh-pages` 分支
- 将构建文件推送到该分支

### 4. 配置 GitHub Pages

1. 进入 GitHub 仓库设置
2. 在 **Pages** 部分
3. 选择 **Deploy from a branch**
4. 选择 `gh-pages` 分支和 `/ (root)` 文件夹

## 🌐 访问你的应用

部署完成后，你的应用将在以下地址可用：
```
https://your-username.github.io/your-repo-name/
```

## 🔧 故障排除

### 常见问题

1. **404 错误**
   - 检查 `vite.config.ts` 中的 `base` 路径是否正确
   - 确认 GitHub Pages 已正确配置

2. **资源加载失败**
   - 确保所有资源路径都是相对路径
   - 检查构建后的文件路径

3. **路由问题**
   - GitHub Pages 不支持客户端路由的回退
   - 考虑使用 HashRouter 而不是 BrowserRouter

### 路由配置（可选）

如果遇到路由问题，可以在 `src/main.tsx` 中使用 HashRouter：

```tsx
import { HashRouter } from 'react-router-dom'

// 将 BrowserRouter 替换为 HashRouter
<HashRouter>
  <App />
</HashRouter>
```

## 📱 PWA 支持

项目已配置为 PWA（渐进式 Web 应用），部署后用户可以：
- 将应用添加到主屏幕
- 离线使用（基本功能）
- 享受原生应用般的体验

## 🎉 完成！

现在你的 Math Dash Mania 应用已经部署到 GitHub Pages，全世界的用户都可以访问和使用了！

---

**提示**：每次推送到 `main` 分支时，GitHub Actions 都会自动重新部署应用。 