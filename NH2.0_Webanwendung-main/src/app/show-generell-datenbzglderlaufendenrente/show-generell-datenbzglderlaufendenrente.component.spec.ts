import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGenerellDatenbzglderlaufendenRenteComponent } from './show-generell-datenbzglderlaufendenrente.component';

describe('ShowGenerellDatenbzglderlaufendenrenteComponent', () => {
  let component: ShowGenerellDatenbzglderlaufendenRenteComponent;
  let fixture: ComponentFixture<ShowGenerellDatenbzglderlaufendenRenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowGenerellDatenbzglderlaufendenRenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowGenerellDatenbzglderlaufendenRenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
