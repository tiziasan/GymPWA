import {TestBed} from '@angular/core/testing';

import {FavoriteService} from './favorite.service';

describe('FavoriteService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service = TestBed.inject(FavoriteService);
    expect(service).toBeTruthy();
  });

});
