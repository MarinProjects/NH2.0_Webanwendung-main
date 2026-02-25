import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent } from './show-generell-personaldatenzumverbliebenenangehoerigen.component';

describe('ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent', () => {
  let component: ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent;
  let fixture: ComponentFixture<ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
