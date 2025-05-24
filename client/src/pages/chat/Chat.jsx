import DefaultChat from "@/components/chat/DefaultChat";
import React, {memo, useState} from "react";
import HideChat from "@/components/chat/HideChat";

const Chat = () => {
    const [isOn, setIsOn] = useState(false);

    return (
        <>
            {/* 토글 버튼 */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => setIsOn(!isOn)}
                    className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        isOn ? "bg-green-500" : "bg-gray-400"
                    }`}
                >
                    {/* 토글 원 (움직이는 버튼) */}
                    <div
                        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                            isOn ? "translate-x-7" : "translate-x-0"
                        }`}
                    />
                </button>
            </div>

            {/* 채팅 UI */}
            {isOn ? <DefaultChat /> : <HideChat />}
        </>
    );
};

export default memo(Chat);
