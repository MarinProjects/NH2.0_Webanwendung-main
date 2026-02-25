import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPersonComponent } from './listperson.component';

describe('ListpersonComponent', () => {
  let component: ListPersonComponent;
  let fixture: ComponentFixture<ListPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPersonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
