import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../../services/map/map.service';
// import * as La from 'leaflet-ajax';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: any;

  constructor() {} // private mapService: MapService

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
    xhr.open('GET', './assets/json/map_layer_sehr_hoch.json');
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
