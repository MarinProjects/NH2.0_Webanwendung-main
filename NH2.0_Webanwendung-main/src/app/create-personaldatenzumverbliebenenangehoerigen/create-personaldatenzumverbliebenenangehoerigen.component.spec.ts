import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePersonaldatenzumverbliebenenangehoerigenComponent } from './create-personaldatenzumverbliebenenangehoerigen.component';

describe('CreatePersonaldatenzumverbliebenenangehoerigenComponent', () => {
  let component: CreatePersonaldatenzumverbliebenenangehoerigenComponent;
  let fixture: ComponentFixture<CreatePersonaldatenzumverbliebenenangehoerigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePersonaldatenzumverbliebenenangehoerigenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePersonaldatenzumverbliebenenangehoerigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
