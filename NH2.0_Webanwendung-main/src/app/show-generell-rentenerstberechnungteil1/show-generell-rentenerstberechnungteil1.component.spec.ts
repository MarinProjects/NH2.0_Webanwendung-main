import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGenerellRentenerstberechnungteil1Component } from './show-generell-rentenerstberechnungteil1.component';

describe('ShowGenerellRentenerstberechnungteil1Component', () => {
  let component: ShowGenerellRentenerstberechnungteil1Component;
  let fixture: ComponentFixture<ShowGenerellRentenerstberechnungteil1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowGenerellRentenerstberechnungteil1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowGenerellRentenerstberechnungteil1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
