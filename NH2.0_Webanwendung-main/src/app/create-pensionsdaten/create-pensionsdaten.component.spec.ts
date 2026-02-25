import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePensionsdatenComponent } from './create-pensionsdaten.component';

describe('CreatePensionsdatenComponent', () => {
  let component: CreatePensionsdatenComponent;
  let fixture: ComponentFixture<CreatePensionsdatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePensionsdatenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePensionsdatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
