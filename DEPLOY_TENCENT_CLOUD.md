# 气场小程序体验版腾讯云部署说明

## 本地运行

```bash
npm install
npm run dev
```

访问：

```text
http://localhost:3000/mini
```

如果本地使用 3001 端口：

```bash
npm run dev -- -p 3001
```

## 本地构建

```bash
npm run build
```

## Docker 本地测试

先准备 `.env.local`，不要提交真实 key：

```bash
AURA_AI_PROVIDER=deepseek
AURA_AI_API_KEY=your_real_key
AURA_AI_BASE_URL=https://api.deepseek.com
AURA_AI_MODEL=deepseek-chat
TENCENT_DEPLOY_TARGET=cloudbase
```

构建并运行：

```bash
docker build -t aura-mini .
docker run -p 3000:3000 --env-file .env.local aura-mini
```

访问：

```text
http://localhost:3000/mini
http://localhost:3000/api/health
```

## 腾讯云 CloudBase 云托管部署

1. 登录腾讯云控制台。
2. 进入 CloudBase 云开发。
3. 创建或选择一个云开发环境。
4. 进入云托管。
5. 新建服务，选择 Dockerfile 部署。
6. 代码仓库选择当前项目仓库，或上传项目代码。
7. 服务端口填写 `3000`。
8. 配置环境变量：
   - `AURA_AI_PROVIDER=deepseek`
   - `AURA_AI_API_KEY=真实 API Key`
   - `AURA_AI_BASE_URL=https://api.deepseek.com`
   - `AURA_AI_MODEL=deepseek-chat`
   - `TENCENT_DEPLOY_TARGET=cloudbase`
9. 确认 Dockerfile 构建并部署。
10. 部署完成后获取公网访问域名。

健康检查：

```text
https://你的域名/api/health
```

H5 页面：

```text
https://你的域名/mini
```

## 微信小程序 WebView 接入

当前先使用 H5 / WebView 体验版，不做原生小程序。

小程序中使用 `web-view` 打开 CloudBase 域名：

```xml
<web-view src="https://你的域名/mini" />
```

注意：

- 域名必须是 HTTPS。
- 需要在微信公众平台配置业务域名。
- 需要按微信要求上传业务域名校验文件。
- 推荐 H5 路径固定为 `https://你的域名/mini`。

## 后续迁移原生小程序

当前页面、流程和 API 都先以 WebView 方式复用。

后续如迁移到原生小程序，需要：

- 将 `/mini` 的 UI 迁移到微信小程序组件。
- 保留当前 `/api/aura/*` 服务端接口。
- 小程序端通过 `wx.request` 调用接口。
- 支付能力替换当前模拟支付逻辑。

## 安全与限制

- API Key 只能配置在腾讯云 CloudBase 环境变量中。
- 不要把 `.env.local` 提交到仓库。
- 前端只调用 `/api/aura/*`，不能直接调用 AI API。
- API Routes 已限制输入长度：
  - 今日测试：最大 5000 字符
  - 完整档案：最大 8000 字符
  - 众生故事：最大 6000 字符
- AI 失败时保留 mock 兜底，不影响体验。
- 不要在日志里打印 API Key。
