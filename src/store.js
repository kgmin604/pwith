import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
    name : 'user',
    initialState : {
      id: "",
      name: "",
      email: ""
    },
    reducers :{
      loginUser: (state, action) => {
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
      },
      clearUser: (state) => {
        state.id = "";
        state.name = "";
        state.email = "";
      }
    }
});
export let { loginUser, clearUser } = user.actions
export default configureStore({
  reducer: { 
    user : user.reducer // 앞의 user는 작명, user.reducer의 user는 slice
  }
})