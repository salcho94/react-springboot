import { Paperclip, Copy } from "lucide-react";
import React, { useState, memo, useMemo } from "react";
import { downloadFile } from "@/utils/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeBlock from "@/components/chat/CodeBlock";
import Attachment from "@/components/chat/Attachment";

const CODE_PATTERNS = /^(import|export|const|let|var|function|class|if|for|while|return|async|await)|[{};]\s*$/m;

const SystemMessage = memo(({ text, timestamp }) => (
    <div className="flex justify-center my-2 animate-fade-in">
        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
            {text}
            <span className="text-xs text-gray-400 ml-2">
                {new Date(timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </span>
        </div>
    </div>
));



const RenderMessage = ({ msg, user ,fontSize}) => {
    const [progress, setProgress] = useState(true);
    const [modalImage, setModalImage] = useState(null); // 모달에 표시할 이미지 URL

    const handleDownload = (name, url) => {
        setProgress(false);
        downloadFile(name, url, setProgress,'chat');
    };

    const handleImageClick = (imageUrl) => {
        setModalImage(imageUrl); // 클릭된 이미지 URL을 모달 상태에 설정
    };

    const closeModal = () => {
        setModalImage(null); // 모달 닫기
    };

    const isCode = useMemo(() => {
        return CODE_PATTERNS.test(msg.text || '');
    }, [msg.text]);

    const detectLinks = (text) => {
        const urlPattern = /(https?:\/\/[^\s]+)/g; // URL 정규 표현식
        return text.split(urlPattern).map((part, index) => {
            // URL이면 <a> 태그로 감싸고, 아니면 그냥 문자열로 반환
            if (urlPattern.test(part)) {
                return (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const renderedContent = useMemo(() => {
        if (!msg.text) return null;

        const processedText = detectLinks(msg.text.trim());

        if (isCode) {
            return <CodeBlock text={msg.text.trim()} />;
        }
        return (
            <span style={{ whiteSpace: "pre-wrap" }}>
            {processedText}
        </span>
        );
    }, [msg.text, isCode]);

    // 시스템 메시지 처리
    if (msg.type === "userList" || msg.type === "typing" || msg.type === "endTyping") {
        return null;
    }
    if (msg.type === "system") {
        return <SystemMessage text={msg.text} timestamp={msg.timestamp} />;
    }

    if (msg.type === "connect") {
        const text = `${msg.user?.nickName || user.nickName}님이 접속하였습니다.`;
        return <SystemMessage text={text} timestamp={new Date()} />;
    }

    if (msg.type === "disconnect") {
        return <SystemMessage text={`${msg.nickName}님이 종료하였습니다.`} timestamp={new Date()} />;
    }

    return (
        <div
            className={`flex ${msg.sender === user.nickName ? "justify-end" : "justify-start"} animate-fade-in mb-4`}
            style={{ fontSize: `${fontSize}px` }} // ✅ 동적 폰트 크기 적용
        >
            {msg.sender !== user.nickName && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <span className="text-sm font-medium text-gray-600">
                        {msg.sender ? msg.sender.charAt(0) : ""}
                    </span>
                </div>
            )}

            <div
                className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === user.nickName ? "bg-blue-500 text-white" : "bg-white border border-gray-200"
                }`}
            >
                <p className="text-xs mb-1 opacity-75">{msg.sender}</p>
                <div>{renderedContent}</div>
                {msg.attachments?.map((att, i) => (
                    <Attachment
                        key={i}
                        att={att}
                        progress={progress}
                        onDownload={() => handleDownload(att.name, att.url)}
                        onClickImage={handleImageClick} // 이미지 클릭 시 모달 열기
                    />
                ))}
                <p className={`text-xs mt-1 ${msg.sender === user.nickName ? "text-blue-100" : "text-gray-400"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>

            {/* 모달 */}
            {modalImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="relative">
                        <img src={modalImage} alt="Preview" className="max-w-full max-h-screen object-contain" />
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(RenderMessage);
