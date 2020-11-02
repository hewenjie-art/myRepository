<!--用户列表-->
<template>
    <div class="role">
        <div class="seek">
            <div class="formContent">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="手机号" class="label">
                        <el-input v-model="searchPhone" placeholder="请输入内容" value=''></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="toAddUser()">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="roleList">
            <el-table
              v-loading="loading"
              :data="tableData"
              border
              row-key="id"
              lazy
              :load="load"
              :row-class-name="tableRowClassName"
              style=" width: 96%;margin-left:30px;margin-top:30px;" :header-cell-style="{background:'#f5f6fa'}">
              <el-table-column
                fixed
                label="序号"
                width="100px">
                <template slot-scope="scope">
                  {{scope.$index+1}}
                </template>
              </el-table-column>
                <el-table-column
                  prop="username"
                  label="用户名"
                  width="180"
                  header-align="center"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱"
                  width="180"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="电话号码"
                  width="180"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="sex.name"
                  label="性别"
                  width="180"
                  align="center">
                </el-table-column>
              <el-table-column
                prop="role.role"
                label="角色"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                prop="age"
                label="年龄"
                width="180"
                align="center">
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="350">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="max"
                    class="config-btn"
                    style="width:70px;"
                    @click.native.prevent="toEditUser(scope.row)">编辑
                  </el-button>
                  <el-button
                    type="danger"
                    class="blue-btn"
                    size="max"
                    style="width:70px"
                    @click.native.prevent="toDel(scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!--分页-->
            <div class="paginationCon">
                <el-pagination
                  v-show="isShow"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[2, 3, 4, 5]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totals">
                </el-pagination>
            </div>
        </div>

        <!-- 添加用户弹出框 -->
        <el-dialog
                :close-on-click-modal="false"
                width="35%"
                title="添加用户信息"
                :visible="addUserForm"
                :modal-append-to-body='false'
                @close='resetForm'
        >
            <el-form ref="userForm" :model="userForm">
                <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="addUser.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="addUser.email"></el-input>
                </el-form-item>
              <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                <el-input autocomplete="off" v-model="addUser.password"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="phone" :label-width="formLabelWidth">
                <el-input autocomplete="off" v-model="addUser.phone"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="age" :label-width="formLabelWidth">
                <el-input autocomplete="off" v-model="addUser.age"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sexId" :label-width="formLabelWidth">
                <el-select placeholder="请选择性别" v-model="addUser.sexList.id">
                  <el-option
                    v-for="item in addUser.sexList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"/>
                </el-select>
              </el-form-item>
              <el-form-item label="用户角色" prop="roleId" :label-width="formLabelWidth">
                <el-select placeholder="请选择角色" v-model="userForm.roleId">
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.role"/>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="addUser1(addUser.username,
                addUser.email,addUser.password,addUser.phone,addUser.age,addUser.sexList.id,userForm.roleId)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户出框 -->
        <el-dialog
                :close-on-click-modal="false"
                width="35%"
                title="修改用户信息"
                :visible="editUserForm"
                :modal-append-to-body='false'
                @close='closeEditUser'
        >
            <el-form :model="userForm" ref="userForm" :rules="rules">
                <el-input autocomplete="off" prop="id" v-show="false" v-model="userForm.id"></el-input>
                <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="userForm.username" value=""></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="userForm.password" value=""></el-input>
                </el-form-item>
<!--                <el-form-item label="用户角色" prop="roleId" :label-width="formLabelWidth">-->
<!--                    <el-select placeholder="请选择角色" v-model="userForm.roleId">-->
<!--                        <el-option-->
<!--                                v-for="item in roleList"-->
<!--                                :key="item.id"-->
<!--                                :value="item.id"-->
<!--                                :label="item.role"/>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEditUser">取 消</el-button>
                <el-button type="primary" @click="editUser(userForm.id,userForm.username,userForm.password)">确 定</el-button>
            </div>
        </el-dialog>
<!--        &lt;!&ndash; 修改用户密码出框 &ndash;&gt;-->
<!--        <el-dialog-->
<!--                :close-on-click-modal="false"-->
<!--                width="35%"-->
<!--                title="修改用户密码"-->
<!--                :visible="editUserPass"-->
<!--                :modal-append-to-body='false'-->
<!--                @close='closeEditUserPass'-->
<!--        >-->
<!--            <el-form :model="userForm" ref="userForm" :rules="rules">-->
<!--                <el-input autocomplete="off" prop="id" v-show="false" v-model="userForm.id"></el-input>-->
<!--                <el-form-item label="用户新密码" prop="password" :label-width="formLabelWidth">-->
<!--                    <el-input autocomplete="off" v-model="userForm.password"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="确认新密码" prop="rePassword" :label-width="formLabelWidth">-->
<!--                    <el-input autocomplete="off" v-model="userForm.rePassword"></el-input>-->
<!--                </el-form-item>-->

<!--            </el-form>-->
<!--            <div slot="footer" class="dialog-footer">-->
<!--                <el-button @click="closeEditUserPass">取 消</el-button>-->
<!--                <el-button type="primary" @click="editUserPassBtn">确 定</el-button>-->
<!--            </div>-->
<!--        </el-dialog>-->
    </div>
</template>
<script>
  import axios from 'axios'
  export default {
    components: {},
    data () {
      // // 设置手机号的验证规则
      // const checkPhone = (rule, value, callback) => {
      //   if (!value) {
      //     callback(new Error('请输入联系方式'))
      //   } else {
      //     const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      //     if (reg.test(value)) {
      //       callback()
      //     } else {
      //       return callback(new Error('请输入正确的电话'))
      //     }
      //   }
      // }
      //

      return {
        changeByRole: false,
        Users:[],
        roleList: [],
        searchPhone: '',
        addUser:{
          username: '',
          email: '',
          password: '',
          phone: '',
          sexList: '',
          age: ''
        },
        userForm: {
          id: '',
          username: '',
          password: '',
          rePassword: '',
          phone: '',
          roleId: '',
        },
        // rules: {
        //   username: [
        //     {required: true, message: '请输人员名称', trigger: 'blur'},
        //     {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        //   ],
        //   password: [
        //     {required: true, message: '请输人员密码', trigger: 'blur'},
        //     {min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur'}
        //   ],
        //   rePassword: [
        //     {required: true, validator: checkPassAgain, trigger: 'blur'},
        //     {min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur'}
        //   ],
        //   phone: [{required: true, validator: checkPhone, trigger: 'blur'}],
        //   roleId: [{required: true, message: '请输人员角色', trigger: 'blur'}]
        // },
        formLabelWidth: '120px',
        editUserForm: false,
        addUserForm: false,
        editUserPass: false,
        totals: 0,
        loading: false,
        isShow: true,
        currentPage: 1,
        pageSize: 3,
        tableData: []

      }
    },

    // 模块新建时
    created: function () {
      this.getUserList()
      // 获取所有在User数据
      let self = this
      let currentPage = 1, pageSize = 2
      self.getUserList()({currentPage, pageSize}).then(res => {
        this.userForm.roleList = res.data.data
      })
    },
    // 计算属性
    mounted () {
      axios.post('/api/Fangkong/role/findAll').then(res=>{
        this.roleList=res.data.object
        console.log(this.roleList)
      }).catch(err=>{
        console.log(err)
      })
      axios.post('/api/Fangkong/user/findSexAll').then(res=>{
        this.addUser.sexList=res.data.object
      }).catch(err=>{
        console.log(err)
      })
    },
    beforeCreate: function () {
      app0 = this
    },
    // 事件处理
    methods: {
      getUserList () {
        axios.post('/api/Fangkong/user/getPage?pageIndex='+this.currentPage+'&pageSize='+this.pageSize).then(res=>{
          this.tableData = res.data.object.pagelist
          console.log(this.tableData)
          this.totals = res.data.object.total
        }).catch(err=>{
          console.log(err)
        })
      },
      // 手机号查询
      onSubmit () {
        let self = this
        if (this.searchPhone.trim()) {
          let phone = this.searchPhone.trim()
          self.getQueryMemberByPhone({phone, currentPage: this.currentPage, pageSize: this.pageSize}).then(res => {
            this.tableData = res.data.data
            this.totals = res.data.total
          })
        } else {
          this.$message.warning('请输入电话号码')
        }
      },
      // 取消添加
      resetForm () {
        this.addUserForm = false
        // 清空表单
        this.$refs['userForm'].resetFields()
      },
      // 取消修改
      closeEditUser () {
        this.editUserForm = false
        // 清空表单
        this.$refs['userForm'].resetFields()
      },
      // 取消修改密码
      closeEditUserPass () {
        this.editUserPass = false
      },
      // 修改密码
      editUserPassBtn () {
        let self = this
        let {id, password} = this.userForm
        self.getUpdateMemberPassword({id, password}).then(res => {
          this.editUserPass = false
          this.$refs['userForm'].resetFields()
          this.getUserList()
          this.$message.success('修改密码成功!')
        })
      },
      // 添加用户
      addUser1 (username,email,password,phone,age,sexId,roleId) {
        if(username==null || email==null || password==null || phone==null || age==null || sexId==null || roleId==null) {
          this.$notify.error({
            title: '错误',
            message: '信息不完善,请检查信息！'
          });
        }
        axios.post('/api/Fangkong/user/register?username='+username+'&email='+email+'&password='
          +password+'&phone='+phone+'&age='+age+'&sexid='+sexId+'&roleid='+roleId).then(res=>{
          if(res.data.status==200) {
            this.$notify({
              title: '成功',
              message: '添加成功！',
              type: 'success'
            });
            this.addUserForm = false
            // 清空表单
            this.$refs['userForm'].resetFields()
            this.$ready['addUser'].resetFields()
            this.getUserList()
          }else{
            this.$notify.error({
              title: '错误',
              message: '添加失败！'
            });
          }
        }).catch(err=>{
          console.log(err)
        })
      },

      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      // 修改用户
      editUser (id,username,password) {
        axios.post('/api/Fangkong/user/toupdate?username='+username+'&password='+password+'&id='+id).then(res=>{
          if(res.data.status==200) {
            this.$notify({
              title: '成功',
              message: '修改成功！',
              type: 'success'
            });
            this.editUserForm = false
            // 清空表单
            this.$refs['userForm'].resetFields()
            this.getUserList()
          }else{
            this.$notify.error({
              title: '错误',
              message: '修改失败！'
            });
          }
        }).catch(err=>{
          console.log(err)
        })

      },
      load () {

      },
      handleSizeChange (val) {
        let self = this
        self.pageSize = val
        self.searchPhone = ''
        self.getUserList()
      },
      handleCurrentChange (val) {
        let self = this
        self.currentPage = val
        self.searchPhone = ''
        self.getUserList()
      },
      // 添加用户
      toAddUser (flag) {
        this.addUserForm = true
      },
      // 修改用户
      toEditUser (row) {
        this.userForm.id = row.id
        this.userForm.username = row.username
        this.userForm.password = row.password
        this.userForm.roleId = row.role.id
        this.userForm.roleList = row.role
        this.editUserForm = true
      },

      //删除用户
      toDel(row) {
        this.$confirm('您确定要删除这个用户么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('/api/Fangkong/user/delById?id='+row.id).then(res=>{
            if(res.data.status==200) {
              this.$notify({
                title: '成功',
                message: '删除成功！',
                type: 'success'
              });
              this.getUserList()
            }else{
              this.$notify.error({
                title: '错误',
                message: '删除失败！'
              });
            }
          }).catch(err=>{
            console.log(err)
          })
        })
      },
    },

    // 监视
    watch: {}
  }
</script>
<style scoped>
    .label {
        padding-left: 20px;
    }

    .role {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .seek {
        width: 98%;
        height: auto;
        margin: 10px auto;
        border: 1px solid #e6e6e6;
        background-color: #fff;
    }

    .roleList {
        width: 98%;
        height: auto;
        border: 1px solid #e6e6e6;
        margin: 10px auto;
        background-color: #fff;
        padding-bottom: 100px;
    }

    .formContent {
        width: 100%;
        height: 100%;
        margin: 30px auto;
    }

    .roleTop {
        width: 100%;
        height: 59px;
        border-bottom: 1px solid #e6e6e6;
    }

    .addRole {
        padding-left: 30px;
        padding-top: 10px;
    }

    .tableForm {
        width: 100%;
        height: 100%;
    }

    .iconSize {
        font-size: 16px;
    }

    .paginationCon {
        float: right;
        margin-top: 12px;
        margin-right: 30px;
    }
</style>
