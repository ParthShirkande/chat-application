import {create} from "zustand"
import {createAuthSlice} from "../store/slices/auth-slice"
import { createChatSlice } from "../store/slices/chat-slice"

export const useAppStore = create((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}))