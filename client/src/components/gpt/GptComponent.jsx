import React, { useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { Loader2 } from "lucide-react";

const GptComponent = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse("");
        try {
            await axiosInstance.post('/api/chat/gpt/question', {
                question: input,
            });
            const res = await axiosInstance.post("/api/chat/gpt", {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: input }],
                max_tokens: 100,
            });
            const content = res.data || "응답이 없습니다.";
            setResponse(content);
        } catch (error) {
            console.error("API 호출 오류:", error);
            setResponse("오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="px-6 py-8">
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                인공 지능 고민 상담소
                            </h2>
                            <p className="text-sm text-gray-500">
                                답변은 100글자 이내로 제공됩니다
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-400"
                                    placeholder="메시지를 입력하세요..."
                                    maxLength={100}
                                    required
                                />
                                <div className="absolute right-3 top-3 text-xs text-gray-400">
                                    {input.length}/100
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        <span>처리중...</span>
                                    </>
                                ) : (
                                    <span>전송하기</span>
                                )}
                            </button>
                        </form>

                        {response && (
                            <div className="mt-6 space-y-2">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 transform transition-all duration-300">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        AI 답변
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {response}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GptComponent;