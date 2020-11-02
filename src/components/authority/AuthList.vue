<!--权限管理-->
<template>
<div>
  <el-container>
    <el-aside width="300px">
      <el-select v-model="role_id" placeholder="请选择角色" >
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.role"
          :value="item.id">
        </el-option>
      </el-select>
      <br>
      <el-button
        @click="roleConfirm"
        type="primary"
        icon="el-icon-s-promotion"
        style="width: 150px;margin-top: 50px">
        确认
      </el-button>
      <br>
      <el-button
        @click="changePower"
        type="primary"
        icon="el-icon-edit"
        style="width: 150px;margin-top: 50px">
        修改权限
      </el-button>
    </el-aside>
    <el-main>
      <el-tree
        :data="menusTree"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="[1,2,3,4]"
        :default-checked-keys="menusIsChecked"
        :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, menusTree }">
            <span>{{ node.label }}</span>
            </span>
      </el-tree>
    </el-main>
  </el-container>
</div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      roleMenusList: [],
      list: [],
      list1: {
        role_id: '',
        menus_id: ''
      },
      isCheck: [],
      menusIsChecked:[],
      roles: [],
      role_id: '',
      addMenusList: {
        id: '',
        name: '',
        icon: '',
        remark: '',
        path: '',
        parentId: ''
      },
      MenusList: {
        id: '',
        name: '',
        icon: '',
        remark: '',
        path: '',
        parentId: ''
      },
      formLabelWidth: '120px',
      addMenusForm: false,
      editMenusForm: false,
      menusTree: [],
      defaultProps: {
        children: 'menusTrees',
        label: 'name',
        icon: 'icon'
      }
    }
  },
  methods: {

    //修改权限
    changePower() {
      if(!this.role_id) {
        this.$message({
          showClose: true,
          message: '请选择用户哦！',
          type: 'warning'
        });
      }else{
        this.isCheck=null
        this.list=[]
        this.roleMenusList=[]
        this.isCheck=this.$refs.tree.getCheckedKeys()
        // const roleMenus = new Array()
        //
        // for(let i=0;i<this.isCheck.length;i++) {
        //   roleMenus[i] = new Object()
        //   roleMenus[i].role_id=this.role_id
        //   roleMenus[i].menus_id=this.isCheck[i]
        //   this.list.push(roleMenus[i])
        // }
        // this.roleMenusList = JSON.stringify(this.list)
        axios.post('/api/Fangkong/rolemenus/todelAll?role_id='+this.role_id).then(res=>{
          if(res.data.status==200) {
            axios.post('/api/Fangkong/rolemenus/toadd',{
              roleId:this.role_id,
              roleMenuIds:this.isCheck
            }).then(re=>{
              if(re.data.status==200) {
                this.$notify({
                  title: '成功',
                  message: '修改成功！',
                  type: 'success'
                });
              }else{
                this.$notify.error({
                  title: '错误',
                  message: '修改失败！'
                });
              }
            })
          }else{
            this.$notify.error({
              title: '错误',
              message: '修改失败！'
            });
          }
        })
      }

    },

    //确认切换角色
    roleConfirm() {
     this.menusIsChecked=[]
      if(!this.role_id) {
        this.$message({
          showClose: true,
          message: '请选择用户哦！',
          type: 'warning'
        });
      }else{
        axios.post('/api/Fangkong/rolemenus/getrolemenusByRoleId?role_id='+this.role_id).then(res=>{
          for(let i in res.data.object) {
            for(let j in res.data.object[i]) {
              this.menusIsChecked[i]=res.data.object[i][j]
            }
          }
          this.getMenus()
          this.$notify({
            title: '成功',
            message: '初始化成功！',
            type: 'success'
          });
        })
      }

   },

    //获取原树
    getMenus() {
      axios.post('/api/Fangkong/menus/findAll').then(res => {
        this.menusTree = res.data.object
      }).catch(err => {
        console.log(err)
      })
    },

    //清除树
    resetTree() {
     axios.post('/api/Fangkong/rolemenus/todelAll?role_id='+this.role_id).then(res=>{
       if(res.data.status==200) {
         this.$notify({
           title: '成功',
           message: '初始化成功！',
           type: 'success'
         });
       }
     }).catch(err=>{
       console.log(err)
     })
    }
  },
  mounted() {
    axios.post('/api/Fangkong/role/findAll').then(res => {
      this.roles = res.data.object
    }).catch(err => {
      console.log(err)
    }),
      console.log(this.role_id)
    this.getMenus()
  }
}
</script>
<style scoped>
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    padding-top: 250px;
    height: 800px;
    /*line-height: 650px;*/
    overflow: hidden;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;

    height: 800px;
  }
  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
