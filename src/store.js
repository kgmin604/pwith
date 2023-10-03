import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: null,
    isSocial: null
  },
  reducers: {
    loginUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.isSocial = action.payload.isSocial;
    },
    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.isSocial = null;
    }
  }
});

const recStudyList = createSlice({
  name: 'recStudyList',
  initialState: [],
  reducers: {
    updateRecStudyList: (state, action) => {
      return action.payload;
    }
  }
});

const studyCategory = createSlice({
  name: 'studyCategory',
  initialState: null,
  reducers: {
    setStudyCategory: (state, action) => {
      return action.payload;
    }
  }
})

const qnaCategory = createSlice({
  name: 'qnaCategory',
  initialState: null,
  reducers: {
    setQnaCategory: (state, action) => {
      return action.payload;
    }
  }
})

export let { loginUser, clearUser } = user.actions;
export const { updateRecStudyList } = recStudyList.actions;
export const { setStudyCategory } = studyCategory.actions;
export const { setQnaCategory } = qnaCategory.actions;

export default configureStore({
  reducer: {
    user: user.reducer, // 앞의 user는 작명, user.reducer의 user는 slice
    recStudyList: recStudyList.reducer,
    studyCategory: studyCategory.reducer,
    qnaCategory: qnaCategory.reducer
  }
})