import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AspirantesComponent } from './aspirantes.component';

describe('AspirantesComponent', () => {
  let component: AspirantesComponent;
  let fixture: ComponentFixture<AspirantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspirantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AspirantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
