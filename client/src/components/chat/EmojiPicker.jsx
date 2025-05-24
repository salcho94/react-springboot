import React, { useState } from "react";
const EmojiPicker = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectEmoji = (emoji) => {
        onSelect(emoji);  // 이모지 선택 후 호출
        setIsOpen(false); // 선택 후 이모지 팝업 닫기
    };

    return (
        <div className="relative">
            <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-1xl">😊</span>
            </button>
            {isOpen && (
                <div className=" absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10" style={{width:'300px'}}>
                    <div className="emoji-picker-grid grid grid-cols-6 gap-2">
                        {["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎","👍","😒","🤔","😫","😕","😞","😭","😱"].map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleSelectEmoji(emoji)}
                                className="text-xl p-1 hover:bg-gray-100 cursor-pointer"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;
