import { useEffect, useState} from "react";
import InsertWorkOut from "@/components/healthy/InsertWorkOut";
import {useAlert, useConfirm} from "@/hooks/useModal";
import axiosInstance from "@/services/axiosInstance";
import {useRecoilState} from "recoil";
import {userDataState} from "@/recoil/auth/atoms";
import {themeState} from "@/recoil/theme/atoms";
import HealthHistory from "@/components/healthy/HealthHistory";
import HealthStatistics from "@/components/healthy/HealthStatistics";
import HealthModify from "@/components/healthy/HealthModify";
import NoRecords from "@/components/healthy/NoRecords";
import {format} from "date-fns";


const HealthyPage = () => {
    const [user] = useRecoilState(userDataState);
    const [workoutList, setWorkoutList] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false); // 입력 폼 표시 여부
    const [activeTab, setActiveTab] = useState("history");
    const {showAlert, AlertDialog} = useAlert()
    const {showConfirm, ConfirmDialog} = useConfirm()
    const [theme, setTheme] = useRecoilState(themeState);
    const today = format(new Date(), "yyyy-MM-dd"); // 오늘 날짜 기본값
    const [selectedDate, setSelectedDate] = useState(today);

    useEffect(() => {
        axiosInstance.get(`/api/health/list?memberId=${Number(user.id)}`).then((res)=>{
            setWorkoutList(res.data);
        });

    }, [isFormVisible]);
    const decreaseSet = async (healthId, setsCount,workout) => {
        if (setsCount === 0) {
            await showAlert("알림" , "축하합니다 해당 운동을 완료하셨습니다.");
            return;
        }

        if(await showConfirm(`${workout}`,`${workout} 1세트 완료하셨습니까?`)){
            const formData = new FormData();
            formData.append("healthId", healthId);
            axiosInstance.post(`/api/health/insertHistory`,formData).then((res)=>{
                if(res.data === 'Y'){
                    setWorkoutList((prev) =>
                        prev.map((item) =>
                            item.healthId === healthId ? {...item, setsCount: Math.max(0, item.setsCount - 1)} : item
                        )
                    );
                }
            });
        }
    };

    const handleDelete = async (healthId,workout) => {
        const formData = new FormData();
        formData.append("healthId", healthId);

        if(await showConfirm('삭제',`${workout} 운동을 삭제하시겠습니까?`)) {
            axiosInstance.post(`/api/health/deleteHealth`,formData).then((res)=>{
                if(res.data === 'Y'){
                    axiosInstance.get(`/api/health/list?memberId=${Number(user.id)}`).then((res)=>{
                        setWorkoutList(res.data);
                    });
                }
            });
        }
    };

    return (
        <div className="relative">
            <div className="flex">
                <h1 className="mr-auto"><strong>운동 종료후 하트 아이콘 클릭하세요</strong></h1>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="bg-gray-300 ml-auto text-white px-4 py-2 rounded-full w-10 h-10 flex items-center justify-center"
                >
                    {isFormVisible ? "❌" : "➕"}
                </button>
            </div>

            {/* 입력 폼 (isFormVisible이 true일 때만 표시) */}
            {isFormVisible && (
                <InsertWorkOut userId = {user.id} setWorkoutList={setWorkoutList} setIsFormVisible={setIsFormVisible}/>
            )}
            {workoutList.length > 0 ?
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {workoutList.map((item) => (
                        <div key={item?.healthId} className="border rounded p-4 flex justify-between items-center relative">
                            <div>
                                <h3 className="font-semibold">{item?.workoutName}</h3>
                                <p>세트당 목표 횟수 : <strong>{item?.repsCount}회</strong> <br/> 남은 횟수 : <strong>{item?.setsCount}세트</strong></p>
                            </div>
                            <button
                                onClick={() => decreaseSet(item?.healthId,item?.setsCount,item?.workoutName)}
                                className="bg-gray-200 rounded-full p-2 mr-5"
                            >
                                <img
                                    src={item?.setsCount === 0 ? "/healthy/health_done.png" : "/healthy/health_ing.png"}
                                    alt="운동"
                                    className="w-8 h-8"
                                />
                            </button>
                            {/* 삭제 버튼 추가 */}
                            <button
                                onClick={() => handleDelete(item?.healthId,item?.workoutName)} // 삭제 처리 함수 호출
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                                aria-label="삭제"
                            >
                                <span className="text-xs">X</span> {/* 또는 아이콘 사용 */}
                            </button>
                        </div>
                    ))}
                    <ConfirmDialog/>
                    <AlertDialog/>
                </div>
                :
                <NoRecords/>
            }
            <div className="mb-4">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                    {["history", "statistics", "modify"].map((tab) => (
                        <li key={tab} className="me-2 dark:text-white" role="presentation" >
                            <button
                                className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-200
                                ${
                                    activeTab === tab
                                        ? "text-gray-900 border-gray-900"
                                        : "text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-900 "
                                }
                                ${theme ==='dark' && "!text-gray-100 hover:border-white"}
                                `}

                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "history" && <strong>운동기록</strong>}
                                {tab === "statistics" && <strong>통계</strong>}
                                {tab === "modify" && <strong>수정하기</strong>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>


            <div>
                {["history", "statistics", "modify"].map((tab) => (
                    <div
                        key={tab}
                        className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 
                  text-gray-900 dark:text-gray-200 ${activeTab === tab ? "block" : "hidden"}`}
                    >
                        {tab === "history" && <HealthHistory selectedDate={selectedDate} setSelectedDate={setSelectedDate} memberId={user.id} workoutList={workoutList}/>}
                        {tab === "statistics" && <HealthStatistics memberId={user.id} workoutList={workoutList} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>}
                        {tab === "modify" && <HealthModify data={workoutList}/>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HealthyPage;


