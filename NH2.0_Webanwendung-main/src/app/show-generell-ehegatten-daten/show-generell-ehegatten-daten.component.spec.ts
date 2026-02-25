import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGenerellEhegattenDatenComponent } from './show-generell-ehegatten-daten.component';

describe('ShowGenerellEhegattenDatenComponent', () => {
  let component: ShowGenerellEhegattenDatenComponent;
  let fixture: ComponentFixture<ShowGenerellEhegattenDatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowGenerellEhegattenDatenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowGenerellEhegattenDatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
