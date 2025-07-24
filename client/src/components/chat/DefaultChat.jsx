import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import {userDataState} from "@/recoil/auth/atoms";
import {Paperclip, Send, X} from "lucide-react";
import RenderMessage from "@/components/chat/RenderMessage";
import axiosInstance from "@/services/axiosInstance";
import {useAlert, useProcessingModal} from "@/hooks/useModal";
import EmojiPicker from "@/components/chat/EmojiPicker";
import {useParams} from "react-router-dom";


// Memoized Message component
const MemoizedRenderMessage = memo(RenderMessage);

// Memoized Attachment component
const Attachment = memo(({ att, index, onRemove }) => (
    <div className="relative">
        {att.type === 'image' ? (
            <div className="relative group">
                <img
                    src={att.preview}
                    alt={att.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    loading="lazy"
                />
                <button
                    onClick={() => onRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        ) : (
            <div className="relative group bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm truncate max-w-[120px]">{att.name}</span>
                </div>
                <button
                    onClick={() => onRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        )}
    </div>
));

// Memoized Header component

const Header = memo(({ onlineUsers ,handleSendMail,decreaseFontSize,increaseFontSize,fontSize}) => (
    <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">실시간 채팅</h1>
            <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2">
                    <button onClick={decreaseFontSize} className="px-3 py-1 border rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300">➖</button>
                    <span className="text-black font-bold">{fontSize}</span>
                    <button onClick={increaseFontSize} className="px-3 py-1 border rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300">➕</button>
                </div>
                <button type="button" onClick={handleSendMail} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">관리자 호출</button>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">온라인</span>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-2 text-gray-600 text-sm">
            <strong>현재 접속 중:</strong> {onlineUsers?.length > 0 ? onlineUsers.join(", ") : "없음"}
        </div>
    </header>
));

const DefaultChat = ({theme }) => {
    const { roomId } = useParams();
    const [user] = useRecoilState(userDataState);
    const { showAlert, AlertDialog } = useAlert();
    const { showProcessing, hideProcessing, ProcessingModal } = useProcessingModal();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [isMailDisabled, setIsMailDisabled] = useState(false);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const captureInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const ws = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [fontSize, setFontSize] = useState(16);
    const [unreadCount, setUnreadCount] = useState(0); // 안 읽은 메시지 개수 상태 추가
    const [isWindowFocused, setIsWindowFocused] = useState(true); // 창 포커스 상태
    const defaultTitle = "실시간 채팅";
    // 컴포넌트 마운트 상태 추적용 ref
    const componentMounted = useRef(true);

    useEffect(() => {
        const handleFocus = () => {
            setIsWindowFocused(true);
            setUnreadCount(0); // 포커스되면 안 읽은 메시지 리셋
            document.title = defaultTitle;
        };

        const handleBlur = () => {
            setIsWindowFocused(false);
        };

        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);
    const increaseFontSize = () => {
        setFontSize((prev) => (prev < 24 ? prev + 2 : prev)); // 최대 24px 제한
    };

    const decreaseFontSize = () => {
        setFontSize((prev) => (prev > 10 ? prev - 2 : prev)); // 최소 10px 제한
    };
    const handleSendMail = () => {
        if (isMailDisabled) {
            showAlert('알림','잠시후 다시 요청해주세요 ㅎ 메일 과부하방지');
            return;
        }

        setIsMailDisabled(true); // 버튼 비활성화

        showProcessing('호출중 ...');
        axiosInstance.post("/api/mail/send", null, {
            params: {
                to: user.nickName // 'to' 파라미터로 'user.nickName'을 전달
            }
        })
            .then(response => {
                setTimeout(() => setIsMailDisabled(false), 5000); // 5초 후 활성화
                showAlert('성공','호출에 성공하였습니다 잠시만 기다려 주세요');
            })
            .catch(error => {
                showAlert('실패','호출에 실패하였습니다.');
                console.error("메일 전송 실패", error);
            })
            .finally(e=>{
                hideProcessing();
            })

        setTimeout(() => setIsMailDisabled(false), 5000); // 5초 후 활성화
    };

    // Debounced typing handler
    const handleTyping = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: "typing",
                user: user.nickName
            }));

            typingTimeoutRef.current = setTimeout(() => {
                handleNoTyping();
            }, 1000);
        }
    }, [user.nickName]);

    const handleNoTyping = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: "endTyping",
                user: user.nickName
            }));
        }
    }, [user.nickName]);

    // WebSocket connection
    useEffect(() => {
        // user.nickName이 없으면 연결하지 않음
        if (!user.nickName) return;

        // 웹소켓 참조 생성
        const socket = new WebSocket(process.env.REACT_APP_CHAT_SOCKET_URL);
        ws.current = socket;

        // 연결 성공 시 호출
        socket.onopen = () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'connect',
                    roomId,
                    user: { nickName: user.nickName }
                }));
                console.log("✅ 연결 성공:", user.nickName);
            }
        };

        // 메시지 수신 시 호출
        socket.onmessage = handleMessage;

        // 재연결 함수 정의
        const reconnect = () => {
            console.log("❌ 연결 종료됨, 3초 후 재연결 시도");
            setTimeout(() => {
                // 컴포넌트가 언마운트된 경우 재연결 방지
                if (!componentMounted.current) return;

                const newSocket =new WebSocket(process.env.REACT_APP_CHAT_SOCKET_URL);
                ws.current = newSocket;

                newSocket.onopen = () => {
                    if (newSocket.readyState === WebSocket.OPEN) {
                        newSocket.send(JSON.stringify({
                            type: 'connect',
                            user: { nickName: user.nickName }
                        }));
                        console.log("✅ 재연결 성공:", user.nickName);
                    }
                };

                newSocket.onmessage = handleMessage;
                newSocket.onclose = reconnect;
                newSocket.onerror = (err) => {
                    console.error("⚠️ 소켓 오류 발생:", err);
                    newSocket.close();
                };
            }, 3000);
        };

        // 연결 종료 시 재연결 시도
        socket.onclose = reconnect;

        // 오류 발생 시 처리
        socket.onerror = (err) => {
            console.error("⚠️ 소켓 오류 발생:", err);
            socket.close(); // 오류 발생 시 안전하게 종료
        };


        // 정리(cleanup) 함수
        return () => {
            componentMounted.current = false; // 컴포넌트 언마운트 표시
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [user.nickName]);
    // Optimized message handler
    const handleMessage = useCallback((event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'userList') {
            setOnlineUsers(prev => [...new Set(data.userList)]);
        } else if (data.type === 'system') {
            setMessages(prev => [...prev, {
                text: data.text,
                sender: "System",
                timestamp: new Date(),
                type: 'system'
            }]);
        } else if (data.type === "typing") {
            setTypingUsers(prev => [...new Set([...prev, data.user])]);
        } else if (data.type === "endTyping") {
            setTypingUsers(prev => prev.filter(user => user !== data.user));
        } else {
            setMessages(prev => [...prev, {
                ...data,
                timestamp: new Date(data.timestamp)
            }]);

            if (data.text !== "" && data?.sender !== user?.nickName) {
                setUnreadCount((prev) => {
                    const newCount = prev + 1;
                    document.title = `(${newCount}) ${defaultTitle}`;
                    return newCount;
                });
            }
        }

    }, [isWindowFocused, user.nickName]);



    // Auto-scroll effect with throttling
    useEffect(() => {
        const scrollTimeout = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);


        return () => clearTimeout(scrollTimeout);
    }, [messages]);

    // Optimized file handling
    const handleFileSelect = useCallback((e) => {
        const MAX_FILE_SIZE = 50 * 1024 * 1024;
        const files = Array.from(e.target.files);

        const validFiles = files.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                showAlert(`알림`, `${file.name}은(는) 50MB를 초과하여 업로드할 수 없습니다.`);
                return false;
            }
            return true;
        });

        setAttachments(prev => [
            ...prev,
            ...validFiles.map(file => ({
                file,
                type: file.type.startsWith('image/') ? 'image' : 'file',
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                name: file.name
            }))
        ]);

        e.target.value = null;
    }, [showAlert]);

    // Optimized message sending
    const sendMessage = useCallback(async () => {
        const MAX_MESSAGE_LENGTH = 50000;
        if (input.length > MAX_MESSAGE_LENGTH) {
            showAlert("오류", "메시지가 너무 깁니다. 50000자 이하로 입력해주세요.");
            return;
        }
        if (input.trim() === "" && attachments.length === 0) return;

        try {
            let fileUrls = [];
            if (attachments.length > 0) {
                showProcessing('메세지 전송중...');
                const formData = new FormData();
                attachments.forEach(att => formData.append("files", att.file));
                const response = await axiosInstance.post('/api/file/chat/upload', formData);
                fileUrls = response.data.files || [];
            }

            const message = {
                text: input,
                sender: user.nickName,
                timestamp: new Date(),
                attachments: fileUrls.map(file => ({
                    type: file.type,
                    name: file.name,
                    url: file.url,
                    preview: file.preview,
                })),
                roomId
            };

            setInput("");
            setAttachments([]);
        } catch (error) {
            showAlert("오류", "메시지 전송에 실패했습니다.");
        } finally {
            hideProcessing();
        }
    }, [input, attachments, user.nickName, showAlert, showProcessing, hideProcessing]);



    const handleEmojiSelect = (emoji) => {
        const cursorPos = inputRef.current.selectionStart; // 커서 위치 가져오기
        const newInput = input.slice(0, cursorPos) + emoji + input.slice(cursorPos); // 커서 위치에 이모지 삽입
        setInput(newInput);

        // 커서가 이모지 뒤로 이동하도록 설정
        setTimeout(() => {
            inputRef.current.selectionStart = inputRef.current.selectionEnd = cursorPos + emoji.length;
        }, 0);
    };


    const handlePaste = (e) => {
        const items = e.clipboardData?.items;

        if (!items) return;

        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();

                const file = item.getAsFile();
                const preview = URL.createObjectURL(file);

                setAttachments(prev => [...prev, {
                    file,
                    type: 'image',
                    preview,
                    name: '클립보드 이미지.png'
                }]);

                break;
            }
        }
    };
    const [isComposing, setIsComposing] = useState(false); // 한글 입력 여부 상태

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            if (isComposing) return; // 🚀 한글 입력 중이면 Enter 무시

            e.preventDefault(); // 기본 동작 방지
            sendMessage();
            handleNoTyping();
        }
        if (e.key === "Enter" && e.shiftKey) {
            setInput((prev) => `${prev}\n`);
        }
    };

    const handleCompositionStart = () => setIsComposing(true);
    const handleCompositionEnd = () => setIsComposing(false);



    return (
        <div className="flex flex-col min-h-screen sm:min-h-[500px] sm:min-w-8 max-h-screen bg-gradient-to-b from-gray-50 to-gray-100 max-w-[330px] sm:max-w-[none]">
            <Header onlineUsers={onlineUsers} handleSendMail={handleSendMail} fontSize={fontSize} decreaseFontSize={decreaseFontSize} increaseFontSize={increaseFontSize}/>
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <MemoizedRenderMessage
                        key={`${msg.sender}-${msg.timestamp}-${index}`}
                        msg={msg}
                        index={index}
                        user={user}
                        fontSize={fontSize}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {attachments.length > 0 && (
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
                        {attachments.map((att, index) => (
                            <Attachment
                                key={`${att.name}-${index}`}
                                att={att}
                                index={index}
                                onRemove={(index) => {
                                    setAttachments(prev => {
                                        const newAttachments = [...prev];
                                        if (newAttachments[index].preview) {
                                            URL.revokeObjectURL(newAttachments[index].preview);
                                        }
                                        newAttachments.splice(index, 1);
                                        return newAttachments;
                                    });
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
            {(typingUsers.length > 0 && typingUsers.join(", ").replace(/^, /, "")) && (
                <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-200 px-3 py-2 rounded-full">
                <span className="text-lg">💬</span>
                    {typingUsers.join(", ").replace(/^, /, "")} 님이 입력 중...
                </span>
            )}
            <div className="border-t border-gray-200 bg-white p-4">
                <div className="max-w-7xl mx-auto flex items-center space-x-4">
                    <EmojiPicker onSelect={handleEmojiSelect} />
                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="w-6 h-6" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <input
                        ref={captureInputRef}
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <textarea
                        ref={inputRef}
                        className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white-600 text-black"} dark:bg-gray-800 dark:text-black-100 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                        placeholder="메시지를 입력하세요 (Ctrl+V로 이미지 붙여넣기)"
                        value={input}
                        rows={1}
                        onChange={(e) => {
                            if (e.target.value === "") {
                                handleNoTyping();
                            } else {
                                handleTyping(e);
                            }
                            setInput(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        onPaste={handlePaste} // 붙여넣기 이벤트 핸들러 유지
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={sendMessage}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <AlertDialog/>
            </div>
        </div>

    );
};

export default memo(DefaultChat);