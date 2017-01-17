import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Observable, Observer } from 'rxjs/Rx';
import 'rxjs/Rx';

// import { SpeechRecognition } from 'SpeechRecognition';
//declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

@Injectable() 
export class SpeechService {
  recognizing: boolean = false;
  ready: boolean = false;
  recognition: any;
  //recognizedText: string = "";
  private resultObservable:Observable<any>;
  private resultObserver:Observer<any>;

  constructor(public dataService: DataService
  ) {
    this.resultObservable = Observable.create((observer:Observer<any>) => {
      this.resultObserver = observer;
    }).share();
  }

  // this goes into the app.cmp platform ready
  init() {
    this.recognition = new SpeechRecognition();
    //this.recognition.continuous = true;
    this.recognition.lang = 'pt-BR'; //en-US
    
    this.recognition.onnomatch = (event => {
      console.log('No match found.');
    });
    
    this.recognition.onerror = (event => {
      console.log(event);
    });
    
    this.recognition.onresult = (event => {
      if (event.results.length > 0) {
        let txt = event.results[0][0].transcript;
        this.notifyResult(txt);
        //console.log('Output STT: ', txt);
      }
    });
    this.recognition.onend = this.reset;
  }

  reset() {
    this.recognizing = false;
    //button.innerHTML = "Click to Speak";
  }

  notifyResult(txt:any) {
    this.resultObserver.next(txt);
  }

  onResultText(callback:(txt:any) => void) {
    this.resultObservable.subscribe(callback);
  }

  start() {
    this.recognizing = true;
    this.recognition.start();
    // button.innerHTML = "Click to Stop";
  }

  stop() {
    this.recognition.stop();
    this.reset();
  }

  toggleStartStop() {
    if(this.recognizing) {
      this.stop();
    } else {
      this.start();
    }
  }
}