import { Heart } from 'lucide-react';

const PostHeader = ({ nickName, counts = 0, likes = 0, onLike,isLiked,setIsLiked }) => {


        const handleLike = () => {
            setIsLiked(!isLiked);
            if (onLike) {
                onLike(!isLiked);
            }
        };

        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-600">작성자:</span>
                    <span className="text-sm font-bold text-gray-900">{nickName}</span>
                    <div className="h-4 w-px bg-gray-300" />
                    <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">조회수:</span>
                        <span className="text-sm font-medium text-gray-900">{counts.toLocaleString()}</span>
                    </div>
                </div>
            {/*
                <button
                    onClick={handleLike}
                    className="flex items-center space-x-1 group pl-5"
                >
                    <Heart
                        className={`w-5 h-5 transition-all duration-200 ${
                            isLiked
                                ? 'fill-red-500 stroke-red-500'
                                : 'stroke-gray-400 group-hover:stroke-red-500'
                        }`}
                    />
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                        isLiked ? 'text-red-500' : 'text-gray-600 group-hover:text-red-500'
                    }`}>
          {likes.toLocaleString()}
        </span>
                </button>*/}
            </div>
        );
    };

export default PostHeader;