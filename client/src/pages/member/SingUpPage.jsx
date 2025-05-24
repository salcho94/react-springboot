import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { duplicateCheck, submit } from "@/apis/member/MemberApi";
import {useAlert,useConfirm} from "@/hooks/useModal";

function SignUpPage() {
    const navigate = useNavigate();
    const {showAlert,showError,AlertDialog} = useAlert();
    const {showConfirm,ConfirmDialog} = useConfirm()
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [alerts, setAlerts] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

    const handleChange = (field) => (event) => {
        setForm({ ...form, [field]: event.target.value });
        setAlerts({ ...alerts, [field]: "" });
        if (field === "name") {
            setIsDuplicateChecked(false);
        }
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = form;
        const newAlerts = {};

        if (!name) newAlerts.name = "닉네임을 입력해주세요.";
        if (!isDuplicateChecked) newAlerts.name = "닉네임 중복 확인이 필요합니다.";
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newAlerts.email = "유효한 이메일 형식이 아닙니다.";
        if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/)) newAlerts.password = "숫자와 영어를 조합한 6자 이상의 비밀번호를 입력하세요.";
        if (password !== confirmPassword) newAlerts.confirmPassword = "비밀번호가 일치하지 않습니다.";

        setAlerts(newAlerts);
        return Object.keys(newAlerts).length === 0;
    };

    const handleDuplicateCheck = async () => {
        if (!form.name) {
            setAlerts({ ...alerts, name: "닉네임을 입력해주세요." });
            return;
        }

        const confirmed = await showConfirm('중복체크','중복 체크 후 닉네임을 수정할 수 없습니다. 진행하시겠습니까?');
        if (!confirmed) return;

        setIsCheckingDuplicate(true);

        try {
            const response = await duplicateCheck(form.name);
            if (response.data.success === "Y") {
                setIsDuplicateChecked(true);
                setAlerts({ ...alerts, name: "" });
            } else {
                setAlerts({ ...alerts, name: response.data.msg });
            }
        } catch {
            setAlerts({ ...alerts, name: "중복 확인 중 오류가 발생했습니다." });
        } finally {
            setIsCheckingDuplicate(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        const confirmed = await showConfirm('회원가입','회원가입을 진행하시겠습니까?');
        
        if (!confirmed) return;

        try {
            const formData = {
                nickName : form.name.trim(),
                email : form.email.trim(),
                password : form.password.trim(),
            }

            const response = await submit(formData);
            if (response.data.success === "Y") {
                await showAlert('알림',response.data.msg)
                navigate("/signin");
            } else {
                await showAlert('알림',response.data.msg)
            }
        } catch {
            await showError('회원가입중 오류가 발생하였습니다.');
            return false;
        }
    };

    return (
        <div className="flex items-center justify-center dark:bg-gray-900 rounded-lg">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-md ">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 dark:text-white">회원가입</h2>

                {/* 닉네임 */}
                <div className="mb-4">
                    <label htmlFor="nickName" className="block text-lg font-semibold text-gray-700 mb-2 dark:text-white">
                        닉네임
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            id="nickName"
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                alerts.name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
                            placeholder="닉네임 입력"
                            value={form.name}
                            onChange={handleChange("name")}
                            disabled={isDuplicateChecked ? true : false}
                        />
                        <button
                            onClick={handleDuplicateCheck}
                            disabled={isDuplicateChecked || isCheckingDuplicate}
                            className={`px-4 py-2 rounded-md text-white text-sm whitespace-nowrap ${
                                isDuplicateChecked
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gray-700 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400"
                            }`}
                        >
                            {isCheckingDuplicate ? "확인 중..." : isDuplicateChecked ? "확인완료" : "중복확인"}
                        </button>
                    </div>
                    {alerts.name && <p className="mt-2 text-sm text-red-600">{alerts.name}</p>}
                </div>

                {/* 이메일 */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2 dark:text-white">
                        이메일
                    </label>
                    <input
                        id="email"
                        type="email"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            alerts.email
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
                        placeholder="이메일 입력"
                        value={form.email}
                        onChange={handleChange("email")}
                    />
                    {alerts.email && <p className="mt-2 text-sm text-red-600">{alerts.email}</p>}
                </div>

                {/* 비밀번호 */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2 dark:text-white">
                        비밀번호
                    </label>
                    <input
                        id="password"
                        type="password"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            alerts.password
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
                        placeholder="비밀번호 입력"
                        value={form.password}
                        onChange={handleChange("password")}
                    />
                    {alerts.password && <p className="mt-2 text-sm text-red-600">{alerts.password}</p>}
                </div>

                {/* 비밀번호 확인 */}
                <div className="mb-4">
                    <label htmlFor="passwordChk" className="block text-lg font-semibold text-gray-700 mb-2 dark:text-white">
                        비밀번호 확인
                    </label>
                    <input
                        id="passwordChk"
                        type="password"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            alerts.confirmPassword
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
                        placeholder="비밀번호 확인"
                        value={form.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                    />
                    {alerts.confirmPassword && <p className="mt-2 text-sm text-red-600">{alerts.confirmPassword}</p>}
                </div>

                {/* 가입 버튼 */}
                <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-500"
                >
                    가입하기
                </button>
            </div>
            <ConfirmDialog/>
            <AlertDialog/>
        </div>
    );
}

export default SignUpPage;
