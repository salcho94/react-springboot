import React from 'react';

const BoardList = React.lazy(() => import("@/pages/board/BoardList"));
const BoardDetail = React.lazy(() => import("@/pages/board/BoardDetail"));
const BoardInsert = React.lazy(() => import("@/pages/board/BoardInsert"));
const Chat = React.lazy(() => import("@/pages/chat/Chat"));
const Gpt = React.lazy(() => import("@/pages/chat/Gpt"));
const LuckPage = React.lazy(() => import("@/pages/luck/LuckPage"));
const HealthyPage = React.lazy(() => import("@/pages/healthy/HealthyPage"));


export const Routes = [
    { path: "/boardList", element: <BoardList />, requiredRoles: ['user','admin','vvip'] },
    { path: "/boardDetail", element: <BoardDetail />, requiredRoles: ['user','admin','vvip'] },
    { path: "/boardInsert", element: <BoardInsert />, requiredRoles: ['user','admin','vvip'] },
    { path: "/chat", element: <Chat />, requiredRoles: ['vvip'] },
    { path: "/gpt", element: <Gpt />, requiredRoles: ['user','admin','vvip'] },
    { path: "/gpt", element: <Gpt />, requiredRoles: ['user','admin','vvip'] },
    { path: "/luck", element: <LuckPage />, requiredRoles: ['user','admin','vvip'] },
    { path: "/healthy", element: <HealthyPage />, requiredRoles: ['user','admin','vvip'] },
];
