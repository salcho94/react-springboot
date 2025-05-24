import React from 'react';

const MenuCustom = React.lazy(() => import("@/pages/admin/menu/MenuCustom"));
const MemberCustom = React.lazy(() => import("@/pages/admin/member/MemberCustom"));

export const AdminRoute = [
    { path: "/menuCustom", element: <MenuCustom />, requiredRoles: ['admin','vvip'] },
    { path: "/memberCustom", element: <MemberCustom />, requiredRoles: ['vvip'] },
];
