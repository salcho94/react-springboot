import React, {Suspense, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";

import {AuthProvider} from '@/services/authContext';
import ProtectedRoute from '@/services/ProtectedRoute';
import {ErrorBoundary} from 'react-error-boundary';

import DashBoard from "@/components/layout/DashBoard";
import {allRoutes} from '@/routes';

const ErrorPage = React.lazy(() => import("@/pages/error/ErrorPage"));


const GoToHome = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/');
    }, [navigate]); // navigate를 의존성 배열에 추가

    return null;
};


const App = () => {
    return (
        <Router>
            <AuthProvider>
                <ErrorBoundary fallback={<ErrorPage errorMessage={"처리중 오류가 발생하였습니다."} />}>
                    <DashBoard>
                        <Suspense
                            fallback={
                                <div className="text-2xl text-black-600 text-center p-4 bg-gray-100 rounded-lg shadow-lg animate-pulse">
                                    로딩중.......
                                </div>
                            }
                        >
                            <Routes>
                                {allRoutes
                                    ? allRoutes.map((route, index) => (
                                        <Route
                                            key={index}
                                            path={`/${route.path}`}
                                            element={
                                                route.requiredRoles === null ? (
                                                    route.element
                                                ) : (
                                                    <ProtectedRoute
                                                        element={route.element}
                                                        requiredRoles={route.requiredRoles}
                                                    />
                                                )
                                            }
                                        />
                                    ))
                                    : null}
                                <Route path="*" element={<GoToHome />} />
                            </Routes>
                        </Suspense>
                    </DashBoard>
                </ErrorBoundary>
            </AuthProvider>
        </Router>
    );
};

export default App;
