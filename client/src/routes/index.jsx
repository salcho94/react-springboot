import { DefaultRoutes } from '@/routes/DefaultRoutes';
import { UserRoutes } from '@/routes/UserRoutes';
import { AdminRoute } from "@/routes/AdminRoutes";
import { Routes } from "@/routes/Routes";


export const allRoutes = [
    ...DefaultRoutes,
    ...UserRoutes,
    ...AdminRoute,
    ...Routes
];
