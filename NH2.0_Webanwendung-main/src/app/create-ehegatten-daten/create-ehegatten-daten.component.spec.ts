import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEhegattenDatenComponent } from './create-ehegatten-daten.component';

describe('CreateEhegattenDatenComponent', () => {
  let component: CreateEhegattenDatenComponent;
  let fixture: ComponentFixture<CreateEhegattenDatenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEhegattenDatenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEhegattenDatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
