export function stringify(value: any): string {
  return JSON.stringify(value, (k, v) => {
    if (v instanceof Map) {
      return {
        dataType: "Map",
        value: Array.from(v.entries()),
      };
    } else {
      return v;
    }
  });
}

export function parse(text: string): any {
  return JSON.parse(text, (k, v) => {
    if (typeof v === "object" && v !== null) {
      if (v.dataType === "Map") {
        return new Map(v.value);
      }
    }
    return v;
  });
}

export function mapToObject(map: Map<any, any> | undefined): object {
  if (typeof map === "undefined") return {};
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
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

export function addDays(date: Date, days: number): Date {
  //return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + days)
  );
}

export function parseRKIDate(date: string): Date {
  const s = date
    .split("/")
    .join("-")
    .split(" ")
    .join("T")
    .split("+00")
    .join("Z");
  return new Date(Date.parse(s));
}

export function lastElementPerMap<T>(map: Map<number, Map<number, T>>): Map<number, T> {
  const m = new Map<number, T>();
  map.forEach((v, key) => {
    let last: T | undefined = undefined;
    v.forEach(e => last = e);
    if (typeof (last) !== 'undefined') {
      m.set(key, last);
    }
  });
  return m;
}

export function daysSince(date: string): number {
  return Math.ceil((new Date().valueOf() - new Date(Date.parse(date)).valueOf()) / 1000 / 60 / 60 / 24);
}

export function dateToString(date: Date): string {
  return `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}