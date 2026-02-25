import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGenerellPensionsDatenComponent } from './show-generell-pensions-daten.component';

describe('ShowGenerellPensionsDatenComponent', () => {
  let component: ShowGenerellPensionsDatenComponent;
  let fixture: ComponentFixture<ShowGenerellPensionsDatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowGenerellPensionsDatenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowGenerellPensionsDatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
