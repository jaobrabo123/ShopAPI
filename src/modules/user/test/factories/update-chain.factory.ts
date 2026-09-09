import { DB } from "../../../../infra/database/types/db.type.js";

export default function (db: DB, returnValue: unknown[]) {
    const returningMock = vitest.fn().mockResolvedValueOnce(returnValue);
    const whereMock = vitest.fn().mockReturnValue({ returning: returningMock });
    const setMock = vitest.fn().mockReturnValue({ where: whereMock });
    vitest.spyOn(db, "update").mockReturnValue({ set: setMock } as any);
    return { setMock, returningMock };
}
