import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {
  County,
  CountyData,
  Vaccine,
  VaccineData,
} from 'src/app/services/alltypes';
import { NetworkService } from 'src/app/services/network/network.service';
import { Router } from '@angular/router';
import { InfectionsService } from 'src/app/services/infections/infections.service';
import { VaccinesService } from 'src/app/services/vaccines/vaccines.service';

// import * as La from 'leaflet-ajax';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  // data
  private countyJson = {} as GeoData;
  private vaccineJson = {} as GeoDataVaccine;

  // map
  private map = {} as L.Map;
  private layer = {} as L.Layer;
  public showInfections: boolean = true;
  public showFirstVaccine: boolean = true;
  public tolltippopup: any;

  constructor(
    private network: NetworkService,
    private router: Router,
    private infection: InfectionsService,
    private vaccines: VaccinesService
  ) {}

  ngOnInit(): void {
    this.showInfections = this.router.url.includes('infections');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  /**
   * shows Vaccine Data
   */
  public showVaccineData(type: 'first' | 'second'): void {
    this.showInfections = false;
    this.loadVaccineData(type);

    this.showFirstVaccine = type === 'first';
  }

  /**
   * creates the map and shows the infection data
   */
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

    // get data
    if (this.showInfections) {
      this.loadInfectionData();
    } else {
      this.loadVaccineData('first');
    }
  }

  /**
   * loads infection data and adds it to the map
   */
  private loadInfectionData(): void {
    this.network.getAllCountyIncidences().subscribe(
      (res) => {
        this.map.removeLayer(this.layer);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', './assets/json/RKI_Corona_Landkreise.json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
        xhr.onload = () => {
          if (xhr.status !== 200) {
            return;
          }
          this.countyJson = this.mapBackendDataToCountyJSON(res, xhr.response);

          this.loadMapWithData(this.countyJson, 'incidences');
        };
        xhr.send();
      },
      (err) => {
        console.log('error getAllCountyIncidences', err);
      }
    );
  }

  /**
   * loads infection data and adds it to the map
   */
  private loadVaccineData(type: 'first' | 'second'): void {
    this.network.getVaccineAllStates().subscribe(
      (res) => {
        this.map.removeLayer(this.layer);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', './assets/json/bundeslaender.geo.json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
        xhr.onload = () => {
          if (xhr.status !== 200) {
            return;
          }
          // this.vaccineJson = xhr.response;
          this.vaccineJson = this.mapBackendDataToVaccineJSON(
            res,
            xhr.response
          );

          if (type === 'first') {
            this.loadMapWithData(this.vaccineJson, 'firstVaccination');
          } else if (type === 'second') {
            this.loadMapWithData(this.vaccineJson, 'secondVaccination');
          }
        };
        xhr.send();
      },
      (err) => {
        console.log('error getVaccineAllStates', err);
      }
    );
  }

  /**
   * loads the geojson data and changes the color according to the backend data
   * @param data geojson data
   * @param type decides which data should be tinted
   */
  private loadMapWithData(
    data: any,
    type: 'firstVaccination' | 'secondVaccination' | 'incidences'
  ): void {
    this.layer = L.geoJSON(data, {
      style: (feature) => {
        if (type === 'firstVaccination') {
          // data gets sorted by first vaccination
          if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 60
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.2,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
              60 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 55
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.4,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
              55 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 50
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.6,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
              50 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 0
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.8,
              weight: 1,
            };
          }
        } else if (type === 'incidences') {
          // data gets sorted by incidences
          if (feature?.properties.propsNetwork.Incidence7 >= 90) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.3,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 90 &&
            feature?.properties.propsNetwork.Incidence7 >= 80
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.35,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 80 &&
            feature?.properties.propsNetwork.Incidence7 >= 70
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.4,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 70 &&
            feature?.properties.propsNetwork.Incidence7 >= 60
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.45,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 60 &&
            feature?.properties.propsNetwork.Incidence7 >= 50
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.5,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 50 &&
            feature?.properties.propsNetwork.Incidence7 >= 40
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.55,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 40 &&
            feature?.properties.propsNetwork.Incidence7 >= 30
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.6,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 30 &&
            feature?.properties.propsNetwork.Incidence7 >= 20
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.65,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 20 &&
            feature?.properties.propsNetwork.Incidence7 >= 10
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.7,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 10 &&
            feature?.properties.propsNetwork.Incidence7 >= 0
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.75,
              weight: 1,
            };
          }
        } else if (type === 'secondVaccination') {
          // data gets sorted second vaccination
          if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >= 31
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.3,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
              31 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
              29.5
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.4,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
              29.5 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >= 28
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.5,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
              28 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
              26.5
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.6,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
              26.5 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >= 25
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.7,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
              25 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >= 0
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.8,
              weight: 1,
            };
          }
        }
        return {};
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', (e) => {
          // e = event
          // console.log(e);
          console.log(e.target.feature.properties);
          console.log(e.target.feature.properties.AdmUnitId);
          // this.infection.selectedCountyId = e.target.feature.properties.AdmUnitId;
          if (this.showInfections) {
            this.infection.setSelectedCountyId(
              e.target.feature.properties.AdmUnitId
            );
          } else {
            console.log(e.target.feature.properties.StateId);
            this.vaccines.setSelectedStateId(
              e.target.feature.properties.StateId
            );
          }
        });
        layer.on('mouseover', (e: any) => {
          let content = '';
          if (this.showInfections) {
            const props =  e.target.feature.properties.propsNetwork;
            content = '<h1>' + props.County + '</h1>' +
            '<p>7 Tage-Inzidenz: ' + props.Incidence7.toFixed(2).replace('.', ',') + '</p>' +
            '<p>Bestätige Fälle: ' + props.TotalCases.toLocaleString('de-DE') + '</p>' +
            '<p>Aktive Fälle: ' + props.ActiveCases.toLocaleString('de-DE') + '</p>' +
            '<p>Genesene: ' + props.Recovered.toLocaleString('de-DE') + '</p>' +
            '<p>Verstorbene: ' + props.Deaths.toLocaleString('de-DE') + '</p>';
          } else {
            const props =  e.target.feature.properties.propsNetwork;
            content = '<h1>' + e.target.feature.properties.name + '</h1>' +
            '<p>erste Impfung: ' + props.ProportionFirstVaccinations.toString().replace('.', ',') + '%</p>' +
            '<p>zweite Impfung: ' + props.ProportionSecondVaccinations.toString().replace('.', ',') + '%</p>' +
            '<p>Impfdosen AstraZeneca: ' + props.SumAstraZeneca.toLocaleString('de-DE') + '</p>' +
            '<p>Impfdosen BioNTech/Pfizer: ' + props.SumBioNTech.toLocaleString('de-DE') + '</p>' +
            '<p>Impfdosen Johnson & Johnson: ' + props.SumJohnsonAndJohnson.toLocaleString('de-DE') + '</p>' +
            '<p>Impfdosen Moderna: ' + props.SumModerna.toLocaleString('de-DE') + '</p>' +
            '<p>Anzahl Impfdosen : ' + props.SumVaccinations.toLocaleString('de-DE') + '</p>';
          }
          const temp = L.latLng(e.latlng.lat, e.latlng.lng);
          this.tolltippopup = L.popup({offset: L.point(0, 0), className: 'poppup'})
          .setContent(content)
          .setLatLng(temp).openOn(this.map);
        });
        layer.on('mouseout', (e) => {
          this.map.closePopup(this.tolltippopup);
        });
      },
    });
    this.layer.addTo(this.map);
  }

  /**
   * orders the data correctly
   * @param res data of the network request
   * @param countyGeo geojson data from the vaccine
   * @returns the geodata with the added backend data
   */
  private mapBackendDataToCountyJSON(
    res: County[],
    countyGeo: GeoData
  ): GeoData {
    for (const county of countyGeo.features) {
      const element = res.find(
        (a) => a[1].CountyId === county.properties.AdmUnitId
      );
      if (element) {
        county.properties.propsNetwork = element[1];
      }
    }
    return countyGeo;
  }

  /**
   * orders the data correctly
   * @param res data of the network request
   * @param countyGeo geojson data from the vaccine
   * @returns the geodata with the added backend data
   */
  private mapBackendDataToVaccineJSON(
    res: Vaccine[],
    countyGeo: GeoDataVaccine
  ): GeoDataVaccine {
    for (let i = 0; i < countyGeo.features.length; i++) {
      const element = res.find((a) => a[1].StateId === i);
      if (element) {
        countyGeo.features[i].properties.propsNetwork = element[1];
      }
    }
    return countyGeo;
  }
}

type GeoData = {
  type: string;
  features: GeoElement[];
};

type GeoElement = {
  type: string;
  id: number;
  properties: properties;
  geometry: {
    type: string;
    coordinates: any;
  };
};

type properties = {
  ADE: number;
  AGS: string;
  AGS_0: string;
  AdmUnitId: number;
  BEM: string;
  BEZ: string;
  BL: string;
  BL_ID: string;
  BSG: number;
  DEBKG_ID: string;
  EWZ: number;
  EWZ_BL: number;
  FK_S3: string;
  GEN: string;
  GF: number;
  IBZ: number;
  KFL: number;
  NBD: string;
  NUTS: string;
  OBJECTID: number;
  RS: string;
  RS_0: string;
  SDV_RS: string;
  SHAPE_Area: number;
  SHAPE_Length: number;
  SN_G: string;
  SN_K: string;
  SN_L: string;
  SN_R: string;
  SN_V1: string;
  SN_V2: string;
  WSK: string;
  cases: number;
  cases7_bl: number;
  cases7_bl_per_100k: number;
  cases7_lk: number;
  cases7_per_100k: number;
  cases7_per_100k_txt: string;
  cases_per_100k: number;
  cases_per_population: number;
  county: string;
  death7_bl: number;
  death7_lk: number;
  death_rate: number;
  deaths: number;
  last_update: string;
  recovered: any;
  propsNetwork?: CountyData;
};

type propertiesVaccine = {
  StateId: number;
  id: string;
  name: string;
  type: string;
  propsNetwork?: VaccineData;
};

type GeoDataVaccine = {
  type: string;
  features: GeoElementVaccine[];
};

type GeoElementVaccine = {
  type: string;
  id: number;
  properties: propertiesVaccine;
  geometry: {
    type: string;
    coordinates: any;
  };
};
