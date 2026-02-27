import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnpassungRGOHalbjahr1Component } from './anpassung-rgohalbjahr1.component';

describe('AnpassungRGOHalbjahr1Component', () => {
  let component: AnpassungRGOHalbjahr1Component;
  let fixture: ComponentFixture<AnpassungRGOHalbjahr1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnpassungRGOHalbjahr1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnpassungRGOHalbjahr1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
