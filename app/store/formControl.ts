import { create } from 'zustand'

interface FormControlState {
    step: number;
    next: () => void;
    previous: () => void;
    end: () => void;
    setFormStep: (step: number) => void;
}

export const useFormControl = create<FormControlState>((set) => ({
    step: 0,
    next: () => set((state) => ({
        step: state.step + 1
    })),
    previous: () => set((state) => ({
        step: state.step - 1
    })),
    end: () => set({ step: 3 }),
    setFormStep: (step: number) => set({ step }),
}))
