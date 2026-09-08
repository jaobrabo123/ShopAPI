import { Transform, TransformOptions } from "class-transformer";

export function ToLowerCase(options?: TransformOptions) {
    return Transform(
        ({ value }: { value: unknown }) => (typeof value === "string" ? value.toLowerCase() : value),
        options,
    );
}
