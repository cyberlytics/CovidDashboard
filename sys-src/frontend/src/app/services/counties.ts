import {County, Vaccine} from './alltypes';

export class Counties {
  static formatDate(c: County) {
    return {
      ...c,
      0: new Date(c[0]).toLocaleDateString('de'),
    };
  }

  static returnCorrectData(c: any) {
    return {
      1: c[1],
    };
  }
}

export class Vaccines {
  static formatDate(v: Vaccine) {
    return {
      ...v,
      0: new Date(v[0]).toLocaleDateString('de'),
    };
  }
}
