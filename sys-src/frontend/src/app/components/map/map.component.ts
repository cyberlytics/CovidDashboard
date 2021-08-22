/* eslint-disable @typescript-eslint/consistent-type-imports */
import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {County, CountyData, Vaccine, VaccineData,} from 'src/app/services/alltypes';
import {NetworkService} from 'src/app/services/network/network.service';
import {Router} from '@angular/router';
import {InfectionsService} from 'src/app/services/infections/infections.service';
import {VaccinesService} from 'src/app/services/vaccines/vaccines.service';
import { ResizeService } from 'src/app/services/resize/resize.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  public showInfections = true;
  public showFirstVaccine = true;
  public tolltippopup: any;
  // data
  private countyJson = {} as GeoData;
  private vaccineJson = {} as GeoDataVaccine;
  // map
  private map = {} as L.Map;
  private layer = {} as L.Layer;

  public legendLabel: 'Fälle letzte 7 Tage/100.000 EW' | 'Erstimpfung in Prozent' | 'Zweitimpfung in Prozent' = 'Fälle letzte 7 Tage/100.000 EW';

  public displayedLegned: Legend[] = [];
  public legendRowNumber: 3 | 4 = 4;

  public incidenceslegend: Legend[] = [
    {
      min: 0,
      max: 20,
      color: '#529bf2',
      fillOpacity: 0.75,
    },
    {
      min: 20,
      max: 40,
      color: '#529bf2',
      fillOpacity: 0.7,
    },
    {
      min: 40,
      max: 60,
      color: '#529bf2',
      fillOpacity: 0.65,
    },
    {
      min: 60,
      max: 80,
      color: '#529bf2',
      fillOpacity: 0.6,
    },
    {
      min: 80,
      max: 100,
      color: '#529bf2',
      fillOpacity: 0.55,
    },
    {
      min: 100,
      max: 120,
      color: '#529bf2',
      fillOpacity: 0.5,
    },
    {
      min: 120,
      max: 140,
      color: '#529bf2',
      fillOpacity: 0.45,
    },
    {
      min: 140,
      max: 160,
      color: '#529bf2',
      fillOpacity: 0.4,
    },
    {
      min: 160,
      max: 180,
      color: '#529bf2',
      fillOpacity: 0.35,
    },
    {
      min: 180,
      max: 200,
      color: '#529bf2',
      fillOpacity: 0.3,
    },
    {
      min: 200,
      max: 220,
      color: '#529bf2',
      fillOpacity: 0.25,
    },
    {
      min: 220,
      max: 240,
      color: '#529bf2',
      fillOpacity: 0.2,
    },
    {
      min: 240,
      max: 260,
      color: '#529bf2',
      fillOpacity: 0.15,
    },
    {
      min: 260,
      max: 280,
      color: '#529bf2',
      fillOpacity: 0.1,
    },
    {
      min: 280,
      max: undefined,
      color: '#529bf2',
      fillOpacity: 0.05,
    },
  ]

  public firstVaccineslegend: Legend[] = [
    {
      min: 0,
      max: 50,
      color: '#529bf2',
      fillOpacity: 1,
    },
    {
      min: 50,
      max: 55,
      color: '#529bf2',
      fillOpacity: 0.95,
    },
    {
      min: 55,
      max: 60,
      color: '#529bf2',
      fillOpacity: 0.9,
    },
    {
      min: 60,
      max: 65,
      color: '#529bf2',
      fillOpacity: 0.8,
    },
    {
      min: 65,
      max: 70,
      color: '#529bf2',
      fillOpacity: 0.7,
    },
    {
      min: 70,
      max: 75,
      color: '#529bf2',
      fillOpacity: 0.6,
    },
    {
      min: 75,
      max: 80,
      color: '#529bf2',
      fillOpacity: 0.5,
    },
    {
      min: 80,
      max: 85,
      color: '#529bf2',
      fillOpacity: 0.4,
    },
    {
      min: 85,
      max: 90,
      color: '#529bf2',
      fillOpacity: 0.3,
    },
    {
      min: 90,
      max: 95,
      color: '#529bf2',
      fillOpacity: 0.2,
    },
    {
      min: 95,
      max: 100,
      color: '#529bf2',
      fillOpacity: 0.1,
    }
  ]

  public secondVaccineslegend: Legend[] = [
    {
      min: 0,
      max: 50,
      color: '#ffc71d',
      fillOpacity: 1,
    },
    {
      min: 50,
      max: 55,
      color: '#ffc71d',
      fillOpacity: 0.95,
    },
    {
      min: 55,
      max: 60,
      color: '#ffc71d',
      fillOpacity: 0.9,
    },
    {
      min: 60,
      max: 65,
      color: '#ffc71d',
      fillOpacity: 0.8,
    },
    {
      min: 65,
      max: 70,
      color: '#ffc71d',
      fillOpacity: 0.7,
    },
    {
      min: 70,
      max: 75,
      color: '#ffc71d',
      fillOpacity: 0.6,
    },
    {
      min: 75,
      max: 80,
      color: '#ffc71d',
      fillOpacity: 0.5,
    },
    {
      min: 80,
      max: 85,
      color: '#ffc71d',
      fillOpacity: 0.4,
    },
    {
      min: 85,
      max: 90,
      color: '#ffc71d',
      fillOpacity: 0.3,
    },
    {
      min: 90,
      max: 95,
      color: '#ffc71d',
      fillOpacity: 0.2,
    },
    {
      min: 95,
      max: 100,
      color: '#ffc71d',
      fillOpacity: 0.1,
    }
  ]

  constructor(
    private network: NetworkService,
    private router: Router,
    private infection: InfectionsService,
    private vaccines: VaccinesService,
    public resize: ResizeService
  ) {
  }

  ngOnInit(): void {
    this.showInfections = this.router.url.includes('infections');
    this.displayedLegned = this.incidenceslegend;
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
    if (this.showFirstVaccine) {
      this.legendLabel = 'Erstimpfung in Prozent';
      this.displayedLegned = this.firstVaccineslegend;
      this.legendRowNumber = 3;
    } else {
      this.legendLabel = 'Zweitimpfung in Prozent';
      this.displayedLegned = this.secondVaccineslegend;
      this.legendRowNumber = 3;
    }
  }

  /**
   * creates the map and shows the infection data
   */
  private initMap(): void {
    let zoom = 7;
    if(this.resize.isMobile) {
      zoom = 6;
    }
    this.map = L.map('map', {
      center: [51.1642292, 10.4541194],
      zoom: zoom,
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
      this.map.panInsideBounds(bounds, {animate: false});
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
    if (type === 'first') {
      this.legendLabel = 'Erstimpfung in Prozent';
      this.displayedLegned = this.firstVaccineslegend;
      this.legendRowNumber = 3;
    } else {
      this.legendLabel = 'Zweitimpfung in Prozent';
      this.displayedLegned = this.firstVaccineslegend;
      this.legendRowNumber = 3;
    }
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
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 95
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.1,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            95 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 90
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.2,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            90 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 85
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.3,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
            85 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 80
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.4,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
            80 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 75
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.5,
              weight: 1,
            };
          }else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
            75 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 70
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.6,
              weight: 1,
            };
          }else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
            70 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 65
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.7,
              weight: 1,
            };
          }else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
            65 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 60
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.8,
              weight: 1,
            };
          }else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
            60 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 55
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.9,
              weight: 1,
            };
          }else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
            55 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 50
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.95,
              weight: 1,
            };
          }else if (
            feature?.properties.propsNetwork?.ProportionFirstVaccinations <
            50 &&
            feature?.properties.propsNetwork?.ProportionFirstVaccinations >= 0
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 1,
              weight: 1,
            };
          }
        } else if (type === 'incidences') {
          // data gets sorted by incidences
          if (feature?.properties.propsNetwork.Incidence7 >= 280) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.05,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 280 &&
            feature?.properties.propsNetwork.Incidence7 >= 260
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.1,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 260 &&
            feature?.properties.propsNetwork.Incidence7 >= 240
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.15,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 240 &&
            feature?.properties.propsNetwork.Incidence7 >= 220
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.2,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 220 &&
            feature?.properties.propsNetwork.Incidence7 >= 200
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.25,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 200 &&
            feature?.properties.propsNetwork.Incidence7 >= 180
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.3,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 180 &&
            feature?.properties.propsNetwork.Incidence7 >= 160
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.35,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 160 &&
            feature?.properties.propsNetwork.Incidence7 >= 140
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.4,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 140 &&
            feature?.properties.propsNetwork.Incidence7 >= 120
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.45,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 120 &&
            feature?.properties.propsNetwork.Incidence7 >= 100
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.5,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 100 &&
            feature?.properties.propsNetwork.Incidence7 >= 80
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.55,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 80 &&
            feature?.properties.propsNetwork.Incidence7 >= 60
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.6,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 60 &&
            feature?.properties.propsNetwork.Incidence7 >= 40
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.65,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 40 &&
            feature?.properties.propsNetwork.Incidence7 >= 20
          ) {
            return {
              color: '#529bf2',
              fillColor: '#529bf2',
              fillOpacity: 0.7,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork.Incidence7 < 20 &&
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
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >= 95
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.1,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            95 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
            90
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.2,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            90 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >= 85
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.3,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            85 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
            80
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.4,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            80 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >= 75
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.5,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            75 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >= 70
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.6,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            70 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
            65
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.7,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            65 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
            60
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.8,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            60 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
            55
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.9,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            55 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
            50
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 0.95,
              weight: 1,
            };
          } else if (
            feature?.properties.propsNetwork?.ProportionSecondVaccinations <
            50 &&
            feature?.properties.propsNetwork?.ProportionSecondVaccinations >=
            0
          ) {
            return {
              color: '#ffc71d',
              fillColor: '#ffc71d',
              fillOpacity: 1,
              weight: 1,
            };
          }
        }
        return {};
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', (e) => {
          if (this.resize.isMobile) {
            createPopUP(e);
          } else {
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
          }
        });
        layer.on('mouseover', (e: any) => {
          createPopUP(e);
        });
        layer.on('mouseout', () => {
          this.map.closePopup(this.tolltippopup);
        });
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const scope = this;
    function createPopUP(e: any) {
      let content = '';
          if (scope.showInfections) {
            content = createPopUpTextInfections(e.target.feature.properties.propsNetwork);
          } else {
            content = createPopUpTextVaccines(e.target.feature.properties.propsNetwork, e.target.feature.properties.name);
          }
          const temp = L.latLng(e.latlng.lat, e.latlng.lng);
          scope.tolltippopup = L.popup({
            offset: L.point(0, 0),
            className: 'popup',
          })
            .setContent(content)
            .setLatLng(temp)
            .openOn(scope.map);
    }

    function createPopUpTextInfections(props: any) {
      const content =
        '<h1>' +
        props.County +
        '</h1>' +
        '<p>Bestätigt: ' +
        props.TotalCases.toLocaleString('de-DE') +
        '</p>' +
        '<p>Aktiv: ' +
        props.ActiveCases.toLocaleString('de-DE') +
        '</p>' +
        '<p>Genesen: ' +
        props.Recovered.toLocaleString('de-DE') +
        '</p>' +
        '<p>7 Tage-Inzidenz: ' +
        props.Incidence7.toFixed(2).replace('.', ',') +
        '</p>' +
        '<p>Verstorben: ' +
        props.Deaths.toLocaleString('de-DE') +
        '</p>';
        return content;
    }

    function createPopUpTextVaccines(props: any, name: any) {
      const content =
      '<h1>' +
      name +
      '</h1>' +
      '<p>Mindestens eine Impfdosis erhalten: ' +
      props.ProportionFirstVaccinations.toString().replace('.', ',') +
      '%</p>' +
      '<p>Zwei Impfdosen erhalten: ' +
      props.ProportionSecondVaccinations.toString().replace('.', ',') +
      '%</p>' +
      '<p>Verabreichte Impfdosen : ' +
      props.SumVaccinations.toLocaleString('de-DE') +
      '</p>' +
      '<p>Impfdosen AstraZeneca: ' +
      props.SumAstraZeneca.toLocaleString('de-DE') +
      '</p>' +
      '<p>Impfdosen BioNTech/Pfizer: ' +
      props.SumBioNTech.toLocaleString('de-DE') +
      '</p>' +
      '<p>Impfdosen Johnson & Johnson: ' +
      props.SumJohnsonAndJohnson.toLocaleString('de-DE') +
      '</p>' +
      '<p>Impfdosen Moderna: ' +
      props.SumModerna.toLocaleString('de-DE') +
      '</p>';
      return content;
    }
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
      const element = res.find((a) => a[1].StateId === countyGeo.features[i].properties.StateId);
      if (element) {
        countyGeo.features[i].properties.propsNetwork = element[1];
      }
    }
    return countyGeo;
  }

  public checkColumn(index: number): number {
    // if (index > 0) {
    //   if (index % 4 === 0) {
    //     // console.log('4', index)
    //     return 4;
    //   } else if (index % 3 === 0) {
    //     // console.log('3', index)
    //     return 3;
    //   } else if (index % 2 === 0) {
    //     // console.log('2', index)
    //     return 2;
    //   }
    // }
    if (index >= 0 && index < this.legendRowNumber) {
      // console.log('1', index)
      return 1;
    } else if (index >= this.legendRowNumber && index < this.legendRowNumber*2) {
      // console.log('2', index)
      return 2;
    } else if (index >= this.legendRowNumber*2 && index < this.legendRowNumber*3) {
      // console.log('3', index)
      return 3;
    } else if (index >= this.legendRowNumber*3 && index < this.legendRowNumber*4) {
      // console.log('4', index)
      return 4;
    }
    return 1;
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

type Legend = {
  min: number
  max: number | undefined
  color: string
  fillOpacity: number
};
