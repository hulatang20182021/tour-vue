<template>
  <div class="module-design">
    <!-- 左侧导航 -->
    <div class="nav-menu">
      <div class="nav-header">
        <i class="el-icon-menu"></i>
        模块导航
      </div>
      <div
          v-for="module in modules"
          :key="module.id"
          class="nav-item"
          :class="{ active: selectedModule?.id === module.id }"
          @click="selectModule(module)"
      >
        <i class="el-icon-folder-opened"></i>
        {{ module.name }}
        <div
            v-for="subModule in module.subModules"
            :key="subModule.id"
            class="sub-nav-item"
            :class="{ active: selectedModule?.id === subModule.id }"
            @click.stop="selectModule(subModule)"
        >
          <i class="el-icon-folder"></i>
          {{ subModule.name }}
        </div>
      </div>
    </div>

    <!-- 右侧详情 -->
    <div class="design-container">
      <template v-if="selectedModule">
        <!-- 模块基本信息 -->
        <el-card class="section-card">
          <div class="card-header">
            <h2><i class="el-icon-document"></i> {{ selectedModule.name }} 详细设计</h2>
            <div class="meta-info">
              <el-tag type="info" size="small">ID: {{ selectedModule.id }}</el-tag>
              <el-tag type="success" size="small">{{ selectedModule.author }}</el-tag>
              <el-tag type="warning" size="small">{{ selectedModule.updated }}</el-tag>
            </div>
          </div>
          <el-divider></el-divider>
          <p class="description">{{ selectedModule.description }}</p>
        </el-card>

        <!-- 类设计 -->
        <el-card class="section-card">
          <div class="card-header">
            <h3><i class="el-icon-cpu"></i> 类设计</h3>
          </div>
          <el-divider></el-divider>
          <div
              v-for="cls in selectedModule.classes"
              :key="cls.name"
              class="design-card"
          >
            <div class="class-header">
              <span class="class-name">{{ cls.name }}</span>
              <el-tag effect="plain" :type="getClassTagType(cls.type)" size="small">
                {{ cls.type }}
              </el-tag>
            </div>
            <p class="responsibility"><strong>职责：</strong>{{ cls.responsibility }}</p>
            <el-divider></el-divider>
            <div class="methods">
              <div
                  v-for="method in cls.methods"
                  :key="method.name"
                  class="method-item"
              >
                <el-tag size="mini" effect="dark" type="info" class="method-tag">方法</el-tag>
                <code>{{ method.name }}</code>
                <span class="method-desc">{{ method.description }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 接口设计 -->
        <el-card class="section-card">
          <div class="card-header">
            <h3><i class="el-icon-connection"></i> 接口设计</h3>
          </div>
          <el-divider></el-divider>
          <el-table
              :data="selectedModule.apis"
              border
              style="width: 100%"
              class="api-table"
          >
            <el-table-column prop="name" label="接口名称" width="180" />
            <el-table-column label="请求方式" width="100">
              <template #default="{ row }">
                <el-tag
                    :type="getMethodTagType(row.method)"
                    effect="dark"
                    size="small"
                >
                  {{ row.method }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="url" label="URL" width="220">
              <template #default="{ row }">
                <code class="api-url">{{ row.url }}</code>
              </template>
            </el-table-column>
            <el-table-column label="输入参数">
              <template #default="{ row }">
                <param-list :params="row.input"/>
              </template>
            </el-table-column>
            <el-table-column label="输出参数">
              <template #default="{ row }">
                <param-list :params="row.output"/>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </template>

      <el-empty
          v-else
          description="请从左侧选择要查看的模块"
          class="empty-tip"
          :image-size="200"
      ></el-empty>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ParamList: {
      props: ['params'],
      template: `
        <div class="param-list">
          <div
              v-for="(param, index) in params"
              :key="index"
              class="param-item"
          >
            <el-tag
                v-if="param.required"
                type="danger"
                size="mini"
                effect="plain"
                class="required-tag"
            >
              Required
            </el-tag>
            <span class="param-name">{{ param.name }}</span>
            <el-tag
                size="mini"
                effect="plain"
                type="info"
                class="type-tag"
            >
              {{ param.type }}
            </el-tag>
          </div>
        </div>
      `
    }
  },
  data() {
    return {
      selectedModule: null,
      modules: [
        {
          id: 'user-management',
          name: '用户管理模块',
          author: '王工程师',
          updated: '2023-07-20',
          description: '负责系统的用户认证、权限管理和个人资料维护',
          subModules: [
            {
              id: 'auth-sub',
              name: '认证子模块',
              classes: [
                {
                  name: 'AuthService',
                  type: '服务类',
                  responsibility: '处理用户登录、令牌颁发和权限验证',
                  methods: [
                    { name: 'login(username, password)', description: '用户登录验证' },
                    { name: 'refreshToken(token)', description: '令牌刷新' },
                    { name: 'checkPermission(user, resource)', description: '权限验证' }
                  ]
                }
              ],
              apis: [
                {
                  name: '用户登录',
                  method: 'POST',
                  url: '/api/v1/auth/login',
                  input: [
                    { name: 'username', type: 'string', required: true },
                    { name: 'password', type: 'string', required: true }
                  ],
                  output: [
                    { name: 'token', type: 'string' },
                    { name: 'expires', type: 'number' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    selectModule(module) {
      this.selectedModule = module
    },
    getMethodTagType(method) {
      const types = {
        GET: 'success',
        POST: 'primary',
        PUT: 'warning',
        DELETE: 'danger'
      }
      return types[method] || 'info'
    },
    getClassTagType(type) {
      const types = {
        '服务类': 'primary',
        '实体类': 'success',
        '工具类': 'warning',
        '接口类': 'danger'
      }
      return types[type] || 'info'
    }
  }
}
</script>

<style scoped>
.module-design {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  padding: 24px;
  height: 100vh;
  background: #f5f7fa;
  box-sizing: border-box;
}

.nav-menu {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(28, 36, 56, 0.08);
}

.nav-header {
  padding: 12px 16px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  i {
    margin-right: 8px;
    color: #409eff;
  }
}

.nav-item {
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 6px;
  cursor: pointer;
  color: #606266;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: #f0faff;
  }

  &.active {
    background: #409eff;
    color: white;

    i {
      color: white;
    }
  }

  i {
    margin-right: 8px;
    color: #909399;
    font-size: 16px;
  }
}

.sub-nav-item {
  padding: 8px 8px 8px 32px;
  font-size: 0.9em;
  margin: 4px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;

  &:hover {
    background: #f8f8f8;
  }

  &.active {
    color: #409eff;
    font-weight: 500;
    background: #f0faff;

    i {
      color: #409eff;
    }
  }

  i {
    font-size: 14px;
    margin-right: 6px;
  }
}

.design-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(28, 36, 56, 0.08);
  overflow-y: auto;
}

.section-card {
  margin-bottom: 24px;
  border: none !important;

  &:last-child {
    margin-bottom: 0;
  }

  ::v-deep .el-card__body {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 18px;
    color: #303133;
    display: flex;
    align-items: center;

    i {
      color: #409eff;
      margin-right: 10px;
      font-size: 20px;
    }
  }

  h3 {
    margin: 0;
    font-size: 16px;
  }
}

.meta-info {
  .el-tag {
    margin-left: 8px;
  }
}

.description {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.design-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  background: #f8fafc;

  .class-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .class-name {
      font-size: 16px;
      font-weight: 500;
      margin-right: 12px;
    }
  }

  .responsibility {
    color: #606266;
    margin: 8px 0;
  }
}

.method-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;

  &:last-child {
    border-bottom: none;
  }

  .method-tag {
    margin-right: 8px;
    width: 40px;
    text-align: center;
  }

  code {
    margin-right: 12px;
    color: #409eff;
    font-family: 'Courier New', monospace;
    font-size: 14px;
  }

  .method-desc {
    color: #909399;
    font-size: 0.9em;
  }
}

.api-table {
  ::v-deep th {
    background-color: #f8fafc !important;
  }

  .api-url {
    color: #67c23a;
    font-family: 'Courier New', monospace;
  }
}

.param-list {
  .param-item {
    display: flex;
    align-items: center;
    margin: 4px 0;

    .param-name {
      margin: 0 8px;
      font-size: 0.9em;
    }

    .required-tag {
      width: 55px;
    }

    .type-tag {
      min-width: 50px;
      justify-content: center;
    }
  }
}

.empty-tip {
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;

  ::v-deep .el-empty__description {
    margin-top: 10px;
  }
}

.el-divider {
  margin: 16px 0;
  background-color: #ebeef5;
}
</style>