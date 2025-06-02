import React from 'react';
import { useNavigate } from 'react-router-dom';
import kakaoBtn from '@/assets/images/kakao.png';
import { loginSubmit } from "@/apis/member/MemberApi";
import { useAuth } from "@/services/authContext";
import {useAlert} from "@/hooks/useModal";



function LoginPage() {
    const { login } = useAuth();
    const {showAlert,AlertDialog} = useAlert();
    let navigate = useNavigate();
    let KakaoLoginAPI = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_KAKAO_LOGIN}/kakaoLogin&response_type=code`;

    const openKakaoLogin = () => {
        window.open(KakaoLoginAPI, '_self');
    };

    const onLoginHandler =  () => {
        let nickName = document.getElementById('nickName').value.trim();
        let password = document.getElementById('password').value.trim();
        if (nickName === '') {
            showAlert('닉네임','닉네임을 입력해주세요.')
        } else if (password === '') {
            showAlert('비밀번호','비밀번호를 입력해주세요.')
        } else {
            const body =
                {
                    "nickName": nickName,
                    "password": password
                }
            loginSubmit(body).then(res => {
                if (res.data.success === "Y") {
                    login(res.data);
                }else{
                   showAlert('로그인 실패',res.data.msg);
                }
            })
        }
    };

    return (
        <div className="flex items-center justify-center  rounded-lg">
            <div className=" items-center justify-center  w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 dark:text-white">로그인</h2>

                {/* Nickname Input */}
                <div className="mb-4">
                    <label htmlFor="nickName" className="block text-lg font-semibold text-gray-700 mb-2 dark:text-white">
                        닉네임
                    </label>
                    <input
                        type="text"
                        id="nickName"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black"
                        placeholder="NickName"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onLoginHandler();
                            }
                        }}
                    />
                </div>

                {/* Password Input */}
                <div className="mb-6">
                    <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2 dark:text-white">
                        비밀번호
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-black"
                        placeholder="Password"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onLoginHandler();
                            }
                        }}
                    />
                </div>

                {/* Kakao Login Button */}
                <div className="mb-6 flex justify-center">
                    <img
                        src={kakaoBtn}
                        alt="Kakao Login"
                        className="w-12 cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => {
                            openKakaoLogin();
                        }}
                    />
                </div>

                {/* Sign Up and Login Buttons */}
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => {
                            navigate('/signup');
                        }}
                        className="w-full py-3 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none transition duration-200"
                    >
                        회원가입
                    </button>
                    <button
                        onClick={(e) => {
                            onLoginHandler(e);
                        }}
                        className="w-full py-3 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none transition duration-200"
                    >
                        로그인
                    </button>
                </div>
            </div>
            <AlertDialog/>
        </div>
    );
}

export default LoginPage;
