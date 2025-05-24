import axiosInstance from "@/services/axiosInstance";

export const duplicateCheck = async  (nickName) => {
    try {
        //응답 성공
        const response = await axiosInstance.get(`/api/member/duplicate?nickName=${nickName}`);
        return response
    } catch (error) {
        //응답 실패
        console.error(error);
    }
}

export const getMember = async  (memberId) => {
    try {
        //응답 성공
        const response = await axiosInstance.get(`/api/member/getMember?memberId=${memberId}`);
        return response
    } catch (error) {
        //응답 실패
        console.error(error);
    }
}


export const submit = async  (body) => {
    try {
        //응답 성공
        const response = await axiosInstance.post(`/api/member/signup`,body);
        return response
    } catch (error) {
        //응답 실패
        console.error(error);
    }
}

export const loginSubmit = async  (body) => {
    try {
        //응답 성공
        const response = await axiosInstance.post(`/api/member/signin`,body);
        return response
    } catch (error) {
        //응답 실패
        console.error(error);
    }
}