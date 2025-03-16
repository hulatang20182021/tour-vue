
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
        <el-button size="small" type="primary" @click="sendReqsToBackend" style="margin-left: 10px;">保存需求</el-button>
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
      <el-button
          type="success"
          @click="handleAddActor"
          style="margin-bottom: 20px; margin-left: 10px;">
        添加角色
      </el-button>
      <el-button
          type="warning"
          @click="saveActorsToBackend"
          style="margin-bottom: 20px; margin-left: 10px;">
        保存角色
      </el-button>
      <el-table :data="actors" style="width: 100%">
        <el-table-column prop="actor_name" label="角色名称"  width="180"></el-table-column>
        <el-table-column prop="function_req" label="对系统要求"  width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEditActor(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDeleteActor(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框 -->
      <el-dialog :title="actorDialogTitle" :visible.sync="dialogVisibleActor">
        <el-form :model="formActor">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="formActor.actor_name"></el-input>
          </el-form-item>
          <el-form-item label="功能要求" :label-width="formLabelWidth">
            <el-input v-model="formActor.function_req" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleActor = false">取消</el-button>
          <el-button type="primary" @click="saveActor">保存</el-button>
        </div>
      </el-dialog>
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
        <el-button
            type="primary"
            @click="handleAddBlankUseCase"
            :disabled="!selectedReqId || !selectedActorId">
          添加用例
        </el-button>
        <el-button type="primary" @click="generateUseCase">生成用例</el-button>
        <el-button
            type="success"
            @click="saveUseCases"
            :disabled="usecases.length === 0"
            style="margin-left: 10px;">
          保存用例
        </el-button>
      </div>

      <div class="usecase-editor">
        <el-table :data="usecases" style="width: 100%">
          <el-table-column prop="actor" label="角色" width="80"></el-table-column>
          <el-table-column prop="title" label="用例" width="200"></el-table-column>
          <el-table-column prop="description" label="用例描述" width="300"></el-table-column>
          <el-table-column prop="preconditions" label="前置条件" width="200"></el-table-column>
          <el-table-column prop="postconditions" label="后置条件" width="200"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="editUseCase(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteUseCase(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :title="usecaseDialogTitle" :visible.sync="usecaseDialogVisible">
          <el-form :model="currentUseCase" label-width="120px">
            <el-form-item label="角色">
              <el-input v-model="currentUseCase.actor"></el-input>
            </el-form-item>

            <el-form-item label="用例标题">
              <el-input v-model="currentUseCase.title"></el-input>
            </el-form-item>

            <el-form-item label="用例描述">
              <el-input
                  v-model="currentUseCase.description"
                  type="textarea"
                  :rows="3"></el-input>
            </el-form-item>

            <el-form-item label="前置条件">
              <el-input
                  v-model="currentUseCase.preconditions"
                  type="textarea"
                  :rows="2"></el-input>
            </el-form-item>

            <el-form-item label="后置条件">
              <el-input
                  v-model="currentUseCase.postconditions"
                  type="textarea"
                  :rows="2"></el-input>
            </el-form-item>
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
      <el-button
          type="primary"
          @click="saveAllSteps"
          style="margin: 0 0 20px 20px;"
          icon="el-icon-finished">
        保存所有步骤
      </el-button>
      <el-table :data="usecases" style="width: 100%">
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
              <el-descriptions-item label="关联角色">{{ currentUseCase.actor }}</el-descriptions-item>
              <el-descriptions-item label="需求来源">{{ getReqName(currentUseCase.reqId) }}</el-descriptions-item>
              <el-descriptions-item label="前置条件" :span="2">{{ currentUseCase.preconditions }}</el-descriptions-item>
              <el-descriptions-item label="后置条件" :span="2">{{ currentUseCase.postconditions }}</el-descriptions-item>
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
                <el-button @click="addStep" type="text" icon="el-icon-plus">+ 添加步骤</el-button>
                <el-button @click="saveSteps" type="success" icon="el-icon-check">保存修改</el-button>
                <el-button @click="removeStep" type="info" plain> 删除最后</el-button>
              </div>
            </div>
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
                  v-for="uc in usecases"
                  :key="uc.id"
                  :label="uc.title"
                  :value="uc.id">
              </el-option>
            </el-select>
            <el-button type="primary" @click="addStep">添加步骤</el-button>
            <el-button
                type="success"
                @click="generateSequenceDiagram"
                :disabled="!selectedUseCaseId">
              生成系统顺序图
            </el-button>
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
              {{ step }}
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
    <el-button type="primary" @click="loadInitialData">加载初始数据</el-button>
  </div>
</template>

<script>
import {uploadFile,getActors,saveReqs,fetchInitialReqs,saveActors,fetchInitialActors,generateUseCases,saveUseCases,fetchInitialUseCases,deleteUseCase,batchGenerateScenarios,batchSaveScenarioSteps,fetchInitialCaseSteps,generateSequenceDiagram} from "@/api/llm.js";
export default {
  data() {
    return {
      // 新增数据项
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
      usecases:[],
      currentUseCase: {},
      usecaseDialogTitle: '',
      usecaseDialogVisible: false,
      newStep: false,
      newStepText: '',
      // 角色相关数据
      dialogVisibleActor: false,
      actorDialogTitle: "添加角色",
      formActor: {
        id: null,
        actor_name: "",
        function_req: ""
      },
      fileList: [],
      reqs:[],
      actors:[],
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
    // 加载数据
    // 在组件的 methods 中添加以下方法
    async loadInitialData() {
      try {
        // 调用初始化接口获取第一页数据（默认每页10条）
        const { data: res } = await fetchInitialReqs({
        });
        if (res.code === 200) {
          // 结构化处理返回数据
          console.log(res)
          this.reqs = res.data.map(item => ({
            id: item.id || Date.now(), // 确保每个需求有唯一ID
            name: item.name,
            requirements: item.requirements || "", // 处理空值情况
            description: item.description || ""
          }));

          this.$message.success(`成功加载 ${res.data.length} 个需求项`);
        } else {
          this.$message.error("初始化数据失败：" + res.message);
          console.error("初始化接口错误:", res);
        }

        const { data: actors } = await fetchInitialActors({
        });
        if (actors.code === 200) {
          // 结构化处理返回数据
          console.log(actors)
          this.actors = actors.data.map(item => ({
            id: item.id, // 确保每个需求有唯一ID
            actor_name: item.actor_name,
            function_req: item.function_req || ""
          }));

          this.$message.success(`成功加载 ${actors.data.length} 个角色`);
        } else {
          this.$message.error("初始化数据失败：" + actors.message);
          console.error("初始化接口错误:", res);
        }

        // 新增：加载用例数据
        const { data: usecasesRes } = await fetchInitialUseCases();
        if (usecasesRes.code === 200) {
          this.usecases = usecasesRes.data.map(uc => ({
            id: uc.id,
            reqId: uc.req_id,
            actorId: uc.actor_id,
            title: uc.title,
            description: uc.description || "",
            preconditions: uc.preconditions || "",
            postconditions: uc.postconditions || "",
            actor: this.actors.find(a => a.id === uc.actor_id)?.actor_name || "未知角色"
          }));
          this.$message.success(`成功加载 ${usecasesRes.data.length} 个用例`);
        }

        // 4. 加载场景步骤并合并
        const { data: stepsRes } = await fetchInitialCaseSteps();
        if (stepsRes.code === 200) {
          // 将步骤数组转换为 { 用例ID: 步骤数组 } 的结构
          const stepsMap = stepsRes.data.reduce((map, step) => {
            const useCaseId = step.use_case_id;
            if (!map[useCaseId]) map[useCaseId] = [];
            map[useCaseId].push({
              id: step.id,
              number: step.step_number,
              description: step.description
            });
            return map;
          }, {});

          // 按步骤顺序排序并合并到用例
          this.usecases = this.usecases.map(uc => {
            const steps = stepsMap[uc.id] || [];
            return {
              ...uc,
              mainSteps: steps.map(step => step.description)
            };
          });

          this.$message.success(`成功加载 ${stepsRes.data.length} 个场景步骤`);}


      } catch (error) {
        this.$message.error("服务器连接失败");
        console.error("初始化数据请求失败:", error);
      }
    },
    // 新增保存角色方法
    async saveActorsToBackend() {
      try {
        if (this.actors.length === 0) {
          this.$message.warning('当前没有需要保存的角色');
          return;
        }

        const { data: res } = await saveActors(this.actors);

        if (res.code === 200) {
          this.$message.success(`成功保存 ${this.actors.length} 个角色`);
        } else {
          this.$message.error('角色保存失败: ' + res.message);
        }
      } catch (error) {
        console.error('保存角色失败:', error);
        this.$message.error('保存失败: ' + (error.response?.data?.message || '服务器错误'));
        console.log(error)
        // 显示详细错误信息
        if (error.response?.data?.errors) {
          error.response.data.errors.forEach(err => {
            this.$notify.error({
              title: '数据校验错误',
              message: `字段 ${err.field}: ${err.message}`
            });
          });
        }
      }
    },
    // 添加角色方法
    handleAddActor() {
      this.formActor = { id: null, actor_name: "", function_req: "" };
      this.actorDialogTitle = "添加角色";
      this.dialogVisibleActor = true;
    },

    handleEditActor(actor) {
      this.formActor = { ...actor };
      this.actorDialogTitle = "编辑角色";
      this.dialogVisibleActor = true;
    },

    handleDeleteActor(actor) {
      this.actors = this.actors.filter(a => a.id !== actor.id);
      this.$message.success("角色删除成功");
    },

    saveActor() {
      if (!this.formActor.actor_name) {
        this.$message.warning("请填写角色名称");
        return;
      }

      if (this.formActor.id) {
        // 更新已有角色
        const index = this.actors.findIndex(a => a.id === this.formActor.id);
        this.$set(this.actors, index, { ...this.formActor });
      } else {
        // 添加新角色
        this.actors.push({
          ...this.formActor,
          id: Date.now() // 生成唯一ID
        });
      }
      this.dialogVisibleActor = false;
      this.$message.success("角色保存成功");
    },
    // 生成角色方法
    async generateActors() {
      try {
        // 发送整个reqs数组到后端
        const { data: res } = await getActors({
          requirements: this.reqs  // 直接传递整个reqs数组
        });

        console.log(res)
        // 处理返回的actors数据
        this.actors = res.map(actor => ({
            ...actor,
            // 确保数据结构与前端匹配
            actor_name: actor.name,
            function_req: actor.description
        }));

        this.$message.success(`成功生成 ${this.actors.length} 个角色`);

      } catch (error) {
        console.error('生成角色失败:', error);
        this.$message.error('角色生成失败: ' + (error.response?.data?.message || '服务器错误'));

        // 显示详细错误
        if (error.response?.data?.details) {
          this.$notify.error({
            title: '错误详情',
            message: JSON.stringify(error.response.data.details)
          });
        }
      }
    },

    // 批量保存方法
    async saveAllSteps() {
      try {
        this.$confirm('确定要保存所有用例的场景步骤吗？', '批量保存确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const payload = this.usecases
              .filter(uc => uc.mainSteps?.length)
              .map(uc => ({
                use_case_id: uc.id,
                steps: uc.mainSteps
              }));

          if (payload.length === 0) {
            this.$message.warning('没有需要保存的步骤');
            return;
          }

          const { data: res } = await batchSaveScenarioSteps({ steps: payload });

          if (res.code === 200) {
            this.$message.success(`成功保存${res.data.count}个用例的步骤`);
          }
        });
      } catch (error) {
        this.$message.error(`保存失败: ${error.response?.data?.message || '服务器错误'}`);
        console.error('批量保存错误:', error);
      }
    },
    // 生成用例场景
    async generateScenario() {
      if (this.usecases.length === 0) {
        this.$message.warning('请先创建或选择用例')
        return
      }

      try {
        const selectedIds = this.usecases.map(uc => uc.id)
        const { data: res } = await batchGenerateScenarios(selectedIds)

        if (res.code === 200) {
          console.log(res)
          // 批量更新用例步骤
          this.usecases = this.usecases.map(uc => ({
            ...uc,
            mainSteps: res.data[uc.id] || [],
          }))
          this.$message.success(`成功生成${Object.keys(res.data).length}个用例场景`)
          console.log(this.usecases)
        }
      } catch (error) {
        console.log(error)
        this.$message.error('生成失败: ' + (error.response?.data?.message || '服务器错误'))
      }
    },

    // 生成系统顺序图
    async generateSequenceDiagram() {
      try {
        if (!this.selectedUseCaseId) {
          this.$message.warning('请先选择要生成的用例');
          return;
        }

        const useCase = this.usecases.find(uc => uc.id === this.selectedUseCaseId);
        if (!useCase?.mainSteps?.length) {
          this.$message.warning('该用例没有场景步骤，请先生成场景步骤');
          return;
        }

        this.$confirm('此操作将覆盖现有顺序图，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data: res } = await generateSequenceDiagram({
            useCaseId: this.selectedUseCaseId,
            steps: useCase.mainSteps
          });

          if (res.code === 200) {
            // 转换数据结构
            this.sequenceSteps = res.data.map((step, index) => ({
              step: index + 1,
              actorAction: step.actorAction,
              systemResponse: step.systemResponse,
              contract: {
                businessRule: step.contract?.businessRule || '',
                precondition: step.contract?.precondition || '',
                postcondition: step.contract?.postcondition || ''
              }
            }));

            // 保存到本地存储
            this.$set(this.sequenceDiagrams, this.selectedUseCaseId, this.sequenceSteps);

            this.$message.success('顺序图生成成功');
          }
        });
      } catch (error) {
        console.error('生成顺序图失败:', error);
        this.$message.error(`生成失败: ${error.response?.data?.message || '服务器错误'}`);
      }
    },

    // 加载顺序图步骤
    loadSequenceSteps() {
      if (this.selectedUseCaseId) {
        const useCase = this.usecases.find(uc => uc.id === this.selectedUseCaseId);

        // 设置成功场景步骤
        this.currentScenarioSteps = useCase?.mainSteps || [];

        // 保留已存在的编辑内容
        const existingData = this.sequenceDiagrams[this.selectedUseCaseId];
        if (existingData) {
          this.sequenceSteps = this.sequenceSteps.map((step, index) =>
              existingData[index] ? { ...step, ...existingData[index] } : step
          );
        }
      }
    },
    // 解析参与者动作（示例解析逻辑）
    parseActorAction(step) {
      const actionKeywords = ["点击", "输入", "选择", "提交"];
      const match = actionKeywords.find(keyword => step.includes(keyword));
      return match ? step.split(match)[0] + match : step;
    },

    // 添加顺序步骤
    addSequenceStep() {
      this.sequenceSteps.push({
        step: this.sequenceSteps.length + 1,
        actorAction: "",
        systemResponse: "",
        contract: {
          businessRule: "",
          precondition: "",
          postcondition: ""
        }
      });
    },

    // 删除顺序步骤
    removeSequenceStep(index) {
      this.$confirm('确定删除该步骤吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sequenceSteps.splice(index, 1);
        // 更新步骤序号
        this.sequenceSteps = this.sequenceSteps.map((step, idx) => ({
          ...step,
          step: idx + 1
        }));
      });
    },

    // 保存顺序图数据
    saveSequenceDiagram() {
      if (this.selectedUseCaseId) {
        this.$set(this.sequenceDiagrams, this.selectedUseCaseId, this.sequenceSteps);
        this.$message.success('顺序图已保存');
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
      this.editingSteps = true
      this.editStepList = [...this.currentUseCase.mainSteps]
      this.$nextTick(() => {
        if (this.$refs.stepInputs?.[0]) {
          this.$refs.stepInputs[0].focus()
        }
      })
    },

    // 改进的添加步骤方法
    addStep() {
      this.editStepList.push('请输入步骤描述')
      this.$nextTick(() => {
        const lastIndex = this.editStepList.length - 1
        this.$refs.stepInputs[lastIndex].focus()
        document.querySelector('.step-edit-item:last-child').scrollIntoView()
      })
    },
    removeStep(index) {
      this.$confirm('确定要删除该步骤吗？', '提示', {
        type: 'warning'
      }).then(() => {
        if (this.editStepList.length > 1) {
          this.editStepList.splice(index, 1)
          this.$message.success('步骤删除成功')
        } else {
          this.$message.warning('至少需要保留一个步骤')
        }
      }).catch(() => {
        // 取消删除时不执行任何操作
      })
    },
    saveSteps() {
      this.currentUseCase.mainSteps = [...this.editStepList]
      const index = this.usecases.findIndex(uc => uc.id === this.currentUseCase.id)
      if (index > -1) {
        this.$set(this.usecases, index, {...this.currentUseCase})
      }
      this.editingSteps = false
    },
    // 获取关联需求名称
    getReqName(reqId) {
      return this.reqs.find(r => r.id === reqId)?.name || '未关联需求'
    },
    showSuccessScenario(useCase) {
      this.currentUseCase = {
        ...useCase,
      }
      this.successDialogVisible = true
    },

    async saveUseCases() {
      if (this.usecases.length === 0) {
        this.$message.warning('没有需要保存的用例')
        return
      }

      try {
        // 格式化数据（处理新旧数据兼容）

        const payload = this.usecases.map(uc => ({
          reqId: uc.reqId || uc.req_id,
          actorId: uc.actorId || uc.actor_id,
          title: uc.title,
          description: uc.description || '',
          preconditions: uc.preconditions || '',
          postconditions: uc.postconditions || ''
        }))
        console.log(payload)
        const { data: res } = await saveUseCases(payload)

        if (res.code === 200) {
          console.log(res)
          // 更新本地ID并合并新用例
          const updatedCases = this.usecases.map((uc, index) => ({
            ...uc,
            id: res.data.ids[index] || uc.id
          }))

          this.usecases = updatedCases
          this.$message.success(`成功保存${res.data.count}个用例`)

          // 触发数据更新事件
          this.$emit('usecases-updated', updatedCases)
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || '服务器错误'
        this.$message.error(`保存失败: ${errorMsg}`)
        console.log(error)
        // 显示详细错误（开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.error('保存错误详情:', error.response?.data)
        }
      } finally {
        this.saving = false
      }
    },

    async generateUseCase() {
      if (!this.selectedReqId || !this.selectedActorId) {
        this.$message.warning('请先选择需求项和角色')
        return
      }

      try {
        const { data: res } = await generateUseCases({
          req_id: this.selectedReqId,
          actor_id: this.selectedActorId
        })

        if (res.code === 200) {
          console.log(res)
          // 转换后端数据结构
          const generated = res.data.map(uc => ({
            id: uc.case_id || Date.now(),
            reqId: this.selectedReqId,
            actorId: this.selectedActorId,
            title: uc.title,
            description: uc.description,
            preconditions: uc.preconditions,
            postconditions: uc.postconditions,
            // 添加角色名称显示
            actor: this.actors.find(a => a.id === this.selectedActorId)?.actor_name
          }))

          // 合并到现有用例列表
          this.usecases = [...this.usecases, ...generated]
          this.$message.success(`成功生成${generated.length}个用例`)
        } else {
          this.$message.error(res.message || '用例生成失败')
          console.log(res)
        }
      } catch (error) {
        console.error('生成用例失败:', error)
        console.log(error)
        this.$message.error(`请求失败: ${error.message}`)
      }
    },
    handleAddBlankUseCase() {
      const selectedReq = this.reqs.find(r => r.id === this.selectedReqId)
      const selectedActor = this.actors.find(a => a.id === this.selectedActorId)

      if (!selectedReq || !selectedActor) {
        this.$message.warning('请先选择需求项和角色')
        return
      }

      this.usecases.push({
        id: Date.now(),
        actor: selectedActor.actor_name,
        title: `${selectedReq.name}-${selectedActor.actor_name}`,
        description: '',
        preconditions: '',
        postconditions: '',
        // 新增关联ID用于后续编辑
        reqId: this.selectedReqId,
        actorId: this.selectedActorId
      })
    },
    // 编辑用例
    editUseCase(row) {
      this.currentUseCase = {
        ...row,
        // 兼容新旧数据结构
        actor: row.actor || this.actors.find(a => a.id === row.actorId)?.actor_name,
        title: row.title || '',
        description: row.description || '',
        preconditions: row.preconditions || '',
        postconditions: row.postconditions || ''
      }
      this.usecaseDialogTitle = '编辑用例 - ' + row.title
      this.usecaseDialogVisible = true
    },

    async deleteUseCase(useCase) {
      try {
        await this.$confirm('此操作将永久删除该用例，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const { data: res } = await deleteUseCase(useCase.id)
        if (res.code === 200) {
          this.usecases = this.usecases.filter(u => u.id !== useCase.id)
          this.$message.success('用例删除成功')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败: ' + (error.response?.data?.message || '服务器错误'))
        }
      }
    },

    // 保存用例
    saveUseCase() {
      if (!this.currentUseCase.title) {
        this.$message.warning('请填写用例标题')
        return
      }

      const index = this.usecases.findIndex(u => u.id === this.currentUseCase.id)
      if (index > -1) {
        // 更新关联的角色名称
        const targetActor = this.actors.find(a => a.id === this.currentUseCase.actorId)
        this.$set(this.usecases, index, {
          ...this.currentUseCase,
          actor: targetActor ? targetActor.actor_name : this.currentUseCase.actor
        })
        this.$message.success('用例更新成功')
      } else {
        this.usecases.push({...this.currentUseCase})
        this.$message.success('用例新增成功')
      }
      this.usecaseDialogVisible = false
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
    // 保存需求
    async sendReqsToBackend() {
      try {
        const response = await saveReqs(this.reqs); // 调用 API
        if (response.data.code === 200) {
          this.$message.success("需求项已成功保存到后端");
        } else {
          this.$message.error("保存失败，请检查后端接口");
          console.log(response);
        }
      } catch (error) {
        console.error("保存失败:", error);
        this.$message.error("服务器错误");
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
