import {TestBed} from '@angular/core/testing';

import {CourseService} from './course.service';

describe('CourseService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service = TestBed.inject(CourseService);
    expect(service).toBeTruthy();
  });
});
