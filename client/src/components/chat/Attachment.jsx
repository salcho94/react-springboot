import React, {memo} from "react";
import {Paperclip} from "lucide-react";

const Attachment = memo(({ att, progress, onDownload, onClickImage }) => (
    <div className="mt-2">
        {att.preview !== "" && (
            <img
                src={`${process.env.REACT_APP_URL}/chat/${att.preview}`}
                alt={att.name}
                className="w-[200px] h-auto max-w-[250px] max-h-[250px] object-cover rounded-lg cursor-pointer"
                loading="lazy"
                onClick={() => onClickImage(`${process.env.REACT_APP_URL}/chat/${att.preview}`)} // 이미지 클릭 시 모달 띄우기
            />
        )}
        <div className="flex items-center space-x-2 bg-gray-100 rounded p-2">
            <Paperclip className="w-4 h-4 text-gray-500" />
            <div
                className="text-black cursor-pointer"
                onClick={onDownload}
            >
                {progress ? att.name : "다운중..."}
            </div>
        </div>
    </div>
));

export default memo(Attachment);