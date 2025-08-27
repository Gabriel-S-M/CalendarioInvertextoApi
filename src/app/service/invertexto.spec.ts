import { TestBed } from '@angular/core/testing';

import { Invertexto } from './invertexto';

describe('Invertexto', () => {
  let service: Invertexto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Invertexto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
