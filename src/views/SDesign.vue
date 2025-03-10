<template>
  <div class="architecture-designer">
    <!-- 新增顶部导航 -->
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="架构设计" name="architecture"></el-tab-pane>
      <el-tab-pane label="交互图设计" name="interaction"></el-tab-pane>
      <el-tab-pane label="界面设计" name="ui"></el-tab-pane>
    </el-tabs>

    <!-- 架构设计模块（原有内容） -->
    <div v-show="activeTab === 'architecture'">
      <!-- 分层架构展示区 -->
      <div class="architecture-layers">
        <h2 class="section-title">系统架构分层展示</h2>
        <div class="layers-container">
          <div class="layer controller">
            <h3>控制器层</h3>
            <draggable :list="controllerRoles" group="roles">
              <div v-for="role in controllerRoles" :key="role.id" class="role-card">
                <el-tag type="primary" size="small">Controller</el-tag>
                <div class="role-name">{{ role.name }}</div>
                <div class="role-interfaces">
                  <el-tag v-for="(item, index) in role.interfaces"
                          :key="index" size="mini" class="interface-tag">
                    {{ item }}
                  </el-tag>
                </div>
              </div>
            </draggable>
          </div>

          <div class="layer service">
            <h3>业务逻辑层</h3>
            <draggable :list="serviceRoles" group="roles">
              <div v-for="role in serviceRoles" :key="role.id" class="role-card">
                <el-tag type="success" size="small">Service</el-tag>
                <div class="role-name">{{ role.name }}</div>
                <div class="role-interfaces">
                  <el-tag v-for="(item, index) in role.interfaces"
                          :key="index" size="mini" class="interface-tag">
                    {{ item }}
                  </el-tag>
                </div>
              </div>
            </draggable>
          </div>

          <div class="layer dao">
            <h3>持久化层</h3>
            <draggable :list="daoRoles" group="roles">
              <div v-for="role in daoRoles" :key="role.id" class="role-card">
                <el-tag type="warning" size="small">DAO</el-tag>
                <div class="role-name">{{ role.name }}</div>
                <div class="role-interfaces">
                  <el-tag v-for="(item, index) in role.interfaces"
                          :key="index" size="mini" class="interface-tag">
                    {{ item }}
                  </el-tag>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <!-- 用例与角色管理区 -->
      <div class="management-section">
        <h2 class="section-title">用例与角色管理</h2>
        <div class="management-content">
          <!-- 用例管理面板 -->
          <div class="use-case-management">
            <div class="use-case-selector">
              <h3 class="panel-title">📁 用例选择</h3>
              <el-select
                  v-model="selectedUseCase"
                  placeholder="请选择用例"
                  @change="handleUseCaseSelect"
                  style="width: 300px"
              >
                <el-option
                    v-for="useCase in useCases"
                    :key="useCase.id"
                    :label="useCase.title"
                    :value="useCase.id"
                >
                </el-option>
              </el-select>
              <el-card class="use-case-details" v-if="currentUseCase">
                <h3>用例详细信息</h3>
                <div class="contract-section">
                  <h4>操作契约</h4>
                  <el-divider></el-divider>
                  <div class="contract-item">
                    <label>操作名称：</label>
                    <span>{{ currentUseCase.contract.operation }}</span>
                  </div>
                  <div class="contract-item">
                    <label>前置条件：</label>
                    <ul>
                      <li v-for="(cond, index) in currentUseCase.contract.preconditions"
                          :key="index">{{ cond }}</li>
                    </ul>
                  </div>
                  <div class="contract-item">
                    <label>后置条件：</label>
                    <ul>
                      <li v-for="(cond, index) in currentUseCase.contract.postconditions"
                          :key="index">{{ cond }}</li>
                    </ul>
                  </div>
                  <div class="contract-item">
                    <label>步骤说明：</label>
                    <el-steps direction="vertical" :active="currentUseCase.contract.steps.length">
                      <el-step
                          v-for="(step, index) in currentUseCase.contract.steps"
                          :key="index"
                          :title="`步骤 ${step.step}`"
                      >
                        <template #description>
                          <div class="step-detail">
                            <div><strong>执行操作:</strong> {{ step.actorAction }}</div>
                            <div><strong>系统响应:</strong> {{ step.systemResponse }}</div>
                            <el-collapse class="contract-collapse">
                              <el-collapse-item title="查看契约详情">
                                <div><strong>前置条件:</strong> {{ step.contract.precondition }}</div>
                                <div><strong>后置条件:</strong> {{ step.contract.postcondition }}</div>
                                <div><strong>业务规则:</strong> {{ step.contract.businessRule }}</div>
                              </el-collapse-item>
                            </el-collapse>
                          </div>
                        </template>
                      </el-step>
                    </el-steps>
                  </div>
                </div>
              </el-card>
            </div>
          </div>

          <!-- 角色创建面板 -->
          <el-card class="role-creator">
            <h3 class="panel-title">🛠️ 角色创建</h3>
            <el-card class="role-creator">
              <h3>创建系统角色</h3>
              <el-form :model="newRole" label-width="100px">
                <el-form-item label="角色名称">
                  <el-input v-model="newRole.name" placeholder="例如：OrderController"></el-input>
                </el-form-item>
                <el-form-item label="所属层次">
                  <el-select v-model="newRole.layer" placeholder="请选择层次">
                    <el-option label="控制器层" value="controller"></el-option>
                    <el-option label="业务逻辑层" value="service"></el-option>
                    <el-option label="持久化层" value="dao"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="接口列表">
                  <div v-for="(interfaceItem, index) in newRole.interfaces" :key="index" class="interface-item">
                    <el-input v-model="newRole.interfaces[index]"
                              placeholder="例如：/api/orders (POST)"
                              style="width: 80%">
                    </el-input>
                    <el-button type="danger"
                               circle
                               icon="el-icon-remove"
                               @click="removeInterface(index)"></el-button>
                  </div>
                  <el-button type="primary"
                             icon="el-icon-circle-plus"
                             @click="addInterface">添加接口
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="success"
                             @click="saveRole"
                             :disabled="!canSaveRole">保存角色
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-card>
        </div>
      </div>
    </div>
    <!-- 交互图设计模块 -->
    <div v-show="activeTab === 'interaction'" class="interaction-designer">
      <div class="image-preview">
        <h3 class="preview-title">系统交互图设计</h3>
        <div class="image-container">
          <img :src="interactionImage" alt="系统交互图" class="interaction-image">
          <div class="upload-overlay">
            <el-upload
                action=""
                :show-file-list="false"
                :before-upload="handleInteractionUpload"
            >
              <div class="upload-guide">
                <i class="el-icon-upload"></i>
                <div class="upload-text">
                  点击上传或拖拽交互图文件

                  (支持PNG格式)
                </div>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="image-controls">

          <el-button
              type="primary"
              @click="exportInteractionImage"
          >
            生成
          </el-button>
          <el-button
              type="primary"
              icon="el-icon-download"
              @click="exportInteractionImage"
          >
            导出图片
          </el-button>
        </div>
      </div>
    </div>

    <!-- 新增界面设计模块 -->
    <div v-show="activeTab === 'ui'" class="ui-designer">
      <div class="image-preview">
        <h3 class="preview-title">系统界面设计</h3>
        <div class="image-container">
          <img :src="interactionImage" alt="系统界面" class="ui-image">
          <div class="upload-overlay">
            <el-upload
                action=""
                :show-file-list="false"
                :before-upload="handleInteractionUpload"
            >
              <div class="upload-guide">
                <i class="el-icon-upload"></i>
                <div class="upload-text">
                  点击上传或拖拽界面图文件

                  (支持PNG格式)
                </div>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="image-controls">

          <el-button
              type="primary"
              @click="exportInteractionImage"
          >
            生成
          </el-button>
          <el-button
              type="primary"
              icon="el-icon-download"
              @click="exportInteractionImage"
          >
            导出图片
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: { draggable },
  computed: {
    // 获取当前选中的完整用例对象
    currentUseCase() {
      return this.useCases.find(u => u.id === this.selectedUseCase)
    }
  },
  data() {
    return {
      activeTab: 'architecture',
      // 交互图数据
      interactionNodes: [],
      connections: [],
      dragNode: null,
      // 界面设计数据
      uiCode: '<template>\n  <div>\n    <h3>New Component</h3>\n  </div>\n</template>',
      dynamicComponent: null,
      // 新增角色表单数据
      newRole: {
        name: '',
        layer: 'controller',
        interfaces: ['']
      },
      selectedUseCase: null,
      controllerRoles: [],
      serviceRoles: [],
      daoRoles: [],
      layerTagMap: { controller: 'primary', service: 'success', dao: 'warning' },

      // 整合后的数据
      useCases: [
        {
          id: 1,
          title: "用例-权限管理系统-系统管理员",
          contract: {
            operation: "验证系统管理员能否添加新角色",
            preconditions: ["系统管理员已登录"],
            postconditions: ["新角色成功添加并显示在角色列表中"],
            steps: [
              {
                step: 1,
                actorAction: "adminLogin(username, password)",
                systemResponse: "displayMainInterface()",
                contract: {
                  precondition: "系统处于未登录状态",
                  postcondition: "系统记录登录日志",
                  businessRule: "需要验证管理员身份"
                }
              },
              {
                step: 2,
                actorAction: "selectRoleManagement()",
                systemResponse: "showRoleList()",
                contract: {
                  precondition: "存在至少一个角色",
                  postcondition: "更新角色列表缓存",
                  businessRule: "仅管理员可见"
                }
              }
            ]
          }
        },
      ],

      allRoles: [
        {
          id: 1,
          name: "AuthController",
          layer: "controller",
          interfaces: ["/api/admin/login(POST)", "/api/role-management(GET)"]
        },
        {
          id: 2,
          name: "AuthService",
          layer: "service",
          interfaces: ["adminLogin()", "selectRoleManagement()"]
        },
        {
          id: 3,
          name: "AuthDao",
          layer: "dao",
          interfaces: ["saveLoginLog()", "updateRoleCache()"]
        },
        // 用户操作界面相关角色
        {
          id: 4,
          name: "UserInterfaceController",
          layer: "controller",
          interfaces: ["/api/data-statistics(GET)"]
        },
      ],
    }
  },
  watch: {
    uiCode: {
      immediate: true,
      handler(newCode) {
        this.compileComponent(newCode)
      }
    }
  },
  methods: {
    // 界面设计方法
    compileComponent(code) {
      try {
        const component = new Function(`return ${this.parseCode(code)}`)()
        this.dynamicComponent = component
      } catch (e) {
        console.error('编译错误:', e)
      }
    },

    parseCode(code) {
      return code
          .replace(/<template>/g, '{ template: `')
          .replace(/<\/template>/g, '` }')
          .replace(/v-model/g, 'v-model')
    },
    handleUseCaseSelect(useCaseId) {
      const caseRoleMap = {
        1: [1, 2, 3],    // 用户注册
        2: [4, 5, 6],    // 订单创建
        3: [7, 8, 9],    // 商品查询
        4: [10, 11, 12], // 支付处理
        5: [13, 14, 15], // 库存管理
        6: [16, 17, 18], // 物流跟踪
        7: [19, 20, 21]  // 售后申请
      }

      const roleIds = caseRoleMap[useCaseId] || []

      this.controllerRoles = this.allRoles
          .filter(r => roleIds.includes(r.id) && r.layer === 'controller')
      this.serviceRoles = this.allRoles
          .filter(r => roleIds.includes(r.id) && r.layer === 'service')
      this.daoRoles = this.allRoles
          .filter(r => roleIds.includes(r.id) && r.layer === 'dao')
    },
  },
  mounted() {
    // 初始化所有角色
    this.controllerRoles = this.allRoles.filter(r => r.layer === 'controller')
    this.serviceRoles = this.allRoles.filter(r => r.layer === 'service')
    this.daoRoles = this.allRoles.filter(r => r.layer === 'dao')
  }
}
</script>

<style scoped>
/* 交互图样式 */
.interaction-designer {
  height: calc(100vh - 120px);
  padding: 20px;
}

.image-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.image-container {
  flex: 1;
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  position: relative;
  background: #f8f9fa;
  overflow: hidden;
}

.interaction-image {
  max-width: 100%;
  max-height: 75vh;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  transition: all 0.3s;
  opacity: 0;
}

.upload-overlay:hover {
  opacity: 1;
}

.upload-guide {
  text-align: center;
  color: #606266;
  padding: 30px;
  cursor: pointer;

  .el-icon-upload {
    font-size: 48px;
    color: #c0c4cc;
    margin-bottom: 20px;
  }

  .upload-text {
    font-size: 14px;
    line-height: 1.6;
  }
}

.image-controls {
  margin-top: 20px;
  text-align: center;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .interaction-image {
    width: 100%;
    height: auto;
  }

  .upload-text {
    font-size: 12px;
  }
}

/* 界面设计样式 */
.ui-designer {
  height: calc(100vh - 120px);
}

.code-editor textarea {
  width: 100%;
  height: calc(100% - 40px);
  padding: 10px;
  font-family: Monaco, monospace;
  font-size: 14px;
  border: none;
  resize: none;
}

/* 基础布局优化 */
.architecture-designer {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #f8fafc;
}

/* 分层架构展示区 */
.architecture-layers {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.layers-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  min-height: 300px;
}

.layer {
  padding: 16px;
  border-radius: 8px;
  background: white;
  border-top: 3px solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &.controller {
    border-color: #409EFF;
    background: linear-gradient(15deg, #f0f7ff 0%, #ffffff 100%);
  }
  &.service {
    border-color: #67C23A;
    background: linear-gradient(15deg, #f2f9ef 0%, #ffffff 100%);
  }
  &.dao {
    border-color: #E6A23C;
    background: linear-gradient(15deg, #fdf6ec 0%, #ffffff 100%);
  }

  h3 {
    color: #2c3e50;
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 16px 0;
    padding: 8px 12px;
    background: rgba(255,255,255,0.9);
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
    }
  }
}

/* 角色卡片 */
.role-card {
  padding: 12px;
  margin: 8px 0;
  background: white;
  border-radius: 6px;
  border: 1px solid #eee;
  transition: all 0.2s ease;
  cursor: move;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  }

  .role-name {
    color: #34495e;
    font-size: 13px;
    font-weight: 600;
    margin: 8px 0;
  }
}

.interface-tag {
  margin: 2px;
  background: #f8f9fa;
  color: #5a6c7b;
  font-size: 10px;
  font-family: 'Fira Code', monospace;
  border: none;
}

/* 管理区域 */
.management-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.management-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

/* 用例选择区 */
.use-case-management {
  background: #f8fafb;
  border-radius: 8px;
  padding: 16px;

  .use-case-details {
    margin-top: 16px;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

    h3 {
      color: #2c3e50;
      font-size: 14px;
      margin-bottom: 16px;
    }
  }
}

/* 角色创建面板 */
.role-creator {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);

  h3 {
    color: #2c3e50;
    font-size: 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 3px;
      height: 14px;
      background: #67C23A;
      border-radius: 2px;
    }
  }
}

/* 公共样式 */
.section-title {
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding-left: 12px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 16px;
    background: #409EFF;
    border-radius: 2px;
  }
}

.panel-title {
  color: #34495e;
  font-size: 14px;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #eee;
    margin-left: 12px;
  }
}

/* 响应式处理 */
@media (max-width: 1200px) {
  .management-content {
    grid-template-columns: 1fr;
  }

  .role-creator {
    order: -1;
  }

  .layers-container {
    grid-template-columns: 1fr;
  }
}

.step-detail {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  line-height: 1.6;
  font-size: 13px;

  strong {
    color: #2c3e50;
    font-weight: 500;
  }
}

.contract-collapse {
  margin-top: 8px;
  border: none;
}

</style>