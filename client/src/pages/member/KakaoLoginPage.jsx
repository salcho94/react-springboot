import React, { useEffect, useState } from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";
import { useAuth } from "@/services/authContext";

const KakaoLoginPage = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_KAKAO_LOGIN}/kakaoLogin`;
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState("");
    const { login } = useAuth();

    const code = new URL(window.location.href).searchParams.get("code");

    const goToHome = () => {
        navigate("/");
    };

    const getUser = async (token) => {
        try {
            const response = await axiosInstance.get(`/api/kakao?accessToken=${token}`);
            return response;
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const getToken = async () => {
        const payload = qs.stringify({
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code: code,
        });

        const headers = {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            Accept: "*/*",
        };

        try {
            const res = await axiosInstance.post(
                "https://kauth.kakao.com/oauth/token",
                payload,
                { headers }
            );
            setAccessToken(res.data.access_token);
        } catch (err) {
            console.error("Error fetching token:", err);
        }
    };

    useEffect(() => {
        if (code) {
            getToken();
        }
    }, [code]);

    useEffect(() => {
        if (accessToken) {
            getUser(accessToken).then((res) => {
                if (res?.data) {
                    login(res.data);
                    goToHome();
                }
            });
        }
    }, [accessToken]);

    return (
        <div>
            <strong>로그인 중입니다. 잠시만 기다려 주세요...</strong>
        </div>
    );
};

export default KakaoLoginPage;
