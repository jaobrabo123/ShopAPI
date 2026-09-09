import { DB } from "../../../../infra/database/types/db.type.js";

export default function (db: DB, returnValue: unknown[]) {
    const returningMock = vitest.fn().mockResolvedValueOnce(returnValue);
    const valuesMock = vitest.fn().mockReturnValue({ returning: returningMock });
    vitest.spyOn(db, "insert").mockReturnValue({ values: valuesMock } as any);
    return { valuesMock, returningMock };
}
