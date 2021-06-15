import { Component, Input, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network/network.service';

@Component({
  selector: 'app-incidencesseven',
  templateUrl: './incidencesseven.component.html',
  styleUrls: ['./incidencesseven.component.scss']
})
export class IncidencessevenComponent implements OnInit {

  @Input() type: 'incidence7' | 'activeCases' | 'recovered' | 'deaths' | 'totalCases' = 'incidence7';
  @Input() daynumber: number = 7;

  public lastseven = [] as ScaleData[];
  public loaded: boolean = false;

  colorScheme = {
    domain: ['#ff1f4d']
  };

  constructor(
    private network: NetworkService
  ) { }

  ngOnInit(): void {
    this.network.getSingleCountyIncidences(9361).subscribe((res) => {
      // console.log('res singel chart', res);
      const t = res.splice(res.length - this.daynumber, res.length);
      // console.log('t', t);
      for (const element of t) {
        if (this.type === 'incidence7') {
          const temp: ScaleData = {name: element[0], value: element[1].Incidence7};
          this.lastseven.push(temp);
        } else if (this.type === 'activeCases') {
          const temp: ScaleData = {name: element[0], value: element[1].ActiveCases};
          this.lastseven.push(temp);
        } else if (this.type === 'recovered') {
          const temp: ScaleData = {name: element[0], value: element[1].Recovered};
          this.lastseven.push(temp);
        } else if (this.type === 'deaths') {
          const temp: ScaleData = {name: element[0], value: element[1].Deaths};
          this.lastseven.push(temp);
        } else if (this.type === 'totalCases') {
          const temp: ScaleData = {name: element[0], value: element[1].TotalCases};
          this.lastseven.push(temp);
        }
      }
      // console.log('lastseven', this.lastseven);
      this.loaded = true;
    })
  }

}

export type ScaleData = {
  name: string;
  value: number;
}
