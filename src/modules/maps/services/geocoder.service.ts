/**
 * @author    Damien Dell'Amico <damien.dellamico@gmail.com>
 * @copyright Copyright (c) 2016
 * @license   GPL-3.0
 */
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

// Amount of time (in milliseconds) to pause between each trip to the
// Geocoding API, which places limits on frequency.
const QUERY_PAUSE = 500;

@Injectable()
export class GeocoderService {

  geocoder: google.maps.Geocoder = null;

  constructor() {
  }

  public fullAddressForlatLng(lat: number, lng: number): Observable<google.maps.GeocoderResult> {
    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }
    const latlng = new google.maps.LatLng(lat, lng);
    return this.geocode(latlng)
      .debounceTime(QUERY_PAUSE)
      .distinctUntilChanged()
      .map(res => res)
      .retry(3);
  }

  /***
   * Convert coordinates to address
   * @param lat
   * @param lng
   * @returns {Observable}
   */
  public addressForlatLng(lat: number, lng: number): Observable<string> {
    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }
    const latlng = new google.maps.LatLng(lat, lng);
    return this.geocode(latlng)
      .debounceTime(QUERY_PAUSE)
      .distinctUntilChanged()
      .map(res => res.formatted_address)
      .retry(3);
  }

  private geocode(latlng: google.maps.LatLng): Observable<any> {
    return new Observable((sub: any) => {
      this.geocoder.geocode({location: latlng}, (result: google.maps.GeocoderResult[], status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          sub.next(result[0]);
          sub.complete();
        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          sub.error({
            type: 'ZERO',
            message: `Zero results for geocoding location: ${location}`
          });
        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          sub.error({
            type: 'OVER_QUERY_LIMIT',
            message: `OVER_QUERY_LIMIT. location: ${location}`
          });
        } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
          sub.error({
            type: 'DENIED',
            message: `Request denied for geocoding location: ${location}`
          });
        } else {
          sub.error({
            type: 'INVALID',
            message: `Invalid request for geocoding: status: ${status}, location: ${location}`
          });
        }
      });
    });
  }
}