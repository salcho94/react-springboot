import axiosInstance from "@/services/axiosInstance";

export const  formatDate = (dateString,mode) => {
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const date = dateString ? new Date(dateString) : new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = days[date.getDay()];

    if (mode ==='day'){
        return `${dayOfWeek}`
    }else if (mode === 'date'){
        return `${year}-${month}-${day}`
    }else {
        return `${year}-${month}-${day} ${dayOfWeek}`
    }

}

export const downloadFile = async (downloadFileName,filePath,setProgress,type) => {
    try {
        setProgress(false);
        const response = await axiosInstance.get(`/api/file/${type}/download?filePath=${encodeURIComponent(filePath)}`,{
            responseType: "blob",
        });

        // 다운로드 처리
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", downloadFileName || 'salcho 파일');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setProgress(true);
    } catch (error) {
        console.error("파일 다운로드 오류:", error);
        setProgress(true);
    }
};

export const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
    }
};
