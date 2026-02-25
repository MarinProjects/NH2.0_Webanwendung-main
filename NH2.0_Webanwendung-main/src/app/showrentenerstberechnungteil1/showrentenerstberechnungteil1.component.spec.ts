import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showrentenerstberechnungteil1Component } from './showrentenerstberechnungteil1.component';

describe('Showrentenerstberechnungteil1Component', () => {
  let component: Showrentenerstberechnungteil1Component;
  let fixture: ComponentFixture<Showrentenerstberechnungteil1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Showrentenerstberechnungteil1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Showrentenerstberechnungteil1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
