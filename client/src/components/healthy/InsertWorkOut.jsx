import {useState} from "react";
import axiosInstance from "@/services/axiosInstance";
import {useAlert, useConfirm} from "@/hooks/useModal";

const InsertWorkOut = ({setWorkoutList,setIsFormVisible,userId}) => {

    const [workout, setWorkout] = useState("");
    const [repsCount, setRepsCount] = useState("");
    const [setsCount, setSetsCount] = useState("");
    const {showConfirm, ConfirmDialog} = useConfirm()
    const{showAlert,AlertDialog} =useAlert();
    const addWorkout = async () => {
        if (!workout.trim()) {
            await showAlert("운동종목","운동종목을 입력해주세요!");
            return;
        }
        if (!repsCount) {
            await showAlert("횟수","횟수를 입력해주세요!");
            return;
        }
        if (!setsCount) {
            await showAlert("세트","세트을 입력해주세요!");
            return;
        }

        setWorkoutList((prev) => [...prev, {
            workoutName:workout
            , repsCount: Number(repsCount)
            , setsCount: Number(setsCount)
        }]);

        try{
            const formData = new FormData();
            formData.append("memberId", Number(userId));
            formData.append("workoutName", String(workout));
            formData.append("repsCount", Number(repsCount));
            formData.append("setsCount", Number(setsCount));
            const data = await axiosInstance.post('/api/health/create', formData);
            if(data.data !== ""){
                await showAlert("알림",data.data);
                setIsFormVisible(false);
                setWorkout("");
                setRepsCount("");
                setSetsCount("");

            }
        } catch (error) {
            console.error('Error creating health entry:', error);
        }

    };

    return (
        <div className="dark:bg-gray-800 dark:text-black-100  absolute top-16 right-0 bg-white shadow-lg p-4 rounded z-10">
            <strong><h6>운동종목</h6></strong>
            <input
                type="text"
                value={workout}
                onChange={(e) => setWorkout(e.target.value)}
                placeholder="운동 종목 입력"
                className="dark:bg-gray-800 dark:text-black-100  border p-2 w-full rounded mb-2"
            />
            <strong><h6>횟수 (유산소:분)</h6></strong>
            <input
                type="number"
                value={repsCount}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,4}$/.test(value)) {
                        setRepsCount(value === "" ? "" : parseInt(value, 10));
                    }
                }}
                placeholder="횟수(분) 입력"
                className="dark:bg-gray-800 dark:text-black-100  border p-2 w-full rounded mb-2"
            />
            <strong><h6>세트</h6></strong>
            <input
                type="number"
                value={setsCount}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,4}$/.test(value)) {
                        setSetsCount(value === "" ? "" : parseInt(value, 10));
                    }
                }}
                placeholder="세트 입력"
                className="dark:bg-gray-800 dark:text-black-100  border p-2 w-full rounded mb-2"
            />
            <button
                onClick={addWorkout}
                className="mt-2 bg-black text-white px-4 py-2 rounded w-full"
            >
                추가하기
            </button>
            <ConfirmDialog/>
            <AlertDialog/>
        </div>
    )
}

export default InsertWorkOut;