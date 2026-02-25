import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDatenBzglDerLaufendenRenteComponent } from './create-daten-bzgl-der-laufenden-rente.component';

describe('CreateDatenBzglDerLaufendenRenteComponent', () => {
  let component: CreateDatenBzglDerLaufendenRenteComponent;
  let fixture: ComponentFixture<CreateDatenBzglDerLaufendenRenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateDatenBzglDerLaufendenRenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDatenBzglDerLaufendenRenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
