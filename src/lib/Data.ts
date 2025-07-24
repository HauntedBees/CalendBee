import Dexie, { type EntityTable, type IDType } from "dexie";
import type { CalendarEntry, Category, Tag } from "./Models";
import { CloseModal, entryModified } from "./State";
import dayjs from "dayjs";

const db = new Dexie("Calendar") as Dexie & {
    category: EntityTable<Category, "id">,
    tag: EntityTable<Tag, "id">,
    entry: EntityTable<CalendarEntry, "id">
};

db.version(1).stores({
    category: "++id, name, color, icon",
    tag: "++id, categoryId, name, color, icon, includeTime",
    entry: "++id, tagId, date, notes"
});

export default db;

export async function Upsert<T extends EntityTable<U, "id">, U extends { id?: IDType<U, "id"> }>(table: T, item: U) {
    if (item.id) {
        await table.update(item.id, item as any); // no idea how to make the type work for this, lazy "any" is the solution for now
    } else {
        await table.add(item);
    }
}

export async function SaveAndCloseModal<T extends EntityTable<U, "id">, U extends { id?: IDType<U, "id"> }>(table: T, item: U) {
    await Upsert(table, item);
    CloseModal();
}

export function TimeDiff(first: Date, second: Date) {
    const diffInHours = dayjs(first).diff(dayjs(second)) / 3600000;
    if (diffInHours < 24) {
        return RoundAndFormat(diffInHours, "hour", "hours");
    } else {
        const diffInDays = diffInHours / 24;
        return RoundAndFormat(diffInDays, "day", "days");
    }
}
function RoundAndFormat(
    unit: number,
    singularString: string,
    pluralString: string,
) {
    const rounded = Math.round(unit);
    if (rounded === 1) {
        return `${rounded} ${singularString}`;
    } else {
        return `${rounded} ${pluralString}`;
    }
}