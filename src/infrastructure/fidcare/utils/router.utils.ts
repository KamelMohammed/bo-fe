export class RouterUtils {
    public static createReturnUrl(baseUrl: string, criteria: any): string {
        const baseHref = document.getElementsByTagName('base')[0].getAttribute("href").toString();
        let ret = baseUrl || window.location.pathname;
        if (ret.startsWith(baseHref)) {
            ret = ret.substr(baseHref.length);
        }
        if (!ret.startsWith("/")) {
            ret = "/" + ret;
        }
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("searchCriteria");
        urlParams.append("searchCriteria", JSON.stringify(criteria));
        return ret + '?' + urlParams.toString();
    }

    public static assignSearchCriteria<T>(paramName: string = "searchCriteria"): T {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get(paramName)) {
            return JSON.parse(urlParams.get(paramName));
        }
        return null;
    }
}
