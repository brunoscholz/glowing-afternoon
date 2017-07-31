/**
 * Simple data class, keeps track of when it was created
 * so that it knows when the its gone stale.
 */
export class Data {
  // Data is stale after 5 seconds
  private STALE_MS: number = 300 * 10000;
  private timestamp: any;
  private _clear: boolean = false;
  value: any = null;

  /*constructor(str) {
    this.value = str.substr(0, 1);
    this.suit = str.substr(1, 1).toLowerCase();
    this.rank = CardValues.indexOf(this.value);
    this.wildValue = str.substr(0, 1);
  }*/
  constructor() {
    this.timestamp = new Date().getMilliseconds();
  }

  set<T>(val: T) {
    this._clear = false;
    this.value = val;
    this.timestamp = new Date().getMilliseconds();
  }

  clear() {
    this._clear = true;
  }

  isUpToDate() : boolean {
    return new Date().getMilliseconds() - this.timestamp < this.STALE_MS && !this._clear;
  }
}