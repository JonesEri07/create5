import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    scores: [],
    error: '',
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setScores(state, scores) {
      state.scores = scores;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    async register(context, data) {
      try {
        let response = await axios.post("/api/users", data);
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async login(context, data) {
     try {
       let response = await axios.post("/api/users/login", data);
       context.commit('setUser', response.data);
       return "";
     } catch (error) {
       return error.response.data.message;
     }
   },
   async logout(context) {
      try {
        await axios.delete("/api/users");
        context.commit('setUser', null);
        return "";
      } catch (error) {
        return error.response.data.message;
      }
    },
    async getUser(context) {
      try {
        let response = await axios.get("/api/users");
        context.commit('setUser', response.data);
        return "";
      } catch (error) {
        return "";
      }
    },
    async getScores(context) {
      try{
        let response = await axios.get("/api/scores");
        context.commit('setScores', response.data);
        return "";
      } catch (error) {
        return "";
      }
    },
    async addScore(context, data) {
      try {
        await axios.post("/api/scores", data);
        let response = await axios.get("/api/scores");
        context.commit('setScores', response.data);
        return "";
      } catch (error) {
        return "";
      }
    },
    async deleteScore(context, data) {
      try {
        await axios.delete("/api/scores/" + data.s_id);
        let response = await axios.get("/api/scores");
        context.commit('setScores', response.data);
        return "";
      } catch (error) {
        context.commit('setError', "Must be admin to delete");
        return "error";
      }
    },
    setError(context, data) {
      let err = data.mess;
      context.commit('setError', err);
    }
  }
})
