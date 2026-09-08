import { Request } from "express";
import { TokenPayloadDTO } from "../../../modules/auth/dto/token-payload.dto.js";

export interface CustomRequest extends Request {
    tokenPayload?: TokenPayloadDTO;
}
