import { writable, type Writable } from "svelte/store";
import { FilterType, ModalType, type CalendarEntry, type Category, type FilterValue, type ModalData, type NewEntryModalData, type PickTagData, type Tag } from "./Models";

export const currentModal: Writable<ModalData | null> = writable(null);
export const filterSelect: Writable<[FilterType, FilterValue]> = writable([FilterType.None, undefined]);
export const searchChanged: Writable<[string, FilterType, FilterValue]> = writable(["", FilterType.None, undefined]);
export const entryModified: Writable<CalendarEntry | undefined> = writable(undefined);


export function OpenModal(type: ModalType.PickTag, data: PickTagData): void;
export function OpenModal(type: ModalType.AddEditGroup, data?: Category): void;
export function OpenModal(type: ModalType.AddEditEntry, data: NewEntryModalData): void;
export function OpenModal(type: ModalType.AddEditTag, data?: Tag): void;
export function OpenModal(type: ModalType, data: any = undefined): void {
    currentModal.set({ type, data });
}

export function CloseModal() {
    currentModal.set(null);
}

export function OnThisModal(desiredModal: ModalType.PickTag, onOpen: (data: PickTagData) => void, onClose: () => void): void;
export function OnThisModal(desiredModal: ModalType.AddEditGroup, onOpen: (data?: Category) => void, onClose: () => void): void;
export function OnThisModal(desiredModal: ModalType.AddEditEntry, onOpen: (data: NewEntryModalData) => void, onClose: () => void): void;
export function OnThisModal(desiredModal: ModalType.AddEditTag, onOpen: (data?: Tag) => void, onClose: () => void): void;
export function OnThisModal(desiredModal: ModalType, onOpen: (data: any) => void, onClose: () => void): void {
    currentModal.subscribe(modal => {
        if (modal === null || modal.type !== desiredModal) {
            onClose();
            return null;
        }
        onOpen(modal.data);
    });
}