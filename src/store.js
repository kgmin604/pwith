import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: null,
    isSocial: null,
    image: null
  },
  reducers: {
    loginUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.isSocial = action.payload.isSocial;
      state.image = action.payload.image;
    },
    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.isSocial = null;
    }
  }
});

const unread = createSlice({
  name: 'unread',
  initialState: false,
  reducers: { 
    setUnread: (state, action) => {
      return action.payload
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
const lectureCategory = createSlice({
  name: 'lectureCategory',
  initialState: {
    firstCategory: null,
    secondCategory: null
  },
  reducers: {
    setLectureCategory: (state, action) => {
      state.firstCategory = action.payload.firstCategory;
      state.secondCategory = action.payload.secondCategory;
    }
  }
})

const bookCategory = createSlice({
  name: 'bookCategory',
  initialState: {
    firstCategory: null,
    secondCategory: null
  },
  reducers: {
    setBookCategory: (state, action) => {
      state.firstCategory = action.payload.firstCategory;
      state.secondCategory = action.payload.secondCategory;
    }
  }
})

export let { loginUser, clearUser } = user.actions;
export const { setUnread } = unread.actions;
export const { updateRecStudyList } = recStudyList.actions;
export const { setStudyCategory } = studyCategory.actions;
export const { setQnaCategory } = qnaCategory.actions;
export const { setLectureCategory } = lectureCategory.actions;
export const { setBookCategory } = bookCategory.actions;


export default configureStore({
  reducer: {
    user: user.reducer, // 앞의 user는 작명, user.reducer의 user는 slice
    unread:unread.reducer,
    recStudyList: recStudyList.reducer,
    studyCategory: studyCategory.reducer,
    qnaCategory: qnaCategory.reducer,
    lectureCategory: lectureCategory.reducer,
    bookCategory: bookCategory.reducer
  }
})