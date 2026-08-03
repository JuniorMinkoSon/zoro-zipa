import { create } from 'zustand';

interface UIState {
  isAiOpen: boolean;
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  modalData: unknown;
  toggleAi: () => void;
  openAi: () => void;
  closeAi: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openModal: (name: string, data?: unknown) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAiOpen: false,
  isMobileMenuOpen: false,
  activeModal: null,
  modalData: null,
  toggleAi: () => set((state) => ({ isAiOpen: !state.isAiOpen })),
  openAi: () => set({ isAiOpen: true }),
  closeAi: () => set({ isAiOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openModal: (name, data) => set({ activeModal: name, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));
