import type dayjs from "dayjs";

export type Category = {
    id?: number;
    name: string;
    color?: string;
    icon?: string;
};

export type Tag = {
    id?: number;
    categoryId?: number;
    name: string;
    color: string;
    icon: string;
    includeTime: boolean;
}

export type TagIndex = { [key: number]: Tag };

export type CalendarEntry = {
    id?: number;
    tagId: number;
    date: Date;
    notes?: string;
};


export type ModalData = {
    type: ModalType.AddEditEntry;
    data: NewEntryModalData;
} | {
    type: ModalType.AddEditTag;
    data?: Tag;
} | {
    type: ModalType.AddEditGroup;
    data?: Category;
} | {
    type: ModalType.PickTag,
    data: PickTagData
}

export enum ModalType { AddEditTag, AddEditEntry, AddEditGroup, PickTag };

export enum FilterType {
    None,
    Category,
    Tag,
}

export type FilterValue = Category | Tag | undefined;

export type NewEntryModalData = {
    tag: Tag;
    entry?: CalendarEntry;
    date?: dayjs.Dayjs
};

export type PickTagData = {
    callback: (tag: Tag) => void;
    date?: dayjs.Dayjs;
    category?: Category;
    showNew?: boolean;
    pickCategory?: boolean;
    fromFilter?: boolean;
}