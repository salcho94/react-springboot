import React, {memo, useMemo, useState} from "react";
import {Copy, Paperclip} from "lucide-react";
import CodeBlock from "@/components/chat/CodeBlock";
import Attachment from "@/components/chat/Attachment";
import {downloadFile} from "@/utils/utils";

const CODE_PATTERNS = /^(import|export|const|let|var|function|class|if|for|while|return|async|await)|[{};]\s*$/m;

const MemoizedRenderMessage = memo(({ msg, index, user, fontSize }) => {
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

    if (msg.type === 'system') {
        return (
            <div className="flex items-center my-2 text-gray-500 text-xs">
                <div className="px-3 py-1 bg-gray-100 rounded-md">
                    <span style={{ fontSize: `${fontSize}px` }}>{msg.text}</span>
                </div>
            </div>
        );
    }

    if (msg.type === "connect") {
        const text = `${msg.user?.nickName || user.nickName}님이 접속하였습니다.`;
        return (
            <div className="flex items-center my-2 text-gray-500 text-xs">
                <div className="px-3 py-1 bg-gray-100 rounded-md">
                    <span style={{ fontSize: `${fontSize}px` }}>{text}</span>
                </div>
            </div>
        );
    }

    if (msg.type === "disconnect") {
        const text = `${msg.user?.nickName || user.nickName}님이 종료하였습니다.`;
        return (
            <div className="flex items-center my-2 text-gray-500 text-xs">
                <div className="px-3 py-1 bg-gray-100 rounded-md">
                    <span style={{ fontSize: `${fontSize}px` }}>{text}</span>
                </div>
            </div>
        );
    }


    return (
        <div className={`my-1 grid grid-cols-6 hover:bg-gray-50 border-b border-gray-100`}>
            <div className="col-span-1 text-xs text-gray-500 py-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="col-span-1 text-xs font-medium py-1 truncate">
                {msg.sender}
            </div>
            <div className="col-span-4 py-1 px-1 text-left">
                <div style={{ fontSize: `${fontSize}px` }}>
                    {renderedContent}
                    {msg.attachments?.map((att, i) => (
                        <Attachment
                            key={i}
                            att={att}
                            progress={progress}
                            onDownload={() => handleDownload(att.name, att.url)}
                            onClickImage={handleImageClick} // 이미지 클릭 시 모달 열기
                        />
                    ))}
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
        </div>
    );
});


export default memo(MemoizedRenderMessage);