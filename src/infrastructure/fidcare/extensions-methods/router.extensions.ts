import { NavigationExtras, Router, UrlTree } from '@angular/router';

declare module '@angular/router' {
    interface Router {
        navigateByUrlWithReturnUrl(url: string | UrlTree, returnUrl: string, extras?: NavigationExtras): Promise<boolean>;
        navigateWithReturnUrl(commands: any[], returnUrl: string, extras?: NavigationExtras): Promise<boolean>;
    }
}
Router.prototype.navigateByUrlWithReturnUrl = function (url: string | UrlTree, returnUrl: string, extras?: NavigationExtras) {
    extras = extras || {}
    if (returnUrl) {
        if (!extras.queryParams) {
            extras.queryParams = {};
        }
        extras.queryParams['returnUrl'] = returnUrl;
    }
    return this.navigateByUrl(url, extras);
}

Router.prototype.navigateWithReturnUrl = function (commands: any[], returnUrl: string, extras?: NavigationExtras) {
    extras = extras || {}
    if (returnUrl) {
        if (!extras.queryParams) {
            extras.queryParams = {};
        }
        extras.queryParams['returnUrl'] = returnUrl;
    }
    return this.navigate(commands, extras);
}