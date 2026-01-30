# 吃什么 - AI 情绪饮食助手

根据你的心情，为你推荐最适合的美食。告别选择困难症！

## 功能特点

### 🤖 AI 虚拟陪伴
选择你喜欢的虚拟伙伴陪你选美食：
- **小桃（女生）** - 4种性格可选：温柔体贴、活泼可爱、高冷傲娇、甜美撒娇
- **小帅（男生）** - 4种性格可选：霸道总裁、阳光暖男、高冷男神、幽默搞笑

每种性格都有独特的说话风格和推荐语气，让选餐过程更有趣！

### 📋 情绪问卷
4步快速了解你的状态：
1. **虚拟伙伴** - 选择小桃或小帅陪你选餐
2. **性格偏好** - 选择喜欢的性格类型
3. **心情** - 开心、疲惫、焦虑、低落、平静、兴奋
4. **身体状态** - 非常饿、有点饿、不太饿、想吃零食
5. **口味偏好** - 咸的（正餐）、甜的（甜品）、都可以
6. **个人补充** - 自由输入特殊需求（如减肥、不吃辣等）

### 🍽️ 智能推荐
- 基于 DeepSeek AI 分析你的情绪状态
- 每次推荐 10-12 种适合的食物
- **高随机性** - 每次推荐都有新意，包含：
  - 地方特色小吃（羊肉泡馍、胡辣汤、螺蛳粉...）
  - 异国料理（泰式冬阴功、越南河粉、印度咖喱...）
  - 精致美食（和牛刺身、怀石料理、分子料理...）
  - 创意甜品（舒芙蕾、熔岩蛋糕、奇亚籽布丁...）

### 🎰 老虎机抽取
- 选择困难？一键随机抽取！
- 精美的老虎机动画效果
- 支持添加自定义食物到候选列表
- 抽中后彩带庆祝特效
- 显示食物健康信息、推荐搭配和健康提示

### 🏠 肚肚社区（v2.0 新增）
全新美食分享社区，与其他吃货一起交流：
- **钱包登录** - 支持 MetaMask、WalletConnect 等主流钱包
- **多链支持** - 支持 BSC、Ethereum、Polygon 网络
- **随机身份** - 自动生成有趣的随机用户名和头像
- **美食分享** - 分享你抽中的美食和心情
- **社交互动** - 点赞、评论其他用户的分享
- **隐私保护** - 仅显示钱包地址前后几位

### 📴 离线可用
- 内置丰富的模拟数据（每种心情约30种食物）
- 无需 API 也能使用
- 每次随机打乱，保证新鲜感

## 在线体验

👉 **https://www.wooodudu.com/**

## 项目结构

```
what-to-eat/
├── index.html          # 主页面（AI 推荐）
├── community.html      # 肚肚社区页面
├── app.html            # 应用独立页面
├── app.js              # 应用逻辑脚本
├── style.css           # 样式文件
├── api/                # 后端 API
│   ├── main.py         # FastAPI 社区服务
│   └── requirements.txt
├── assets/             # 静态资源
├── public/             # 公共文件
└── capacitor.config.json
```

## 快速开始

### 前端（静态页面）

```bash
# 方式1：直接打开
open index.html

# 方式2：启动本地服务器
npx serve .

# 方式3：使用 Python
python -m http.server 8000
```

### 后端（社区 API）

```bash
# 进入 api 目录
cd api

# 安装依赖
pip install -r requirements.txt

# 启动服务
python main.py
# 或使用 uvicorn
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## iOS 应用打包

项目使用 Capacitor 支持打包为 iOS 应用：

```bash
# 安装依赖
npm install

# 添加 iOS 平台
npm run cap:add:ios

# 同步代码到 iOS 项目
npm run cap:sync

# 在 Xcode 中打开
npm run cap:open
```

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML/CSS/JavaScript | 纯前端单页应用 |
| DeepSeek API | AI 智能推荐 |
| Capacitor | iOS 应用打包 |
| FastAPI | 社区后端 API |
| SQLite | 社区数据存储 |
| Web3Modal + ethers.js | 钱包连接 |
| WalletConnect v2 | 移动钱包支持 |

## API 配置

点击右上角 ⚙️ 设置按钮，可配置：

| 配置项 | 说明 |
|--------|------|
| DeepSeek API Key | 以 `sk-` 开头的密钥 |
| API 地址 | 默认 `https://api.deepseek.com`，可自定义 |

> 💡 不配置 API Key 也可使用，会自动切换到离线模式

## 社区 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/auth/wallet` | POST | 钱包登录/注册 |
| `/user/{wallet}` | GET | 获取用户信息 |
| `/user/{wallet}` | PUT | 更新用户信息 |
| `/posts` | GET | 获取帖子列表 |
| `/posts` | POST | 创建帖子 |
| `/posts/{id}` | DELETE | 删除帖子 |
| `/posts/{id}/like` | POST | 点赞/取消点赞 |
| `/posts/{id}/comments` | GET | 获取评论 |
| `/posts/{id}/comments` | POST | 发表评论 |

## 更新日志

### v2.0.0 (2026-01-30) 🎉
**新增「肚肚社区」功能**
- 新增 `community.html` 社区页面
- 新增 `api/main.py` 后端服务（FastAPI + SQLite）
- 支持钱包登录（MetaMask、WalletConnect、OKX 等）
- 支持多链：BSC、Ethereum、Polygon
- 自动生成随机用户名（如"快乐的小猫咪123"、"干饭美食家456"）
- 自动生成 DiceBear 风格头像
- 帖子功能：分享美食 + 心情 + emoji + 评论
- 社交互动：点赞、评论、查看他人分享
- 时间显示：智能转换为"刚刚"、"5分钟前"、"2小时前"等

**主应用优化**
- 优化主页面布局和样式
- 新增健康信息展示（营养价值、推荐搭配、健康提示）
- 增加 100+ 食物的健康数据库
- 优化 emoji 匹配算法，支持更多食物类型

### v1.1.0
- 增加食物推荐随机性
- API temperature 提高到 0.95
- 扩展离线食物池（每种心情约30种）
- 优化 AI prompt，推荐更多样化的食物

### v1.0.0
- 初始版本发布
- AI 虚拟陪伴功能
- 情绪问卷系统
- 老虎机抽取功能

## License

MIT
