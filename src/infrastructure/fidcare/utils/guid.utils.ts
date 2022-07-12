export class Guid {
    public static newGuid(): string {
        let datetime = new Date().getTime();
        const ret = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (datetime + Math.random() * 16) % 16 | 0;
            datetime = Math.floor(datetime / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return ret;
    }
}