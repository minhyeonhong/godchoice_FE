import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getCookie } from "../../pages/Post";

const initialState={
    posts : [
      
    ]

}


    export const __addPost = createAsyncThunk(
        "posts/__addPost",
        async (payload, thunkAPI) => {
            try {
                const data = await axios.post("http://localhost:3001/posts", payload);
                //console.log(data.data);
                return thunkAPI.fulfillWithValue(data.data);
            } catch (error) {
                return thunkAPI.rejectWithValue(error);
            }
        }
    );

    // export const __addPost = createAsyncThunk(
//     "posts/__addPost",
//     async (payload, thunkAPI) => {
//       try {
//         await axios
//           .post(`https://study.o-r.kr/api/feed`, payload, {
//             headers: {
//               enctype: "multipart/form-data",
//               Access_Token: getCookie('Access_Token'),
//               // RefreshToken: refreshToken, 생략 예정
//               "Cache-Control": "no-cache",
//             },
//           })
//           .then((response) => {
//             console.log("response", response.data);
//           });
//       } catch (error) {
//         console.log("error", error);
//         return thunkAPI.rejectWithValue(error);
//       }
//     }
//   );

    export const __getPost = createAsyncThunk(
        "posts/__getPost",
        async (payload, thunkAPI) => {
        try {
            const data = await axios.get("http://localhost:3001/posts");

            return thunkAPI.fulfillWithValue(data.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
        }
    );

  


export const PostSlice = createSlice({
    name: "posts", 
    initialState,
    reducers: {},
    extraReducers: {
    
    //__getPost
    [__getPost.pending]: (state) => {
        state.isLoading = true;
    },
    [__getPost.fulfilled]: (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
    },
    [__getPost.rejected]: (state, action) => {
         state.isLoading = false;
        state.error = action.payload;
    },

    //__addPost
    [__addPost.pending]: (state) => {
        state.isLoading = true; 
    },
    [__addPost.fulfilled]: (state, action) => {
        state.isLoading = false; 
        state.posts = action.payload; 
    },
    [__addPost.rejected]: (state, action) => {
        state.isLoading = false; 
        state.error = action.payload; 
    },

    }
})



export const { } = PostSlice.actions;
export default PostSlice.reducer;