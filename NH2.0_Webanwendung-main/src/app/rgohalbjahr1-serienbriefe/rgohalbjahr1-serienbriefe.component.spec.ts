import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RGOHalbjahr1SerienbriefeComponent } from './rgohalbjahr1-serienbriefe.component';

describe('RGOHalbjahr1SerienbriefeComponent', () => {
  let component: RGOHalbjahr1SerienbriefeComponent;
  let fixture: ComponentFixture<RGOHalbjahr1SerienbriefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RGOHalbjahr1SerienbriefeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RGOHalbjahr1SerienbriefeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
