import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolveniusComponent } from './solvenius.component';

describe('SolveniusComponent', () => {
  let component: SolveniusComponent;
  let fixture: ComponentFixture<SolveniusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolveniusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolveniusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
