import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import {userDataState} from "@/recoil/auth/atoms";
import {Calculator, FileSpreadsheet, Filter, Paperclip, Send, X} from "lucide-react";

import axiosInstance from "@/services/axiosInstance";
import {useAlert, useProcessingModal} from "@/hooks/useModal";
import EmojiPicker from "@/components/chat/EmojiPicker";
import MemoizedRenderMessage from "@/components/chat/MemoizedRenderMessage";


// Memoized Attachment component
const Attachment = memo(({ att, index, onRemove }) => (
    <div className="relative">
        {att.type === 'image' ? (
            <div className="relative group">
                <img
                    src={att.preview}
                    alt={att.name}
                    className="w-16 h-16 object-cover rounded"
                    loading="lazy"
                />
                <button
                    onClick={() => onRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        ) : (
            <div className="relative group bg-gray-50 p-2 rounded border border-gray-200">
                <div className="flex items-center space-x-1">
                    <Paperclip className="w-3 h-3" />
                    <span className="text-xs truncate max-w-[100px]">{att.name}</span>
                </div>
                <button
                    onClick={() => onRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        )}
    </div>
));

// Excel-like Header component
const Header = memo(({ onlineUsers, handleSendMail, decreaseFontSize, increaseFontSize, fontSize }) => (
    <header className="bg-[#217346] text-white border-b border-gray-300">
        <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center">
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                <h1 className="text-sm font-normal">데이터 분석 시트 - Sheet1.xlsx</h1>
            </div>
            <div className="flex items-center space-x-1">
                <div className="hidden md:flex items-center space-x-1">
                    <button onClick={decreaseFontSize} className="px-1 py-0.5 text-xs bg-[#185c37] hover:bg-[#0f4025] rounded">A-</button>
                    <span className="text-xs">{fontSize}</span>
                    <button onClick={increaseFontSize} className="px-1 py-0.5 text-xs bg-[#185c37] hover:bg-[#0f4025] rounded">A+</button>
                </div>
                <button
                    type="button"
                    onClick={handleSendMail}
                    className="text-xs bg-[#185c37] hover:bg-[#0f4025] px-2 py-1 rounded flex items-center"
                >
                    <Calculator className="w-3 h-3 mr-1" />
                    <span>관리자 호출</span>
                </button>
            </div>
        </div>
        <div className="bg-[#E7F1E9] text-black px-2 py-1 text-xs">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <Filter className="w-3 h-3 mr-1" />
                    <span className="font-medium text-gray-600">활성 사용자: </span>
                    <span className="ml-1">{onlineUsers?.length > 0 ? onlineUsers.join(", ") : "없음"}</span>
                </div>
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-gray-600">연결됨</span>
                </div>
            </div>
        </div>
        {/* Excel-like tab and formatting toolbar */}
        <div className="bg-gray-100 flex items-center px-2 py-1 border-b border-gray-300">
            <span className="text-gray-700 text-xs font-medium mr-4">홈</span>
            <span className="text-gray-500 text-xs mr-4">삽입</span>
            <span className="text-gray-500 text-xs mr-4">페이지 레이아웃</span>
            <span className="text-gray-500 text-xs mr-4">수식</span>
            <span className="text-gray-500 text-xs">데이터</span>
        </div>
        {/* Column headers */}
        <div className="bg-gray-100 grid grid-cols-6 text-gray-700 text-xs border-b border-gray-300">
            <div className="px-2 py-1 font-medium border-r border-gray-300">시간</div>
            <div className="px-2 py-1 font-medium border-r border-gray-300">사용자</div>
            <div className="px-2 py-1 font-medium col-span-4">데이터</div>
        </div>
    </header>
));

const HideChat = ({theme}) => {
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
    const [fontSize, setFontSize] = useState(12); // 기본 글꼴 크기를 더 작게 조정
    const [unreadCount, setUnreadCount] = useState(0);
    const [isWindowFocused, setIsWindowFocused] = useState(true);
    const defaultTitle = "데이터 분석 시트";

    // 컴포넌트 마운트 상태 추적용 ref
    const componentMounted = useRef(true);

    useEffect(() => {
        const handleFocus = () => {
            setIsWindowFocused(true);
            setUnreadCount(0);
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
        setFontSize((prev) => (prev < 18 ? prev + 1 : prev)); // 최대 크기를 18로 제한
    };

    const decreaseFontSize = () => {
        setFontSize((prev) => (prev > 8 ? prev - 1 : prev)); // 최소 크기를 8로 제한
    };

    const handleSendMail = () => {
        if (isMailDisabled) {
            showAlert('알림', '잠시후 다시 요청해주세요. 처리 중입니다.');
            return;
        }

        setIsMailDisabled(true);

        showProcessing('요청 중...');
        axiosInstance.post("/api/mail/send", null, {
            params: {
                to: user.nickName
            }
        })
            .then(response => {
                setTimeout(() => setIsMailDisabled(false), 5000);
                showAlert('성공', '요청에 성공하였습니다. 잠시만 기다려 주세요');
            })
            .catch(error => {
                showAlert('실패', '요청에 실패하였습니다.');
                console.error("메일 전송 실패", error);
            })
            .finally(e => {
                hideProcessing();
            });

        setTimeout(() => setIsMailDisabled(false), 5000);
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

                const newSocket = new WebSocket(process.env.REACT_APP_CHAT_SOCKET_URL);
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
                showProcessing('데이터 처리 중...');
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
            };

            ws.current?.send(JSON.stringify(message));
            setInput("");
            setAttachments([]);
        } catch (error) {
            showAlert("오류", "데이터 전송에 실패했습니다.");
        } finally {
            hideProcessing();
        }
    }, [input, attachments, user.nickName, showAlert, showProcessing, hideProcessing]);

    const handleEmojiSelect = (emoji) => {
        const cursorPos = inputRef.current.selectionStart;
        const newInput = input.slice(0, cursorPos) + emoji + input.slice(cursorPos);
        setInput(newInput);

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
                    name: '스프레드시트_이미지.png'
                }]);

                break;
            }
        }
    };

    const [isComposing, setIsComposing] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            if (isComposing) return;

            e.preventDefault();
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
        <div className="flex flex-col min-h-screen sm:min-h-[500px] max-h-screen bg-white max-w-[330px] sm:max-w-[none] border border-gray-300">
            <Header
                onlineUsers={onlineUsers}
                handleSendMail={handleSendMail}
                fontSize={fontSize}
                decreaseFontSize={decreaseFontSize}
                increaseFontSize={increaseFontSize}
            />
            <div className="flex-1 overflow-y-auto bg-white">
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
                <div className="bg-gray-50 border-t border-gray-200 p-2">
                    <div className="flex flex-wrap gap-2">
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
                <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 border-t border-gray-200">
          <span>
            {typingUsers.join(", ").replace(/^, /, "")} 님이 데이터 입력 중...
          </span>
                </div>
            )}
            <div className="border-t border-gray-200 bg-gray-50 p-2">
                <div className="flex items-center space-x-2">
                    <EmojiPicker onSelect={handleEmojiSelect} />
                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="w-4 h-4" />
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
                        className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white-600 text-black"} flex-1 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm` }
                        placeholder="데이터 입력... (Ctrl+V로 이미지 붙여넣기)"
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
                        onPaste={handlePaste}
                    />
                    <button
                        className="bg-[#217346] hover:bg-[#185c37] text-white rounded p-1 transition-colors focus:outline-none"
                        onClick={sendMessage}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <AlertDialog />
            <ProcessingModal />
        </div>
    );
};

export default memo(HideChat);