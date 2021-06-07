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
  private map = {} as L.Map;
  private response: GeoData = {} as GeoData;
  private layer = {} as L.Layer;

  constructor(
    private network: NetworkService
  ) {
    // this.network.getCounty(1001).subscribe((res: any) => {
    //   console.log(res);
    // })

    // this.network.getVaccine(0).subscribe((res) => {
    //   console.log(res)
    // })
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
      dragging: true,
    });

    // set bounds for the map so only germany is displayed and draggable
    let bounds = L.latLngBounds([[55.1, 5.4541194], [46.25, 15.4541194]]);
    this.map.setMaxBounds(bounds);
    this.map.on('drag', () => {
      this.map.panInsideBounds(bounds, { animate: false });
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
      this.loadMapWithData(xhr.response, myStyle);
    };
    xhr.send();
  }

  private loadMapWithData(data: any, myStyle: any) {
    this.layer = L.geoJSON(data, {
      style: myStyle,
      onEachFeature: (feature, layer) => {
        layer.on('click', function (e) {
          // e = event
          console.log(e);
          console.log(e.target.feature.properties);
        });
      },
    })
    this.layer.addTo(this.map);
  }

  public showVaccineData() {
    console.log('showVaccineData');
    this.map.removeLayer(this.layer);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/json/bundeslaender_simplify200.geo.json');
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
      this.loadMapWithData(xhr.response, myStyle);
    };
    xhr.send();
  }

  public showInfectionData() {
    console.log('showInfectionData');
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
