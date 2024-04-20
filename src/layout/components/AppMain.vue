<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.path
      }
    },
    mounted() {
      let that = this;
      window.onresize = function(){ // 定义窗口大小变更通知事件
        that.$store.dispatch('app/setScreenHeight', document.documentElement.clientHeight);
      };
    }
  }
</script>

<style lang="scss" scoped>
  .app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .fixed-header+.app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      /* 84 = navbar + tags-view = 50 + 34 + 50 */
      min-height: calc(100vh - 84px);
      height: calc(100vh - 84px);
      background-color: #f0f0f0;
      overflow-y: auto;
    }

    .fixed-header+.app-main {
      padding-top: 84px;
    }
  }

  .hasNoTagsView {
    .app-main {
      /* 100 = navbar + tags-view = 50 + 50 */
      min-height: calc(100vh - 50px);
      height: calc(100vh - 50px);
      background-color: #f0f0f0;
      overflow-y: auto;
    }

    .fixed-header+.app-main {
      padding-top: 84px;
    }
  }
</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
