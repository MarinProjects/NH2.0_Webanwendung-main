import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent } from './show-detail-personaldatenzumverbliebenenangehoerigen.component';

describe('ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent', () => {
  let component: ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent;
  let fixture: ComponentFixture<ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
