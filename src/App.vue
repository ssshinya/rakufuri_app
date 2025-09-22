<template>
  <div id="app">
    <div id="loading"><img src="/src/assets/loading.gif"></div>
    <router-view/>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
font-family: 'Source Sans Pro',
sans-serif;
}

#wrapper {
  background:
    radial-gradient(
      ellipse at top left,
      rgba(255, 255, 255, 1) 40%,
      rgba(229, 229, 229, .9) 100%
    );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#loading{
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
  background-color: rgba(255,255,255,0.5);
  z-index: 999;
  display: none;
}

#loading img{
  position: absolute;
  left: 50%;
  top: 50%;
}
#loading_status{
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
  background-color: rgba(255,255,255,0.5);
  z-index: 999;
  display: none;
}
#loading_status_message{
  position: absolute;
  left: 50%;
  top: 50%;
  text-align: center;
  font-size: 16px;
  background: #ffffff;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div { flex-basis: 50%; }

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}

/* CSS */
html,body{
  height: 100vh;
  font-size:14px;
  margin: 0;
  padding: 0;
  width: 100%;
}
body{
  padding: 0;
}
#app{
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}
.contents{
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}
.contents .el-container{
  height: 100vh;
  width: 100%;
}
header{
  padding: 0 !important;
}
.menu{
  background: #fafafa;
  height:100%;
  text-align:center;
  padding-top: 20px;
  width: 190px !important;
}
.menu button{
  width:150px;
  margin: 5px 0 0 0 !important;
  padding: 12px 10px;
}
.hidden{
  height:1px !important;
  width:1px !important;
}
.hidden input{
  visibility:hidden;
  height:1px!important;
  width:1px!important;
}
.el-table__row {
  cursor: pointer;
}
</style>
