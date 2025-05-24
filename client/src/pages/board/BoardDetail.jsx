import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";
import {userDataState} from "@/recoil/auth/atoms";
import {useAlert, useConfirm, useProcessingModal} from "@/hooks/useModal";
import axiosInstance from "@/services/axiosInstance";
import {downloadFile} from "@/utils/utils";
import PostHeader from "@/components/board/PostHeader";
import {XCircleIcon} from "lucide-react"; // 아이콘 추가
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import ImageTool from "@editorjs/image";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import Strikethrough from "editorjs-strikethrough";
import Table from '@editorjs/table';
import {themeState} from "@/recoil/theme/atoms";

let passYn ='';
const BoardDetail = () => {
    const [user] = useRecoilState(userDataState);
    const { showAlert, AlertDialog } = useAlert();
    const { showProcessing, hideProcessing,ProcessingModal } = useProcessingModal();
    const { showConfirm, ConfirmDialog } = useConfirm();
    const navigate = useNavigate()
    const location = useLocation();
    const { boardId } = location.state || {};
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);
    const [ comment , setComment ] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [updateData ,setUpdateDate] = useState({
        title: '',
        contents: '',
        password: '',
        userId:'',
        counts:0,
        likes:0,
        deleteFiles:[],
        boardId:boardId
    });
    const [files, setFiles] = useState([]);
    const userState = user.id !== updateData.userId;
    const [progress,setProgress] = useState(false);
    const [comments, setComments] = useState([]);
    const editorRef = useRef(null);
    const [theme] = useRecoilState(themeState);
// 댓글 삭제 함수

    useEffect(() => {

        if (updateData.contents && !editorRef.current) {
            editorRef.current = new EditorJS({
                holder: "editorjs",
                readOnly: userState, // ✅ 읽기 전용 모드 설정
                tools: {
                    header: {
                        class: Header,
                        config: {
                            placeholder: "제목을 입력하세요",
                            levels: [1, 2, 3, 4, 5, 6],
                            defaultLevel: 2,
                        },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    // 테이블 도구 추가
                    table: {
                        class: Table,
                        inlineToolbar: true,
                        config: {
                            rows: 2,
                            cols: 3,
                        },
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
                                        console.log(response);
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
                    setUpdateDate((prevData) => ({
                        ...prevData,
                        contents: data,
                    }));
                },
            });

            editorRef.current.isReady.then(() => {
                if (updateData.contents) {
                    editorRef.current.render(updateData.contents); // ✅ 저장된 데이터 렌더링
                }
            });
        }
    }, [updateData.contents]);

    useEffect(() => {
        if(!boardId){
            navigate('/boardList');
            return;
        }

        const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts")) || [];

        // 먼저 조회수 증가 처리
        const fetchData = async () => {
            if (!viewedPosts.includes(boardId)) {
                await axiosInstance.get('/api/board/updateCount', {
                    params: { boardId: boardId }
                }).then(res => {
                    viewedPosts.push(boardId);
                    localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
                });
            }

            // 그 다음 게시글 데이터 조회
            const response = await axiosInstance.get('/api/board/getBoard', {
                params: { boardId: boardId }
            });

            const resComments = await axiosInstance.get('/api/board/getComment', {
                params: { boardId: boardId }
            });

            if(resComments.data){
                setComments(resComments.data);
            }

            const data = response.data[0];
            if(data.passYn === 'Y'){
                passYn = 'Y'
                setIsPasswordRequired(true);
            } else {
                passYn = 'N'
                setIsPasswordRequired(false);
            }

            setUpdateDate(prevData => ({
                ...prevData,
                title: data.title,
                contents: JSON.parse(data.contents),
                userId: data.userId,
                nickName: data.nickName,
                counts: data.counts,
                likes: data.likes,
            }));

            if(data.fileName !== null && data.filePath !== null){
                const files = response?.data?.map(data => ({
                    path: data.filePath,
                    name: data.fileName,
                    fileId: data.fileId
                }));
                setFiles(files);
            }
        };

        fetchData();
    }, [boardId]);


    useEffect(() => {
        let isDeleting = false;

        const handleKeyDown = (event) => {
            if (event.key === "Delete" && editorRef.current && !isDeleting) {
                event.preventDefault(); // 기본 Delete 동작 방지

                isDeleting = true; // 중복 실행 방지

                setTimeout(() => {
                    isDeleting = false; // 100ms 후 삭제 가능하도록 해제
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
    const handleDelete = async () => {
        if(await showConfirm("글 삭제", "글 삭제를 하시겠습니까?")){
        const formData = new FormData();
        formData.append("boardId", boardId);
        try{
            const result = await axiosInstance.post("/api/board/delete", formData);

            if(result.data){
                await showAlert('성공',result.data)
                navigate('/boardList');
            }

        }catch (e){
            showAlert('실패','글삭제에 실패하였습니다.')
        }

        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        if(updateData.title.trim() === '' || updateData.title.trim() === null) {
            await showAlert("제목", "글 제목을 입력해 주세요");
            return
        }
        if (JSON.stringify(updateData.contents).trim() === '' || JSON.stringify(updateData.contents).trim() === null){
            await showAlert("내용", "글 내용을 입력해 주세요");
            return
        }
        if((isPasswordRequired && passYn !=='Y') && (updateData.password === '' || updateData.password === null )){
            await showAlert("비밀번호", "비밀번호를 입력해주세요");
            return
        }

        if (await showConfirm("글 수정", "글 수정을 하시겠습니까?")) {

            const formData = new FormData();

            // 일반 데이터 추가
            formData.append("boardId", boardId);
            formData.append("passYn",isPasswordRequired ?"Y":"N");
            formData.append("title", updateData.title);
            formData.append("contents", JSON.stringify(updateData.contents));
            formData.append("password", updateData.password);
            formData.append("deleteFiles", updateData.deleteFiles);

            // 파일 데이터 추가
            files.forEach((file) => {
                if(file.size){
                    formData.append("files", file);
                }
            });

            try {
                // 프로세스 표시
                await showProcessing('글을 수정하는 중입니다....');

                // 서버 요청
               const result = await axiosInstance.post("/api/board/update", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                });
                hideProcessing();
                // 성공 메시지 확인 후 이동
                await showAlert('수정 성공', result.data);

                window.location.reload();

            } catch (error) {
                console.error("업로드 실패", error);
                await showAlert('업로드 실패', error.message || '오류가 발생했습니다.');
            } finally {
                hideProcessing();
            }

        }
    };
    const handleChange = (e) => {
        setUpdateDate((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };


    const handleFileChange = (e) => {
        setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    };

    const handleRemoveFile = (index,fileId) => {
        if(fileId){
            let updateFiles = updateData.deleteFiles;
            updateFiles.push(fileId);
            setUpdateDate((prevData) => ({
                ...prevData,
                deleteFiles: updateFiles
            }));
        }

        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };


    const handleInsertComment = async () => {
        if(!comment){
            showAlert('알림','댓글을 입력해주세요')
            return
        }
        if(await showConfirm("댓글", "댓글을 등록하시겠습니까?")){
            const formData = new FormData();
            formData.append("boardId", boardId);
            formData.append("comment", comment);
            formData.append("nickName", user.nickName);
            try{
                const result = await axiosInstance.post("/api/board/comment", formData);

                if(result.data){
                    window.location.reload();
                }

            }catch (e){
                showAlert('실패','댓글등록에 실패하였습니다.')
            }

        }
    }

    const handleDeleteComment = async (reviewId) => {
        if(await showConfirm("댓글", "댓글을 삭제하시겠습니까?")){
            const formData = new FormData();
            formData.append("reviewId", reviewId);
            try{
                const result = await axiosInstance.post("/api/board/commentDelete", formData);

                if(result.data){
                    setComments((prevComments) => prevComments.filter((comment) => comment.reviewId !== reviewId));
                }
            }catch (e){
                showAlert('실패','댓글삭제에 실패하였습니다.')
            }

        }

    };

    return (
        <div className="dark:bg-gray-900 dark:text-white dark:border-gray-700">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">게시글 상세</h2>
                <PostHeader
                    nickName={updateData.nickName}
                    counts={updateData.counts}
                    likes={updateData.likes}
                    isLiked={isLiked}
                    setIsLiked={setIsLiked}
                />
            </div>
            <div className="dark:bg-gray-900 dark:text-white dark:border-gray-700">
                <div className="mb-4">
                    <label htmlFor="title"  className={`${ theme === "dark" ? "text-white" : " text-black"} block text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-700`}>
                        제목
                    </label>
                    <input
                        id="title"
                        type="text"
                        className={` ${
                            theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                        } w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none
                            `}
                        value={updateData.title}
                        onChange={handleChange}
                        placeholder="제목을 입력하세요 (50자 이내로 입력)"
                        maxLength="50"
                        readOnly={userState}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="title" className={`${ theme === "dark" ? "text-white" : " text-black"} block text-gray-700 dark:bg-gray-900 dark:text-white dark:border-gray-700`}>
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
                    {user.id === updateData.userId  &&
                    <button type="button"
                            className="w-fit bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                            onClick={() =>{document.getElementById('file').click()}}
                    >파일 선택</button>
                    }
                    {files.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600">
                            {files.map((file, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span
                                        className="cursor-pointer"
                                        onClick={(e) =>  file.path !== undefined && downloadFile(file.name, file.path,setProgress,'board')}
                                    >
                                   📎 {file.name} {(file.path === undefined) &&
                                        <span className="text-xs pr-1 pl-1 font-bold text-white bg-red-500 rounded-full">
                                          NEW!
                                        </span>
                                    }
                                    </span>
                                    {!userState  &&
                                        <button
                                            type="button"
                                            className="text-red-500 text-xs font-bold"
                                            onClick={() => handleRemoveFile(index,file.fileId)}
                                        >
                                            x
                                        </button>
                                    }
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                {/* 비밀번호 입력 활성화 체크박스 */}
                {!userState  &&
                <div className="mb-4 flex items-center">
                    <input
                        id="passwordCheckbox"
                        type="checkbox"
                        className="w-5 h-5 mr-2 accent-blue-500"
                        checked={isPasswordRequired}
                        onChange={() => setIsPasswordRequired(!isPasswordRequired)}
                    />
                    <label htmlFor="passwordCheckbox" className="text-gray-700 font-medium">
                        비밀글
                    </label>
                </div>
                }

                {/* 비밀번호 입력 필드 */}
                {(isPasswordRequired && passYn !== 'Y') && (
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
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
                            value={updateData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>
                )}
                <hr/>
                <div className="mt-4 p-4 border rounded-lg shadow-md">
                    <label htmlFor="content"  className={` ${
                        theme === "dark" ? "text-white" : " text-black"
                    } block text-gray-700 font-medium mb-2
                            `}>
                        댓글
                    </label>

                    {/* 댓글 목록 */}
                    <ul className="mb-4 space-y-2">
                        {comments.length > 0 ? comments.map((comment) => (
                            <li key={comment.reviewId}
                                className={` ${
                                    theme === "dark" ? "text-white" : " text-black"
                                } flex justify-between items-center p-3 border rounded-lg bg-gray-50
                            `}>
                                <div>
                                    <div >
                                        <span className={`${ theme === "dark" ? "text-black" : " text-black"} font-semibold mr-3`}>{comment.nickName}</span>
                                        <span className={`${ theme === "dark" ? "text-black" : " text-black"} text-gray-500 font-light`} >({comment.regDate})</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.comment}</p>
                                </div>
                                {user.nickName === comment.nickName &&
                                    <button type="button" onClick={() => handleDeleteComment(comment.reviewId)} className="text-red-500 hover:text-red-700">
                                        <XCircleIcon size={20} />
                                    </button>
                                }
                            </li>
                        )) :
                            <li  className={` ${
                                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                            } flex justify-between items-center p-3 border rounded-lg bg-gray-50
                            `} >
                                <div>
                                    댓글이 존재하지 않습니다.
                                </div>
                            </li>
                        }
                    </ul>

                    {/* 댓글 입력창 */}
                    <div className="flex items-stretch space-x-2">
                        <textarea
                            id="comment"
                            className={` ${
                                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                            } w-full h-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none
                            `}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="내용을 입력하세요 (200자 이내로 입력)"
                            maxLength="200"
                        ></textarea>
                        <button type="button" className="px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 h-32" onClick={handleInsertComment}>
                            등록
                        </button>
                    </div>
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        type="button"
                        className="w-24 bg-gray-400 text-white font-medium py-1 px-3 rounded hover:bg-gray-500 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                        onClick={()=>navigate('/boardList')}
                    >
                        목록
                    </button>
                    {!userState  &&
                    <>
                        <button
                            type="submit"
                            className="w-24 bg-yellow-400 text-white font-medium py-1 px-3 rounded hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                            onClick={handleSubmit}
                        >
                            글수정
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-24 bg-red-500 text-white font-medium py-1 px-3 rounded hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                        >
                            글삭제
                        </button>
                    </>
                    }
                </div>
            </div>
            <ConfirmDialog/>
            <AlertDialog/>
            <ProcessingModal/>
        </div>
    );
}


export default BoardDetail;