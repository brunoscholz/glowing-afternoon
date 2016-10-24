import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable, Observer, Subject } from 'rxjs/Rx';
import 'rxjs/Rx';

import { MLabService } from './mongolab';

import _ from 'underscore';

import { IProduct, IProductFact, IUser } from '../interfaces'; //ICategory, IReview, IReviewFact, IComment, ISocialFact, IUser, IRelationship, ITransaction, IAction, IDate

@Injectable()
export class DataService {
  
  private _subjects$: any;
  private dataStore: any;

  get customers$() { return this._subjects$.customers.asObservable(); }
  get users$() { return this._subjects$.users.asObservable(); }
  
  get coinFacts$() { return this._subjects$.factCoin.asObservable(); }

  constructor(public mlab: MLabService) {
    this.mlab.Init("category");
    
    this._subjects$ = {
      customers: new Subject(),
      users: <Subject<IUser[]>>new Subject(),
      factCoin: new Subject()
    };
  }

/*
for each row R1 in the build table
    begin
        calculate hash value on R1 join key(s)
        insert R1 into the appropriate hash bucket
    end
for each row R2 in the probe table
    begin
        calculate hash value on R2 join key(s)
        for each row R1 in the corresponding hash bucket
            if R1 joins with R2
                return (R1, R2)
    end
*/

  loadMinimum() {
    // this.findAll({ collectionName: 'dimCategory', sortOrder: { code: 1 } }),
    // this.findAll({ collectionName: 'action' }),
    // this.findAll({ collectionName: 'dimDate' })
  }

  // finds all results of T interface and caches it
  findAll(options: any) {
    if(!options) throw new Error('invalid options');

    this.mlab.listDocuments(options)
      .map((res: Response) => res.json())
      .subscribe(data => {
        this._subjects$[options.collectionName].next(data);
      }, 
      error => console.log('something went wrong'),
      () => console.log('findAll Completed for ' + options.collectionName));
  }

  getProducts(options) {
    var self = this;
    Observable.forkJoin(
      self.mlab.listDocuments(options).map((res: Response) => res.json()),
      self.mlab.listDocuments({ collectionName: 'dimProduct', query: { } }).map((res: Response) => res.json())
    )
    .subscribe(
      data => {
        let products = self.linkProducts(data[0], data[1]);
        self._subjects$['products'].next(products);
      }, 
      error => console.log('something went wrong while getting products'),
      () => console.log('getProducts Completed for products'));
  }

  linkProducts(products: IProductFact[], details: IProduct[]) {
    _.each(products, (value, key) => {
      let detail = _.find(details, function(el) {
        return el._id.$oid === value['productId']['$oid'];
      });

      if(detail)
        _.extend(products[key], {data: detail});
    });

    return products;
  }

  findOne(options: any) {
    if(!options) throw new Error('invalid options');

    this.mlab.viewDocument(options)
      .map((res: Response) => res.json())
      .subscribe(data => {
        let notFound = true;

        this.dataStore[options.collectionName].forEach((item, index) => {
          if (_.isEqual(item._id, data._id)) {
            this.dataStore[options.collectionName][index] = data;
            notFound = false;
          }
        });

        if (notFound) {
          this.dataStore.todos.push(data);
        }

        this._subjects$[options.collectionName].next(this.dataStore[options.collectionName]);
      }, error => console.log('Could not load.'));
        //return this.filterResult(this.dataStore[options.collectionName], options.query);
  }

  count(col: string) {
    let options = {
      collectionName: col,
      resultCount: 'true'
    };
    this.mlab.listDocuments(options)
      .map(res => res.json())
      .subscribe(num => {
        console.log(num);
      });
  }

  cacheResults(list, cb) {
    var self = this;

    Observable.forkJoin(
      list.forEach(function(elem) {
        self.findAll(elem)
      })
    )
    .subscribe(res => {
      cb();
    });
  }

  /// <summary>
  /// insert function
  /// <param name="options">IQueryOptions Object</param>
  /// <description>
  /// options.collectionName: name of the collection
  /// options.documents: list of obj to insert
  /// [, options.database]
  /// </description>
  /// </summary>
  insert(options) {
    this.mlab.insertDocuments(options)
      .map(res => res.json())
      .subscribe(data => {
        this.dataStore[options.collectionName].push(data);
        this._subjects$[options.collectionName].next(this.dataStore[options.collectionName]);
      }, error => console.log('Could not create.'));
  }

  update(options) {
    return this.mlab.updateDocuments(options);
  }

  insertTransaction(args) {
    
  }

  /*private findObservable<T>(list: T[], query: any) : Observable<T> {
    return this.createObservable(this.filterResult<T>(list, query));
  }

  private findAllObservable<T>(list: T[], query: any) : Observable<T[]> {
    return this.createObservable(this.filterResults<T>(list, query));
  }*/

  //private filterResults(list) : ICategory[] {}

  public filterResult<T>(list: T[], query: any) : T {
    if(query == {} || query == null) {
      return null;
    }

    let res = _.filter(list, function(value) {
      for (var key in query) {
        if(query[key] === value[key] || (_.isObject(query[key]) && _.isEqual(query[key], value[key])))
          return true;
      }
      return false;
    });
    return (res.length) ? res[0] : null;
  }

  public filterResults<T>(list: T[], query: any) : T[] {
    if(query == {} || query == null) {
      return list;
    }

    let res = _.filter(list, function(value) {
      for (var key in query) {
        if(query[key] === value[key] || (_.isObject(query[key]) && _.isEqual(query[key], value[key])))
          return true;
      }
      return false;
    });
    //whereDeep(list, query, false);
    //let res = _.where(list, query);
    return (res.length) ? res : null;
  }

  /*filterDeep(value) {
    for (var key in query) {
      if(query[key] === value[key] || (_.isObject(query[key]) && _.isEqual(query[key], value[key])))
        return true;
    }
    return false;
  }*/

  createObservable(data: any) : Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next(data);
      observer.complete();
    });
  }

  handleResponse(status) {
    if(status < 200 || status >= 300) {
      throw new Error('This request has failed ' + status);
    } 
    // If everything went fine, return the response
    else {
      return 'success';
    }
  }
}
