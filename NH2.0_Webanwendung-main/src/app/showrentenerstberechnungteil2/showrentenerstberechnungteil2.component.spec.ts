import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showrentenerstberechnungteil2Component } from './showrentenerstberechnungteil2.component';

describe('Showrentenerstberechnungteil2Component', () => {
  let component: Showrentenerstberechnungteil2Component;
  let fixture: ComponentFixture<Showrentenerstberechnungteil2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Showrentenerstberechnungteil2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Showrentenerstberechnungteil2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
