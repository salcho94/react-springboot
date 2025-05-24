const NoRecords = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 13h6m-6 4h6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                />
            </svg>
            <p className="text-gray-600 text-lg font-semibold">기록이 없습니다</p>
            <p className="text-gray-500 text-sm">운동을 추가하고 진행해보세요!</p>
        </div>
    );
};


export default NoRecords;