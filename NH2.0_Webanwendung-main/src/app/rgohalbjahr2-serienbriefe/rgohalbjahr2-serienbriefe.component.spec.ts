import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RGOHalbjahr2SerienbriefeComponent } from './rgohalbjahr2-serienbriefe.component';

describe('RGOHalbjahr2SerienbriefeComponent', () => {
  let component: RGOHalbjahr2SerienbriefeComponent;
  let fixture: ComponentFixture<RGOHalbjahr2SerienbriefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RGOHalbjahr2SerienbriefeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RGOHalbjahr2SerienbriefeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
