import React from "react";
import { useRecoilValue } from "recoil";
import { themeState } from "@/recoil/theme/atoms";

const Footer = () => {
    const theme = useRecoilValue(themeState); // 현재 테마 가져오기
    const currentYear = new Date().getFullYear(); // 현재 년도 실시간으로 가져오기
    return (
        <footer
            className={`p-4 text-center ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white-600 text-black"
            }`}
        >
            <h1 className="text-2xl font-bold">
                &copy; {currentYear} All rights reserved.
            </h1>
        </footer>
    );
};

export default Footer;
