import React from 'react';

const SingUpPage = React.lazy(() => import("@/pages/member/SingUpPage"));
const Login = React.lazy(() => import("@/pages/member/LoginPage"));
const KakaoLoginPage = React.lazy(() => import("@/pages/member/KakaoLoginPage"));
const LogOut = React.lazy(() => import("@/pages/member/LogoutPage"));
export const UserRoutes = [
    { path: "/signUp", element: <SingUpPage />, requiredRoles: null },
    { path: "/signIn", element: <Login />, requiredRoles: null },
    { path: "/kakaoLogin", element: <KakaoLoginPage />, requiredRoles: null },
    { path: "/logout", element: <LogOut />, requiredRoles: null }
];
