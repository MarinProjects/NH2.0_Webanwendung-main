import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonaldatenVerstorbenerComponent } from './personaldaten-verstorbener.component';

describe('PersonaldatenVerstorbenerComponent', () => {
  let component: PersonaldatenVerstorbenerComponent;
  let fixture: ComponentFixture<PersonaldatenVerstorbenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonaldatenVerstorbenerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonaldatenVerstorbenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
