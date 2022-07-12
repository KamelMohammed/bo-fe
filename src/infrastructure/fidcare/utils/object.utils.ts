
// @dynamic
export class ObjectUtils {

    public static clone<T>(value: T): T {
        return value == null ? null : <T>(JSON.parse(JSON.stringify(value)));
    }
}