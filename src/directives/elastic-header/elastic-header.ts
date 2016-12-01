import { Directive, ElementRef, OnInit } from '@angular/core';
import { Subject } from "rxjs/Subject";

@Directive({
  selector: '[elastic-header]'
})
export class ElasticHeader implements OnInit {
  element: any;
  scrollerHandle = null;
  header = null;
  headerHeight = null;
  translateAmt = null;
  scrollTop = null;
  lastScrollTop = null;
  ticking = false;
  scaleAmt = null;

  scrollSubject = new Subject();

  constructor(private el: ElementRef) {
    this.element = el;
    this.scrollSubject = new Subject();
  }

  ngOnInit() {
    var self = this;

    self.scrollSubject.debounceTime(200)
    .subscribe(() => {
      self.updateElasticHeader();
    });

    // this.scrollerHandle = this.element.nativeElement.children[0];
    // this.header = this.scrollerHandle; //document.getElementById("elastic-header");
    this.scrollerHandle = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
    this.header = this.scrollerHandle.children[0];
    console.log(this.header);
    this.headerHeight = this.scrollerHandle.clientHeight;
    this.translateAmt = null;
    this.scrollTop = null;
    this.lastScrollTop = null;
    this.ticking = false;

    this.header.style.webkitTransformOrigin = 'center bottom';

    window.addEventListener('resize', function() {
      self.headerHeight = self.scrollerHandle.clientHeight;
    }, false);

    this.scrollerHandle.addEventListener('scroll', function() {
      self.scrollSubject.next({});
      /*if(self.ticking) {
        window.requestAnimationFrame(function() {
          self.updateElasticHeader();
        });
      }
      self.ticking = true;*/
    });
  }

  updateElasticHeader() {
    this.scrollTop = this.scrollerHandle.scrollTop;

    if(this.scrollTop >= 0) {
      this.translateAmt = this.scrollTop / 2;
      this.scaleAmt = 1;
    } else {
      this.translateAmt = 0;
      this.scaleAmt = -this.scrollTop / this.headerHeight + 1;
    }

    this.header.style.backgroundColor = "#f00";
    this.header.style.webkitTransform = 'translate3d(0, ' + this.translateAmt + 'px,0) scale(' + this.scaleAmt + ',' + this.scaleAmt + ')';
    this.ticking = false;
  }
}