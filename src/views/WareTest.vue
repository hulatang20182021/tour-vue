<template>
  <div class="test-platform">
    <!-- 导航菜单 -->
    <div class="nav-menu">
      <div
          v-for="tab in tabs"
          :key="tab.type"
          class="nav-item"
          :class="{ active: activeTab === tab.type }"
          @click="activeTab = tab.type"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </div>
    </div>

    <!-- 黑盒测试 -->
    <div v-show="activeTab === 'blackbox'" class="test-container">
      <div class="config-section">
        <h2><i class="el-icon-s-marketing"></i> 黑盒测试管理</h2>

        <!-- 需求编辑区 -->
        <div class="requirement-editor">
          <div class="editor-header">
            <h3>功能需求输入</h3>
            <el-button
                type="primary"
                size="small"
                @click="analyzeRequirement"
                :loading="analyzing"
            >
              <i class="el-icon-s-promotion"></i> 生成等价类
            </el-button>
          </div>
          <el-input
              v-model="requirementText"
              type="textarea"
              :rows="4"
              placeholder="请输入功能需求描述，例如：用户名必须为3-20位字母数字组合"
              class="requirement-input"
          />
        </div>

        <!-- 等价类展示 -->
        <div class="equivalence-results">
          <h3>等价类划分结果</h3>
          <el-table :data="analyzedData" border style="width: 100%">
            <el-table-column prop="param" label="参数名称" width="180" />
            <el-table-column label="有效等价类">
              <template #default="{ row }">
                <div v-for="(item, i) in row.valid" :key="`valid-${i}`" class="case-item">
                  <el-tag type="success" size="mini">V{{ i + 1 }}</el-tag>
                  <span class="case-desc">{{ item }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="无效等价类">
              <template #default="{ row }">
                <div v-for="(item, i) in row.invalid" :key="`invalid-${i}`" class="case-item">
                  <el-tag type="danger" size="mini">I{{ i + 1 }}</el-tag>
                  <span class="case-desc">{{ item }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 白盒测试 -->
    <div v-show="activeTab === 'whitebox'" class="test-container">
      <div class="config-section">
        <h2><i class="el-icon-cpu"></i> 白盒测试分析</h2>

        <!-- 代码编辑器 -->
        <div class="code-editor-container">
          <el-input
              v-model="whiteboxCode"
              type="textarea"
              :rows="15"
              placeholder="输入被测代码..."
              class="code-area"
          />

          <!-- 测试用例结果 -->
          <div class="coverage-results" v-if="testCases.length">
            <h3>路径覆盖测试用例（覆盖率 {{ coverage }}%）</h3>
            <el-table :data="testCases" border>
              <el-table-column prop="path" label="路径" width="150" />
              <el-table-column prop="condition" label="条件" />
              <el-table-column prop="input" label="输入参数" width="200" />
              <el-table-column prop="expected" label="预期输出" width="200" />
            </el-table>
          </div>

          <div class="editor-footer">
            <el-button
                type="success"
                @click="analyzeCode"
                :loading="analyzing"
                class="analyze-btn"
            >
              <i class="el-icon-search"></i> 执行代码分析
            </el-button>
            <span class="code-stats">
              代码行数: {{ codeLines }} | 函数数量: {{ functionCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'blackbox',
      tabs: [
        { type: 'blackbox', label: '黑盒测试', icon: 'el-icon-box' },
        { type: 'whitebox', label: '白盒测试', icon: 'el-icon-cpu' }
      ],
      // 黑盒测试数据
      requirementText: '',
      analyzing: false,
      analyzedData: [],
      // 白盒测试数据
      whiteboxCode: `function login(username, password) {
  if (username === 'admin' && password === 'Admin@123') {
    return { code: 200, token: '...' };
  } else if (username === 'guest') {
    return { code: 201, access: 'limited' };
  } else {
    return { code: 401, error: '认证失败' };
  }
}`,
      testCases: [],
      coverage: 0
    }
  },

  computed: {
    codeLines() {
      return this.whiteboxCode.split('\n').length
    },
    functionCount() {
      return (this.whiteboxCode.match(/function/g) || []).length
    }
  },

  methods: {
    // 黑盒需求分析
    analyzeRequirement() {
      this.analyzing = true
      setTimeout(() => {
        this.analyzedData = this.parseRequirement(this.requirementText)
        this.analyzing = false
      }, 800)
    },

    parseRequirement(text) {
      const result = []

      // 解析用户名
      if (text.includes("用户名")) {
        const match = text.match(/用户名必须为(\d+)-(\d+)位([\u4e00-\u9fa5a-zA-Z]+)/)
        if (match) {
          result.push({
            param: "用户名",
            valid: [
              `${match[1]}位${match[3]}组合`,
              `${match[2]}位${match[3]}组合`,
              `${Math.floor((+match[1] + +match[2])/2)}位${match[3]}组合`
            ],
            invalid: [
              `${match[1]-1}位${match[3]}`,
              `${match[2]+1}位${match[3]}`,
              `包含特殊字符`
            ]
          })
        }
      }

      // 解析密码
      if (text.includes("密码")) {
        const match = text.match(/密码必须为(\d+)-(\d+)位，包含至少([^\d]+)/)
        if (match) {
          result.push({
            param: "密码",
            valid: [
              `${match[1]}位符合要求`,
              `${match[2]}位符合要求`,
              `包含${match[3]}`
            ],
            invalid: [
              `${match[1]-1}位密码`,
              `${match[2]+1}位密码`,
              `纯数字组合`
            ]
          })
        }
      }

      return result
    },

    // 白盒代码分析
    analyzeCode() {
      this.analyzing = true
      setTimeout(() => {
        this.testCases = [
          {
            path: "主路径",
            condition: "正确管理员凭证",
            input: { username: "admin", password: "Admin@123" },
            expected: { code: 200 }
          },
          {
            path: "分支路径1",
            condition: "访客账户",
            input: { username: "guest", password: "any" },
            expected: { code: 201 }
          },
          {
            path: "分支路径2",
            condition: "错误凭证",
            input: { username: "test", password: "wrong" },
            expected: { code: 401 }
          }
        ]
        this.coverage = 100
        this.analyzing = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.test-platform {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
  padding: 24px;
  height: 100vh;
  background: #f5f7fa;
}

.nav-menu {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav-item {
  padding: 12px 16px;
  margin: 8px 0;
  border-radius: 6px;
  cursor: pointer;
  color: #606266;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background: #f0faff;
  }

  &.active {
    background: #409eff;
    color: white;
  }

  i {
    margin-right: 8px;
    font-size: 18px;
  }
}

.test-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 黑盒测试样式 */
.requirement-editor {
  margin-bottom: 30px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  background: #f8fafc;

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h3 {
      color: #303133;
      margin: 0;
    }
  }
}

.requirement-input {
  ::v-deep .el-textarea__inner {
    font-size: 14px;
    line-height: 1.6;
    padding: 12px;
    background: white;
  }
}

.equivalence-results {
  h3 {
    color: #409eff;
    margin-bottom: 20px;
  }

  .case-item {
    display: flex;
    align-items: center;
    padding: 6px 0;

    .el-tag {
      margin-right: 8px;
      width: 40px;
      justify-content: center;
    }

    .case-desc {
      flex: 1;
    }
  }
}

/* 白盒测试样式 */
.code-editor-container {
  .code-area {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 20px;

    ::v-deep textarea {
      font-family: inherit;
    }
  }

  .coverage-results {
    margin-top: 30px;

    h3 {
      color: #67c23a;
      margin-bottom: 15px;
    }
  }

  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

    .code-stats {
      color: #909399;
      font-size: 0.9em;
    }
  }
}

/* 通用样式 */
h2 {
  color: #303133;
  margin-top: 0;
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
    color: #409eff;
  }
}

.el-table {
  margin-top: 15px;

  ::v-deep th {
    background-color: #f8fafc;
  }
}

.el-button {
  transition: all 0.2s;
}
</style>