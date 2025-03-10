
<template>
  <div class="reqs-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="需求提取"></el-step>
      <el-step title="确定角色"></el-step>
      <el-step title="生成用例"></el-step>
      <el-step title="用例场景"></el-step>
      <el-step title="系统顺序图"></el-step>
    </el-steps>
    <div class="get_reqs" v-show="active === 0">
      <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleFileChange"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传txt文件，仅可单选</div>
      </el-upload>
      <el-card class="box-card" >
        <div slot="header" class="header">
          <span class="header-title">需求管理</span>
          <div class="header-controls">
            <el-input v-model="searchTitle" placeholder="输入标题进行搜索" class="search-input"></el-input>
            <el-button type="primary" @click="fetchData">搜索</el-button>
            <el-button type="success" @click="handleAddReq">添加需求项</el-button>
          </div>

        </div>
        <el-table :data="reqs" style="width: 100%">
          <el-table-column prop="name" label="需求名称"  width="180"></el-table-column>
          <el-table-column prop="description" label="需求描述"  width="180"></el-table-column>
          <el-table-column prop="requirements" label="实现要求"  width="180"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="handleEditReq(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="handleDeleteReq(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <el-form :model="form">
          <el-form-item label="需求名称" :label-width="formLabelWidth">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="需求描述" :label-width="formLabelWidth">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="实现要求" :label-width="formLabelWidth">
            <el-input v-model="form.requirements" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveReq">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="get_actors" v-show="active === 1">
      <el-button
          type="primary"
          @click="generateActors"
          style="margin-bottom: 20px;">
        自动生成角色
      </el-button>
      <el-table :data="actors" style="width: 100%">
        <el-table-column prop="actor_name" label="角色名称"  width="180"></el-table-column>
        <el-table-column prop="function_req" label="对系统要求"  width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEditReq(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDeleteReq(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="get_usecases" v-show="active === 2">
      <div class="usecase-selector">
        <el-select v-model="selectedReqId" placeholder="请选择需求项">
          <el-option
              v-for="req in reqs"
              :key="req.id"
              :label="req.name"
              :value="req.id">
          </el-option>
        </el-select>

        <el-select v-model="selectedActorId" placeholder="请选择角色">
          <el-option
              v-for="actor in actors"
              :key="actor.id"
              :label="actor.actor_name"
              :value="actor.id">
          </el-option>
        </el-select>

        <el-button type="primary" @click="generateUseCase">生成用例</el-button>
      </div>

      <div class="usecase-editor">
        <el-table :data="generatedUseCases" style="width: 100%">
          <el-table-column prop="id" label="用例ID" width="80"></el-table-column>
          <el-table-column prop="title" label="用例标题" width="200"></el-table-column>
          <el-table-column prop="description" label="用例描述" width="300"></el-table-column>
          <el-table-column prop="preconditions" label="前置条件" width="200"></el-table-column>
          <el-table-column prop="expectedResult" label="预期结果" width="200"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="editUseCase(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteUseCase(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :title="usecaseDialogTitle" :visible.sync="usecaseDialogVisible">
          <el-form :model="currentUseCase" label-width="120px">
            <el-form-item label="用例ID"><el-input disabled v-model="currentUseCase.id"></el-input></el-form-item>
            <el-form-item label="用例标题"><el-input v-model="currentUseCase.title"></el-input></el-form-item>
            <el-form-item label="用例描述"><el-input v-model="currentUseCase.description" type="textarea"></el-input></el-form-item>
            <el-form-item label="前置条件"><el-input v-model="currentUseCase.preconditions" type="textarea"></el-input></el-form-item>
            <el-form-item label="预期结果"><el-input v-model="currentUseCase.expectedResult" type="textarea"></el-input></el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="usecaseDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveUseCase">保存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="usecase-description" v-show="active === 3">
      <el-button
          type="success"
          @click="generateScenario"
          style="margin: 0 0 20px 20px;"
          icon="el-icon-data-analysis">
        生成场景步骤
      </el-button>
      <el-table :data="generatedUseCases" style="width: 100%">
        <el-table-column prop="title" label="用例标题" width="300"></el-table-column>
        <el-table-column prop="description" label="用例描述" width="400"></el-table-column>
        <el-table-column label="成功场景" width="120">
          <template slot-scope="scope">
            <el-button
                @click="showSuccessScenario(scope.row)"
                type="text"
                size="small">
              查看说明
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 成功场景对话框 -->
      <el-dialog
          :title="currentUseCase.title"
          :visible.sync="successDialogVisible"
          width="80%"
          top="5vh">
        <div class="scenario-container">
          <!-- 基本信息 -->
          <div class="base-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="相关需求">{{ selectedReq.name }}</el-descriptions-item>
              <el-descriptions-item label="执行角色">{{ selectedActor.actor_name }}</el-descriptions-item>
              <el-descriptions-item label="前置条件" :span="2">{{ currentUseCase.preconditions }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 主成功场景 -->
          <div class="main-scenario">
            <h3>
              成功场景
              <el-button
                  @click="editSteps"
                  type="text"
                  size="small"
                  icon="el-icon-edit">
                编辑
              </el-button>
            </h3>
            <ol class="steps-list" v-if="!editingSteps">
              <li v-for="(step,index) in currentUseCase.mainSteps" :key="index">
                {{ step }}
              </li>
            </ol>
            <div v-else>
              <el-input
                  v-for="(step,index) in editStepList"
                  :key="index"
                  v-model="editStepList[index]"
                  class="step-input"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4}"
              ></el-input>
              <div class="step-controls">
                <el-button @click="addStep" type="text">+ 添加步骤</el-button>
                <el-button @click="removeStep" type="text">- 删除最后</el-button>
              </div>
            </div>
          </div>

          <!-- 预期结果 -->
          <div class="expected-result">
            <h3>预期结果</h3>
            <p>{{ currentUseCase.expectedResult }}</p>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="sequence-container" v-show="active === 4">
      <el-card class="box-card">
        <div slot="header" class="header">
          <span class="title">系统顺序图</span>
          <div class="controls">
            <el-select
                v-model="selectedUseCaseId"
                placeholder="选择用例"
                style="margin-right: 15px;"
                @change="loadSequenceSteps">
              <el-option
                  v-for="uc in generatedUseCases"
                  :key="uc.id"
                  :label="uc.title"
                  :value="uc.id">
              </el-option>
            </el-select>
            <el-button type="primary" @click="addStep">添加步骤</el-button>
          </div>
        </div>
        <!-- 成功场景展示 -->
        <el-card class="scenario-card" v-if="currentScenarioSteps.length > 0">
          <div slot="header" class="scenario-header">
            <i class="el-icon-document"></i>
            <span>当前用例成功场景</span>
          </div>
          <ol class="scenario-steps">
            <li v-for="(step, index) in currentScenarioSteps" :key="index">
              {{ index + 1 }}. {{ step }}
            </li>
          </ol>
        </el-card>

        <el-table :data="sequenceSteps" border class="sequence-table">
          <el-table-column prop="step" label="步骤">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column label="参与者动作">
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.actorAction"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  placeholder="输入参与者行为"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="系统响应">
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.systemResponse"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  placeholder="输入系统响应"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作契约">
            <template slot-scope="scope">
              <el-button
                  @click="editContract(scope.row)"
                  type="text"
                  size="small">
                编辑
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                  @click="removeStep(scope.$index)"
                  type="text"
                  size="small"
                  icon="el-icon-delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="legend">
          <h4>使用说明：</h4>
          <p>1. 从下拉菜单中选择要编辑的用例</p>
          <p>2. 单击单元格可直接编辑内容</p>
          <p>3. 点击"编辑"按钮设置操作契约</p>
        </div>
      </el-card>
      <!-- 操作契约对话框 -->
      <el-dialog
          title="操作契约"
          :visible.sync="contractDialogVisible"
          width="50%">
        <el-form :model="currentContract">
          <el-form-item label="交叉引用" label-width="100px">
            <el-input v-model="currentContract.businessRule" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="前置条件" label-width="100px">
            <el-input v-model="currentContract.precondition" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="后置条件" label-width="100px">
            <el-input v-model="currentContract.postcondition" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
      <el-button @click="contractDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveContract">保存</el-button>
    </span>
      </el-dialog>
    </div>
    <el-button style="margin-top: 12px;" @click="prev">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>

  </div>
</template>

<script>
import {uploadFile} from "@/api/llm.js";
export default {
  data() {
    return {
      currentScenarioSteps: [],
      // 更新示例数据格式
      selectedUseCaseId: null,
      sequenceSteps: [],
      contractDialogVisible: false,
      currentContract: {
        step: null,
        precondition: '',
        postcondition: '',
        businessRule: ''
      },
      // 顺序图存储结构 {用例ID: 步骤数组}
      sequenceDiagrams: {
        1: [
          {
            step: 1,
            actorAction: "adminLogin(username, password)",  // 属性名改为 actorAction
            systemResponse: "displayMainInterface()",       // 属性名改为 systemResponse
            contract: {
              precondition: "系统处于未登录状态",
              postcondition: "系统记录登录日志",
              businessRule: "需要验证管理员身份"
            }
          },
          {
            step: 2,
            actorAction: "selectRoleManagement()",          // 属性名改为 actorAction
            systemResponse: "showRoleList()",               // 属性名改为 systemResponse
            contract: {
              precondition: "存在至少一个角色",
              postcondition: "更新角色列表缓存",
              businessRule: "仅管理员可见"
            }
          }
        ]
      },
      editingSteps: false,
      editStepList: [],
      successDialogVisible: false,
      selectedReq: {
        id: 1,
        name: "权限管理系统",
        description: "系统管理员需要完整的权限管理功能",
        requirements: "1. 实现角色分级机制\n2. 支持权限动态分配\n3. 记录权限变更日志"
      },
      selectedActor:{
        id: 1,
        actor_name: '系统管理员',
        function_req: '管理系统用户权限和配置'
      },
      selectedReqId: '',
      selectedActorId: '',
      generatedUseCases: [{
        id: 1,
        title: "用例-权限管理系统-系统管理员",
        description: "验证系统管理员能否添加新角色",
        preconditions: "系统管理员已登录",
        expectedResult: "新角色成功添加并显示在角色列表中"
      },
        {
          id: 2,
          title: "用例-用户操作界面-普通用户",
          description: "验证普通用户能否查看数据统计页面",
          preconditions: "普通用户已登录",
          expectedResult: "数据统计页面成功加载并显示相关数据"
        },
        {
          id: 3,
          title: "用例-审计追踪系统-审计员",
          description: "验证审计员能否导出操作日志",
          preconditions: "审计员已登录且存在操作日志",
          expectedResult: "操作日志文件成功下载"
        },
        {
          id: 4,
          title: "用例-跨角色协作-系统管理员与审计员",
          description: "验证系统管理员配置用户权限后审计员能否查看",
          preconditions: "系统管理员已登录并配置权限",
          expectedResult: "审计员在日志中看到最新权限变更记录"
        }],
      currentUseCase: {
        id: 1,
        title: "用例-权限管理系统-系统管理员",
        mainSteps: [
          "系统管理员登录管理控制台",
          "进入角色管理模块",
          "点击'新建角色'按钮",
          "填写角色名称和权限配置",
          "提交表单并确认创建成功"
        ],
        extensions: [
          {
            description: "角色名称重复",
            steps: "系统应显示错误提示，要求修改角色名称"
          }
        ],
        preconditions: "系统管理员已登录",
        expectedResult: "新角色成功添加并显示在角色列表中"
      },
      usecaseDialogTitle: '',
      usecaseDialogVisible: false,
      newStep: false,
      newStepText: '',
      fileList: [],
      reqs:[{
        id: 1,
        name: "权限管理系统",
        description: "系统管理员需要完整的权限管理功能",
        requirements: "1. 实现角色分级机制\n2. 支持权限动态分配\n3. 记录权限变更日志"
      },
        {
          id: 2,
          name: "用户操作界面",
          description: "普通用户需要友好的业务操作界面",
          requirements: "1. 提供可视化数据展示\n2. 支持常用操作快捷键\n3. 包含操作指引提示"
        },
        {
          id: 3,
          name: "审计追踪系统",
          description: "审计员需要完整的操作追踪功能",
          requirements: "1. 记录所有敏感操作\n2. 支持日志导出功能\n3. 提供操作时间轴视图"
        },
        {
          id: 4,
          name: "跨角色协作",
          description: "不同角色间的协作需求",
          requirements: "1. 系统管理员可配置用户权限\n2. 审计员可查看普通用户操作记录\n3. 支持角色间消息通知"
        }],
      actors:[{
        id: 1,
        actor_name: '系统管理员',
        function_req: '管理系统用户权限和配置'
      },
        {
          id: 2,
          actor_name: '普通用户',
          function_req: '使用系统核心功能进行日常操作'
        },
        {
          id: 3,
          actor_name: '审计员',
          function_req: '查看系统日志和操作记录'
        }],
      dialogVisible:false,
      formLabelWidth: '100px',
      form:{
        id:0,
        name:'',
        description:'',
        requirements:'',
      },
      dialogTitle:"编辑需求项",
      active: 0
    };
  },
  watch: {
    selectedUseCaseId(newVal) {
      if (newVal) this.loadSequenceSteps();
    }
  },
  methods: {
    // 生成角色方法
    async generateActors() {
      try {
        // 调用API生成角色，这里用模拟数据演示
        const mockActors = [
          { id: 4, actor_name: '访客', function_req: '浏览公开信息' },
          { id: 5, actor_name: '审核员', function_req: '内容审核与批准' }
        ]
        this.actors = [...this.actors, ...mockActors]
        this.$message.success('成功生成2个新角色')
      } catch (error) {
        this.$message.error('角色生成失败: ' + error.message)
      }
    },

    // 生成用例方法
    async generateUseCases() {
      if (!this.selectedReqId || !this.selectedActorId) {
        this.$message.warning('请先选择需求项和角色')
        return
      }

      try {
        // 模拟API调用生成用例
        const newUseCase = {
          id: this.generatedUseCases.length + 1,
          title: `智能生成用例-${Date.now().toString(36)}`,
          description: '系统自动生成的默认用例描述',
          preconditions: '默认前置条件',
          expectedResult: '预期操作成功完成'
        }
        this.generatedUseCases.push(newUseCase)
        this.$message.success('用例生成成功')
      } catch (error) {
        this.$message.error('用例生成失败: ' + error.message)
      }
    },

    // 生成场景步骤方法
    async generateScenario() {
      if (!this.currentUseCase.id) {
        this.$message.warning('请先选择或创建用例')
        return
      }

      try {
        // 模拟生成场景步骤
        const mockSteps = [
          "用户发起操作请求",
          "系统验证权限有效性",
          "执行核心业务逻辑",
          "记录操作日志",
          "返回执行结果"
        ]
        this.currentUseCase.mainSteps = mockSteps
        this.$message.success('成功生成5个场景步骤')
      } catch (error) {
        this.$message.error('场景生成失败: ' + error.message)
      }
    },
    // 加载顺序图步骤
    loadSequenceSteps() {
      if (this.selectedUseCaseId) {
        // 获取关联的用例数据
        const useCase = this.generatedUseCases.find(uc => uc.id === this.selectedUseCaseId);
        // 设置成功场景步骤
        this.currentScenarioSteps = useCase?.mainSteps || [];

        // 加载顺序图步骤
        this.sequenceSteps = this.sequenceDiagrams[this.selectedUseCaseId]?.map((step, index) => ({
          ...step,
          step: index + 1
        })) || [];

      }
    },

    // 编辑契约
    editContract(row) {
      this.currentContract = {
        step: row.step,
        ...row.contract
      };
      this.contractDialogVisible = true;
    },

    // 保存契约
    saveContract() {
      const stepIndex = this.sequenceSteps.findIndex(s => s.step === this.currentContract.step);
      if (stepIndex > -1) {
        this.sequenceSteps[stepIndex].contract = { ...this.currentContract };
        this.$set(this.sequenceSteps, stepIndex, this.sequenceSteps[stepIndex]);
      }
      this.contractDialogVisible = false;
    },
    editSteps() {
      this.editingSteps = true;
      this.editStepList = [...this.currentUseCase.mainSteps];
    },

    saveSteps() {
      this.currentUseCase.mainSteps = [...this.editStepList];
      this.editingSteps = false;
      this.$message.success('步骤保存成功');
    },

    addStep() {
      this.editStepList.push('新步骤描述');
    },

    removeStep() {
      if (this.editStepList.length > 1) {
        this.editStepList.pop();
      }
    },
    showSuccessScenario(useCase) {
      this.successDialogVisible = true
    },


    generateUseCase() {
      if (!this.selectedReqId || !this.selectedActorId) {
        this.$message.warning('请选择需求项和角色');
        return;
      }

      // 根据ID获取对应对象
      this.selectedReq = this.reqs.find(req => req.id === this.selectedReqId);
      this.selectedActor = this.actors.find(actor => actor.id === this.selectedActorId);

      // 根据需求和角色生成用例模板
      const useCase = {
        id: this.currentUseCase.length+1,
        title: `用例-${this.selectedReq.name}-${this.selectedActor.actor_name}`,
        description: `验证${this.selectedActor.actor_name}执行${this.selectedReq.name}需求的功能`,
        preconditions: `系统已登录${this.selectedActor.actor_name}`,
        expectedResult: `登陆成功`
      };

      this.generatedUseCases.push(useCase);
      this.$message.success('用例生成成功');
    },

    editUseCase(useCase) {
      this.usecaseDialogTitle = '编辑用例';
      this.usecaseDialogVisible = true;
      this.currentUseCase = { ...useCase };
    },

    deleteUseCase(useCase) {
      this.generatedUseCases = this.generatedUseCases.filter(u => u.id !== useCase.id);
      this.$message.success('用例删除成功');
    },

    saveUseCase() {
      if (this.editingSteps) {
        this.currentUseCase.mainSteps = [...this.editStepList];
      }
      if (this.currentUseCase.id) {
        // 更新现有用例
        const index = this.generatedUseCases.findIndex(u => u.id === this.currentUseCase.id);
        this.$set(this.generatedUseCases, index, { ...this.currentUseCase });
      } else {
        // 新增用例
        this.generatedUseCases.push({ ...this.currentUseCase, id: Date.now() });
      }
      this.usecaseDialogVisible = false;
      this.currentUseCase = {};
      this.newStep = false;
      this.newStepText = '';
    },

    next() {
      if (this.active++ > 3) {
        this.active = 0;
        this.$router.push('/sdesigns')
      }
    },
    prev() {
      if (this.active > 0) {
        this.active--;
      }
    },
    handleAddReq() {
      this.dialogVisible = true;
      this.form = {name: '', description: '', requirements: '',}
      this.dialogTitle = "添加需求项"
    },
    handleEditReq(req) {
      this.dialogVisible = true;
      this.form = { ...req };
      this.dialogTitle = "编辑需求项"
    },
    handleDeleteReq(req) {
      this.reqs = this.reqs.filter(t => t.id !== req.id);
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList; // 更新文件列表
    },
    submitUpload() {
      if (this.fileList.length === 0) {
        this.$message.warning('请先选择文件');
        return;
      }
      const formData = new FormData();
      this.fileList.forEach(file => {
        formData.append('files', file.raw); // 将文件添加到 FormData
      });

      // 调用封装的 uploadFile 函数
      uploadFile(formData)
          .then(response => {
            this.$message.success('文件上传成功');
            this.reqs = response.data; // 将后端返回的对象列表赋值给 responseData
            console.log('后端返回的数据:', response.data);
          })
          .catch(error => {
            this.$message.error('文件上传失败');
            console.error('上传失败:', error);
          });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSaveReq() {
      if (this.form.id) {
        const index = this.reqs.findIndex(t => t.id === this.form.id);
        if (index !== -1) {
          this.$set(this.reqs, index, { ...this.form });
        }
      } else {
        const newTour = { ...this.form, id: this.reqs.length + 1 };
        this.reqs.push(newTour);
      }
      this.dialogVisible = false;
    },
    handlePreview(file) {
      console.log(file);
    }
  }
}
</script>
<style scoped>
.step-controls {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}
.reqs-container {
  padding: 20px;
}
.box-card{
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}
.header-controls {
  display: flex;
  align-items: center;
}
.header-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
