import React, {useState} from "react";
import RealTimeNews from "@/components/news/RealTimeNews";
import JobsComponent from "@/components/jobs/JobsComponent";
import ChatHistory from "@/components/chat/ChatHistory";
import {useRecoilState} from "recoil";
import {userDataState} from "@/recoil/auth/atoms";

const Home = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user] = useRecoilState(userDataState);
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="md:flex">
            <ul className="flex-column space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                <li>
                    <a
                        href="#"
                        className={`inline-flex items-center px-4 py-3 rounded-lg w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                            activeTab === 'profile' ? 'bg-blue-700 text-white' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleTabClick('profile')}
                    >
                        <svg
                            className="w-4 h-4 me-2 text-white-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 18"
                        >
                            <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                        </svg>
                        뉴스
                    </a>
                </li>
                <li className="whitespace-nowrap">
                    <a
                        href="#"
                        className={`inline-flex items-center px-4 py-3 rounded-lg w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                            activeTab === 'develop' ? 'bg-blue-700 text-white' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleTabClick('develop')}
                    >
                        <svg
                            className="w-4 h-4 me-2 text-white-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                        개발자 공고
                    </a>
                </li>
                {user?.nickName === '김지섭'  &&
                <li className="whitespace-nowrap">
                    <a
                        href="#"
                        className={`inline-flex items-center px-4 py-3 rounded-lg w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white ${
                            activeTab === 'chatHistory' ? 'bg-blue-700 text-white' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => handleTabClick('chatHistory')}
                    >
                        <svg
                            className="w-4 h-4 me-2 text-white-500 dark:text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        ><path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h6m-1 8a9 9 0 100-18 9 9 0 000 18z"
                        />
                        </svg>
                        채팅 가져오기
                    </a>
                </li>
                }
            </ul>
            <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
                    {activeTab === 'profile' && <RealTimeNews/>}
                    {activeTab === 'develop' && <JobsComponent/>}
                    {(activeTab === 'chatHistory' && user.nickName ==='김지섭' ) && <ChatHistory/>}
            </div>
        </div>
    );
};

export default Home;
