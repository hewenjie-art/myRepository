<!--角色管理-->
<template>
    <div class="role">
        <div class="seek">
            <div class="formContent">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item class="label">
                        <el-button type="success" @click="toAddRole()">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="roleList">
            <el-table
              v-loading="loading"
              :data="roles"
              border
              row-key="id"
              style=" width: 96%;margin-left:30px;margin-top:30px;"
              :header-cell-style="{background:'#f5f6fa'}"
              :row-class-name="tableRowClassName2">
                <el-table-column
                  type="index"
                  label="序号"
                  width="60"
                  header-align="center"
                  align="center">
                  <template slot-scope="scope">
                    {{scope.$index+1}}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="role"
                  label="角色名称"
                  width="340"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="描述"
                  width="400"
                  align="center">
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="400">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      size="max"
                      class="config-btn"
                      style="width:70px;"
                      @click.native.prevent="toEditRole(scope.row)">编辑
                    </el-button>
                    <el-button
                      type="danger"
                      class="blue-btn"
                      size="max"
                      style="width:70px"
                      @click.native.prevent="deleteRole(scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
            </el-table>

<!--        分页-->
<!--            <div class="paginationCon">-->
<!--                <el-pagination-->
<!--                  v-show="isShow"-->
<!--                  @size-change="handleSizeChange"-->
<!--                  @current-change="handleCurrentChange"-->
<!--                  :current-page="currentPage"-->
<!--                  :page-sizes="[10, 15, 20, 100]"-->
<!--                  :page-size='pageSize'-->
<!--                  layout="total, sizes, prev, pager, next, jumper"-->
<!--                  :total="totals">-->
<!--                </el-pagination>-->
<!--            </div>-->
        </div>

        <!-- 添加角色 -->
        <el-dialog
                :close-on-click-modal="false"
                width="35%"
                title="添加角色"
                :visible="addRoleForm"
                :modal-append-to-body='false'
                @close='closeRoleForm'
        >
            <el-form :model="roleForms" ref="roleForm" >
                <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="roleForms.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="roleRemark" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="roleForms.roleRemark"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRoleForm">取 消</el-button>
                <el-button type="primary" @click="addRole(roleForms.roleName,roleForms.roleRemark)">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改角色 -->
        <el-dialog
                :close-on-click-modal="false"
                width="35%"
                title="修改角色"
                :visible="editRoleForm"
                :modal-append-to-body='false'
                @close='closeEditRoleForm'
        >
            <el-form :model="roleForm" ref="roleForm">
                <el-input autocomplete="off" prop="id" v-show="false" v-model="roleForm.id"></el-input>
                <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="roleForm.roleRemark"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEditRoleForm">取 消</el-button>
                <el-button type="primary" @click="editRole(roleForm.roleName,roleForm.roleRemark,roleForm.id)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
  import axios from 'axios'
  export default {
    components: {},
    data () {
      return {
        roles:[],
        user:{
          role_id: ''
        },
        roleForms: {
          roleName: '',
          roleRemark: ''
        },
        roleForm: {
          id: '',
          roleName: '',
          roleRemark: ''
        },
        // rules: {
        //   roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}]
        // },
        formLabelWidth: '120px',
        isShow: true,
        loading: false,
        totals: 0,
        roleName: '',
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        addRoleForm: false,
        editRoleForm: false
      }
    },
    // 过滤
    filters: {},
    // 模块新建时
    created: function () {

    },
    // 计算属性
    mounted () {
      this.getRoleListForm()
    },
    // 事件处理
    methods: {

      tableRowClassName2({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },

      // 添加页面
      toAddRole () {
        this.addRoleForm = true
      },
      // 关闭添加页面
      closeRoleForm () {
        this.addRoleForm = false
        // 清空表单
        this.$refs['roleForm'].resetFields()
      },

      // 添加角色
      addRole (roleName,roleRemark) {
        if(!roleName || !roleRemark) {
          this.$notify.error({
            title: '错误',
            message: '信息不完善，请检查信息！'
          });
        }else{
          axios.post('/api/Fangkong/role/toadd?role='+roleName+'&remark='+roleRemark).then(res=>{
            if(res.data.status==200) {
              this.$notify({
                title: '成功',
                message: '增加成功！',
                type: 'success'
              });
              this.addRoleForm = false
              // 清空表单
              this.$refs['roleForm'].resetFields()
              this.getRoleListForm()
            }else{
              this.$notify.error({
                title: '错误',
                message: '增加失败！'
              });
            }
          })
        }

      },

      // //查询角色是否使用
      // findTheRoleInUser() {
      //
      //
      //   })
      // },

      //删除角色
      deleteRole (row) {
        let id = row.id
        // 检查角色是否已经使用

        axios.post('/api/Fangkong/user/findRoleByRoleId?roleId='+id).then(res => {
          if (res.data.status == 200) {
            this.$notify.error({
              title: '错误',
              message: '角色已被使用，无法删除！'
            });
          } else {
            this.$confirm('您确定要删除这个角色么, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.post('/api/Fangkong/role/todel?id='+id).then(res => {
                if(res.data.status==200) {
                  this.$notify({
                    title: '成功',
                    message: '删除成功！',
                    type: 'success'
                  });
                  this.getRoleListForm()
                }
              }).catch(err => {
                console.log(err)
              })
            })
          }
        })
        },



      // 获取Role列表
      getRoleListForm () {
        axios.post('/api/Fangkong/role/findAll').then(res=>{
          this.roles=res.data.object
        }).catch(err=>{
          console.log(err)
        })

      },
      // 打开修改页面
      toEditRole (row) {
        this.editRoleForm = true
        this.roleForm.id=row.id
        this.roleForm.roleName=row.role
        this.roleForm.roleRemark=row.remark
      },
      //关闭修改页面
      closeEditRoleForm () {
        this.editRoleForm = false
        // 清空表单数据
        this.$refs['roleForm'].resetFields()
      },
      // 修改角色
      editRole (roleName,roleRemark,id) {
        if(!roleName || !roleRemark) {
          this.$notify.error({
            title: '错误',
            message: '信息不完善，请检查信息！'
          });
        }else{
          axios.post('/api/Fangkong/role/update?role='+roleName+'&remark='+roleRemark+'&id='+id).then(res=>{
            if(res.data.status==200) {
              this.$notify({
                title: '成功',
                message: '修改成功！',
                type: 'success'
              });
              this.editRoleForm = false
              // 清空表单数据
              this.$refs['roleForm'].resetFields()
              this.getRoleListForm()
            }else{
              this.$notify.error({
                title: '错误',
                message: '修改失败！'
              });
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      },

      handleSizeChange (val) {
        let self = this
        self.pageSize = val
        self.getRoleListForm()
      },
      handleCurrentChange (val) {
        let self = this
        self.currentPage = val
        self.getRoleListForm()
      },
    },

    // tableRowClassName({row, rowIndex}) {
    //   if (rowIndex === 1) {
    //     return 'warning-row';
    //   } else if (rowIndex === 3) {
    //     return 'success-row';
    //   }
    //   return '';
    // },

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
