import { create } from 'zustand'
import type { RequestForm } from '../types'

interface RequestInfoState {
  requestInfo: RequestForm;
  setRequest: (requestInfo: RequestForm) => void;
}

export const useRequestInfo = create<RequestInfoState>((set) => ({
  requestInfo: {} as RequestForm,
  setRequest: (requestInfo: RequestForm) => set({ requestInfo }),
}))