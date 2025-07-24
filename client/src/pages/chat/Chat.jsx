import DefaultChat from "@/components/chat/DefaultChat";
import React, {memo, useEffect, useState} from "react";
import HideChat from "@/components/chat/HideChat";
import {useRecoilState} from "recoil";
import {themeState} from "@/recoil/theme/atoms";
import {userDataState} from "@/recoil/auth/atoms";
import {useLocation, useNavigate} from "react-router-dom";
import {useAlert} from "@/hooks/useModal";

const Chat = () => {
    const [isOn, setIsOn] = useState(false);
    const [theme, setTheme] = useRecoilState(themeState);

    const location = useLocation();
    const navigate = useNavigate()
    const roomId = location.state?.roomId;
    const { showAlert, AlertDialog } = useAlert();

    useEffect(() => {
        const init = async () =>{
            if (!roomId) {
                await showAlert('비정상','올바르지않은 요청입니다.')
                navigate(-1);
            }
        }
        init();
    }, [roomId, navigate]);

    return (
        <>
            <AlertDialog/>
            {/* 토글 버튼 */}
            {/*<div className="flex items-center space-x-3">*/}
            {/*    <button*/}
            {/*        onClick={() => setIsOn(!isOn)}*/}
            {/*        className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${*/}
            {/*            isOn ? "bg-green-500" : "bg-gray-400"*/}
            {/*        }`}*/}
            {/*    >*/}
            {/*        /!* 토글 원 (움직이는 버튼) *!/*/}
            {/*        <div*/}
            {/*            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${*/}
            {/*                isOn ? "translate-x-7" : "translate-x-0"*/}
            {/*            }`}*/}
            {/*        />*/}
            {/*    </button>*/}
            {/*</div>*/}
            <HideChat theme={theme} roomId={roomId} />
            {/* 채팅 UI */}
            {/*{isOn ? <DefaultChat theme={theme} /> : <HideChat theme={theme} />}*/}
        </>
    );
};

export default memo(Chat);
