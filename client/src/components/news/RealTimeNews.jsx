import React, { useState, useEffect } from 'react';
import useFetch from "@/hooks/useFetch";
import { formatDate } from "@/utils/utils";

const RealTimeNews = () => {
    const [newsData, setNewsData] = useState([]);
    const { data, error, loading } = useFetch('/api/news/list', 'get');

    // 데이터가 로드되면 newsData 상태를 업데이트
    useEffect(() => {
        if (data && data.news) {
            setNewsData(data.news);
        }
    }, [data]);

    // 로딩 상태 처리
    if (loading) return <div className="text-center py-4">로딩 중...</div>;

    // 에러 상태 처리
    if (error) return <div className="text-center text-red-500 py-4">{error.response.data.message}</div>;

    return (
        <div className="h-auto">
            <div>
                <span className="block text-center text-gray-800 dark:text-white font-bold text-2xl">{formatDate()}</span>
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 ">
                    실시간 뉴스
                </h2>
            </div>

            {newsData.length === 0 ? (
                <div className="text-center py-6 text-gray-600 dark:text-gray-400 text-lg">
                    현재 뉴스가 없습니다.
                </div>
            ) : (
                <div className="overflow-y-auto h-96">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-hidden"> {/* overflow-x-hidden 추가 */}
                        {newsData.map((news, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500">
                                        <a href={news.link} target="_blank" rel="noopener noreferrer">
                                            {news.title}
                                        </a>
                                    </h3>
                                    {news.thumbnail && (
                                        <img
                                            src={news.thumbnail}
                                            alt="thumbnail"
                                            className="w-full h-36 object-cover mt-4 rounded-md"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealTimeNews;
