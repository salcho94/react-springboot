import { useState, useEffect } from "react";
import axiosInstance from "@/services/axiosInstance";

function useFetch(url, mode, requestData = null) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // 기본값 false로 설정

    useEffect(() => {
        // URL이 없으면 요청하지 않음
        if (!url) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // HTTP 메서드에 따라 요청 처리
                const response = await axiosInstance({
                    method: mode,
                    url,
                    data: ["post", "patch", "put"].includes(mode) ? requestData : undefined,
                    params: mode === "get" ? requestData : undefined,
                });

                // 상태 업데이트
                setData(response.data);
                setError(null);
            } catch (err) {
                setError(err);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, error, loading };
}

export default useFetch;
