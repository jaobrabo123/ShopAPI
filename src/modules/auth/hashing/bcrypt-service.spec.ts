import bcrypt from "bcrypt";
import { BcryptService } from "./bcrypt.service.js";

vi.mock("bcrypt");

describe("BcryptService", () => {
    const service = new BcryptService();

    const MOCK_SALT = "MOCK_SALT";
    const MOCK_HASH = "MOCK_HASH";

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("hash", () => {
        it("should generate a salt and return the generated hash", async () => {
            const password = "secretpass";

            vi.mocked(bcrypt.genSalt).mockResolvedValue(MOCK_SALT as any);
            vi.mocked(bcrypt.hash).mockResolvedValue(MOCK_HASH as any);

            const result = await service.hash(password);

            expect(bcrypt.genSalt).toHaveBeenCalledOnce();
            expect(bcrypt.hash).toHaveBeenCalledWith(password, MOCK_SALT);
            expect(result).toBe(MOCK_HASH);
        });
    });

    describe("compare", () => {
        it("should return true if the passowrd is correct", async () => {
            const password = "secretpass";

            vi.mocked(bcrypt.compare).mockResolvedValue(true as any);

            const result = await service.compare(password, MOCK_HASH);

            expect(bcrypt.compare).toHaveBeenCalledWith(password, MOCK_HASH);
            expect(result).toBe(true);
        });

        it("should return false if the passowrd is incorrect", async () => {
            vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

            const result = await service.compare("wrong-password", MOCK_HASH);

            expect(result).toBe(false);
        });
    });
});
