import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
const { persistAtom } = recoilPersist();

// 인증 상태
export const isAuthenticatedState = atom({
    key: 'isAuthenticatedState',
    default: false,
    effects_UNSTABLE: [persistAtom],
});

// 사용자 역할 상태
export const userRolesState = atom({
    key: 'userRolesState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});


// 사용자 메뉴 상태
export const menuState  = atom({
    key: 'menuState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});


// 사용자 데이터 상태
export const userDataState = atom({
    key: 'userDataState',
    default: {
        user: '',
        email: '',
        id: '',
        nickName: '',
        roles: [],
        success: '',
        token: '',
        type: 'normal',
    },
    effects_UNSTABLE: [persistAtom],
});
