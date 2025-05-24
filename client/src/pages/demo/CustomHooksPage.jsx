import React from "react";

import useLocalStorage from '@/hooks/useLocalStorage';
import useToggle from '@/hooks/useToggle';
import {useAlert} from "@/hooks/useModal";
import {useConfirm} from "@/hooks/useModal";
import {useProcessingModal} from "@/hooks/useModal";

const UserPage = () => {
    const [name, setName] = useLocalStorage('name', '홍길동');
    const [isToggled, toggle] = useToggle(); // toggle 상태 관리
    const { showAlert,AlertDialog } = useAlert();
    const { showConfirm,ConfirmDialog} = useConfirm();
    const { showProcessing,hideProcessing,ProcessingModal} = useProcessingModal();


    return (
        <>
            <div>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">이름: {name}</h1>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이름을 입력하세요(로컬스토리지 저장됨)"
                />
            </div>
            {/* Toggle 버튼 */}
            <div>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">토글</h1>
                <button
                    onClick={toggle}
                    className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${
                        isToggled ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                    }`}
                >
                    {isToggled ? "TRUE" : "FALSE"}
                </button>
            </div>
            <div>
                <button className="px-6 py-2 rounded-full font-semibold transition duration-300"
                        onClick={() => showAlert('알림', 'alert!@!!')}>showAlert
                </button>
                <button className="px-6 py-2 rounded-full font-semibold transition duration-300"
                        onClick={() => showConfirm('알림', 'alert!@!!')}>showConfirm
                </button>
                <button
                    className="px-6 py-2 rounded-full font-semibold transition duration-300"
                    onClick={() => {
                        showProcessing('조회중');
                        setTimeout(() => {
                            hideProcessing();
                        }, 1000);
                    }}
                >
                    showProgress
                </button>
            </div>
            <AlertDialog/>
            <ConfirmDialog/>
            <ProcessingModal/>
        </>
    );
};

export default UserPage;
