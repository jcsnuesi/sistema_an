import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarAspirantesComponent } from './administrar-aspirantes.component';

describe('AdministrarAspirantesComponent', () => {
  let component: AdministrarAspirantesComponent;
  let fixture: ComponentFixture<AdministrarAspirantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarAspirantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarAspirantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
