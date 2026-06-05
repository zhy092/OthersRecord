# Hermes Agent 完整安装使用教程

> 📦 一个功能强大的开源 CLI AI 助手，由 Nous Research 开发
> 
> ✨ 支持文件操作、终端命令、网页浏览、定时任务、多平台消息集成

---

## 📋 目录

1. [什么是 Hermes Agent](#1-什么是-hermes-agent)
2. [系统要求](#2-系统要求)
3. [快速安装](#3-快速安装)
4. [手动安装](#4-手动安装)
5. [初始配置](#5-初始配置)
6. [基本使用](#6-基本使用)
7. [CLI 命令行使用详解](#7-cli-命令行使用详解)
8. [核心功能与实际使用案例](#8-核心功能与实际使用案例)
9. [高级配置](#9-高级配置)
10. [技能系统](#10-技能系统)
11. [常见问题](#11-常见问题)

---

## 1. 什么是 Hermes Agent

Hermes Agent 是一个开源的命令行 AI 助手，可以：

- 🔧 **执行终端命令** - 帮你运行脚本、管理文件、部署应用
- 📁 **操作文件系统** - 读取、写入、搜索、编辑文件
- 🌐 **浏览网页** - 访问网站、提取内容、截图分析
- 📅 **定时任务** - 设置 cron 任务自动执行
- 💬 **多平台集成** - 连接 Telegram、Discord、WhatsApp 等
- 🧩 **技能扩展** - 安装社区技能扩展功能

---

## 2. 系统要求

### 支持的操作系统

| 系统 | 支持情况 |
|------|----------|
| Linux | ✅ 完全支持 |
| macOS | ✅ 完全支持 |
| Windows | ⚠️ 需要 WSL2 |
| WSL2 | ✅ 完全支持 |
| Android (Termux) | ⚠️ 参考专门指南 |

### 硬件要求

- **内存**: 最低 2GB，推荐 4GB+
- **磁盘**: 至少 1GB 可用空间
- **网络**: 需要访问 LLM API

### 前置依赖

唯一需要手动安装的是 **Git**：

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt update && sudo apt install git

# Fedora/RHEL
sudo dnf install git
```

> 💡 其他依赖（Python、Node.js、ripgrep、ffmpeg）安装程序会自动处理

---

## 3. 快速安装（推荐）

### 一步安装命令

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### 安装过程

安装程序会自动完成：

1. ✅ 检测并安装缺失的依赖（Python 3.11、Node.js v22、ripgrep、ffmpeg）
2. ✅ 克隆 Hermes Agent 仓库
3. ✅ 创建 Python 虚拟环境
4. ✅ 安装所有 Python 依赖
5. ✅ 设置全局 `hermes` 命令
6. ✅ 运行交互式配置向导

### 安装后

```bash
# 重新加载 shell 配置
source ~/.bashrc    # 或 source ~/.zshrc

# 如果安装时跳过了配置，运行：
hermes setup

# 启动 Hermes
hermes
```

---

## 4. 手动安装

如果你需要完全控制安装过程：

### 步骤 1：克隆仓库

```bash
git clone --recurse-submodules https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

如果已经克隆但缺少子模块：

```bash
git submodule update --init --recursive
```

### 步骤 2：安装 uv 并创建虚拟环境

```bash
# 安装 uv（如果尚未安装）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 创建 Python 3.11 虚拟环境
uv venv venv --python 3.11
```

### 步骤 3：安装 Python 依赖

```bash
export VIRTUAL_ENV="$(pwd)/venv"

# 安装完整版（推荐）
uv pip install -e ".[all]"

# 或只安装核心功能
uv pip install -e "."
```

### 可选扩展包

| 扩展包 | 功能 | 命令 |
|--------|------|------|
| `all` | 所有功能 | `uv pip install -e ".[all]"` |
| `messaging` | Telegram & Discord | `uv pip install -e ".[messaging]"` |
| `cron` | 定时任务 | `uv pip install -e ".[cron]"` |
| `cli` | 终端菜单 UI | `uv pip install -e ".[cli]"` |
| `mcp` | MCP 协议支持 | `uv pip install -e ".[mcp]"` |
| `homeassistant` | 智能家居集成 | `uv pip install -e ".[homeassistant]"` |
| `tts-premium` | ElevenLabs 语音 | `uv pip install -e ".[tts-premium]"` |

### 步骤 4：创建全局命令

```bash
ln -s "$(pwd)/bin/hermes" ~/.local/bin/hermes
```

---

## 5. 初始配置

### 运行配置向导

```bash
hermes setup
```

### 选择 LLM 提供商

| 提供商 | 说明 | 配置方式 |
|--------|------|----------|
| **Nous Portal** | 订阅制，零配置 | `hermes model` OAuth 登录 |
| **OpenAI Codex** | ChatGPT OAuth | 设备码认证 |
| **OpenRouter** | 200+ 模型，按量付费 | 输入 API Key |
| **自定义端点** | VLLM/SGLang 等 | 设置 base URL + API Key |

### 常用 API 提供商配置

#### OpenRouter（推荐）

1. 访问 https://openrouter.ai/ 注册
2. 获取 API Key
3. 在 Hermes 中输入：

```bash
hermes config set OPENROUTER_API_KEY your_key_here
```

#### 阿里云通义千问

```bash
hermes config set provider alibaba
hermes config set base_url https://dashscope.aliyuncs.com/compatible-mode/v1
hermes config set ALIBABA_API_KEY your_dashscope_key
```

#### Ollama（本地运行）

```bash
hermes config set provider ollama
hermes config set base_url http://localhost:11434/v1
```

### 设置默认模型

```bash
hermes config set model.default gpt-4o
hermes config set model.provider openrouter
```

---

## 6. 基本使用

### 启动对话

```bash
hermes
```

### 恢复上次会话

```bash
hermes --continue    # 或 hermes -c
```

### 查看帮助

```bash
# 在对话中输入
/help

# 或在命令行
hermes --help
```

### 基本对话示例

```
❯ 你好，能帮我做什么？

❯ 查看当前目录下最大的 5 个文件夹

❯ 帮我创建一个 Python 脚本，计算两个日期之间的天数

❯ 搜索一下最新的 AI 新闻
```

---

## 7. CLI 命令行使用详解

### 7.1 命令行参数

| 参数 | 简写 | 说明 | 示例 |
|------|------|------|------|
| `--continue` | `-c` | 恢复上次会话 | `hermes -c` |
| `--session` | `-s` | 指定会话 ID | `hermes -s abc123` |
| `--model` | `-m` | 指定模型 | `hermes -m gpt-4o` |
| `--config` | | 指定配置文件 | `hermes --config ./custom.yaml` |
| `--verbose` | `-v` | 详细输出模式 | `hermes -v` |
| `--quiet` | `-q` | 静默模式 | `hermes -q "执行命令"` |
| `--export` | | 导出会话 | `hermes --export > output.md` |

### 7.2 非交互式命令（一行命令）

可以直接在命令行传递消息，无需进入交互模式：

```bash
# 执行简单任务
hermes "查看当前目录的文件列表"

# 执行命令并保存输出
hermes "分析这个项目的代码结构" > analysis.txt

# 链式调用
hermes "列出所有 Python 文件" | hermes "统计代码行数"
```

### 7.3 配置管理命令

```bash
# 查看所有配置
hermes config list

# 查看特定配置项
hermes config get model.default

# 设置配置项
hermes config set model.default claude-sonnet-4
hermes config set display.personality helpful
hermes config set terminal.timeout 300

# 重置配置项
hermes config reset model.default

# 导出配置
hermes config export > my-config.yaml

# 导入配置
hermes config import ./my-config.yaml
```

### 7.4 模型管理命令

```bash
# 交互式切换模型
hermes model

# 列出可用模型
hermes model list

# 设置默认模型
hermes model set gpt-4o

# 测试模型连接
hermes model test
```

### 7.5 技能管理命令

```bash
# 搜索技能
hermes skills search github

# 列出已安装技能
hermes skills list

# 查看技能详情
hermes skills view github-pr-workflow

# 安装技能
hermes skills install github-pr-workflow

# 卸载技能
hermes skills uninstall skill-name

# 更新所有技能
hermes skills update

# 验证技能
hermes skills verify skill-name
```

### 7.6 工具管理命令

```bash
# 列出所有工具
hermes tools list

# 启用工具
hermes tools enable browser

# 禁用工具
hermes tools disable browser

# 设置工具集
hermes tools --set all
hermes tools --set "['terminal', 'file', 'web_search']"

# 测试工具
hermes tools test terminal
```

### 7.7 会话管理命令

```bash
# 列出所有会话
hermes sessions list

# 查看会话详情
hermes sessions view <session-id>

# 删除会话
hermes sessions delete <session-id>

# 清空所有会话
hermes sessions clear

# 导出会话
hermes sessions export <session-id> > conversation.md

# 导入会话
hermes sessions import ./conversation.md
```

### 7.8 网关/平台命令

```bash
# 设置网关
hermes gateway setup

# 查看网关状态
hermes gateway status

# 启动网关服务
hermes gateway start

# 停止网关服务
hermes gateway stop

# 重启网关服务
hermes gateway restart
```

### 7.9 定时任务命令

```bash
# 列出所有定时任务
hermes cron list

# 创建定时任务
hermes cron create "每天 9 点检查新闻" --schedule "0 9 * * *"

# 暂停定时任务
hermes cron pause <job-id>

# 恢复定时任务
hermes cron resume <job-id>

# 删除定时任务
hermes cron remove <job-id>

# 手动运行定时任务
hermes cron run <job-id>
```

### 7.10 其他实用命令

```bash
# 更新 Hermes
hermes update

# 查看版本
hermes --version

# 查看系统信息
hermes doctor

# 清理缓存
hermes cache clean

# 查看缓存大小
hermes cache size

# 备份数据
hermes backup create

# 恢复数据
hermes backup restore ./backup-file.tar.gz
```

---

## 8. 核心功能与实际使用案例

### 8.1 终端命令案例

**案例 1：系统诊断**
```
❯ 检查我的磁盘使用情况，显示最大的 5 个目录

❯ 查看系统内存和 CPU 使用情况

❯ 列出最近修改的 10 个文件
```

**案例 2：项目分析**
```
❯ 统计这个项目中每种文件类型的数量

❯ 找出所有包含 TODO 注释的代码文件

❯ 生成项目目录树结构
```

**案例 3：Git 操作**
```
❯ 查看最近的 git 提交历史

❯ 显示当前分支的未提交更改

❯ 创建一个新分支并切换到它
```

### 8.2 文件操作案例

**案例 1：文件内容处理**
```
❯ 读取 config.yaml 的内容并解释每个配置项

❯ 在 package.json 中添加 lodash 依赖

❯ 创建一个包含项目结构的 README.md 文件
```

**案例 2：文件搜索**
```
❯ 搜索所有包含 "console.log" 的 JavaScript 文件

❯ 找出所有超过 500 行的代码文件

❯ 查找所有包含密码或密钥的文件
```

**案例 3：批量操作**
```
❯ 将所有 .txt 文件重命名为 .md

❯ 删除所有空的 __pycache__ 目录

❯ 备份所有配置文件到 backup 目录
```

### 8.3 代码开发案例

**案例 1：创建新项目**
```
❯ 帮我创建一个 Python Flask 项目结构，包含 requirements.txt、app.py 和 tests 目录

❯ 初始化一个 npm 项目，添加 React 和 TypeScript 依赖

❯ 创建一个 Dockerfile 用于部署 Node.js 应用
```

**案例 2：代码调试**
```
❯ 这段代码为什么报错？[粘贴代码]

❯ 帮我修复这个 Python 脚本中的语法错误

❯ 优化这个函数的性能
```

**案例 3：编写测试**
```
❯ 为这个函数编写单元测试

❯ 创建一个 pytest 配置文件并运行所有测试

❯ 生成测试覆盖率报告
```

### 8.4 网页浏览案例

**案例 1：内容提取**
```
❯ 访问 https://news.ycombinator.com 并总结前 5 条新闻

❯ 从这篇博客文章提取主要内容 https://example.com/article

❯ 下载这个 PDF 并总结关键内容 https://arxiv.org/pdf/xxxx.pdf
```

**案例 2：数据分析**
```
❯ 查看这个 GitHub 仓库的 star 趋势和最近提交

❯ 检查这个网站的状态和响应时间

❯ 比较这三个产品的价格和特性
```

**案例 3：截图分析**
```
❯ 截图这个页面并分析布局问题

❯ 帮我识别这个验证码的内容

❯ 分析这个图表的数据趋势
```

### 8.5 自动化任务案例

**案例 1：定时监控**
```
❯ 每小时检查一次服务器状态，如果 CPU 超过 80% 就通知我

❯ 每天早上 9 点抓取科技新闻并发送到我的邮箱

❯ 监控这个 GitHub 仓库的 issue，有新的 bug 报告就提醒我
```

**案例 2：数据处理**
```
❯ 每天从 API 获取数据并更新到数据库

❯ 每周生成销售报告并保存为 PDF

❯ 每月清理临时文件和日志
```

### 8.6 多步骤任务案例

**案例 1：部署流程**
```
❯ 帮我部署这个应用到服务器：
   1. 运行测试
   2. 构建生产版本
   3. 上传到服务器
   4. 重启服务
   5. 验证部署成功
```

**案例 2：数据迁移**
```
❯ 帮我把数据从旧数据库迁移到新数据库：
   1. 导出旧数据
   2. 转换格式
   3. 导入新数据库
   4. 验证数据完整性
```

---

## 9. 高级配置

### 9.1 沙箱终端

为安全起见，可以在隔离环境中运行命令：

```bash
# Docker 隔离
hermes config set terminal.backend docker

# 远程服务器
hermes config set terminal.backend ssh
hermes config set terminal.ssh.host your.server.com
hermes config set terminal.ssh.user username
```

### 9.2 消息平台集成

```bash
# 配置网关
hermes gateway setup

# 支持的平台
- Telegram
- Discord
- Slack
- WhatsApp
- 微信（需额外配置）
```

### 9.3 定时任务

```
❯ 每天早上 9 点检查 Hacker News 并发送摘要到 Telegram
```

Hermes 会自动创建 cron 任务。

### 9.4 个性设置

```bash
# 更改个性
hermes config set display.personality helpful      # 默认
hermes config set display.personality creative     # 创意
hermes config set display.personality teacher      # 教育
hermes config set display.personality pirate       # 海盗风格

# 或在对话中
/personality pirate
```

### 9.5 工具管理

```bash
# 查看所有工具
/tools

# 启用所有工具
hermes tools --set all

# 禁用特定工具
hermes tools --disable browser
```

### 9.6 会话管理

```bash
# 列出所有会话
hermes sessions

# 删除旧会话
hermes sessions --prune

# 导出会话
hermes sessions --export > conversation.md
```

---

## 10. 技能系统

### 10.1 什么是技能

技能是预定义的工作流，扩展 Hermes 的能力：

- 📝 **笔记管理** - IMA、Obsidian、Notion
- 📊 **数据分析** - Jupyter、Pandas
- 🎨 **创意生成** - ASCII 艺术、图表生成
- 🔧 **开发工具** - GitHub、代码审查
- 🏠 **智能家居** - Home Assistant、Philips Hue

### 10.2 浏览技能

```bash
# 搜索技能
hermes skills search github

# 列出所有技能
hermes skills list

# 查看技能详情
hermes skills view github-pr-workflow
```

### 10.3 安装技能

```bash
# 从技能中心安装
hermes skills install skill-name

# 从 URL 安装
hermes skills install https://github.com/.../skill.zip

# 本地安装
hermes skills install ./path/to/skill
```

### 10.4 技能配置

某些技能需要额外配置：

```bash
# IMA 技能示例
mkdir -p ~/.config/ima
echo "your_client_id" > ~/.config/ima/client_id
echo "your_api_key" > ~/.config/ima/api_key
```

### 10.5 常用技能推荐

| 技能 | 用途 |
|------|------|
| `github-pr-workflow` | GitHub PR 管理 |
| `jupyter-live-kernel` | Jupyter 交互式编程 |
| `obsidian` | Obsidian 笔记管理 |
| `youtube-content` | YouTube 转录提取 |
| `arxiv` | 学术论文搜索 |
| `docker` | Docker 容器管理 |

---

## 11. 常见问题

### 11.1 安装失败怎么办？

```bash
# 清理后重试
rm -rf ~/.hermes
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### 11.2 如何切换模型？

```bash
# 交互式切换
hermes model

# 或手动配置
hermes config set model.default claude-sonnet-4
```

### 11.3 命令执行太慢？

```bash
# 增加超时时间
hermes config set terminal.timeout 300

# 使用后台执行
hermes config set terminal.backend docker
```

### 11.4 如何备份配置？

```bash
# 备份配置目录
tar -czf hermes-backup.tar.gz ~/.hermes
```

### 11.5 如何更新 Hermes？

```bash
# 自动更新
hermes update

# 或手动更新
cd ~/hermes-agent
git pull
git submodule update --init --recursive
uv pip install -e ".[all]"
```

### 11.6 API 密钥在哪里存储？

密钥存储在 `~/.hermes/.env` 或 `~/.hermes/config.yaml` 中，确保文件权限安全：

```bash
chmod 600 ~/.hermes/.env
chmod 600 ~/.hermes/config.yaml
```

### 11.7 如何禁用某些工具？

```bash
# 编辑配置
hermes config set toolsets "['hermes-cli']"

# 或在 config.yaml 中修改 toolsets 列表
```

### 11.8 日志在哪里？

```bash
# 查看日志
tail -f ~/.hermes/logs/agent.log

# 调整日志级别
hermes config set logging.level DEBUG
```

---

## 📚 更多资源

- **官方文档**: https://hermes-agent.nousresearch.com/docs/
- **GitHub 仓库**: https://github.com/NousResearch/hermes-agent
- **问题反馈**: https://github.com/NousResearch/hermes-agent/issues
- **社区讨论**: https://github.com/NousResearch/hermes-agent/discussions
- **Nous Research**: https://nousresearch.com/

---

## 🚀 快速参考卡

```bash
# 安装
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# 启动
hermes

# 恢复会话
hermes -c

# 切换模型
hermes model

# 配置
hermes setup

# 技能
hermes skills search <关键词>
hermes skills install <技能名>

# 工具
hermes tools --set all

# 更新
hermes update

# 帮助
/help          # 对话中
hermes --help  # 命令行
```

---

*教程版本：1.0 | 最后更新：2026 年 4 月*
