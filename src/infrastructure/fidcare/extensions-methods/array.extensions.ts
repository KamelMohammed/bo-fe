declare global {
    interface Array<T> {
        sortAsc(field: (field: T) => any): T[];
        sortDesc(field: (field: any) => any): T[];
        range(start: number, numOfItems: number): number[];
        min(field: (field: T) => number): number;
        max(field: (field: T) => number): number;
        sum(field: (field: T) => number): number;
        average(field: (field: T) => number): number;
        selectMany<C = any>(field: (field: T) => C[]): C[];
        distinct<C = any>(field: (field: T) => C): C[];
        groupBy<C = any>(group: (field: T) => any): Group<T, C>[]
        containsInArray<U, P>(otherArray: U[], parentField: (field: T) => P, childField: (field: U) => P): T[];
        notContainsInArray<U, P>(otherArray: U[], parentField: (field: T) => P, childField: (field: U) => P): T[];
        any(): boolean;
        first(): T;
        last(): T;
        contains(value: T): boolean;
        sum(field: (field: T) => number): number;
        clone(): T[];
        take(numOfItems: number): T[];
        skip(numOfItems: number): T[];
        binaryIndexOf(value: T): number;
        binaryAny(value: T): boolean;
        innerJoin<O, R>(outerItems: O[], innerField: (field: T) => any, outerField: (field: O) => any, mapFunc: (inner: T, outer: O) => R): R[];
        leftJoin<O, R>(outerItems: O[], innerField: (field: T) => any, outerField: (field: O) => any, mapFunc: (inner: T, outer: O) => R): R[];
    }
}

Array.prototype.sortAsc = function (field: (field: any) => any) {
    this.sort((first, second) => {
        if (field(first) > field(second)) {
            return 1;
        }
        return -1;
    })
    return this;
}

Array.prototype.sortDesc = function (field: (field: any) => any) {
    this.sort((first, second) => {
        if (field(first) > field(second)) {
            return -1
        }
        return 1;
    })
    return this;
}

Array.prototype.range = function (start: number, numOfItems: number) {
    const ret: number[] = [];
    for (let i = start; i < start + numOfItems; i++) {
        ret.push(i);
    }
    return ret;
}

Array.prototype.min = function (field: (field: any) => number) {
    return Math.min(...this.map(m => field(m)));
}

Array.prototype.max = function (field: (field: any) => number) {
    return Math.max(...this.map(m => field(m)));
}

Array.prototype.sum = function (field: (field: any) => number) {
    const intialValue = 0;
    return this.reduce((sum, obj) => sum + field(obj), intialValue);
}

Array.prototype.average = function (field: (field: any) => number) {
    if (this.length == 0) {
        return 0;
    }
    return this.sum(field) / this.length;
}

Array.prototype.selectMany = function <U>(field: (field: U[]) => U[]) {
    if (this.length == 0) {
        return [];
    };
    if (this.length == 1) {
        return field(this[0]);
    }
    return this.reduce((result, array) => {
        return result.concat(field(array));
    }, []);
}

Array.prototype.distinct = function <T, U>(field: (field: T) => U) {
    if (this.length == 0) {
        return [];
    };
    let set = new Set<U>();
    for (let i = 0; i < this.length; i++) {
        set.add(field(this[i]));
    }
    return Array.from(set);
}

Array.prototype.groupBy = function <T, U>(group: (field: T) => U) {
    if (this.length == 0) {
        return [];
    };
    let ret: Group<T, U>[] = [];
    for (let i = 0; i < this.length; i++) {
        let currentKey = group(this[i]);
        let currenJsonKey = JSON.stringify(currentKey);
        let currentGroup: Group<T, U> = null;
        for (let x = 0; x < ret.length; x++) {
            let jsonKey = JSON.stringify(ret[x].key);
            if (currenJsonKey == jsonKey) {
                currentGroup = ret[x];
                break;
            }
        }

        if (!currentGroup) {
            currentGroup = new Group(currentKey);
            ret.push(currentGroup);
        }

        currentGroup.items.push(this[i]);
    }
    return ret;
}

Array.prototype.containsInArray = function <T, U, P>(otherArray: U[], parentField: (field: T) => P, childField: (field: U) => P) {
    if (otherArray.length == 0) {
        return [];
    }
    return this.filter(f => otherArray.findIndex(fi => childField(fi) == parentField(f)) >= 0);
}

Array.prototype.notContainsInArray = function <T, U, P>(otherArray: U[], parentField: (field: T) => P, childField: (field: U) => P) {
    if (otherArray.length == 0) {
        return this;
    }
    return this.filter(f => otherArray.findIndex(fi => childField(fi) == parentField(f)) < 0);
}

Array.prototype.any = function () {
    return this.length > 0;
}

Array.prototype.first = function () {
    return this.length > 0 ? this[0] : null;
}

Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : null;
}

Array.prototype.contains = function <T>(value: T) {
    return this.indexOf(value) >= 0;
}

Array.prototype.clone = function () {
    return JSON.parse(JSON.stringify(this));
}

Array.prototype.skip = function (numOfItems: number) {
    let ret = this.filter((x, i) => {
        return i >= numOfItems;
    });
    return ret;
}

Array.prototype.take = function (numOfItems: number) {
    let ret = this.filter((x, i) => {
        return i < numOfItems;
    });
    return ret;
}

Array.prototype.binaryIndexOf = function <T>(value: T) {
    let startIndex = 0;
    let endIndex = this.length;
    while (startIndex <= endIndex) {
        const mid = startIndex + Math.ceil((endIndex - startIndex) / 2);
        if (value === this[mid]) {
            return mid;
        }
        if (value < this[mid]) {
            endIndex = mid - 1;
        }
        if (value > this[mid]) {
            startIndex = mid + 1;
        }
    }
    return -1;
}

Array.prototype.binaryAny = function <T>(value: T) {
    return this.binaryIndexOf(value) >= 0;
}

Array.prototype.innerJoin = function <T, O, R>(outerItems: O[], innerField: (field: T) => any, outerField: (field: O) => any, mapFunc: (inner: T, outer: O) => R): R[] {
    let ret: R[] = []
    for (let i = 0; i < this.length; i++) {
        const inner = this[i];
        for (let x = 0; x < outerItems.length; x++) {
            const outer = outerItems[x];
            if (innerField(inner) == outerField(outer)) {
                ret.push(mapFunc(inner, outer));
            }
        }
    }
    return ret;
}

Array.prototype.leftJoin = function <T, O, R>(outerItems: O[], innerField: (field: T) => any, outerField: (field: O) => any, mapFunc: (inner: T, outer: O) => R): R[] {
    let ret: R[] = []
    for (let i = 0; i < this.length; i++) {
        const inner = this[i];
        for (let x = 0; x < outerItems.length; x++) {
            const outer = outerItems[x];
            if (innerField(inner) == outerField(outer)) {
                ret.push(mapFunc(inner, outer));
            }
            else {
                ret.push(mapFunc(inner, null));
            }
        }
    }
    return ret;
}

export class Group<T, U>{
    public items: T[] = []
    constructor(public key: U) {

    }
}

export { };
