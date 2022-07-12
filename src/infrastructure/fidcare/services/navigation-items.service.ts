import { Injectable } from "@angular/core";
import { FuseNavigationItem } from "infrastructure/@fuse/components/navigation/navigation.types";

@Injectable()
export class NavigationItemsService {
	private _navigationItems: Map<string, FuseNavigationItem[]> = new Map<string, FuseNavigationItem[]>();

	public addMenuItems = (key: string, items: FuseNavigationItem[]): void => {
		if (!this._navigationItems.has(key)) {
			this._navigationItems.set(key, items);
		}
	}

	public getMenuItems = (key: string): FuseNavigationItem[] => {
		if (!this._navigationItems.has(key)) {
			return this._navigationItems.get(key);
		}
		return [];
	}
	public removeMenuItems = (key: string): void => {
		if (!this._navigationItems.has(key)) {
			this._navigationItems.delete(key);
		}
	}
}

