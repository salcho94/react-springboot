import React, { useState } from "react";
import {useAlert} from "@/hooks/useModal";

const ChatRoomCreateModal = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const { showAlert, AlertDialog } = useAlert();
    const handleSubmit = async () => {
        if (!name.trim()) return await showAlert("제목", "방 제목을 입력해 주세요");
        onSubmit({ name: name.trim(), password });
        setName("");
        setPassword("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white w-80 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">채팅방 생성</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">방 제목</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="예: 프론트엔드 팀"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">비밀번호 (선택)</label>
                        <input
                            type="password"
                            value={password}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="입력하지 않으면 공개방"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        생성
                    </button>
                </div>
            </div>
            <AlertDialog/>
        </div>
    );
};

export default ChatRoomCreateModal;
