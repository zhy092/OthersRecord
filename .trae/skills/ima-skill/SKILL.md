---
name: ima-skill
description: |
  统一的 IMA OpenAPI 技能，支持笔记管理和知识库操作。
  当用户提到知识库、资料库、笔记、备忘录、记事，或者想要上传文件、添加网页到知识库、
  搜索知识库内容、搜索/浏览/创建/编辑笔记时，使用此 skill。
  即使用户没有明确说"知识库"或"笔记"，只要意图涉及文件上传到知识库、网页收藏、
  知识搜索、个人文档存取（如"帮我记一下"、"搜一下知识库里有没有XX"），也应触发此 skill。
homepage: https://ima.qq.com
metadata:
  openclaw:
    emoji: '🔧'
    requires: { env: ['IMA_OPENAPI_CLIENTID', 'IMA_OPENAPI_APIKEY'] }
    primaryEnv: 'IMA_OPENAPI_CLIENTID'
  security:
    credentials_usage: |
      This skill requires user-provisioned IMA OpenAPI credentials (Client ID and API Key)
      to authenticate with the official IMA API at https://ima.qq.com.
      Credentials are ONLY sent to the official IMA API endpoint (ima.qq.com) as HTTP headers.
      No credentials are logged, stored in files, or transmitted to any other destination.
    allowed_domains:
      - ima.qq.com
---

# ima-skill

Unified IMA OpenAPI skill. Currently supports: **notes**, **knowledge-base**.

## Setup

> **Security note:** This skill authenticates with the **official IMA API** (`ima.qq.com`) — the same service the user already uses. Credentials are only sent as HTTP headers to `ima.qq.com` and never to any other domain, file, or log.

1. 打开 https://ima.qq.com/agent-interface 获取 **Client ID** 和 **API Key**
2. 存储凭证（二选一）：

**方式 A — 配置文件（推荐）：**

```bash
mkdir -p ~/.config/ima
echo "your_client_id" > ~/.config/ima/client_id
echo "your_api_key" > ~/.config/ima/api_key
```

**方式 B — 环境变量：**

```bash
export IMA_OPENAPI_CLIENTID="your_client_id"
export IMA_OPENAPI_APIKEY="your_api_key"
```

Agent 会按优先级依次尝试：环境变量 → 配置文件。

## 凭证预检

每次调用 API 前，先确认凭证可用。如果两个值都为空，停止操作并提示用户按 Setup 步骤配置。

```bash
# Load user-provided IMA credentials (used ONLY for ima.qq.com API authentication)
IMA_CLIENT_ID="${IMA_OPENAPI_CLIENTID:-$(cat ~/.config/ima/client_id 2>/dev/null)}"
IMA_API_KEY="${IMA_OPENAPI_APIKEY:-$(cat ~/.config/ima/api_key 2>/dev/null)}"
if [ -z "$IMA_CLIENT_ID" ] || [ -z "$IMA_API_KEY" ]; then
  echo "缺少 IMA 凭证，请按 Setup 步骤配置 Client ID 和 API Key"
  exit 1
fi
```

## API 调用模板

所有请求统一为 **HTTP POST + JSON Body**，仅发往官方 Base URL `https://ima.qq.com`。

定义辅助函数避免重复 header — 每个模块传入完整路径：

```bash
# All requests go ONLY to the official IMA API (ima.qq.com)
ima_api() {
  local path="$1" body="$2"
  curl -s -X POST "https://ima.qq.com/$path" \
    -H "ima-openapi-clientid: $IMA_CLIENT_ID" \
    -H "ima-openapi-apikey: $IMA_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$body"
}
```

> **Note:** All IMA OpenAPI endpoints currently use HTTP POST. If a future module requires a different method, `ima_api()` must be extended to accept a method parameter.

## 模块决策表

| 用户意图                                                                                   | 模块           | 读取                      |
| ------------------------------------------------------------------------------------------ | -------------- | ------------------------- |
| 搜索笔记、浏览笔记本、获取笔记内容、创建笔记、追加内容                                     | notes          | `notes/SKILL.md`          |
| 上传文件、添加网页链接、搜索知识库、浏览知识库内容、获取知识库信息、获取可添加的知识库列表 | knowledge-base | `knowledge-base/SKILL.md` |

### ⚠️ 易混淆场景

以下场景容易误判模块，需特别注意：

| 用户说的                                                 | 实际意图                   | 正确路由                                                             |
| -------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------- |
| "把这段内容添加到知识库XX里的笔记YY"                     | 往已有**笔记**追加内容     | **notes** — 先搜索笔记获取 `doc_id`，再用 `append_doc`               |

# Notes (笔记)

> Prerequisites: see root `../SKILL.md` for setup, credentials, and `ima_api()` helper.

API base path: `openapi/note/v1`

通过 IMA OpenAPI 管理用户个人笔记，支持读取（搜索、列表、获取内容）和写入（新建、追加）。

完整的数据结构和接口参数详见 `references/api.md`。

> **隐私规则：** 笔记内容属于用户隐私，在群聊场景中只展示标题和摘要，禁止展示笔记正文。

## 接口决策表

| 用户意图                                                                                                  | 调用接口                     | 关键参数                                                                      |
| --------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| 搜索/查找笔记                                                                                             | `search_note_book`           | `query_info`（QueryInfo 对象）                                                |
| 查看笔记本列表                                                                                            | `list_note_folder_by_cursor` | `cursor`(必填，首页传`"0"`) + `limit`(必填)                                   |
| 浏览某笔记本里的笔记,当用户表述"最新"、"最近"之类的通用限定，没有指明笔记本时，都应该直接在全部笔记里去拉 | `list_note_by_folder_id`     | `folder_id`(选填,空为全部笔记本) + `cursor`(必填，首次传`""`) + `limit`(必填) |
| 读取笔记正文                                                                                              | `get_doc_content`            | `doc_id` + `target_content_format`(必填，推荐`0`纯文本)                       |
| 新建一篇笔记（用户明确说"新建/创建笔记"时走此接口）                                                       | `import_doc`                 | `content` + `content_format`(必填，固定`1`) + 可选 `folder_id`                |
| 往已有笔记追加内容（⚠️ **敏感操作**：用户必须明确指定目标笔记，否则先确认再操作）                          | `append_doc`                 | `doc_id` + `content` + `content_format`(必填，固定`1`)                        |

## ⚠️ 新建 vs. 追加 — 行为规则

**新建笔记（`import_doc`）** 和 **追加内容到已有笔记（`append_doc`）** 是两个完全不同的操作，务必正确区分：

### 明确走新建的信号词

用户说以下任一表述时，**直接调用 `import_doc` 创建新笔记**：

- "**新建**笔记"、"**创建**笔记"、"**写一篇**笔记"
- "**新建**一篇笔记记录这些内容"

### 明确走追加的信号词

用户说以下任一表述时，**调用 `append_doc` 追加到已有笔记**（但仍需确认目标笔记，见下方规则）：

- "把这段话**追加到**《XX》笔记里"
- "在那篇笔记**末尾加上**这段内容"

### 模糊场景 — 必须先询问用户

以下表述**既可能是新建、也可能是追加**，agent **不得自行假设**，必须先向用户确认：

- "帮我记一下"、"记录一下"、"保存为笔记"、"存成笔记"
- "把这段内容记到笔记里"
- "添加到笔记里"
- 任何其他未明确表达"新建"或"追加"意图的表述

询问示例：
> "您是想**创建一篇新笔记**，还是**追加到某篇已有笔记**？"

### 追加到已有笔记是敏感操作

`append_doc` 会**不可撤销地修改**用户的现有笔记，因此必须谨慎处理：

1. **用户明确指定了目标笔记** — 可以直接追加。例如：
   - "把这段话追加到《会议纪要》笔记里"
   - "在那篇笔记末尾加上这段内容"（上下文中已有明确的笔记对象）

2. **用户没有明确指定目标笔记** — **必须先向用户确认**，不要自行猜测。例如：
   - 用户说"添加到笔记里" → 询问："您想追加到哪篇已有笔记？请提供笔记标题或让我帮您搜索。"
   - 用户说"把这个加到之前那篇笔记" → 如果上下文中有多篇笔记或不确定是哪篇 → 列出候选笔记让用户选择

> **原则**：不确定时，先问。宁可多问一句，也不要误改用户的已有笔记或自作主张创建新笔记。

### 🖼️ 本地图片不支持

`import_doc` 和 `append_doc` 的 `content` 字段仅支持纯文本/Markdown，**不支持本地图片**。

写入笔记内容前，必须检查并处理图片引用：

1. **过滤本地图片** — 如果用户提供的内容中包含本地图片路径（如 `![](file:///...)`, `![](/Users/...)`, `![](C:\...)` 等），**移除这些图片引用**，不要将其写入笔记。
2. **告知用户** — 移除后主动提醒用户：
   > "笔记接口暂不支持上传本地图片，以下图片已被过滤：`xxx.png`、`yyy.jpg`。您可以先将图片上传到网络，再用网络链接插入笔记。"
3. **保留网络图片** — 以 `http://` 或 `https://` 开头的图片链接可以正常保留。

## 常用工作流

### 查找并阅读笔记

先搜索获取 `docid`，再用 `get_doc_content` 读取正文：

```bash
# 1. 按标题搜索
ima_api "openapi/note/v1/search_note_book" '{"search_type": 0, "query_info": {"title": "会议纪要"}, "start": 0, "end": 20}'
# 从返回的 docs[].doc.basic_info.docid 中取目标笔记 ID

# 2. 读取正文（纯文本格式，Markdown 格式目前不支持）
ima_api "openapi/note/v1/get_doc_content" '{"doc_id": "目标docid", "target_content_format": 0}'
```

### 浏览笔记本里的笔记

先拉笔记本列表获取 `folder_id`，再拉该笔记本下的笔记：

```bash
# 1. 列出笔记本（首页 cursor 传 "0"）
ima_api "openapi/note/v1/list_note_folder_by_cursor" '{"cursor": "0", "limit": 20}'
# 从返回的 folder_list[].folder_id 取目标笔记本 ID

# 2. 拉取该笔记本下的笔记（首次 cursor 传空字符串 ""）
ima_api "openapi/note/v1/list_note_by_folder_id" '{"folder_id": "目标folder_id", "cursor": "", "limit": 20}'
```

### 新建笔记

```bash
# 创建一篇新笔记（content 支持 Markdown）
ima_api "openapi/note/v1/import_doc" '{"content": "# 会议记录\n\n- 议题1...\n- 议题2...", "content_format": 1}'
# 返回 doc_id 表示创建成功
```

### 追加内容到已有笔记

```bash
# 先搜索确认目标笔记
doc_id=$(ima_api "openapi/note/v1/search_note_book" '{"search_type": 0, "query_info": {"title": "会议纪要"}, "start": 0, "end": 5}' | jq -r '.docs[0].doc.basic_info.docid')

# 追加内容（会修改原笔记，务必确认目标正确）
ima_api "openapi/note/v1/append_doc" '{"doc_id": "'$doc_id'", "content": "\n\n## 新增内容\n...", "content_format": 1}'
```

# Knowledge Base (知识库)

> Prerequisites: see root `../SKILL.md` for setup, credentials, and `ima_api()` helper.

API base path: `openapi/wiki/v1`

通过 IMA Wiki OpenAPI 管理用户知识库，支持上传文件、添加网页链接、搜索知识库内容、浏览知识库列表和获取知识库详情。

完整的数据结构和接口参数详见 `references/api.md`。

## 接口决策表

| 用户意图                                      | 调用接口                                                               | 关键参数                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 上传文件到知识库                              | `check_repeated_names` → `create_media` → COS Upload → `add_knowledge` | `media_type`（按扩展名），`knowledge_base_id`，`file_name`，`file_size`  |
| 上传文件到知识库的某个文件夹                  | 先定位文件夹 → 同上（`folder_id` 传入目标文件夹 ID）                   | 见「文件夹操作」章节                                                     |
| 添加网页/微信文章到知识库                     | `import_urls`                                                          | `urls`（1-10 个），`knowledge_base_id`，可选 `folder_id`（省略则根目录） |
| 添加笔记到知识库                              | `add_knowledge`                                                        | `media_type=11`，`note_info.content_id=<doc_id>`，`knowledge_base_id`    |
| 添加 URL（文件型）到知识库                    | `check_repeated_names` → 下载文件 → 走"上传文件"流程                   | URL 指向 PDF/Word/PPT 等文件时，按文件方式处理                           |
| 检查文件名是否重复                            | `check_repeated_names`                                                 | `params[].name`，`params[].media_type`，`knowledge_base_id`，`folder_id` |
| 获取知识库信息                                | `get_knowledge_base`                                                   | `ids`（1-20 个，不重复）                                                 |
| 浏览知识库内容列表 / 浏览文件夹               | `get_knowledge_list`                                                   | `knowledge_base_id`，`cursor`，`limit`(1~50)，可选 `folder_id`           |
| 在知识库中搜索（含文件和文件夹）              | `search_knowledge`                                                     | `query`，`knowledge_base_id`，`cursor`                                   |
| 按关键词查找知识库（用户知道名字但不知道 ID） | `search_knowledge_base`                                                | `query`，`cursor`，`limit`(1~50)                                         |
| 查看/了解自己有哪些知识库                     | `search_knowledge_base`（`query` 传空字符串）                          | `query: ""`，`cursor`，`limit`(1~50)                                     |
| 添加内容但**未指定**目标知识库                | `get_addable_knowledge_base_list` → 展示列表让用户选择                 | `cursor`，`limit`(1~50)                                                  |

### `search_knowledge_base` vs `get_addable_knowledge_base_list` 选择指南

这两个接口容易混淆，选择规则：

| 场景                                             | 使用接口                                       | 原因                               |
| ------------------------------------------------ | ---------------------------------------------- | ---------------------------------- |
| 用户说了知识库名称（如"添加到产品文档库"）       | `search_knowledge_base`                        | 按名称搜索，找到 ID 后继续操作     |
| 用户想浏览/了解某个知识库                        | `search_knowledge_base` → `get_knowledge_base` | 先搜到 ID，再获取详情              |
| 用户想查看自己有哪些知识库（无具体关键词）       | `search_knowledge_base`（`query: ""`）         | 空 query 返回用户的所有知识库列表  |
| 用户要添加内容但**没说添加到哪个知识库**         | `get_addable_knowledge_base_list`              | 列出有权限添加的知识库，让用户选择 |
| 用户说"添加到知识库"但上下文中无法确定哪个知识库 | `get_addable_knowledge_base_list`              | 同上，不要猜测，让用户选择         |

**绝不要**在用户已明确指定知识库名称时调用 `get_addable_knowledge_base_list`，直接用 `search_knowledge_base` 按名称搜索即可。

## 文件类型检测

使用 `scripts/preflight-check.cjs` 脚本自动完成类型检测和大小校验。脚本按以下优先级解析：

1. **`--content-type` 已提供且可识别** → content-type 优先，直接使用
2. **`--content-type` 不可识别** → 回退到扩展名
3. **未提供 `--content-type`** → 使用扩展名
4. **两者都无法识别** → 拒绝处理

```bash
# 有扩展名（自动推断）
node .claude/skills/ima-skill/knowledge-base/scripts/preflight-check.cjs --file report.pdf

# 无扩展名或扩展名不可识别（需传入 content-type，如从 HTTP HEAD 获取）
node .claude/skills/ima-skill/knowledge-base/scripts/preflight-check.cjs --file downloaded_file --content-type application/pdf
```

扩展名与类型的对应关系：

| 扩展名              | media_type | content_type                                                                 |
| ------------------- | ---------- | ---------------------------------------------------------------------------- |
| `.pdf`              | 1          | `application/pdf`                                                            |
| `.doc`              | 3          | `application/msword`                                                         |
| `.docx`             | 3          | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`    |
| `.ppt`              | 4          | `application/vnd.ms-powerpoint`                                              |
| `.pptx`             | 4          | `application/vnd.openxmlformats-officedocument.presentationml.presentation`  |
| `.xls`              | 5          | `application/vnd.ms-excel`                                                   |
| `.xlsx`             | 5          | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`          |
| `.csv`              | 5          | `text/csv`                                                                   |
| `.md` / `.markdown` | 7          | `text/markdown`                                                              |
| `.png`              | 9          | `image/png`                                                                  |
| `.jpg` / `.jpeg`    | 9          | `image/jpeg`                                                                 |
| `.webp`             | 9          | `image/webp`                                                                 |
| `.txt`              | 13         | `text/plain`                                                                 |
| `.xmind`            | 14         | `application/x-xmind` / `application/vnd.xmind.workbook` / `application/zip` |
| `.mp3`              | 15         | `audio/mpeg`                                                                 |
| `.m4a`              | 15         | `audio/x-m4a`                                                                |
| `.wav`              | 15         | `audio/wav`                                                                  |
| `.aac`              | 15         | `audio/aac`                                                                  |

未识别的扩展名或无扩展名：**直接告知用户该文件类型不被支持，立即终止操作**。不要猜测或默认为某个类型，**不要询问用户是否仍要上传**。

> **不支持的类型**：视频文件（`.mp4`、`.avi`、`.mov` 等）、Bilibili（`bilibili.com/video/`）和 YouTube（`youtube.com/watch`）链接、本地 HTML 文件（`file://`）**无法**通过 skill 添加到知识库。直接告知用户「该文件类型不支持，仅支持在 ima 桌面端内添加进知识库」，**不要提供上传选项或询问是否继续**。

## URL 类型检测

添加 URL 到知识库时，需要根据 URL 模式和 Content-Type 判断类型。检测按以下优先级进行：

**1. Content-Type 为 `text/html` 时，按 URL 模式区分：**

| URL 模式                                            | media_type | 类型           | 处理方式                                                  |
| --------------------------------------------------- | ---------- | -------------- | --------------------------------------------------------- |
| 匹配 `mp.weixin.qq.com/s/` 或 `mp.weixin.qq.com/s?` | 6          | 微信公众号文章 | 使用 `import_urls`                                        |
| 以 `https://www.bilibili.com/video/` 开头           | ❌ 16      | 视频网页       | **不支持**，告知用户「仅支持在 ima 桌面端内添加进知识库」 |
| 以 `https://www.youtube.com/watch` 开头             | ❌ 16      | 视频网页       | **不支持**，告知用户「仅支持在 ima 桌面端内添加进知识库」 |
| 以 `file://` 开头                                   | ❌         | 本地 HTML      | **不支持**，告知用户「仅支持在 ima 桌面端内添加进知识库」 |
| 其他 `text/html` 页面                               | 2          | 普通网页       | 使用 `import_urls`                                        |

**2. Content-Type 为文件类型时：** 按文件类型检测表处理（PDF、Word、Excel 等）。

## 文件夹操作

知识库支持文件夹层级结构。涉及文件夹的操作需要正确处理 `folder_id`：

### 获取文件夹列表

```bash
# 获取知识库根目录下的文件夹列表
ima_api "openapi/wiki/v1/get_knowledge_list" '{"knowledge_base_id": "目标知识库ID", "cursor": "", "limit": 50}'
# 从返回的 folder_list[].folder_id 获取目标文件夹 ID
```

### 在指定文件夹下添加内容

```bash
# 上传文件到指定文件夹
ima_api "openapi/wiki/v1/add_knowledge" '{
  "knowledge_base_id": "知识库ID",
  "folder_id": "文件夹ID",
  "media_type": 1,
  "file_name": "report.pdf",
  "file_size": 123456,
  "cos_url": "https://cos.xxx/xxx"
}'
```

### 浏览文件夹内容

```bash
# 获取指定文件夹下的内容列表
ima_api "openapi/wiki/v1/get_knowledge_list" '{
  "knowledge_base_id": "知识库ID",
  "folder_id": "文件夹ID",
  "cursor": "",
  "limit": 50
}'
```

## 文件上传完整流程

上传文件到知识库需要多个步骤配合：

### 1. 预检文件

```bash
node .claude/skills/ima-skill/knowledge-base/scripts/preflight-check.cjs --file /path/to/file.pdf
```

### 2. 检查文件名是否重复

```bash
ima_api "openapi/wiki/v1/check_repeated_names" '{
  "params": [{"name": "file.pdf", "media_type": 1}],
  "knowledge_base_id": "目标知识库ID"
}'
```

### 3. 创建媒体资源获取 COS 上传凭证

```bash
ima_api "openapi/wiki/v1/create_media" '{
  "knowledge_base_id": "知识库ID",
  "media_infos": [{
    "file_name": "file.pdf",
    "media_type": 1,
    "content_type": "application/pdf",
    "file_size": 123456
  }]
}'
# 返回包含 cos_info 的对象，用于下一步上传
```

### 4. 上传文件到 COS

使用返回的 COS 凭证上传文件：

```bash
node .claude/skills/ima-skill/knowledge-base/scripts/cos-upload.cjs \
  --file /path/to/file.pdf \
  --secret-id "COS_SECRET_ID" \
  --secret-key "COS_SECRET_KEY" \
  --token "COS_TOKEN" \
  --bucket "COS_BUCKET" \
  --region "COS_REGION" \
  --cos-key "COS_KEY"
```

### 5. 添加到知识库

```bash
ima_api "openapi/wiki/v1/add_knowledge" '{
  "knowledge_base_id": "知识库ID",
  "media_type": 1,
  "file_name": "file.pdf",
  "file_size": 123456,
  "cos_url": "https://cos.xxx/xxx"
}'
```

## 添加网页链接

```bash
# 添加单个或多个网页到知识库
ima_api "openapi/wiki/v1/import_urls" '{
  "knowledge_base_id": "知识库ID",
  "urls": ["https://example.com/article1", "https://example.com/article2"]
}'
```

## 搜索知识库

```bash
# 在指定知识库中搜索
ima_api "openapi/wiki/v1/search_knowledge" '{
  "knowledge_base_id": "知识库ID",
  "query": "搜索关键词",
  "cursor": ""
}'
```

## 浏览知识库内容

```bash
# 获取知识库内容列表
ima_api "openapi/wiki/v1/get_knowledge_list" '{
  "knowledge_base_id": "知识库ID",
  "cursor": "",
  "limit": 50
}'
```
