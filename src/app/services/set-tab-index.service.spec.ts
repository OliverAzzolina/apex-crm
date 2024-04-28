import { TestBed } from '@angular/core/testing';

import { SetTabIndexService } from './set-tab-index.service';

describe('SetTabIndexService', () => {
  let service: SetTabIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetTabIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
