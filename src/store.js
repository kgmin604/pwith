import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
    name : 'user',
    initialState : {
      id: null,
      name: null
    },
    reducers :{
      loginUser: (state, action) => {
        state.id = action.payload.id;
        state.name = action.payload.name;
      },
      clearUser: (state) => {
        state.id = null;
        state.name = null;
      }
    }
});

let studyPostList = createSlice({
  name : 'studyPostList',
  initialState : [],
  reducers : {
    updateStudyPostList: (state,action)=>{
      return action.payload;
    }
  }
}) ;

export let { loginUser, clearUser } = user.actions;
export let {updateStudyPostList} = studyPostList.actions;

export default configureStore({
  reducer: { 
    user : user.reducer, // 앞의 user는 작명, user.reducer의 user는 slice
    studyPostList : studyPostList.reducer
  }
})