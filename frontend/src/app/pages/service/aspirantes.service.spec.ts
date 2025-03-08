import { TestBed } from '@angular/core/testing';

import { AspirantesService } from './aspirantes.service';

describe('AspirantesService', () => {
  let service: AspirantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AspirantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
