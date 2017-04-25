//import { DataService } from '../providers/data/data.service';
//import { UtilityComponent } from './utilityComponent';

export class ModelPage {
  selectedItem: any;
  refresher: any;
  data = [];
  pageNum: number = 1;
  hasMore: boolean = false;
  color: string = '';

  title: string;
  viewStatus = ViewStatusEnum;
  status: any;
  
  displayMode = DisplayModeEnum;
  display: any;
  online: boolean = false;


  constructor(
  	private ttl: string
  ) {
    this.doReset(ttl);
    this.status = ViewStatusEnum.Loading;
    this.display = DisplayModeEnum.Card;
  }

  doChangeTitle(ttl: string) {
    this.title = ttl;
  }

  doReset(ttl: string) {
    this.title = ttl;
    this.data = [];
    this.status = ViewStatusEnum.Loading;
    this.doToggleLoading(true);
  }

  doToggleLoading(l: boolean) {

  }

  doChangeView(st: ViewStatusEnum) {
    //this.status = st;
    setTimeout( () => this.status = st, 0);
  }

  doChangeViewState(st: boolean) {
    if (st)
      this.doChangeView(ViewStatusEnum.Full);
    else
      this.doChangeView(ViewStatusEnum.Empty);
  }

  doChangeDisplayMode(mode: DisplayModeEnum) {
    this.display = mode;
  }
}

export enum DisplayModeEnum {
  Card = 0,
  Grid = 1,
  List = 2,
  Map = 3
}

// status of the view
export enum ViewStatusEnum {
  Loading = 0,
  Full = 1,
  Empty = 2
}
