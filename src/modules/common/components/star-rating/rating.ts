import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingCmp implements OnInit {
  @Input('rate') rate: number;
  _max: number = 5;
  _readOnly: boolean = false;
  _emptyStarIconName: string = 'star-outline';
  _halfStarIconName: string = 'star-half';
  _starIconName: string = 'star';
  _nullable: boolean = false;


  @Input()
  get max() {
    return this._max;
  }
  set max(val: any) {
    this._max = this.getNumberPropertyValue(val);
  }

  @Input()
  get emptyStarIconName() {
    return this._emptyStarIconName;
  }
  set emptyStarIconName(val: any) {
    this._emptyStarIconName = val;
  }

  @Input()
  get halfStarIconName() {
    return this._halfStarIconName;
  }
  set halfStarIconName(val: any) {
    this._halfStarIconName = val;
  }

  @Input()
  get starIconName() {
    return this._starIconName;
  }
  set starIconName(val: any) {
    this._starIconName = val;
  }

  innerValue: any;
  starIndexes: Array<number>;

  @Output('notify') notify: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
    this.starIndexes = Array(this.max).fill(1).map((x, i) => i);
    this.value = this.rate;
  }

  getStarIconName(starIndex: number) {
    if (this.value === undefined) {
      return this.emptyStarIconName;
    }

    if (this.value > starIndex) {

      if (this.value < starIndex + 1) {
        return this.halfStarIconName;

      } else {
        return this.starIconName;
      }

    } else {
      return this.emptyStarIconName;
    }
  }

  get value(): any {
    return this.innerValue;
  }

  set value(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.notify.emit(value);
    }
  }

  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  rateThis(value: number) {
    if (value < 0 || value > this.max) {
      return;
    }

    /*if (value === this.value && this.nullable) {
      value = null;
    }*/

    this.value = value;
  }

  private getNumberPropertyValue(val: any): number {
    if (typeof val === 'string') {
      return parseInt(val.trim());
    }
    return val;
  }
}