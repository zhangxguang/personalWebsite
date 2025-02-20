# 个人网站部署指南

## 1. 服务器环境配置

### 1.1 安装 Node.js
```bash
# 使用 nvm 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### 1.2 安装 Nginx
```bash
sudo apt update
sudo apt install nginx
```

### 1.3 安装 MongoDB（如果需要）
```bash
# 导入 MongoDB 公钥
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 添加 MongoDB 源
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 安装 MongoDB
sudo apt update
sudo apt install mongodb-org
```

## 2. 项目部署

### 2.1 安装 PM2
```bash
npm install -g pm2
```

### 2.2 部署前端项目
```bash
# 克隆项目
git clone [你的项目地址]
cd personalWebsite

# 安装依赖
npm install

# 构建项目
npm run build

# 将构建后的文件移动到 Nginx 目录
sudo cp -r dist/* /var/www/html/
```

### 2.3 配置 Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2.4 配置 SSL 证书（使用 Let's Encrypt）
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取并安装证书
sudo certbot --nginx -d your-domain.com
```

## 3. 环境变量配置

创建 .env 文件：
```env
VITE_API_BASE_URL=https://your-domain.com/api
```

## 4. 启动服务

```bash
# 重启 Nginx
sudo systemctl restart nginx

# 使用 PM2 启动后端服务（如果有）
pm2 start server.js
```

## 5. 维护指南

### 5.1 日常维护
- 定期更新系统包：`sudo apt update && sudo apt upgrade`
- 监控服务器状态：`htop`, `df -h`
- 查看日志：`pm2 logs`, `sudo tail -f /var/log/nginx/error.log`

### 5.2 备份策略
- 数据库备份（如果使用）
- 代码版本控制
- 配置文件备份

### 5.3 更新部署
```bash
# 拉取最新代码
git pull

# 安装依赖
npm install

# 构建项目
npm run build

# 更新部署
sudo cp -r dist/* /var/www/html/
```

## 6. Docker 环境配置

### 6.1 安装 Docker
```bash
# 卸载旧版本 Docker（如果存在）
yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine

# 安装必要的依赖包
yum install -y yum-utils device-mapper-persistent-data lvm2

# 添加 Docker 仓库
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker 引擎
yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker 服务
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 6.2 配置 Docker
```bash
# 将当前用户添加到 docker 用户组
usermod -aG docker $USER

# 创建 Docker 配置目录
mkdir -p /etc/docker

# 配置镜像加速器
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "data-root": "/var/lib/docker",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
EOF

# 重启 Docker 服务
systemctl daemon-reload
systemctl restart docker
```

### 6.3 验证安装
```bash
# 配置镜像加速器
sudo mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
EOF

# 重启Docker服务以应用配置
sudo systemctl daemon-reload
sudo systemctl restart docker

# 检查 Docker 版本
docker --version
docker-compose --version

# 验证 Docker 是否正常运行
docker run hello-world

# 查看 Docker 服务状态
systemctl status docker
```

### 6.4 常用 Docker 命令
```bash
# 查看所有容器
docker ps -a

# 查看所有镜像
docker images

# 停止所有运行中的容器
docker stop $(docker ps -q)

# 删除所有停止的容器
docker container prune

# 删除未使用的镜像
docker image prune -a

# 查看 Docker 系统资源使用情况
docker system df

# 查看容器日志
docker logs [容器ID或名称]

# 进入容器内部
docker exec -it [容器ID或名称] /bin/bash

# 构建镜像
docker build -t [镜像名称]:[标签] .

# 推送镜像到仓库
docker push [镜像名称]:[标签]
```

### 6.5 Docker 安全配置
```bash
# 定期更新 Docker
yum update docker-ce docker-ce-cli containerd.io

# 限制容器资源使用
docker run -d \
  --name my-container \
  --memory="512m" \
  --cpus="1.0" \
  --pids-limit=100 \
  your-image

# 配置容器网络隔离
docker network create --driver bridge isolated_network
docker run --network isolated_network your-image
```