import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaLoginComponent } from './consulta-login.component';

describe('ConsultaLoginComponent', () => {
  let component: ConsultaLoginComponent;
  let fixture: ComponentFixture<ConsultaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
