<!--<template>-->
<!--  <div class="profile-settings">-->
<!--    <el-card class="box-card">-->
<!--      <div slot="header" class="clearfix">-->
<!--        <span>个人设置</span>-->
<!--      </div>-->
<!--      <el-form :model="form" label-width="100px" :rules="rules" ref="profileForm">-->
<!--        <el-form-item label="用户名" prop="username">-->
<!--          <el-input v-model="form.username"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="年龄" prop="age">-->
<!--          <el-input v-model="form.age" type="number"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="职业" prop="profession">-->
<!--          <el-input v-model="form.profession"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="签名" prop="signature">-->
<!--          <el-input type="textarea" v-model="form.signature"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="地址" prop="address">-->
<!--          <el-input v-model="form.address"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="手机" prop="phone">-->
<!--          <el-input v-model="form.phone"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="邮箱" prop="email">-->
<!--          <el-input v-model="form.email"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="onSubmit">保存</el-button>-->
<!--          <el-button @click="onReset">重置</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </el-card>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      form: {-->
<!--        username: '',-->
<!--        age: '',-->
<!--        profession: '',-->
<!--        signature: '',-->
<!--        address: '',-->
<!--        phone: '',-->
<!--        email: ''-->
<!--      },-->
<!--      rules: {-->
<!--        username: [-->
<!--          { required: true, message: '请输入用户名', trigger: 'blur' }-->
<!--        ],-->
<!--        age: [-->
<!--          { required: true, message: '请输入年龄', trigger: 'blur' }-->
<!--        ],-->
<!--        profession: [-->
<!--          { required: true, message: '请输入职业', trigger: 'blur' }-->
<!--        ],-->
<!--        phone: [-->
<!--          { required: true, message: '请输入手机号码', trigger: 'blur' },-->
<!--          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }-->
<!--        ],-->
<!--        email: [-->
<!--          { required: true, message: '请输入邮箱地址', trigger: 'blur' },-->
<!--          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }-->
<!--        ]-->
<!--      }-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    onSubmit() {-->
<!--      this.$refs.profileForm.validate((valid) => {-->
<!--        if (valid) {-->
<!--          alert('保存成功');-->
<!--        } else {-->
<!--          console.log('error submit!!');-->
<!--          return false;-->
<!--        }-->
<!--      });-->
<!--    },-->
<!--    onReset() {-->
<!--      this.$refs.profileForm.resetFields();-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.profile-settings {-->
<!--  padding: 20px;-->
<!--}-->
<!--</style>-->

