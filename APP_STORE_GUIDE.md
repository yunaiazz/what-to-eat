# 「吃什么」App Store 上架指南

## 项目结构

```
what-to-eat/
├── public/              # 网页源文件（打包用）
│   ├── index.html       # 主页面
│   └── privacy.html     # 隐私政策
├── assets/              # 资源文件
│   └── icon.png         # App 图标 (1024x1024)
├── package.json         # npm 配置
├── capacitor.config.json # Capacitor 配置
└── APP_STORE_GUIDE.md   # 本文档
```

## 一、准备工作

### 1. 需要的环境
- Mac 电脑（必须）
- Xcode 15+（从 App Store 免费下载）
- Node.js 18+
- Apple Developer 账号（$99/年）

### 2. 注册开发者账号
1. 访问 https://developer.apple.com/
2. 点击 "Account" 登录或注册 Apple ID
3. 加入 Apple Developer Program（$99/年）
4. 等待审核通过（通常 24-48 小时）

## 二、打包步骤

### 1. 在 Mac 上克隆项目
```bash
# 将项目文件夹复制到 Mac 上，或者通过 scp
scp -r root@你的服务器IP:/root/what-to-eat ~/Desktop/
cd ~/Desktop/what-to-eat
```

### 2. 安装依赖
```bash
npm install
```

### 3. 初始化 Capacitor（如果还没初始化）
```bash
npx cap init "吃什么" "com.chishenme.app" --web-dir=public
```

### 4. 添加 iOS 平台
```bash
npx cap add ios
```

### 5. 复制网页到 iOS 项目
```bash
npx cap copy ios
```

### 6. 打开 Xcode
```bash
npx cap open ios
```

## 三、Xcode 配置

### 1. 签名配置
1. 在 Xcode 左侧选择项目（蓝色图标）
2. 选择 "Signing & Capabilities" 标签
3. 勾选 "Automatically manage signing"
4. Team 选择你的开发者账号
5. Bundle Identifier 填写：`com.chishenme.app`

### 2. 设置 App 图标
1. 在 Xcode 中打开 `ios/App/App/Assets.xcassets`
2. 点击 `AppIcon`
3. 将 1024x1024 的图标拖入对应位置
4. 或使用在线工具生成所有尺寸：https://appicon.co/

### 3. 设置启动页
1. 打开 `ios/App/App/Assets.xcassets/Splash.imageset`
2. 添加启动页图片

### 4. Info.plist 配置
打开 `ios/App/App/Info.plist`，确保以下配置：

```xml
<key>CFBundleDisplayName</key>
<string>吃什么</string>
<key>CFBundleName</key>
<string>吃什么</string>
```

## 四、App Store Connect 配置

### 1. 创建 App
1. 登录 https://appstoreconnect.apple.com/
2. 点击 "我的 App" → "+" → "新建 App"
3. 填写信息：
   - 平台：iOS
   - 名称：吃什么
   - 主要语言：简体中文
   - 套装 ID：选择你的 Bundle ID
   - SKU：chishenme001

### 2. 填写 App 信息

#### 基本信息
- **副标题**：AI 情绪饮食助手
- **类别**：美食佳饮 / 健康健美
- **内容版权**：否

#### App 描述（简体中文）
```
「吃什么」是一款基于 AI 的智能饮食推荐应用，帮助你告别选择困难症！

主要功能：
🧠 情绪识别：通过简单的问答了解你当前的心情和状态
🍽️ 智能推荐：AI 根据你的情绪状态推荐最适合的美食
🎰 趣味抽取：老虎机式的抽取体验，让选择变得有趣
💡 科学依据：基于情绪饮食学，为不同心情匹配合适的食物

使用场景：
• 不知道吃什么的时候
• 心情低落想吃点治愈的食物
• 工作疲惫需要补充能量
• 想要尝试新口味

让 AI 帮你决定今天吃什么！
```

#### 关键词
```
吃什么,美食推荐,选择困难,AI推荐,情绪饮食,今天吃啥,随机美食,饮食助手,外卖推荐,美食
```

#### 技术支持网址
你的网站或 GitHub 页面

#### 隐私政策网址
部署 privacy.html 后的链接

### 3. 准备截图

需要准备以下尺寸的截图（3-5 张）：

| 设备 | 尺寸 |
|------|------|
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1242 x 2688 |
| iPhone 5.5" | 1242 x 2208 |
| iPad 12.9" | 2048 x 2732（如支持 iPad）|

**截图建议内容**：
1. 首页 - 心情选择界面
2. AI 分析中界面
3. 推荐结果界面
4. 老虎机抽取界面
5. 设置界面

## 五、提交审核

### 1. 构建并上传
1. 在 Xcode 中选择 "Any iOS Device (arm64)"
2. 菜单栏 → Product → Archive
3. 等待 Archive 完成
4. 点击 "Distribute App"
5. 选择 "App Store Connect" → "Upload"
6. 等待上传完成

### 2. 在 App Store Connect 提交
1. 回到 App Store Connect
2. 选择刚上传的构建版本
3. 填写"此版本的新增内容"
4. 点击"提交以供审核"

### 3. 审核注意事项

**常见拒审原因及解决**：

| 原因 | 解决方案 |
|------|----------|
| 需要登录但无法测试 | 提供演示账号或让 App 可以无 API Key 使用（本 App 已支持） |
| 缺少隐私政策 | 已提供 privacy.html |
| 功能过于简单 | 强调 AI 推荐功能的价值 |
| 元数据问题 | 检查描述、截图是否符合要求 |

## 六、审核通过后

1. 设置价格（免费或付费）
2. 选择上架国家/地区
3. 设置发布方式：
   - 手动发布
   - 自动发布
   - 定时发布

## 七、后续更新

每次更新代码后：

```bash
# 复制更新到 iOS 项目
npx cap copy ios

# 打开 Xcode
npx cap open ios

# 修改版本号后重新 Archive 并上传
```

## 联系方式

如有问题，可通过闲鱼找代上架服务，或联系开发者。

---

祝上架顺利！🎉
