import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePensionersComponent } from './active-pensioners.component';

describe('ActivePensionersComponent', () => {
  let component: ActivePensionersComponent;
  let fixture: ComponentFixture<ActivePensionersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivePensionersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivePensionersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
