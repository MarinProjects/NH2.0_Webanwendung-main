import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnpassungPensionsverordnungComponent } from './anpassung-pensionsverordnung.component';

describe('AnpassungPensionsverordnungComponent', () => {
  let component: AnpassungPensionsverordnungComponent;
  let fixture: ComponentFixture<AnpassungPensionsverordnungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnpassungPensionsverordnungComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnpassungPensionsverordnungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
