import { snapshot_UNSTABLE } from "recoil";
import { userDataState } from "@/recoil/auth/atoms";

export const getUserData = () => {
    const snapshot = snapshot_UNSTABLE();
    return snapshot.getLoadable(userDataState).contents;
};
