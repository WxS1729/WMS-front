<template>
  <div class="top-head" :style="{backgroundColor: theme}">
    <div class="sidebar-logo-container" >
      <el-row>
        <el-col :span="5">
          <router-link key="collapse" class="sidebar-logo-link" to="/">
            <img :src="logo" class="sidebar-logo"/>
            <h1 class="sidebar-title"
                :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitle : variables.sidebarLightTitle }">
              {{ title }} </h1>

<!--            <h3 class="sidebar-title-right">欢迎您的登录，{{user}}</h3>-->

          </router-link>
        </el-col>
        <el-col :span="15">
          <Navbar />
        </el-col>
        <el-col :span="4">
          <div class="right-menu">
            <template v-if="device!=='mobile'">

              <screenfull id="screenfull" class="right-menu-item hover-effect" />

<!--              <el-tooltip content="布局大小" effect="dark" placement="bottom" style="color: #ffffff">
                <size-select id="size-select" class="right-menu-item hover-effect" />
              </el-tooltip>-->
              <el-tooltip content="主题颜色" effect="dark" placement="bottom" style="color: #ffffff">
                <theme-picker class="right-menu-theme hover-effect" @change="themeChange"/>
              </el-tooltip>


            </template>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
              <div class="avatar-wrapper">
                <img :src="avatar" class="user-avatar">
                <i class="el-icon-caret-bottom"  style="color: #ffffff"/>
              </div>
              <el-dropdown-menu slot="dropdown">
                <router-link to="/user/profile">
                  <el-dropdown-item>
                    <div>
                      <span style="font-weight: 600">{{nickName}}</span>
                    </div>
                    <div>
                      <span>@{{user}}</span>
                    </div>
                  </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided @click.native="setting = true">
                  <span>布局设置</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>



    </div>


  </div>
</template>

<script>
import variables from "@/assets/styles/variables.scss";
import logoImg from "@/assets/logo/logo2.png";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import {mapGetters} from "vuex";
import ThemePicker from '@/components/ThemePicker';
import Navbar from '@/layout/components/Navbar';

export default {
  name: "TopTitle",
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      logo: logoImg,
      theme: this.$store.state.settings.theme,
      tagsView: this.$store.state.settings.tagsView,
      fixedHeader: this.$store.state.settings.fixedHeader,
      sidebarLogo: this.$store.state.settings.sidebarLogo,
      dynamicTitle: this.$store.state.settings.dynamicTitle,
      sideTheme: this.$store.state.settings.sideTheme
    }
  },
  components: {
    ThemePicker,
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Navbar
  },
  computed: {
    variables() {
      return variables;
    },

    user(){
      return this.$store.state.user.name;
    },
    nickName(){
      return this.$store.state.user.nickName;
    },
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleTheme(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'sideTheme',
        value: val
      })
      this.sideTheme = val;
    },
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
      this.theme = val;
      this.saveSetting();
    },
    saveSetting() {
      this.$cache.local.set(
        "layout-setting",
        `{
            "topNav":${this.topNav},
            "tagsView":${this.tagsView},
            "fixedHeader":${this.fixedHeader},
            "sidebarLogo":${this.sidebarLogo},
            "dynamicTitle":${this.dynamicTitle},
            "sideTheme":"${this.sideTheme}",
            "theme":"${this.theme}"
          }`
      );
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          // location.href = '/index';
          location.reload();
        })
      }).catch(() => {});
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-head{
    width: 100%;
    height: 50px;
  }
  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    padding-left: 10px;
    overflow: hidden;

    & .sidebar-logo-link {
      height: 100%;
      width: 100%;

      & .sidebar-logo {
        width: 91px;
        height: 40px;
        vertical-align: middle;
        margin-right: 12px;
      }

      & .sidebar-title {
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        line-height: 50px;
        font-size: 18px;
        font-family: SimHei, Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }

      & .sidebar-title-right {
        display: inline-block;
        margin: 0 10px;
        color: #fff;
        //font-weight: 600;
        line-height: 50px;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }
    }
  }
  .left-info{
    float: left;
  }

  .right-menu {
    float: right;
    height: 50px;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 18px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .right-menu-theme{
      display: inline-block;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 26px;
          height: 26px;
          vertical-align: middle;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: relative;
          right: -5px;
          top: 0px;
          font-size: 12px;
        }
      }
    }
  }
</style>
