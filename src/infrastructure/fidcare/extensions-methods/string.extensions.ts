
declare global {
    interface String {
        format(params: string[]): string;
        replaceAll(oldValue: string, newValue: string): string;
        fullText(textToSearch: string, nullable: boolean): boolean;
        occurences(textToSearch): number;
    }
}
String.prototype.format = function (params: string[]) {
    let ret = this;
    if (this != null && params.length >= 0) {
        for (let i = 0; i < params.length; i++) {
            ret = ret.replace(`{${i}}`, params[i])
        }
    }
    return ret;
}

String.prototype.fullText = function (textToSearch: string, nullable: boolean = false) {
    let searchText = (textToSearch || "").trim();
    let lText = this ? this.toLowerCase() : "";
    let textParts = searchText.toLowerCase().trim().split(" ").filter(f => f.trim() != "");
    if (textParts.length) {
        for (let i = 0; i < textParts.length; i++) {
            if (lText.indexOf(textParts[i]) < 0) {
                return false;
            }
        }
        return true;
    }
    else {
        return nullable;
    }
}


String.prototype.replaceAll = function (oldValue: string, newValue: string) {
    let ret = <string>this;
    if (this) {
        while (ret.indexOf(oldValue) >= 0) {
            ret = ret.replace(oldValue, newValue);
        }
    }
    return ret;
}
String.prototype.occurences = function (textToSearch: string) {
    let ret = 0;
    if (this != null && textToSearch) {
        ret = this.split(textToSearch).length - 1
    }
    return ret;
}


export { };