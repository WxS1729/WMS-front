<template>
  <div style="padding: 0 14px;border-top: 1px solid #e9e9e9;font-size: 13px" @click="toggleClick" title="Toggle Sidebar">
    <svg class="toggleBar" :class="{'is-active':!isActive}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
         width="64" height="64"
    >
      <path
        d="M896 832v64H128v-64h768zM361.376 297.376l45.248 45.248L237.248 512l169.376 169.376-45.248 45.248L146.752 512l214.624-214.624zM896 608v64H480v-64h416z m0-256v64H480v-64h416z m0-224v64H128V128h768z"></path>
    </svg>
    <span v-if="isActive" style="font-size: 13px;padding-left: 8px;">收起侧边栏</span>
  </div>

</template>

<script>
export default {
  name: 'ToggleBar',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick');

    }
  }
}
</script>

<style scoped>
.toggleBar {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.toggleBar.is-active {
  transform: rotate(180deg);
}
</style>
