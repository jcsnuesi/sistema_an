import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesEntrantesComponent } from './solicitudes-entrantes.component';

describe('SolicitudesEntrantesComponent', () => {
  let component: SolicitudesEntrantesComponent;
  let fixture: ComponentFixture<SolicitudesEntrantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesEntrantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesEntrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
