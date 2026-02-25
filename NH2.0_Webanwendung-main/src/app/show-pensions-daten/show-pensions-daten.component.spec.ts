import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPensionsDatenComponent } from './show-pensions-daten.component';

describe('ShowPensionsDatenComponent', () => {
  let component: ShowPensionsDatenComponent;
  let fixture: ComponentFixture<ShowPensionsDatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowPensionsDatenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowPensionsDatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
