import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";
import ChatRoomCreateModal from "@/components/chat/ChatRoomCreateModal";
import { useRecoilState } from "recoil";
import { userDataState } from "@/recoil/auth/atoms";
import {useConfirm,useAlert} from "@/hooks/useModal";
import PasswordCheckModal from "@/components/chat/PasswordCheckModal";

const ChatList = () => {
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user] = useRecoilState(userDataState);
    const { showConfirm, ConfirmDialog } = useConfirm();
    const { showAlert, AlertDialog } = useAlert();
    const navigate = useNavigate();
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // 채팅방 목록 불러오기
    const fetchRooms = async () => {
        try {
            const res = await axiosInstance.get("/api/chat/rooms");
            console.log(res)
            setRooms(res.data);
        } catch (error) {
            console.error("채팅방 목록 불러오기 실패", error);
        }
    };

    const checkPassWord = (roomId) => {
        setSelectedRoomId(roomId);
        setIsPasswordModalOpen(true);
    };

    const handlePasswordSubmit = async (inputPassword) => {
        try {
            const res = await axiosInstance.post(`/api/chat/rooms/${selectedRoomId}/check`, {
                password: inputPassword,
            });

            if (res.data.success) {
                navigate("/chat", { state: { roomId: selectedRoomId } });
            } else {
                showAlert("불일치","비밀번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error("비밀번호 확인 실패", error);
        } finally {
            setIsPasswordModalOpen(false);
        }
    };

    useEffect(() => {
        fetchRooms().then();
    }, []);

    // 채팅방 생성
    const handleCreateRoom = async ({ name, password }) => {
        try {
            await axiosInstance.post("/api/chat/rooms", {
                name,
                password,
                writer: user.id, // 작성자 ID
            });
            fetchRooms().then();
            setIsModalOpen(false);
        } catch (error) {
            console.error("채팅방 생성 실패", error);
        }
    };

    // 채팅방 삭제
    const handleDeleteRoom = async (roomId) => {
        await showConfirm('삭제','채팅방을 삭제하시겠습니까?');

        try {
            await axiosInstance.delete(`/api/chat/rooms/${roomId}`);
            fetchRooms().then();
        } catch (error) {
            console.error("채팅방 삭제 실패", error);
        }
    };

    return (
        <div className="w-full  h-screen mx-auto bg-white shadow-md rounded-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between bg-gray-100 p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">채팅방 목록</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    + 생성
                </button>
            </div>

            <ul className="divide-y divide-gray-200 overflow-y-auto max-h-[500px]">
                {rooms.length === 0 ? (
                    <li className="p-4 text-gray-500 text-sm">
                        생성된 채팅방이 없습니다.
                    </li>
                ) : (
                    rooms.map((room, idx) => (
                        <li
                            key={`${room.id}_${idx}`}
                            onClick={() =>
                                room.password === 'Y'
                                    ? checkPassWord(room.id)
                                    : navigate("/chat", { state: { roomId: room.id } })
                            }

                            className="hover:bg-gray-50 transition cursor-pointer"
                        >
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-gray-800 text-sm font-medium">
                                {room.password === 'Y' && '🔒  '}{room.name}
                                </span>
                                {room.writer === user.id && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // 입장 클릭 방지
                                            handleDeleteRoom(room.id).then();
                                        }}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>
            <AlertDialog/>
            <ConfirmDialog/>
            {/* 채팅방 생성 모달 */}
            <ChatRoomCreateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateRoom}
            />

            <PasswordCheckModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handlePasswordSubmit}
            />
        </div>
    );
};

export default ChatList;
