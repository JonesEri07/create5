<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">MiniGame</router-link> |
      <router-link to="/register">Register</router-link>/
      <router-link to="/login">Login</router-link>
    </div>
    <router-view/>
    <footer id="sticky">
      <a class="pure-menu-link" href="https://github.com/JonesEri07/create5">git JonesEri07</a>
    </footer>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.pure-menu-link {
  color: #fff;
  padding: 10px 20px;
  font-weight: 800;
}

#sticky {
  width: 100%;
  height: 25px;
  background: blue;
  color: white;
  font-size: 12px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
