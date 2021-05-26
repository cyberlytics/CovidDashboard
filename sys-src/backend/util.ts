export function stringify(value: any): string {
    return JSON.stringify(value, (k, v) => {
        if(v instanceof Map) {
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
        if(typeof v === 'object' && v !== null) {
            if(v.dataType === 'Map') {
                return new Map(v.value);
            }
        }
        return v;
    });
}