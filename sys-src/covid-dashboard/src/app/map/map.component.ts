import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapserviceService } from '../services/mapservice.service';
// import * as La from 'leaflet-ajax';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  private map: any;

  constructor(
    private mapService: MapserviceService
  ) { }


  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 51.145, 9.932 ],
      zoom: 6
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', '../assets/1_sehr_hoch.geo.json');
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.responseType = 'json';
    // xhr.onload = () => {
    //   if (xhr.status !== 200) return;
    //   L.geoJSON(xhr.response).addTo(this.map);
    // }
    // xhr.send();
    // L.geoJSON()

    L.geoJSON(this.mapService.geoDaten,{
      onEachFeature: (feature, layer) => {
        layer.on('click', function (e) {
          // e = event
          console.log(e);
          console.log(e.target.feature.properties);
          })
      }
    }).addTo(this.map);
  }



}
