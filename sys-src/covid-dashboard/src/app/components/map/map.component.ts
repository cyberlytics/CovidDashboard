import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { County } from 'src/app/services/county';
import { NetworkService } from 'src/app/services/network/network.service';
import { MapService } from '../../services/map/map.service';
// import * as La from 'leaflet-ajax';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private response: GeoData = {} as GeoData;

  constructor(
    private network: NetworkService
  ) {
    // this.network.getCounty(1001).subscribe((res: any) => {
    //   console.log(res);
    // })

    this.network.getVaccine(0).subscribe((res) => {
      console.log(res)
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [51.1642292, 10.4541194],
      zoom: 7,
      minZoom: 6,
      maxZoom: 10,
      attributionControl: false,
      zoomControl: false,
      dragging: false,
    });

    let xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/json/RKI_Corona_Landkreise.json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status !== 200) return;

      let myStyle = {
        color: '#ff1f4d',
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0.1,
      };

      this.response = xhr.response;

      L.geoJSON(xhr.response, {
        style: myStyle,
        onEachFeature: (feature, layer) => {
          layer.on('click', function (e) {
            // e = event
            console.log(e);
            console.log(e.target.feature.properties);
          });
        },
      }).addTo(this.map);
    };
    xhr.send();

    // L.geoJSON()

    // L.geoJSON(this.mapService.geoDaten,{
    //   onEachFeature: (feature, layer) => {
    //     layer.on('click', function (e) {
    //       // e = event
    //       console.log(e);
    //       console.log(e.target.feature.properties);
    //       })
    //   }
    // }).addTo(this.map);
  }
}

type GeoData = {
  type: string;
  features: GeoElement[];
}

type GeoElement = {
  type: string
  id: number,
  properties: properties
  geometry: {
    type: string,
    coordinates: any;
  }
}

type properties = {
  ID_0: number,
  ISO: string,
  NAME_0: string,
  ID_1: number,
  NAME_1: string,
  ID_2: number,
  NAME_2: string,
  ID_3: number,
  NAME_3: string,
  NL_NAME_3: string,
  VARNAME_3: null,
  TYPE_3: string,
  ENGTYPE_3: string
}
