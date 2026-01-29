# 吃什么 - AI 情绪饮食助手

根据你的心情，为你推荐最适合的美食。

## 功能特点

- **AI 虚拟陪伴** - 选择小柔(女生)或小帅(男生)陪你选美食，支持多种性格：温柔体贴、活泼可爱、高冷傲娇、霸道总裁等
- **情绪问卷** - 3步快速了解你的状态：心情 → 饥饿程度 → 个人偏好
- **智能推荐** - 基于 DeepSeek AI 分析你的情绪状态，推荐 10-12 种适合的食物
- **老虎机抽取** - 选择困难？一键随机抽取，支持添加自定义食物
- **离线可用** - 内置模拟数据，无需 API 也能使用

## 在线体验

👉 **https://www.wooodudu.com/**

## 快速开始

```bash
# 直接打开 index.html 即可使用
# 或启动本地服务器
npx serve .
```

## iOS 应用打包

项目使用 Capacitor 支持打包为 iOS 应用：

```bash
npm install
npm run cap:add:ios
npm run cap:sync
npm run cap:open  # 在 Xcode 中打开
```

## 技术栈

- 纯前端单页应用（HTML/CSS/JavaScript）
- DeepSeek API 提供 AI 推荐
- Capacitor 打包 iOS 应用

## 配置

点击右上角 ⚙️ 设置按钮，可配置：
- DeepSeek API Key
- API 地址（可选）

## License

MIT
