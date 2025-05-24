import React from "react";

const UserPage = () => {
    return (
        <>
            <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    유저 전용 페이지
                </h2>
                <p className="mt-2 text-gray-500">
                    이 페이지는 유저만 접근 가능합니다.
                </p>
            </div>
        </>
    );
};

export default UserPage;
