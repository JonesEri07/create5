<template>
  <div class="home">


    <h1 align="center">Space Bots!</h1>
    <h1 align="center">Mini Game</h1>
    <div id="root" @keydown.esc="closeForm">
      <transition v-if="showForm" name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <h1 class="modal-title">Register or Login</h1>
              </div>
              <div class="modal-body">
                <p v-if="error" class="error">{{error}}</p>
                <button @click="register" type="button">Register</button>
                <button @click="login" type="button" class="other">Login</button>
                <button @click="toggleForm" type="button" class="close">Close</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
        <div align="center">
          <button @click="restart">Restart</button>
        </div>
        <p v-if="user">Welcome {{user.username}}<br><a href="#" @click="logout">Logout</a></p>
        <p v-else><a href="#" @click="toggleForm">Register/Login</a></p>
        <div align="center">{{x_message}}</div>
        <div align="center">{{y_message}}</div>
        <div align="center">Total guesses: {{count}}</div>
      <div id="outer">
        <div class="square-container">
          <div v-for="r in rows">
            <div v-for="c in r">
              <div class="square">
                <div class="content" :class="{ 'is-visited': c.visited }" @click="search(c)">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3>Scores</h3>
      <div class="score">
        <table>
          <tr>
            <th>Username</th>
            <th>Best Score</th>
          </tr>
          <tr v-for="score in scores">
            <td>{{score.name}}</td>
            <td>{{score.score}}</td>
            <button @click="deleteScore(score)">Delete</button>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      x_message: '',
      y_message: '',
      count: 0,
      available_x: [],
      rows: [],
      botAt: {
        x_axis: '',
        y_axis: '',
      },
      addedScore: 0,

      showForm: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    scores() {
      return this.$store.state.scores;
    },
    error() {
      return this.$store.state.error;
    }
  },
  created() {
    this.getScores();
    this.build();
  },
  methods: {
  build() {
    var i, j;
    for (i = 0; i < 15; i++) {
      var row = [];
      var available_y = [i];
      for (j = 0; j < 15; j++) {
        var c = {x: '', y: '', visited: '', here: ''};
        c.x= i;
        c.y= j;
        c.visited = false;
        c.here = false;
        row.push(c);

        available_y.push(j);
      }
      this.rows.push(row);
      this.available_x.push(available_y);
    }
    var placeBotx = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    var placeBoty = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    console.log(placeBotx, placeBoty, this.rows[placeBotx][placeBoty]);
    this.rows[placeBotx][placeBoty].here = true;
    this.botAt.x_axis=placeBotx;
    this.botAt.y_axis=placeBoty;
  },
  updateAvailable(c_x, c_y) {
    for (var i = 0; i < this.available_x.length; i++) {
      var y_ar = this.available_x[i];
      if (y_ar[0] === c_x) {
        for (var j = 1; j < y_ar.length; j++) {
          if (y_ar[j] === c_y) {
            y_ar.splice(j,1);
            if (y_ar.length === 1) {
              this.available_x.splice(i,1);
            }
            break;
          }
        }
        break;
      }
    }
  },
  moveBot() {
    // Set the current spot to false
    this.rows[this.botAt.x_axis][this.botAt.y_axis].here = false

    // Find available coordinates to move Bot to non visited square.
    var newXi = Math.floor(Math.random() * (this.available_x.length-1 - 0 + 1));
    //this.available_x[newXi][0] is the available y axis with unvisited x spots.

    var ar = this.available_x[newXi];
    var newYi = Math.floor(Math.random() * (ar.length - 1 - 0 + 1));
    if (newYi === 0) {
      newYi = 1;
    }

    var newX = this.available_x[newXi][0];
    var newY = this.available_x[newXi][newYi];
    console.log(newX, newY); //the new coordinates for the bot

    this.rows[newX][newY].here = true;
    console.log(this.rows[newX][newY]);
    this.botAt.x_axis = newX;
    this.botAt.y_axis = newY;

  },
  search(c) {
    if (this.user == null) {
      this.toggleForm();
      this.error = "Login or Register to Play!";
    }
    else {
      if (c.here) {
        alert("Congrats! You found the Bot!");
        this.addScore();
        this.restart();
      }
      else if (!c.visited) {
        this.addedScore = this.addedScore + 1;
        c.visited = true;
        this.updateAvailable(c.x, c.y);
        this.moveBot();
        var xsteps = Math.abs(c.x - this.botAt.x_axis);
        var ysteps = Math.abs(c.y - this.botAt.y_axis);
        this.message = "BOT MOVED!"
        this.x_message = "x: (+/-)" + ysteps + " trees";
        this.y_message = "y: (+/-)" + xsteps + " trees";
        this.count = this.count + 1;
      }
      else {
        alert("already clicked, choose another one");
      }
    }
  },
  restart() {
    this.rows=[];
    this.message= "New Game";
    this.x_message= '';
    this.y_message= '';
    this.count = 0;
    this.build();
  },
  toggleForm() {
    this.error = "";
    this.username = "";
    this.password = "";
    this.showForm = !this.showForm;
  },
  register() {
    this.$router.push('register');
  },
  login() {
    this.$router.push('login');
  },
  async getScores() {
    try {
      this.$store.dispatch("getScores");
    } catch (error) {
      console.log(error);
    }
  },
  async addScore() {
    try {
      this.$store.dispatch("addScore", {
        name: this.user.username,
        score: this.addedScore,
      });
      this.addedScore = 0;

    } catch (error) {
      console.log(error);
    }
  },
  async deleteScore(score) {
    try {
      if (this.user.username === "admin") {
        this.$store.dispatch("deleteScore", {
          s_id: score._id,
        });
      }
      else {
        this.$store.dispatch("setError",  {
          mess: "Must be admin to delete",
        });
        this.toggleForm();
      }


    } catch (error) {
      console.log(error);
    }
  },
  closeForm() {
    this.showForm = false;
  },
  async logout() {
    try {
      this.$store.dispatch("logout");
    } catch (error) {
      console.log(error);
    }
  }
  },

}
 </script>

 <style scoped>
 h1
{
  font-family: 'Bungee Shade';font-size: 60px;
  color: blue;
}

.center
{
  text-align: center;
}

.page-footer
{
  position: sticky;
  bottom: 0;
  background-color: lightgray;
}

.levelList
{
  margin: auto;
  width: 10%;
}
#hideImg{
  opacity: 0;
 filter: alpha(opacity=0);
}

#levelImg{
  background-image: url("/images/level1.png");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
}

#select1:hover ~ #levelImg{

      background-image: url("/images/purpleBot.jpeg");

}

* {
  box-sizing: border-box;
}

html, body {
  background-color: #fafafa;
}

.square-containermain {
  padding: 8px;
}
.square-containermain:after {
  content: "";
  clear: both;
  display: block;
}

.squaremain {
  width: calc(100% / 2);
  float: left;
  position: relative;
  padding-bottom: calc(100% / 2);
  position: relative;
  left: 25%;
}
.squaremain .contentmain {
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  margin: 8px;
  padding: 16px;
  position: absolute;
  border-radius: 4px;
  background-image: url("/images/level1.png");
  background-size: contain;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
}


.levels {
  left: 0;
}

.squaremain .level1{
  background-image: url("/images/level1.png");
}

.squaremain .level2{
  background-image: url("/images/level2.png");
}

.squaremain .level3{
  background-image: url("/images/level3.png");
}

.squaremain .create {
  background-image: url("/images/levelblank.png");

}

.button {
  position: relative;
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 30px;
  left: 25%;
  cursor: pointer;
  border-radius: 8px;
  width: 50%;
}

/* Login Form */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h1 {
  margin-bottom: 30px;
  font-size: 1.5em;
}

.modal-body {
  margin: 0;
}

.modal-body input {
  margin-bottom: 20px;
  height: 30px;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.modal-default-button {
  float: right;
}

/*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

body, html, #root {
  overflow: auto;
}


#outer {
  width: 100%;
  margin: auto;

  background: url("/images/forest.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
}

.square-container {
  max-width: 75%;
  padding: 20%;
  position: relative;
  overflow: auto;
  margin: auto;

}

  &:after {
    content: '';
    clear: both;
    display: block;
}
.square {
  width: calc(100% / 15);
  float: left;
  position: relative;
  background-color: lightgray;
  padding-bottom: calc(100% / 15);

}
  .content {
    width: calc(100% - 16);
    height: calc(100% - 16);
    min-width: 25px;
    min-height: 25px;
    padding: auto;
    position: absolute;
    border-radius: 4px;
    background-color: green;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
}
.row {
  display: grid;
  width: 100%;
  height: 100%;
  grid-gap: 1px;

  grid-template-columns: minmax(25px, 75px) minmax(25px, 75px) minmax(25px, 75px) minmax(25px, 75px) minmax(25px, 75px)
                        minmax(25px, 75px) minmax(25px, 75px) minmax(25px, 75px) minmax(25px, 75px) minmax(25px, 75px);

  justify-content: center;
}

.cell {
  display: block;
  height: auto;
}

.is-visited {
  background-color: red;
}

.page-footer
{
  position: sticky;
  bottom: 0;
  background-color: lightgray;
}

</style>
