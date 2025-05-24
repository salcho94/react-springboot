import React from 'react';

const Home = React.lazy(() => import("@/pages/Home"));
const ConnectPage = React.lazy(() => import("@/pages/database/ConnectPage"));
const AdminPage = React.lazy(() => import("@/pages/demo/AdminPage"));
const UserPage = React.lazy(() => import("@/pages/demo/UserPage"));
const RecoilExamplePage = React.lazy(() => import("@/pages/demo/RecoilExamplePage"));
const UseEffectExamplePage = React.lazy(() => import("@/pages/demo/UseEffectExamplePage"));
const UseMemoPage = React.lazy(() => import("@/pages/demo/UseMemoPage"));
const UseCallbackPage = React.lazy(() => import("@/pages/demo/UseCallbackPage"));
const UseRefPage = React.lazy(() => import("@/pages/demo/UseRefPage"));
const UseStatePage = React.lazy(() => import("@/pages/demo/UseStatePage"));
const ReactMemoPage = React.lazy(() => import("@/pages/demo/ReactMemoPage"));
const ForwardRefPage = React.lazy(() => import("@/pages/demo/ForwardRefPage"));
const CustomHooksPage = React.lazy(() => import("@/pages/demo/CustomHooksPage"));

export const DefaultRoutes = [
    { path: "/", element: <Home />, requiredRoles: null },
    { path: "/adminPage", element: <AdminPage />, requiredRoles: ['admin'] },
    { path: "/userPage", element: <UserPage />, requiredRoles: ['user'] },
    { path: "/recoil", element: <RecoilExamplePage />, requiredRoles: ['user', 'admin'] },
    { path: "/dbPage", element: <ConnectPage />, requiredRoles: ['db'] },
    { path: "/useEffect", element: <UseEffectExamplePage />, requiredRoles: ['user', 'admin'] },
    { path: "/useMemo", element: <UseMemoPage />, requiredRoles: ['user', 'admin'] },
    { path: "/useCallback", element: <UseCallbackPage />, requiredRoles: ['user', 'admin'] },
    { path: "/useRef", element: <UseRefPage />, requiredRoles: ['user', 'admin'] },
    { path: "/useState", element: <UseStatePage />, requiredRoles: ['user', 'admin'] },
    { path: "/reactMemo", element: <ReactMemoPage />, requiredRoles: ['user', 'admin'] },
    { path: "/forwardRef", element: <ForwardRefPage />, requiredRoles: ['user', 'admin'] },
    { path: "/customHooks", element: <CustomHooksPage />, requiredRoles: ['user', 'admin'] },
];
