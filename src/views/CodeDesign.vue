<template>
  <div class="code-generator-container">
    <!-- 左侧模块树 -->
    <div class="module-pane">
      <div class="pane-header">
        <i class="el-icon-folder-opened"></i>
        <span>设计模块</span>
      </div>
      <el-tree
          :data="designModules"
          node-key="id"
          :props="treeProps"
          @node-click="handleNodeSelect"
          highlight-current
      >
        <template #default="{ node, data }">
          <div class="custom-node">
            <i :class="data.icon" class="node-icon"></i>
            <div class="node-content">
              <div class="node-title">{{ node.label }}</div>
              <div v-if="data.type" class="node-subtitle">{{ data.type }}</div>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 中间配置 -->
    <div class="config-pane">
      <div v-if="selectedModule" class="config-content">
        <div class="config-header">
          <h3 class="module-title">
            <i :class="selectedModule.icon"></i>
            {{ selectedModule.name }}
          </h3>
          <el-tag :type="moduleTypeMap[selectedModule.type]" effect="dark">
            {{ selectedModule.type }}
          </el-tag>
        </div>

        <el-form label-width="120px" class="config-form">
          <el-form-item label="目标语言：" class="config-item">
            <el-select v-model="config.language" placeholder="选择编程语言">
              <el-option
                  v-for="lang in languages"
                  :key="lang.value"
                  :label="lang.label"
                  :value="lang.value"
              >
                <i :class="lang.icon"></i>
                <span style="margin-left: 6px">{{ lang.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="代码风格：" class="config-item">
            <el-radio-group v-model="config.style">
              <el-radio-button label="procedural">
                <i class="el-icon-c-scale-to-original"></i>
                <span>过程式</span>
              </el-radio-button>
              <el-radio-button label="oop">
                <i class="el-icon-copy-document"></i>
                <span>面向对象</span>
              </el-radio-button>
              <el-radio-button label="functional">
                <i class="el-icon-connection"></i>
                <span>函数式</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="详细程度：" class="config-item">
            <el-slider
                v-model="config.detailLevel"
                :marks="detailMarks"
                :format-tooltip="formatDetailLevel"
                show-stops
            />
          </el-form-item>
        </el-form>

        <div class="generate-action">
          <el-button
              type="primary"
              class="generate-btn"
              @click="generatePseudocode"
              :loading="generating"
          >
            <i class="el-icon-magic-stick"></i>
            <span>{{ generating ? '生成中...' : '立即生成' }}</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 右侧代码预览 -->
    <div class="code-pane">
      <div class="pane-header">
        <i class="el-icon-document"></i>
        <span>代码预览</span>
        <div class="code-actions">
          <el-tooltip content="复制代码" placement="top">
            <el-button circle size="small" @click="copyCode">
              <i class="el-icon-document-copy"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip content="导出文件" placement="top">
            <el-button circle size="small" @click="exportCode">
              <i class="el-icon-download"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <div v-if="generatedCode" class="code-wrapper">
        <pre class="code-display"><code>{{ generatedCode }}</code></pre>
      </div>

      <div v-else class="empty-preview">
        <i class="el-icon-monitor"></i>
        <p>选择模块并生成代码预览</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeProps: {
        label: 'name',
        children: 'subModules'
      },
      designModules: [
        {
          id: 'user-auth',
          name: '用户认证',
          type: '核心模块',
          icon: 'el-icon-lock',
          classes: [
            {
              name: 'AuthService',
              responsibility: '处理用户认证逻辑',
              methods: [
                {
                  name: 'login',
                  parameters: [
                    { name: 'username', type: 'string' },
                    { name: 'password', type: 'string' }
                  ],
                  returns: 'AuthToken'
                }
              ]
            }
          ],
          apis: [
            {
              name: '/api/login',
              method: 'POST',
              parameters: ['username', 'password'],
              response: 'JWT Token'
            }
          ]
        },
        {
          id: 'order-mgr',
          name: '订单管理',
          type: '业务模块',
          icon: 'el-icon-s-order',
          classes: [
            {
              name: 'OrderService',
              responsibility: '订单生命周期管理',
              methods: [
                {
                  name: 'createOrder',
                  parameters: [
                    { name: 'items', type: 'Array<OrderItem>' },
                    { name: 'userId', type: 'number' }
                  ],
                  returns: 'Order'
                }
              ]
            }
          ]
        },
        {
          id: 'payment',
          name: '支付网关',
          type: '集成模块',
          icon: 'el-icon-bank-card',
          subModules: [
            {
              id: 'wechat-pay',
              name: '微信支付',
              classes: [
                {
                  name: 'WechatPayAdapter',
                  responsibility: '微信支付接口封装',
                  methods: [
                    {
                      name: 'createPayment',
                      parameters: [
                        { name: 'orderId', type: 'string' },
                        { name: 'amount', type: 'number' }
                      ],
                      returns: 'PaymentResult'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      selectedModule: null,
      generating: false,
      generatedCode: '',
      config: {
        language: 'python',
        style: 'oop',
        detailLevel: 75
      },
      languages: [
        { label: 'Python', value: 'python', icon: 'el-icon-s-promotion' },
        { label: 'Java', value: 'java', icon: 'el-icon-coffee-cup' },
        { label: 'TypeScript', value: 'typescript', icon: 'el-icon-data-analysis' }
      ],
      moduleTypeMap: {
        '核心模块': 'danger',
        '业务模块': 'warning',
        '集成模块': 'success'
      },
      detailMarks: {
        0: '简洁',
        25: '基础',
        50: '标准',
        75: '详细',
        100: '完整'
      }
    }
  },
  methods: {
    handleNodeSelect(node) {
      this.selectedModule = node
    },
    async generatePseudocode() {
      this.generating = true
      await new Promise(r => setTimeout(r, 800))

      const generator = new PseudocodeGenerator(
          this.selectedModule,
          this.config
      )

      this.generatedCode = generator.generate()
      this.generating = false
    },
    formatDetailLevel(val) {
      return `${val}% (${this.detailMarks[val] || '自定义'})`
    },
    copyCode() {
      navigator.clipboard.writeText(this.generatedCode)
      this.$message.success('代码已复制到剪贴板')
    },
    exportCode() {
      const blob = new Blob([this.generatedCode], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${this.selectedModule.name}_${Date.now()}.${this.config.language}`
      a.click()
    }
  }
}

class PseudocodeGenerator {
  constructor(module, config) {
    this.module = module
    this.config = config
  }

  generate() {
    let code = []
    if (this.config.style === 'oop') {
      code.push(`class ${this.module.name} {`)
      code.push(...this.generateMethods())
      code.push('}')
    } else {
      code.push(...this.generateFunctions())
    }
    return code.join('\n')
  }

  generateMethods() {
    return this.module.classes.flatMap(cls => [
      '',
      ...cls.methods.flatMap(method => [
        `  ${method.name}(${method.parameters.map(p => p.name).join(', ')}) {`,
        '    // 业务逻辑实现',
        '  }'
      ])
    ])
  }
}
</script>

<style scoped>
/* 增加树节点间距 */
::v-deep .el-tree-node {
  margin-bottom: 16px;  /* 控制节点之间的垂直间距 */
}

::v-deep .el-tree-node__content {
  padding: 12px 0;      /* 调整节点内容区域的上下内边距 */
  height: auto !important;
}

.custom-node {
  margin: 8px 0;        /* 节点内部元素的外边距 */
  padding: 14px 20px;   /* 增加节点容器的内边距 */
  border-radius: 8px;
  background: rgba(108,140,255,0.05);
}
.code-generator-container {
  display: grid;
  grid-template-columns: 280px 1fr 1fr;
  height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  gap: 1px;
}

/* 统一面板样式 */
.module-pane,
.config-pane,
.code-pane {
  background: white;
  box-shadow: 0 4px 12px rgba(64,158,255,0.08);
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;
}

.pane-header {
  padding: 16px 24px;
  background: #f8fbff;
  border-bottom: 1px solid #e4efff;
  font-size: 15px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.pane-header i {
  color: #409EFF;
  font-size: 18px;
  margin-right: 10px;
}

/* 树形控件美化 */
.custom-node {
  padding: 10px 20px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.custom-node:hover {
  background: rgba(108,140,255,0.05);
}

.node-icon {
  color: #6c8cff;
  font-size: 16px;
  margin-right: 12px;
}

.node-title {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.node-subtitle {
  color: #7d8db3;
  font-size: 12px;
  margin-top: 2px;
}

/* 配置区域 */
.config-pane {
  padding: 0;
  background: white;
}

.config-header {
  padding: 24px;
  border-bottom: 1px solid #e4efff;
  display: flex;
  align-items: center;
}

.module-title {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 16px 0 0;
  display: flex;
  align-items: center;
}

.module-title i {
  color: #409EFF;
  margin-right: 12px;
  font-size: 20px;
}

.config-form {
  padding: 24px;
}

/* 生成按钮 */
.generate-btn {
  background: #409EFF;
  border: none;
  border-radius: 24px;
  padding: 14px 36px;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(64,158,255,0.3);
  transition: all 0.3s;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64,158,255,0.4);
}

/* 代码预览区 */
.code-pane {
  display: flex;
  flex-direction: column;
}

.code-wrapper {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

.code-display {
  background: #f8f9ff;
  border: 1px solid #e4e7ff;
  border-radius: 6px;
  padding: 20px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #3a4668;
}

.empty-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a3b1d1;
}

.empty-preview i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .code-generator-container {
    grid-template-columns: 260px 1fr;
  }

  .code-pane {
    grid-column: span 2;
    margin-top: 0;
  }
}

/* 标签美化 */
.el-tag {
  border-radius: 4px;
  font-weight: 500;
  padding: 0 10px;
  height: 28px;
  line-height: 26px;
}

/* 操作按钮 */
.code-actions .el-button {
  background: rgba(64,158,255,0.08);
  border-color: rgba(64,158,255,0.2);
  color: #409EFF;
}

.code-actions .el-button:hover {
  background: rgba(64,158,255,0.15);
}
</style>