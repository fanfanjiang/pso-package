<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<style lang="less">
html,
body {
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: relative;
  color: #2b3441; 
}
#app {
  height: 100%;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(73, 73, 73, 0.33);
  border: 2px solid #fff;
  border-radius: 8px;
}
::-webkit-scrollbar {
  -webkit-appearance: none;
}
</style>