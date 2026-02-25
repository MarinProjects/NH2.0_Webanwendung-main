import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPersonaldatenComponent } from './show-personaldaten.component';

describe('ShowPersonaldatenComponent', () => {
  let component: ShowPersonaldatenComponent;
  let fixture: ComponentFixture<ShowPersonaldatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowPersonaldatenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowPersonaldatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
