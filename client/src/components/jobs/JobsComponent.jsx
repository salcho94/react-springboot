import React, { useState, useEffect } from 'react';
import useFetch from "@/hooks/useFetch";
import axiosInstance from "@/services/axiosInstance";

const JobsComponent = () => {
    const [jobsData, setJobsData] = useState([]);
    const [isLoading, setIsLoding] = useState(true);
    const [maxPage, setMaxPage] = useState("20");


    // 데이터가 로드되면 jobsData 상태를 업데이트
    useEffect(() => {
        setIsLoding(true);
        axiosInstance.get(`/api/jobs/list?maxPages=${maxPage}`).then(res =>{
            setJobsData(res.data.jobs);
            setIsLoding(false);
        })
    }, [maxPage]);

    const handlePageChange = (e) => {
        setMaxPage(e.target.value); // 페이지 수 변경 시 maxPage 업데이트
    };



    return (
        <div className="h-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
                <h2 className="text-3xl font-bold text-gray-900">구인공고</h2>
                <select
                    onChange={handlePageChange}
                    className="max-w-52 bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="150">150</option>
                    <option value="200">200</option>
                    <option value="250">250</option>
                </select>
            </div>
            {isLoading &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" />
                    <div className="relative p-8 bg-white rounded-lg shadow-lg text-center">
                        <div className="flex justify-center space-x-2 mb-4">
                            <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                            <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                            <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
                        </div>
                        <p className="text-gray-700">구인정보를 불러오는 중입니다.....</p>
                    </div>
                </div>
            }

            {jobsData.length === 0 && !isLoading &&
                <div className="text-center py-6 text-gray-600 text-lg">
                    현재 공고가 없습니다.
                </div>
            }

            {jobsData.length > 0 && !isLoading && (
                <div className="overflow-y-auto overflow-x-hidden h-96">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobsData.map((job, index) => (
                            <div key={index}
                                 className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                                <div className="p-5">
                                    <h2>[{job.category}]</h2>
                                    [{job.deadline}][{job.education}][{job.experience}]<br/>
                                    <h3 className="text-xl font-semibold text-red-500 hover:text-red-700">
                                        <a href={job.link} target="_blank" rel="noopener noreferrer">
                                            {job.title}
                                        </a>
                                    </h3><br/>
                                    등록일: {job.postedDate} <br/>
                                    지역: {job.location}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsComponent;
