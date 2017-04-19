import { ComponentFixture, async, TestBed, inject } from '@angular/core/testing';
import { TestUtils }               from '../../test';
import { CategoryPage }          from './category';

import { ProductPage } from '../product/product';
import { DataService } from '../../providers/data/data.service';
import { UtilProvider } from '../../providers/utils/util.provider';
import { ICategory } from '../../providers/data/interfaces';

let fixture: ComponentFixture<CategoryPage> = null;
let instance: any = null;

describe('Pages: Category', () => {
  let dataService: DataService;
  let util: UtilProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService, UtilProvider]
    });
  });

  beforeEach(inject([DataService], ds => {
    dataService = ds;
  }));

  beforeEach(inject([UtilProvider], u => {
    util = u;
  }));

  beforeEach(async(() => TestUtils.beforeEachCompiler([CategoryPage]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
  })));

  /*it('should get customer details', inject([CustomerService], (customerService) => {
    let customerDetails = customerService.printCustomerDetails(1);
    expect(customerDetails).toBe('Customer purchased: Milk,Soda,Bread');
  }));*/

  it('should create the category page', async(() => {
    expect(instance).toBeTruthy();
  }));

  it('should have service data', () => {
    expect(dataService).toBeDefined();
  });

  it('should have findAll function', () => {
    expect(dataService.findAll).toBeDefined();
  });

  it('should return cats', done => {
    dataService.findAll({
      controller: 'categories',
      query: { parentId: 0 }
    })
      .then((categories: Array<ICategory>) => {
        expect(categories).toBeDefined();
        done();
      })
      .catch((err) => {
        console.log("FUCK");
        console.log(err);
        done();
      });
  });
});