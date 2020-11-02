<template>
    <div >
        <div class="menusList">
          <el-button type="primary"
          @click="() =>toAddRole(node,menusTree)"
          icon="el-icon-edit">
            增加
          </el-button>
          <hr>
<!--          <el-button-->
<!--            class="focuscolor"-->
<!--            type="text"-->
<!--            size="mini"-->
<!--            @click="() =>toAddRole(node,menusTree)">-->
<!--            增加-->
<!--          </el-button><br>-->
          <el-tree
            :data="menusTree"
            node-key="id"
            :default-expanded-keys="[1,2, 3,4]"
            :default-checked-keys="[20]"
            :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, menusTree }">
            <span> <i :class="node.data.icon"></i>{{ node.label }}</span>
            <span>
              <el-button
                class="focuscolor"
                type="text"
                size="mini"
                @click="() =>toEditRole(node,menusTree)">
                修改
              </el-button>
              <el-button
                class="focuscolor"
                type="text"
                size="mini"
                @click="() => remove(node, menusTree)">
                删除
                </el-button>
             </span>
             </span>
          </el-tree>
        </div>

      <!-- 添加菜单 -->
      <el-dialog
        :close-on-click-modal="false"
        width="35%"
        title="添加菜单"
        :visible="addMenusForm"
        :modal-append-to-body='false'
        @close='closeMenusForm'
      >
        <el-form v-model="addMenusList" ref="roleForm">
          <el-input autocomplete="off" prop="id" v-show="false"></el-input>
          <el-form-item label="菜单名称" prop="name" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="addMenusList.name"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="addMenusList.icon"></el-input>
          </el-form-item>
          <el-form-item label="菜单描述" prop="remark" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="addMenusList.remark"></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="path" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="addMenusList.path"></el-input>
          </el-form-item>
          <el-form-item label="父ID" prop="parentid" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="addMenusList.parentId"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeMenusForm">取 消</el-button>
          <el-button type="primary" @click="addRole(addMenusList.name,addMenusList.icon,
          addMenusList.remark,addMenusList.path,addMenusList.parentId)">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改菜单 -->
      <el-dialog
        :close-on-click-modal="false"
        width="35%"
        title="修改菜单名称"
        :visible="editMenusForm"
        :modal-append-to-body='false'
        @close='closeEditMenusForm'
      >
        <el-form :model="MenusList" ref="roleForm">
          <el-input autocomplete="off" prop="id" v-show="false"></el-input>
          <el-form-item label="菜单名称" prop="name" :label-width="formLabelWidth">
            <el-input autocomplete="off" v-model="MenusList.name"></el-input>
          </el-form-item>
<!--          <el-form-item label="图标" prop="icon" :label-width="formLabelWidth">-->
<!--            <el-input autocomplete="off" v-model="MenusList.icon"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="菜单描述" prop="remark" :label-width="formLabelWidth">-->
<!--            <el-input autocomplete="off" v-model="MenusList.remark"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="路径" prop="path" :label-width="formLabelWidth">-->
<!--            <el-input autocomplete="off" v-model="MenusList.path"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="父ID" prop="parentid" :label-width="formLabelWidth">-->
<!--            <el-input autocomplete="off" v-model="MenusList.parentId"></el-input>-->
<!--          </el-form-item>-->

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditMenusForm">取 消</el-button>
          <el-button type="primary" @click="editRole(MenusList.id,MenusList.name)">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>
<script>
  import axios from 'axios'
  export default {
    components: {},
    data() {
      return {
        addMenusList:{
          id: '',
          name: '',
          icon: '',
          remark: '',
          path: '',
          parentId: ''
        },
        MenusList:{
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
        menusTree:[],
        defaultProps: {
          children: 'menusTrees',
          label: 'name',
          icon:'icon'
        }
      }

    },
    methods: {

      // 添加菜单
      addRole (name,icon,remark,path,parentId) {
        if(!name || !icon || !remark || !path || !parentId) {
          this.$notify.error({
            title: '错误',
            message: '信息不完善，请检查信息！'
          });
        }else{
          axios.post('/api/Fangkong/menus/toadd?name='+name+'&icon='+icon+'&remark='+
            remark+'&path='+path+'&parentid='+parentId).then(res=>{
            if(res.data.status==200) {
              this.$notify({
                title: '成功',
                message: '增加成功！',
                type: 'success'
              });
              this.getMenusTree()
              this.addMenusForm = false
              // 清空表单
              this.$refs['addMenusList'].resetFields()
            }else{
              this.$notify.error({
                title: '错误',
                message: '增加失败！'
              });
            }
          })
        }

      },

      // 修改菜单
      editRole (id,name) {
        if(!name) {
          this.$notify.error({
            title: '错误',
            message: '信息不完善，请检查信息！'
          });
        }else{
          axios.post('/api/Fangkong/menus/toupdate?name='+name+'&id='+id).then(res=>{
            if(res.data.status==200) {
              this.$notify({
                title: '成功',
                message: '修改成功！',
                type: 'success'
              });
              this.getMenusTree()
              this.editMenusForm = false
              // 清空表单数据
              this.$refs['MenusList'].resetFields()
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

      //删除
      remove(node) {
        let id = node.data.id
        this.$confirm('您确定要删除这个角色么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          axios.post('/api/Fangkong/menus/todel?id='+id).then(res=>{
            if(res.data.status==200) {
              this.$notify({
                title: '成功',
                message: '修改成功！',
                type: 'success'
              });
              this.getMenusTree()
            }
          }).catch(err=>{
            console.log(err)
          })
        })

      },

      //关闭修改页面
      closeEditMenusForm () {
        this.editMenusForm = false
        // 清空表单数据
        this.$refs['MenusList'].resetFields()
      },

      // 打开修改页面
      toEditRole (node) {
        this.editMenusForm = true
        this.MenusList.id=node.data.id
        this.MenusList.name=node.data.name
        this.MenusList.icon=node.data.icon
        this.MenusList.remark=node.data.remark
        this.MenusList.path=node.data.path
        this.MenusList.parentId=node.data.parentid
      },

      //取消
      closeMenusForm () {
        this.addMenusForm = false
        // 清空表单
        this.$refs['addMenusList'].resetFields()
      },

      toAddRole () {
        this.addMenusForm = true
      },

      //获取菜单列表
      getMenusTree() {
        axios.post('/api/Fangkong/menus/findAll').then(res=>{
          this.menusTree=res.data.object
          console.log(res.data.object)
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    mounted() {
      this.getMenusTree()
    }

  }
</script>
<style scoped>
    .focuscolor:hover{
      color:lightblue;
    }
    .menusList {
        width: 98%;
        height: auto;
        border: 1px solid #e6e6e6;
        margin: 10px auto;
        background-color: #fff;
        padding-bottom: 100px;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 700px;
    }

</style>
