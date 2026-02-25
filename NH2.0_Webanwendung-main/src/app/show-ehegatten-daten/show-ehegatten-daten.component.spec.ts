import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEhegattenDatenComponent } from './show-ehegatten-daten.component';

describe('ShowEhegattenDatenComponent', () => {
  let component: ShowEhegattenDatenComponent;
  let fixture: ComponentFixture<ShowEhegattenDatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowEhegattenDatenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowEhegattenDatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
