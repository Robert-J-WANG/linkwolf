# Develop Steps:

## Section 1 : Pipeline Setup / Mop

### 1.  project init

- create github repository
- clone the project to the local

```bash
git clone https://github.com/Robert-J-WANG/linkwolf.git
```

- Enter the project root directory

```bash
cd linkwolf
```

- create directories and files

```bash
mkdir backend
mkdir frontend
touch .gitignore
```

- Init project

```bash
npm init -y	
```

### 2. backend setup

- switch to the bachend directory

```bash
cd bachend
```

- Init backend

```bash
npm init -y
```

- Install  express framework 

```bash
npm install express
```

- install tpyescript for development 

```bash
npm install -D typescript @types/node @types/express ts-node ts-node-dev
```

- setup ts config 

```bash
npx tsc --init
```

- Edit content of tsconfig file 

```json
# backend/tsconfig.json

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- create app.ts

```
mkdir src
cd src
touch app.ts
```

- Edit content of app.ts file 

```ts
// backend/src/app.ts

import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
       message: "Backend is running!",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
```

- edit script for run the server in package.json 

```json
// backend/package.json

{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  }
}
```

- Test the server port

```bash
npm run dev
# 访问 http://localhost:3001/health 确认工作

{
  "status": "OK",
  "message": "Backend is running!",
  "timestamp": "2025-09-12T23:47:45.780Z"
}
```

#### 3. Frontend setup

create frontend next app 

```bash
// cd frontend

npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
cd frontend
```

Run next app

```bash
cd frontend
npm run dev

# 访问 http://localhost:3000/ 确认frontend page rendering
```

#### 4. End to end communication

fix browser cross-origin: backend install lib and types

```bash
// cd backend

npm i cors --save-dev @types/cors       
```

Edit backend app.ts file to use cors

```ts
// backend/src/app.ts

import express from "express";
// 引入 cors 中间件 - 解决浏览器跨域问题
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(express.json());
// 使用 CORS 中间件，允许跨域请求
app.use(cors());
...
```

install axios for http request

```bash
// cd frontend

npm i axios
```

Endit content of the page.tsx file, useing axios to fetch data from backend server port

```tsx
// frontend/src/page.tsx

"use client"; // 声明为客户端组件
import { useState, useEffect } from "react"; // React 的状态和副作用钩子
import axios from "axios"; // 用于发起 HTTP 请求

// 定义后端健康检查接口返回的数据类型
type HealthData = {
  status: string; // 服务状态
  message: string; 
  timestamp: string; // 时间戳
};

export default function Home() {
  // healthData 用于保存后端健康检查数据，loading 表示加载状态
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL ="http://localhost:3001";
    axios
      .get(`${API_URL}/health`)
      .then((response) => {
        setHealthData(response.data); // 保存后端返回数据
        setLoading(false); // 设置加载完成
      })
      .catch((error) => {
        console.error("Failed to connect to backend:", error); // 连接失败处理
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">LinkWolf</h1>
        <p className="text-gray-600 mb-8">个人链接分享平台</p>

        {/* 显示后端连接状态 */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">后端连接状态</h3>
          {loading ? (
            <p className="text-gray-500">连接中...</p> // 加载中
          ) : healthData ? (
            <div className="text-green-600">
              <p>✅ 后端连接成功</p>
              <p className="text-sm mt-2">状态: {healthData.status}</p>
              <p className="text-sm">信息: {healthData.message}</p>
              <p className="text-sm">
                时间: {new Date(healthData.timestamp).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-red-600">❌ 后端连接失败</p> // 连接失败
          )}
        </div>
      </div>
    </main>
  );
}

```

Test end-to-end communication

```bash
# cd backend

npm run dev

# 访问 http://localhost:3001/health 确认工作server port data

{
  "status": "OK",
  "message": "Backend is running!",
  "timestamp": "2025-09-12T23:47:45.780Z"
}
```

```bash
# cd frontend

npm run dev

# 访问 http://localhost:3000/ 确认frontend page rendering
```

#### 5. Docker setup

- Create frontend Docker file ` ./frontend/Dockerfile`

```dockerfile
# 使用轻量级的 Node 18 官方镜像（alpine 版）作为基础镜像
FROM node:18-alpine

# 在容器内创建并切换到工作目录 /app
WORKDIR /app

# 将 package.json 与 package-lock.json（若存在）复制到容器的当前工作目录
# 这样可以利用 Docker 缓存加速依赖安装步骤
COPY package*.json ./

# 在容器内安装项目依赖
RUN npm ci

# 复制当前项目所有文件到容器工作目录（注意：.dockerignore 可控制要排除的文件）
COPY . .

# 声明容器将监听的端口（便于运行时和编排工具识别）
EXPOSE 3000

# 容器启动时执行的命令，这里运行 Next.js/前端开发服务器的 dev 脚本
CMD ["npm", "run", "dev"]
```

- Create backend docker file ` ./backend/Dockerfile`

```dockerfile
# 使用轻量级的 Node 18 官方镜像（alpine 版）作为基础镜像
FROM node:18-alpine

# 在容器内创建并切换到工作目录 /app
WORKDIR /app

# 将 package.json 与 package-lock.json（若存在）复制到容器的当前工作目录
# 以便利用缓存优化依赖安装步骤
COPY package*.json ./

# 在容器内安装后端项目的依赖
RUN npm ci

# 复制当前项目所有文件到容器工作目录（请使用 .dockerignore 排除不必要文件）
COPY . .

# 声明容器将监听的端口（后端默认使用 3001）
EXPOSE 3001

# 容器启动时执行的命令，这里运行后端开发脚本
CMD ["npm", "run", "dev"]
```

- Create docker-compose.dev.yaml ` ./docker-compose.dev.yaml`

```yaml
 # Docker Compose 开发环境配置：同时启动 frontend 与 backend，用于本地开发
version: '3.8'
services:
  # 后端服务（开发）
  backend:
    # 指定构建上下文和要使用的开发 Dockerfile
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    # 端口映射（宿主机:容器）
    ports:
      - "3001:3001"
    # 挂载本地源代码以便热重载，第二个条目保留容器内的 node_modules
    volumes:
      - ./backend:/app
      - /app/node_modules

  # 前端服务（开发）
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    # 端口映射（宿主机:容器）
    ports:
      - "3000:3000"
    # 挂载本地前端代码并保留容器内的 node_modules 用于一致的依赖环境
    volumes:
      - ./frontend:/app
      - /app/node_modules
    # 前端启动依赖后端服务（注意：depends_on 仅保证启动顺序，不保证服务健康）
    depends_on:
      - backend
```

- create docker running scripts ` ./package.json`

```json
{
  "name": "linkwolf",
  "private": true,
  "scripts": {
    "dev": "docker-compose -f docker-compose.dev.yml up --build",
    "dev:down": "docker-compose -f docker-compose.dev.yml down",
    "clean": "docker system prune -f && docker volume prune -f"
  }
}
```

- Test the end to end communication using Docker : make sure the docker is running

```bash
# cd linkwolf
npm run dev

# frontend: http://localhost:3000/
# backend: http://localhost:3001/health
```

#### 6. Create git branch, update to remote repository

edit .gitignore file

```bash
# Dependencies
node_modules/
npm-debug.log*

# Environment files
.env
.env.*
!env/.env.*

# Build outputs
dist/
.next/
out/

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore

# Logs
logs/
*.log
```

Create  feature branch and update

```bash
git checkout -b chore/1-project-init
git add .
git commit -m 'project init'
git push remote origin chore/1-project-init
```



