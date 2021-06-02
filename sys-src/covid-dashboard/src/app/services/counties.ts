import { County, Vaccine } from './county';

export class Counties {
  static formatDate(c: County) {
    return {
      ...c,
      0: new Date(c[0]).toLocaleDateString('de')
    };
  }
}


export class Vaccines {
  static formatDate(v: Vaccine) {
    return {
      ...v,
      0: new Date(v[0]).toLocaleDateString('de')
    };
  }
}
