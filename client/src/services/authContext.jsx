import React, { createContext, useContext, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {isAuthenticatedState, userRolesState, userDataState, menuState} from '@/recoil/auth/atoms';
import { useNavigate } from 'react-router-dom';
import {useAlert} from "@/hooks/useModal";


// AuthContext 생성
const AuthContext = createContext();

// AuthProvider 구현
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
  const [userRoles, setUserRoles] = useRecoilState(userRolesState);
  const [userData, setUserData] = useRecoilState(userDataState);
  const [menuData, setMenuData] = useRecoilState(menuState); // 메뉴 상태 관리
  const {showAlert,AlertDialog} = useAlert();
  const navigate = useNavigate();

  const login = (userData) => {
    // 사용자 데이터 설정
    const roles = [userData.auth];
    const userWithRoles = {
      ...userData,
      roles,
    };

    setUserData(userWithRoles);
    setUserRoles(roles);
    setIsAuthenticated(true);

    // 메인 페이지로 이동
    navigate('/');
  };

  useEffect(() => {
    if (!userData?.accessToken) return; // ✅ userData가 없으면 실행 안 함

    const storedRoles = userData.roles || [];

    setUserRoles((prevRoles) =>
        JSON.stringify(prevRoles) !== JSON.stringify(storedRoles) ? storedRoles : prevRoles
    );

    setIsAuthenticated((prevAuth) => (prevAuth !== true ? true : prevAuth));
  }, [userData]); // userData만 의존성 배열에 추가



  const logout =async (mode) => {
    // 로그아웃 처리
    setUserData(null);
    setUserRoles([]);
    setMenuData([])
    setIsAuthenticated(false);
    await showAlert('알림',mode === 'token'?'토큰이 만료되었습니다.' :'로그아웃 되었습니다.')
    navigate('/signIn'); // 로그아웃 후 로그인 페이지로 이동
  };


  return (
      <AuthContext.Provider value={{ isAuthenticated, userRoles, login, logout }}>
        {children}
      <AlertDialog/>
      </AuthContext.Provider>
  );
};

// `useAuth` 훅을 통해 AuthContext 접근
export const useAuth = () => useContext(AuthContext);
