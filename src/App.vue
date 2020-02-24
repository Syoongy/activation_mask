<template>
  <main id="app">
    <!-- <nav id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </nav> -->
    <router-view />
    <notifications
      group="submitReq"
      position="bottom center"
      classes="custom-notification"
    ></notifications>
  </main>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fff;
}

.custom-notification {
  background: #3abb67 !important;
  border-left: none;
  padding: 0.4rem;
  margin: 0 0.3rem 0.3rem;
  color: #fff;
  border-radius: 4px;
}

::-webkit-scrollbar {
    display: none;
}

.custom-notification .my-success {
}
</style>
