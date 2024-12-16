import { create } from "zustand";
import { persist} from "zustand/middleware";

const userStore = create(
    persist(
        (set) => ({
            user: null,
            saveUser: (newUser) => set({ user: newUser}),
            deleteUser: () => set({ user: null}),
        }),
        {
            name: "user",
        }
    )
);

export default userStore;