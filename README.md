# 计算器开发文档

## 环境要求

### 后端
- Go 1.24+ 
- 运行环境：Windows/amd64

### 前端
- Node.js 20.13.0+
- npm 10.9.2+

## 项目启动

### 后端服务  8080端口
1.进入项目目录
```bash 
cd .\calculatorBackend\example
```
2.启动服务
```bash 
go run main.go
```
### 前端服务 3000端口
1.进入项目目录
```bash 
cd .\frontend\
```
2.安装依赖（首次运行需要）
```bash 
npm install
```
3.启动服务

```bash 
npm run dev # 开发模式
next build && next start # 生产构建
```



![image-20250429174606774](C:\Users\Admin\AppData\Roaming\Typora\typora-user-images\image-20250429174606774.png)
