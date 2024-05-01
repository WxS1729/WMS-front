<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    @select="handleSelect"
  >
    <template v-for="(item, index) in topMenus" v-if="index < visibleNumber && show ">
      <el-menu-item :style="{'--theme': theme}" :index="item.path" :key="index"
      ><svg-icon :icon-class="item.meta.icon" />
        {{ item.meta.title }}</el-menu-item
      >
    </template>

    <!-- 顶部菜单超出数量折叠 -->
    <el-submenu :style="{'--theme': theme}" index="more" v-if="topMenus.length > visibleNumber & show">
      <template slot="title">更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
          :index="item.path"
          :key="index"
          v-if="index >= visibleNumber"
        ><svg-icon :icon-class="item.meta.icon" />
          {{ item.meta.title }}</el-menu-item
        >
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>
  import { constantRoutes } from "@/router";

  export default {
    data() {
      return {
        // 顶部栏初始数
        visibleNumber: parseInt(document.body.getBoundingClientRect().width / 3 / 65),
        // 是否为首次加载
        isFrist: false,
        show: false,
        // 当前激活菜单的 index
        currentIndex: undefined
      };
    },
    watch:{
      '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
        this.visibleNumber = parseInt(document.body.getBoundingClientRect().width / 3 / 65);
      },
    },
    computed: {
      theme() {
        return this.$store.state.settings.theme;
      },
      // visibleNumber: {
      //   get(){
      //     const width = document.body.getBoundingClientRect().width / 3;
      //     return parseInt(width / 65);
      //   },
      //   set(v){
      //
      //   }
      // },
      // 顶部显示菜单
      topMenus() {
        let topMenus = [];
        this.routers.map((menu) => {
          // 兼容顶部栏一级菜单内部跳转
          if (menu.hidden !== true) {

            if (menu.path === "/") {
              topMenus.push(menu.children[0]);
            } else {
              topMenus.push(menu);
            }
          }
        });
        this.show = true;
        return topMenus;
      },

      // 所有的路由信息
      routers() {
        return this.$store.state.permission.topbarRouters;
      },
      // 设置子路由
      childrenMenus() {
        var childrenMenus = [];
        this.routers.map((router) => {
          for (var item in router.children) {
            if (router.children[item].parentPath === undefined) {
              if(router.path === "/") {
                router.children[item].path = "/redirect/" + router.children[item].path;
              } else {
                if(!this.ishttp(router.children[item].path)) {
                  router.children[item].path = router.path + "/" + router.children[item].path;
                }
              }
              router.children[item].parentPath = router.path;
            }
            childrenMenus.push(router.children[item]);
          }
        });
        return constantRoutes.concat(childrenMenus);
      },
      // 默认激活的菜单
      activeMenu() {
        const path = this.$route.path;
        let activePath = this.defaultRouter();
        if (path.lastIndexOf("/") > 0) {
          const tmpPath = path.substring(1, path.length);
          activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
        } else if ("/index" == path || "" == path) {
          if (!this.isFrist) {
            this.isFrist = true;
          } else {
            activePath = "index";
          }
        }
        var routes = this.activeRoutes(activePath);
        if (routes.length === 0) {
          activePath = this.currentIndex || this.defaultRouter()
          this.activeRoutes(activePath);
        }
        return activePath;
      },
    },
    beforeMount() {
      window.addEventListener('resize', this.setVisibleNumber)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.setVisibleNumber)
    },
    mounted() {
      this.setVisibleNumber();
    },
    methods: {
      // 根据宽度计算设置显示栏数
      setVisibleNumber() {
        const width = document.body.getBoundingClientRect().width / 3;
        // this.visibleNumber = parseInt(width / 85);
        this.visibleNumber = parseInt(width / 65);
      },
      // 默认激活的路由
      defaultRouter() {
        let router;
        Object.keys(this.routers).some((key) => {
          if (!this.routers[key].hidden) {
            router = this.routers[key].path;
            return true;
          }
        });
        return router;
      },
      // 菜单选择事件
      handleSelect(key, keyPath) {
        this.currentIndex = key;
        if (this.ishttp(key)) {
          // http(s):// 路径新窗口打开
          window.open(key, "_blank");
        } else if (key.indexOf("/redirect") !== -1) {
          // /redirect 路径内部打开
          this.$router.push({ path: key.replace("/redirect", "") });
        } else {
          // 显示左侧联动菜单
          this.activeRoutes(key);
        }
      },
      // 当前激活的路由
      activeRoutes(key) {
        var routes = [];
        if (this.childrenMenus && this.childrenMenus.length > 0) {
          this.childrenMenus.map((item) => {
            if (key == item.parentPath || (key == "index" && "" == item.path)) {
              routes.push(item);
            }
          });
        }
        if(routes.length > 0) {
          this.$store.commit("SET_SIDEBAR_ROUTERS", routes);
        }
        return routes;
      },
      ishttp(url) {
        return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
      }
    },
  };
</script>

<style lang="scss">

  .topmenu-container{
    background-color: #{'var(--theme)'} !important;
  }
  .topmenu-container.el-menu--horizontal > .el-menu-item {
    float: left;
    height: 50px !important;
    line-height: 50px !important;
    color: #ffffff !important;
    //color: #999093 !important;
    padding: 0 5px !important;
    margin: 0 10px !important;
  }

  .topmenu-container.el-menu--horizontal > .el-menu-item:hover {
    background-color: rgba(255,255,255,0.1) !important;
  }
  .topmenu-container.el-menu--horizontal > .el-menu-item.is-active{
    background-color: #{'var(--theme)'} !important;
  }

  .topmenu-container.el-menu--horizontal > .el-menu-item.is-active, .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
    //border-bottom: 2px solid #{'var(--theme)'} !important;
    border-bottom: 4px solid #ffffff !important;
    //color: #303133;
    background-color: rgba(255,255,255, 0.1) !important;

  }

  /* submenu item */
  .topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title:hover{
    background-color: rgba(255,255,255, 0.1) !important;
  }
  .topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title {
    float: left;
    height: 50px !important;
    line-height: 50px !important;
    color: #ffffff !important;
    padding: 0 5px !important;
    margin: 0 10px !important;
    //background-color: #{'var(--theme)'} !important;
  }

  .topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title i{
    color: #ffffff;
  }
</style>
