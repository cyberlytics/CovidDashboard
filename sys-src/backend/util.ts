export function stringify(value: any): string {
    return JSON.stringify(value, (k, v) => {
        if (v instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(v.entries()),
            };
        } else {
            return v;
        }
    });
}

export function parse(text: string): any {
    return JSON.parse(text, (k, v) => {
        if (typeof v === 'object' && v !== null) {
            if (v.dataType === 'Map') {
                return new Map(v.value);
            }
        }
        return v;
    });
}

export function mapToObject(map: Map<any, any> | undefined): object {
    if (typeof map === 'undefined') return {};
    return Array.from(map.entries());
}

export function lastDays(amount: number = 14): Date[] {
    const dates = new Array<Date>();
    const today = getMidnightUTC(new Date());
    for (let i = 0; i < amount; i++) {
        dates.unshift(addDays(today, -i));
    }
    return dates;
}

function getMidnightUTC(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function addDays(date: Date, days: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function parseRKIDate(date: string): Date {
    const s = date.split("/").join("-").split(" ").join("T").split("+00").join("Z");
    return new Date(
        Date.parse(s)
    );
}