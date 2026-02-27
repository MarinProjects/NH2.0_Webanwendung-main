import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnpassungRGOHalbjahr2Component } from './anpassung-rgohalbjahr2.component';

describe('AnpassungRGOHalbjahr2Component', () => {
  let component: AnpassungRGOHalbjahr2Component;
  let fixture: ComponentFixture<AnpassungRGOHalbjahr2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnpassungRGOHalbjahr2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnpassungRGOHalbjahr2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
