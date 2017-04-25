import { Component, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { MapService } from '../services/map.service';

/*
  Generated class for the Maps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'ddMap',
  templateUrl: 'map.html'
})
export class MapCmp implements AfterViewInit {
  @Output() onMapReady = new EventEmitter();
  @Output() onMapIdle = new EventEmitter();
  @Output() onCenterChanged = new EventEmitter();
  @Output() onDragStart = new EventEmitter();

  @ViewChild('map') mapCanvas;
  private map: any = null;

  constructor(public mapService: MapService) {}

  ngAfterViewInit() {
    const mapElem = this.mapCanvas.nativeElement;
    return this.mapService.createMap(mapElem)
    .then((map) => {
      this.map = map;
      this.bindMapEvents(mapElem);
    });
  }

  private bindMapEvents(mapEl: HTMLElement): void {

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(mapEl, 'mousedown', (e) => {
      e.preventDefault();
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.onMapReady.emit({
        value: this.map
      });
    });

    google.maps.event.addListenerOnce(this.map, 'center_changed', () => {
      this.onCenterChanged.emit({
        value: this.map
      });
    });

    google.maps.event.addListener(this.map, 'idle', () => {
      this.onMapIdle.emit({
        value: this.map
      });
    });

    google.maps.event.addListener(this.map, 'dragstart', () => {
      this.onDragStart.emit({
        value: this.map
      });
    });
  }
}
