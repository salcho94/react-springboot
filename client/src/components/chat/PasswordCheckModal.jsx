import React, { useState } from "react";

const PasswordCheckModal = ({ isOpen, onClose, onSubmit }) => {
    const [password, setPassword] = useState("");

    const handleConfirm = () => {
        if (!password.trim()) return alert("비밀번호를 입력하세요.");
        onSubmit(password);
        setPassword("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white w-80 rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">비밀번호 확인</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                    placeholder="채팅방 비밀번호"
                    className="w-full border px-3 py-2 rounded text-sm"
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordCheckModal;
