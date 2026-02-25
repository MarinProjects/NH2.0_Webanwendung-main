import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowdatenBzglDerLaufendenRenteComponent } from './showdaten-bzgl-der-laufenden-rente.component';

describe('ShowdatenBzglDerLaufendenRenteComponent', () => {
  let component: ShowdatenBzglDerLaufendenRenteComponent;
  let fixture: ComponentFixture<ShowdatenBzglDerLaufendenRenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowdatenBzglDerLaufendenRenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowdatenBzglDerLaufendenRenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
