import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import React from "react";
import axios from "axios";
import { setCookie } from "../../cookie/cookie";

// 카카오로그인
export const __kakaoLogin = createAsyncThunk(
  "memberSlice/__kakaoLogin",
  async (payload, thunkAPI) => {
    try {
      axios.get(`${process.env.REACT_APP_API_URL}/member/signup/kakao?code=${payload}`)
        .then((res) => {
          console.log("넘어온 값", res); // 토큰이 넘어올 것임
          const Access_Token = res.headers.access_token;
          const resData = res.data.data;

          localStorage.setItem("token", Access_Token);

          localStorage.setItem("role", resData.role);
          localStorage.setItem("userAddressTag", resData.userAddressTag);
          localStorage.setItem("userId", resData.userId);
          localStorage.setItem("userImgUrl", resData.userImgUrl);

          window.location.replace("/mypage")
        }).catch((error) => {
          console.log("소셜로그인 에러", error);
          //window.alert("로그인에 실패하였습니다.");
          //   window.location.replace("/login");
        })

    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
)

export const memberSlice = createSlice({
  name: "memberSlice",
  initialState: {
    isLoading: false
    //loginModal: false
  },
  reducers: {
    //모달 토글
    // modalTogle(state, action) {
    //     state.loginModal = !state.loginModal;
    // },
  },
  extraReducers: {


  }
});

export const { } = memberSlice.actions;
export default memberSlice.reducer;