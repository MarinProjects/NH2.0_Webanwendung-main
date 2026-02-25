import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGenerellRentenerstberechnungteil2Component } from './show-generell-rentenerstberechnungteil2.component';

describe('ShowGenerellRentenerstberechnungteil2Component', () => {
  let component: ShowGenerellRentenerstberechnungteil2Component;
  let fixture: ComponentFixture<ShowGenerellRentenerstberechnungteil2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowGenerellRentenerstberechnungteil2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowGenerellRentenerstberechnungteil2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
