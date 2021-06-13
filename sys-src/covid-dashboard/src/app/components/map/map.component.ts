import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { County, Vaccine, VaccineData } from 'src/app/services/county';
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
  private countyJson = {} as GeoData;
  private vaccineJson = {} as GeoData;
  private layer = {} as L.Layer;

  currentMap: string = 'infection';

  constructor(private network: NetworkService) {
    // this.network.getCounty(1001).subscribe((res: any) => {
    //   console.log(res);
    // })

    // this.network.getVaccine(0).subscribe((res) => {
    //   console.log(res)
    // })

    // this.network.getAllIncidences().subscribe((res) => {
    //   console.log(res);
    //   console.log(res[0][1].ActiveCases)
    // });

    // this.network.getSingelIncidence(1001).subscribe((res) => {
    //   console.log(res);
    // })

    // this.network.getCountyOverView().subscribe((res) => {
    //   console.log(res);
    // })

    // this.network.getVaccine(1).subscribe((res) => {
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
    const bounds = L.latLngBounds([
      [55.1, 5.4541194],
      [46.25, 15.4541194],
    ]);
    this.map.setMaxBounds(bounds);
    this.map.on('drag', () => {
      this.map.panInsideBounds(bounds, { animate: false });
    });

    const xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/json/RKI_Corona_Landkreise.json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status !== 200) {
        return;
      }

      const myStyle = {
        color: '#ff1f4d',
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0.1,
      };

      this.countyJson = xhr.response;
      this.loadMapWithData(xhr.response, myStyle);
    };
    xhr.send();
  }

  private loadMapWithData(data: any, myStyle: any): void {
    this.layer = L.geoJSON(data, {
      style: (feature) => {
        if (feature?.properties.propsNetwork?.ProportionFirstVaccinations > 40) {
          return {color: '#87ceeb', fillColor: '#87ceeb', fillOpacity: 0.2};
        } else if (feature?.properties.propsNetwork?.ProportionFirstVaccinations < 30) {
          return {color: '#6ca6cd', fillColor: '#6ca6cd', fillOpacity: 0.2};
        } else if (feature?.properties.propsNetwork?.ProportionFirstVaccinations < 20) {
          return {color: '#4a708b', fillColor: '#4a708b', fillOpacity: 0.2};
        }
        // return {color: 'red', fillColor: 'red'}
        return {};
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', (e) => {
          // e = event
          console.log(e);
          console.log(e.target.feature.properties);
        });
      },
    });
    this.layer.addTo(this.map);
  }

  public showVaccineData(): void {
    this.network.getVaccineAllStates().subscribe((res) => {
      console.log(res);
      const myStyle = {
        color: '#ff1f4d',
        weight: 2,
        opacity: 0.5,
        fillOpacity: 0.1,
      };
      console.log('showVaccineData', this.vaccineJson);
      this.map.removeLayer(this.layer);
      // if (this.vaccineJson.type) {
        //   this.loadMapWithData(this.vaccineJson, myStyle);
        // } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', './assets/json/bundeslaender.geo.json');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status !== 200) {
          return;
        }
        this.vaccineJson = xhr.response;
        console.log(this.vaccineJson);
        for (let i = 0; i < this.vaccineJson.features.length; i++) {
          const element = res.find(a => a[1].StateId === i);
          if (element) {
            this.vaccineJson.features[i].properties.propsNetwork = element[1];
          }
        }

        this.loadMapWithData(this.vaccineJson, myStyle);
      };
      xhr.send();
    })
    // }
  }

  public showInfectionData(): void {
    this.currentMap = 'infection';
    console.log('showInfectionData');
    this.map.removeLayer(this.layer);
    const myStyle = {
      color: '#ff1f4d',
      weight: 2,
      opacity: 0.5,
      fillOpacity: 0.1,
    };
    setTimeout(() => {
      this.loadMapWithData(this.countyJson, myStyle);
    }, 0);
  }
}

type GeoData = {
  type: string;
  features: GeoElement[];
};

type GeoElement = {
  type: string
  id: number,
  properties: properties | propertiesVaccine
  geometry: {
    type: string;
    coordinates: any;
  };
};

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
  propsNetwork?: VaccineData
};

type propertiesVaccine = {
  StateId: number,
  id: string,
  name: string,
  type: string,
  propsNetwork?: VaccineData
};
