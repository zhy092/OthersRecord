#!/bin/bash

# SQL转Excel工具启动脚本

# 脚本所在目录
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PROJECT_DIR=$(cd "$SCRIPT_DIR/../../" && pwd)

# 激活虚拟环境
echo "正在激活虚拟环境..."
source "$PROJECT_DIR/.venv/bin/activate"

# 运行主脚本
echo "启动 SQL 转 Excel 工具..."
echo "=============================================="
python3 "$SCRIPT_DIR/sql_to_excel_batch.py"

# 退出虚拟环境
deactivate
echo "=============================================="
echo "已退出虚拟环境"