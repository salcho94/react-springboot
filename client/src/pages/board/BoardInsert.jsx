import React, {useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import {userDataState} from "@/recoil/auth/atoms";
import axiosInstance from "@/services/axiosInstance";
import {useAlert, useConfirm, useProcessingModal} from "@/hooks/useModal";
import {useNavigate} from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import ImageTool from "@editorjs/image";
import DragDrop from "editorjs-drag-drop";
import Strikethrough from "editorjs-strikethrough";
import {themeState} from "@/recoil/theme/atoms";

const BoardInsert = () => {
    const [user] = useRecoilState(userDataState);
    const { showAlert, AlertDialog } = useAlert();
    const { showProcessing, hideProcessing,ProcessingModal } = useProcessingModal();
    const { showConfirm, ConfirmDialog } = useConfirm();
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const [theme] = useRecoilState(themeState);

    const [insertData, setInsertData] = useState({
        title: '',
        contents: '',
        password: '',
    });
    const [files, setFiles] = useState([]); // 파일 배열 상태 관리

    useEffect(() => {
        if (!editorRef.current) {
            editorRef.current = new EditorJS({
                holder: "editorjs",
                placeholder: "여기에 글을 작성하세요",
                autofocus: true,
                tools: {
                    header: {
                        class: Header,
                        config: {
                            placeholder: "제목을 입력하세요",
                            levels: [2, 3, 4],
                            defaultLevel: 2,
                        },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    code: {
                        class: Code,
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file) {
                                    // ✅ 파일을 서버에 업로드하고 URL을 반환하는 로직
                                    const formData = new FormData();
                                    formData.append("image", file);

                                    try {

                                        const response = await axiosInstance.post("/api/board/imageFile", formData);

                                        const result = await response.data;
                                        return {
                                            success: 1,
                                            file: {
                                                url: result?.imageUrl, // 서버에서 반환하는 이미지 URL
                                            },
                                        };
                                    } catch (error) {
                                        console.error("이미지 업로드 실패:", error);
                                        return { success: 0 };
                                    }
                                },
                            },
                        },
                    },
                    strikethrough: { // ✅ 이렇게 등록해야 함
                        class: Strikethrough,
                    },
                },
                onReady: () => {
                    // ✅ Drag & Drop 기능 활성화
                    new DragDrop(editorRef.current);
                },
                onChange: async () => {
                    const data = await editorRef.current.save();
                    setInsertData((prevData) => ({
                        ...prevData,
                        contents: data,
                    }));
                },
            });

        }

    }, []);



    useEffect(() => {
        let isDeleting = false;

        const handleKeyDown = (event) => {
            if (event.key === "Delete" && editorRef.current && !isDeleting) {
                event.preventDefault();
                isDeleting = true;

                setTimeout(() => {
                    isDeleting = false;
                }, 100);

                const currentBlockIndex = editorRef.current.blocks.getCurrentBlockIndex();
                if (currentBlockIndex !== undefined) {
                    editorRef.current.blocks.delete(currentBlockIndex);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);








    const handleChange = (e) => {
        setInsertData((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };

    const handleFileChange = (e) => {
        setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    };

    const handleSubmit = async (e) => {
        if(e.key === 'Enter'){
           return;
        }
        e.preventDefault();
        if(insertData.title === '' || insertData.title === null) {
            await showAlert("제목", "글 제목을 입력해 주세요");
            return
        }
        if (insertData.contents === '' || insertData.contents === null){
            await showAlert("내용", "글 내용을 입력해 주세요");
            return
        }
        if(isPasswordRequired && (insertData.password === '' || insertData.password === null )){
            await showAlert("비밀번호", "비밀번호를 입력해주세요");
            return
        }

        if (await showConfirm("글 작성", "글작성을 하시겠습니까?")) {
            const contents = await editorRef.current.save();
            const formData = new FormData();

            // 일반 데이터 추가
            formData.append("title", insertData.title);
            formData.append("contents", JSON.stringify(contents));
            formData.append("password", insertData.password);
            formData.append("nickName", user.nickName);
            formData.append("userId", user.id);

            // 파일 데이터 추가
            files.forEach((file) => {
                formData.append("files", file);
            });

            try {
                // 프로세스 표시
                await showProcessing('글을 등록하는 중입니다....');

                // 서버 요청
                const result = await axiosInstance.post("/api/board/insert", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                });
                hideProcessing();
                await showAlert('등록 성공', result.data);

                navigate('/boardList');

            } catch (error) {
                console.error("업로드 실패", error);
                await showAlert('업로드 실패', error.message || '오류가 발생했습니다.');
            } finally {
                hideProcessing();
            }

        }
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">게시글 등록</h2>
                <h3 className="text-1xl font-bold mb-4">작성자 : {user.nickName}</h3>
            </div>
            <div>
                <div className="mb-4">
                    <label htmlFor="title" className={`${ theme === "dark" ? "text-white" : " text-black"} block text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-700`}>
                        제목
                    </label>
                    <input
                        id="title"
                        type="text"
                        className={` ${
                            theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                        } w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none
                            `}
                        value={insertData.title}
                        onChange={handleChange}
                        placeholder="제목을 입력하세요 (50자 이내로 입력)"
                        maxLength="50"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className={`${ theme === "dark" ? "text-white" : " text-black"} block text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-700`}>
                        내용
                    </label>
                    <div id="editorjs" className="border border-gray-300 rounded-lg shadow-md dark:bg-gray-900 dark:text-white dark:border-gray-700"></div>
                </div>

                {/* 파일 첨부 */}
                <div className="mb-4">
                    <input
                        id="file"
                        type="file"
                        className="w-full text-gray-700 hidden"
                        onChange={handleFileChange}
                        multiple // 여러 개의 파일 선택 허용
                    />
                    <button type="button"
                            className="w-fit bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                            onClick={() =>{document.getElementById('file').click()}}
                    >파일 선택</button>
                    {files.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600">
                            {files.map((file, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span>📎 {file.name}</span>
                                    <button
                                        type="button"
                                        className="text-red-500 text-xs font-bold"
                                        onClick={() => handleRemoveFile(index)}
                                    >
                                        x
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                {/* 비밀번호 입력 활성화 체크박스 */}
                <div className="mb-4 flex items-center">
                    <input
                        id="passwordCheckbox"
                        type="checkbox"
                        className="w-5 h-5 mr-2 accent-blue-500"
                        checked={isPasswordRequired}
                        onChange={() => setIsPasswordRequired(!isPasswordRequired)}
                    />
                    <label htmlFor="passwordCheckbox" className={`${ theme === "dark" ? "text-white" : " text-black"} block text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-700`}>
                        비밀글
                    </label>
                </div>


                {/* 비밀번호 입력 필드 */}
                {isPasswordRequired && (
                    <div className="mb-4">
                        <label htmlFor="password" className={`${ theme === "dark" ? "text-white" : " text-black"} block text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-700`}>
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={` ${
                                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                            } w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none
                            `}
                            placeholder="비밀번호를 입력하세요(20자 이내로 입력)"
                            maxLength="20"
                            value={insertData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>
                )}

                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        type="button"
                        className="w-24 bg-gray-400 text-white font-medium py-1 px-3 rounded hover:bg-gray-500 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                        onClick={()=>navigate('/boardList')}
                    >
                        목록
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-24 bg-blue-500 text-white font-medium py-1 px-3 rounded hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    >
                        글등록
                    </button>
                </div>
            </div>
            <ConfirmDialog/>
            <AlertDialog/>
            <ProcessingModal/>
        </div>
    );
};

export default BoardInsert;
