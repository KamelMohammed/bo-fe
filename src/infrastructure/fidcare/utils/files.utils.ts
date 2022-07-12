export class FilesUtils {
    public static openFromByteArray(content: any, contentType: string, fileName: string): void {
        let anchor = <HTMLAnchorElement>document.createElement("a");
        document.body.appendChild(anchor);
        anchor.style.display = "none";

        let blob = new Blob([content], { type: contentType });
        let url = window.URL.createObjectURL(blob);
        anchor.href = url;
        anchor.download = fileName;
        anchor.click();
        window.URL.revokeObjectURL(url);
        anchor.parentElement.removeChild(anchor);
    }
    public static getFilenameExtension(fileName: string): string {
        return fileName.split('.').pop();
    }

    public static createLink(url: string): void {
        var a = document.createElement('a');
        a.href = url;
        a.download = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
