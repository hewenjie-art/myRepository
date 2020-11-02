<!--注册-->
<template>
  <div class="register">
    <div class="top">
      <div class="topLeft"></div>
      <span class="welcome">欢迎注册</span>
      <div class="toLogin" @click="tologin()">已有账号？去登录</div>
    </div>
    <div class="bot">
      <div class="step">
        <el-steps :active="active" finish-status="success">
          <el-step title="验证手机号"></el-step>
          <el-step title="完善信息"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps>
      </div>
      <div class="form">
        <el-form
          v-show="active==0"
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label prop="mobile">
            <el-input placeholder="请输入内容" v-model="ruleForm.mobile" autocomplete="off">
              <template slot="prepend">中国 +86</template>
            </el-input>
          </el-form-item>
          <el-form-item label prop="code">
            <el-input placeholder="请输入内容" v-model="ruleForm.code" autocomplete="off">
              <template slot="prepend">手机验证码</template>
              <el-button slot="append" @click.native="getPhoneCode">{{enterCode}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">下一步</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 用户详细信息 -->
        <el-form v-show="active == 1" :model="formList" class="demo-ruleForm">
          <el-form-item label prop="userName" :label-width="formLabelWidth" class="height">
            <el-input v-model="formList.usersName" autocomplete="off">
              <template slot="prepend">用户名称</template>
            </el-input>
          </el-form-item>
          <el-form-item label prop="email" :label-width="formLabelWidth" class="height">
            <el-input v-model="formList.email" autocomplete="off">
              <template slot="prepend">邮箱</template>
            </el-input>
          </el-form-item>
          <el-form-item label prop="psd" :label-width="formLabelWidth" class="height">
            <el-input v-model="formList.psd" autocomplete="off">
              <template slot="prepend">用户密码</template>
            </el-input>
          </el-form-item>
          <el-form-item label prop="email" :label-width="formLabelWidth" class="height">
            <el-input v-model="formList.phone" autocomplete="off">
              <template slot="prepend">用户电话</template>
            </el-input>
          </el-form-item>
          <el-form-item label prop="age" :label-width="formLabelWidth" class="height">
            <el-input v-model="formList.age" autocomplete="off">
              <template slot="prepend">年龄</template>
            </el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" class="height">
            <el-select placeholder="请选择性别" v-model="formList.sex.id">
              <el-option
                v-for="item in formList.sex"
                :key="item.id"
                :value="item.id"
                :label="item.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="用户角色" :label-width="formLabelWidth" class="height">
            <el-select placeholder="请选择角色" v-model="formList.role.id">
              <el-option
                v-for="item in formList.role"
                :key="item.id"
                :value="item.id"
                :label="item.role"/>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left:150px;">
            <el-button type="primary" @click="submitForm2(formList.usersName,formList.email,formList.psd,
        formList.phone,formList.age,formList.sex.id,formList.role.id)">完成</el-button>
          </el-form-item>
        </el-form>

        <div v-show="active == 2" class="step3">
          <div class="contion">恭喜您，注册成功！</div>
          <el-button class="resToLogin" type="primary" @click="tologin()">去登录</el-button>
        </div>
      </div>
    </div>
    <div class="copy">Copyright ©2019 中原大数据研究院有限公司 版权所有</div>
  </div>
</template>
<script>
  import axios from 'axios'
export default {
  data() {
    return {
      code: '1111',
      active: 0,
      step1: true,
      ruleForm: {
        mobile: "",
        code: "",
        appCode: ""
      },
      enterCode: "获取验证码",
      // rules: {
      //   // app: [{ required: true, message: "请输入APP授权码", trigger: "blur" }],
      //   userName: [
      //     { required: true, message: "请输入用户名称", trigger: "blur" },
      //     { max: 10, message: "用户名称最多为10个字符" }
      //   ],
      //   // account: [
      //   //   { required: true, message: "请输入账号", trigger: "blur" },
      //   //   { min: 6, max: 24, message: "账号长度在6-24个字符", trigger: "blur" },
      //   //   {
      //   //     pattern: /^[a-zA-Z0-9_]{0,}$/,
      //   //     message: "不可以输入中文和特殊字符",
      //   //     trigger: "blur"
      //   //   }
      //   // ],
      //   password: [
      //     { required: true, message: "请输入密码", trigger: "blur" },
      //     {
      //       pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/,
      //       message: "至少包含大写字母,小写字母,数字,且不小于6位不大于16位",
      //       trigger: "blur"
      //     }
      //   ],
      //   telphone: [
      //     { required: true, message: "请输入手机号", trigger: "blur" },
      //     {
      //       pattern: /^1[34578]\d{9}$/,
      //       message: "请输入正确的手机号码",
      //       trigger: "blur"
      //     }
      //   ],
      //   email: [
      //     { required: true, message: "请输入邮箱地址", trigger: "blur" },
      //     { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
      //   ],
      //   companyName: [
      //     { required: true, message: "请输入单位名称", trigger: "blur" },
      //     { max: 24, message: "单位名称最大长度为24个字符" }
      //   ],
      //   companyLicense: [
      //     { max: 18, message: "统一社会信用代码最大长度为18个字符" }
      //   ],
      //   companyAddress: [{ max: 50, message: "单位地址最大长度为50个字符" }],
      //   setRole: [
      //     {
      //       required: true,
      //       message: "请选择角色配置",
      //       trigger: "change"
      //     }
      //   ]
      // },
      formLabelWidth: "150px",
      formLabelheight: '20',
      addRoleVisible: false,
      formList: {
        sex: [],
        role: [],
        usersName: "",
        app: "",
        age: "",
        account: "",
        psd: "",
        phone: "",
        email: "",
        companyName: "",
        companyLicense: "",
        companyAddress: "",
        setRole: [],
        remark: "",
      }
    };
  },
  // 过滤
  filters: {},
  // 模块新建时
  created: function() {},
  // 计算属性
  mounted() {
    axios.post('/api/Fangkong/user/findSexAll').then(res=>{
      this.formList.sex=res.data.object
    });
    axios.post('/api/Fangkong/role/findAll').then(res=>{
      this.formList.role=res.data.object
    })
  },
  // 事件处理
  methods: {
    //   获取验证码
    getPhoneCode() {
      let self = this;
      if (self.ruleForm.mobile == "") {
        self.$message({
          type: "info",
          message: "请输入手机号"
        });
        return;
      }

     axios.post('/api/Fangkong/user/getCode').then(res => {
          if (res.data.status) {
            this.code = res.data.object
            this.$message({
              showClose: true,
              message: this.code+"<------这是你要的验证码,会消失哦"
            });
          }
        })
    },

    // 下一步，获取APP授权码
    submitForm() {

      if(this.ruleForm.code!=this.code) {
          this.$message({
            showClose: true,
            message: '信息有误，请重新输入！',
            type: 'error'
          });
        }else{
          this.active = 1;
        }
    },

    // 重置
    resetForm() {
      this.ruleForm = {
        mobile: "",
        code: ""
      };
    },
    submitForm2(username,email,psd,phone,age,sexId,roleId) {
      if(username==null || email==null || psd==null || phone==null || age==null || sexId==null || roleId==null) {
        this.$notify.error({
          title: '错误',
          message: '信息不完善,请检查信息！'
        });
      }else{
        axios.post('/api/Fangkong/user/register?username='+username+'&email='+email+'&password='
          +psd+'&phone='+phone+'&age='+age+'&sexid='+sexId+'&roleid='+roleId).then(res=>{
          if(res.data.status==200) {
            this.$notify({
              title: '成功',
              message: '添加成功！',
              type: 'success'
            });
            this.active = 2;
          }else{
            this.$notify.error({
              title: '错误',
              message: '添加失败！'
            });
          }
        }).catch(err=>{
          console.log(err)
        })
      }

      /* sessionStorage.setItem('userToken','123')
       sessionStorage.setItem('userId','123')
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          self
            .getAddUser({
              app_token: self.ruleForm.appCode,
              name: self.form.userName,
              account: self.form.account,
              password: self.form.password,
              mobile: self.ruleForm.mobile,
              email: self.form.email,
              company_name: "",
              company_license: "",
              company_address: "",
              role_id_list: [],
              remark: "",
              depts: ''
            })
            .then((data) => {
              if (data.code == "0") {
                this.form.roleName = "";
                this.form.remark = "";
                this.loading = true;
                this.active = 2;
              }
            });
        } else {
          return false;
        }
      });*/
    },
    tologin() {
      this.$router.push({
        path: "/login"
      });
    },
  },
  // 监视
  watch: {}
};
</script>
<style scoped>
.height{
  height: 30px;
}
.resToLogin {
  width: 336px;
  height: 40px;
  background: rgba(26, 220, 255, 1);
  border-radius: 0px !important;
  color: #0a3d75 !important;
}
.step3 {
  width: 100%;
  height: 100%;
  text-align: center;
  margin-left: 50px;
  margin-top: 200px;
}
.contion {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(26, 220, 255, 1);
  line-height: 81px;
}
.step {
  width: 40%;
  height: auto;
  margin: 0 auto;
}
.bot {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 89px;
  left: 0;
  background: url("/static/img/registerBot.png") no-repeat;
  background-size: cover;
  padding-top: 56px;
}
.welcome {
  width: 80px;
  height: 20px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(5, 255, 255, 1);
  line-height: 24px;
  margin-left: 24px;
  margin-top: 37px;
}
.topLeft {
  width: 244px;
  height: 45px;
  margin-left: 43px;
  background: url("/static/img/logo.png") no-repeat;
  background-size: cover;
  float: left;
  margin-top: 19px;
}
.toLogin {
  float: right;
  width: 117px;
  height: 15px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(132, 248, 248, 1);
  line-height: 89px;
  margin-right: 162px;
  cursor: pointer;
}
.top {
  width: 100%;
  height: 89px;
  background: url("/static/img/registerTop.png") no-repeat;
  background-size: cover;
  line-height: 89px;
}
.register {
  width: 100%;
  height: 100%;
  /* overflow: scroll; */
}
.form {
  margin-left: -100px;
  margin-top: 10px;
}
.demo-ruleForm {
  width: 40%;
  height: 100%;
  margin: 0 auto;
  padding-top: 30px;
}
.copy {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  text-align: center;
  line-height: 70px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(20, 137, 204, 0.99);
  opacity: 0.5;
}
</style>
