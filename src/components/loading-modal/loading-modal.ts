import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from "../../providers/utils/loading.service";

@Component({
  selector: 'loading-modal',
  templateUrl: 'loading-modal.html'

})
export class LoadingModal implements OnInit, OnDestroy { 
	isBusy = false;
	private subscription: any;

  constructor (public el: ElementRef, public loadingService: LoadingService) {}

  showOrHideLoadingIndicator(loading) {
    this.isBusy = loading;
    if (this.isBusy) this.playLoadingAnimation();
    //else cancel the animation?
  }

  playLoadingAnimation() {
    //this will be your implementation to start the loading animation
  }

  ngOnInit() {
    this.subscription = this.loadingService.loading$
    	.subscribe(loading => this.showOrHideLoadingIndicator(loading));
  }

  ngOnDestroy() {         
    this.subscription.unsubscribe();
  }
}
