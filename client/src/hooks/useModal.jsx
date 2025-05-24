import React, { useCallback, useEffect, useState, useRef } from 'react';
// Close 아이콘 컴포넌트
const CloseIcon = () => (
    <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export function useAlert() {
    const [queue, setQueue] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [resolve, setResolve] = useState(null);
    const btnRef = useRef(null);


    const processNextAlert = useCallback(() => {
        if (queue.length > 0) {
            const nextAlert = queue[0];
            setCurrentAlert(nextAlert); // 다음 알림을 설정
            setOpen(true);
            setQueue((prevQueue) => prevQueue.slice(1)); // 큐에서 제거
        }
    }, [queue]);

    const showAlert = useCallback((title, message) => {
        return new Promise((res) => {
            setQueue((prevQueue) => [
                ...prevQueue,
                { title, message, resolve: res },
            ]); // 큐에 알림 추가
        });
    }, []);

    const showError = useCallback((message) => {
        return new Promise((res) => {
            setQueue((prevQueue) => [
                ...prevQueue,
                { title: '확인', message, resolve: res },
            ]);
        });
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        if (resolve) {
            resolve(); // Promise 해결
        }
    }, [resolve]);


    useEffect(() => {
        if (!open && queue.length > 0) {
            processNextAlert(); // 큐에 남은 알림이 있을 경우 처리
        }
    }, [open, queue, processNextAlert]);

    useEffect(() => {
        if (currentAlert) {
            setResolve(() => currentAlert.resolve); // 현재 알림의 resolve 설정
        }
    }, [currentAlert]);


    const replaceError = (error) => {
        let errorMsg = '처리중 오류가 발생하였습니다.';

        if(error?.message){
            if(String(error?.message).includes('undefined')){
                errorMsg = '처리중 오류가 발생하였습니다.';
            }else{
                errorMsg = error?.message
            }

        }

        if(error?.message.length >= 150){
            errorMsg = '서버오류가 발생하였습니다. 관리자에게 문의하세요.'
        }
        return errorMsg;
    }


    const AlertDialog = useCallback(
        () => (
            open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
                    <div className="relative w-full max-w-xl min-h-[200px] bg-white rounded-lg shadow-lg">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold  text-gray-700  dark:bg-gray-500 dark:hover:bg-gray-400">
                                {currentAlert?.title}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="p-6">
                            {currentAlert?.title === '확인' ? (
                                <p className="text-gray-700"
                                   dangerouslySetInnerHTML={{
                                       __html: replaceError(JSON.parse(JSON.stringify(currentAlert))).replaceAll('\n', '<br/>')
                                   }}
                                />
                            ) : (
                                <p className="text-gray-700"
                                   dangerouslySetInnerHTML={{
                                       __html: currentAlert?.message.replaceAll('\n', '<br/>')
                                   }}
                                />
                            )}
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            <button
                                ref={btnRef}
                                onClick={handleClose}
                                className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )
        ),
        [open, currentAlert, handleClose]
    );

    return { showAlert, showError, AlertDialog };
}


/**
 * useConfirm 훅 - 사용자에게 확인/취소 모달을 표시하고 응답을 기다립니다.
 *
 * @returns {{
 *  showConfirm: (title: string, message: string, cancel?: string, pass?: string) => Promise<boolean>,
 *  ConfirmDialog: () => JSX.Element
 * }}
 */
export function useConfirm() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');
    const [buttonMsg, setButtonMsg] = useState(['취소', '확인']);
    const [resolve, setResolve] = useState(null);
    const footerRef = useRef(null);
    const modalBoxRef = useRef(null);

    const showConfirm = useCallback(
        (title, message, cancel = buttonMsg[0], pass = buttonMsg[1]) => {
            return new Promise((res) => {
                setTitle(title);
                setMessage(message);
                setOpen(true);
                setButtonMsg([cancel, pass]);
                setResolve(() => res);
            });
        },
        [buttonMsg]
    );

    const handleClose = useCallback(
        (result) => {
            if (resolve) {
                resolve(result);
            }
            setOpen(false);
        },
        [resolve]
    );

    /**
     * ConfirmDialog - 확인/취소 옵션을 제공하는 모달 컴포넌트.
     * @returns {JSX.Element}
     */
    const ConfirmDialog = useCallback(
        () => (
            open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => handleClose(false)} />
                    <div className="relative w-full max-w-xl min-h-[200px] bg-white rounded-lg shadow-lg" ref={modalBoxRef}>
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold dark:bg-gray-500 text-gray-700 dark:hover:bg-gray-400">{title}</h2>
                            <button
                                onClick={() => handleClose(false)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700"
                               dangerouslySetInnerHTML={{
                                   __html: message.replaceAll('\n', '<br/>')
                               }}
                            />
                        </div>
                        <div className="flex justify-end gap-4 p-4 border-t" ref={footerRef}>
                            <button
                                onClick={() => handleClose(false)}
                                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                {buttonMsg[0]}
                            </button>
                            <button
                                onClick={() => handleClose(true)}
                                className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            >
                                {buttonMsg[1]}
                            </button>
                        </div>
                    </div>
                </div>
            )
        ),
        [open, title, message, handleClose, buttonMsg]
    );

    return { showConfirm, ConfirmDialog };
}

/**
 * useProcessingModal 훅 - 사용자가 작업 중임을 알리는 로딩 모달을 표시합니다.
 *
 * @returns {{
 *  showProcessing: (msg?: string) => void,
 *  hideProcessing: () => void,
 *  ProcessingModal: () => JSX.Element,
 *  nowProcessing: boolean
 * }}
 */
export function useProcessingModal() {
    const [open, setOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState('조회 중입니다...');
    const alertBtnRef = useRef(null);

    const showProcessing = useCallback((msg = '조회 중입니다...') => {
        setMessage(msg);
        setOpen(true);
    }, []);

    /**
     * 로딩 모달을 숨깁니다.
     */
    useEffect(()=>{
        setOpen(open)
    },[open])

    const hideProcessing = useCallback((length) => {
        setOpen(false);
        if (length !== undefined && length === 0) {
            setAlertOpen(true);
        } else {
            setAlertOpen(false);
        }
    }, []);

    const handleCloseAlert = useCallback(() => {
        setOpen(false);
        setAlertOpen(false);
    }, []);

    const ProcessingModal = useCallback(
        () => (
            <>
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="fixed inset-0 bg-black/50" />
                        <div className="relative p-8 bg-white rounded-lg shadow-lg text-center">
                            <div className="flex justify-center space-x-2 mb-4">
                                <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                                <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                                <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce"></div>
                            </div>
                            <p className="text-gray-700">{message}</p>
                        </div>
                    </div>
                )}
                {alertOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="fixed inset-0 bg-black/50" onClick={handleCloseAlert} />
                        <div className="relative w-full max-w-xl min-h-[200px] bg-white rounded-lg shadow-lg">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-xl font-semibold">알림</h2>
                                <button
                                    onClick={handleCloseAlert}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-700">조회된 데이터가 없습니다.</p>
                            </div>
                            <div className="flex justify-end p-4 border-t">
                                <button
                                    ref={alertBtnRef}
                                    onClick={handleCloseAlert}
                                    className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        ),
        [open, alertOpen, message, handleCloseAlert]
    );

    return {
        showProcessing,
        hideProcessing,
        ProcessingModal,
        nowProcessing: open,
    };
}