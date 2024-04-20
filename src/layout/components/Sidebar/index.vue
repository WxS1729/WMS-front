<template>
  <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <!--        <logo v-if="showLogo" :collapse="isCollapse" />-->
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path  + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>

    <div class="humburgerTransfer">
      <ToggleBar id="toggleBar-container" :is-active="sidebar.opened" class="toggleBar-container" @toggleClick="toggleSideBar" />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from "vuex";
  import Logo from "./Logo";
  import SidebarItem from "./SidebarItem";
  import variables from "@/assets/styles/variables.scss";
  import ToggleBar from '@/components/ToggleBar'

  export default {
    components: { SidebarItem, Logo, ToggleBar },
    computed: {
      ...mapState(["settings"]),
      ...mapGetters(["sidebarRouters", "sidebar"]),
      activeMenu() {
        const route = this.$route;
        const { meta, path } = route;
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu;
        }
        return path;
      },
      showLogo() {
        return this.$store.state.settings.sidebarLogo;
      },
      variables() {
        return variables;
      },
      isCollapse() {
        return !this.sidebar.opened;
      }
    },
    methods:{
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar');
        // let that = this;
        // setTimeout(function (){
        //   that.$store.dispatch('app/setScreenHeight', new Date());
        // }, 200)
        this.refreshView();
      },
      refreshView() {
        this.$store.dispatch('tagsView/delAllCachedViews', this.$route)
        const { fullPath } = this.$route
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      }
    }
  };
</script>
