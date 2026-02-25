import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRentenErstberechnungTeil1Component } from './create-rentenerstberechnungteil1.component';

describe('CreateRentenerstberechnungteil1Component', () => {
  let component: CreateRentenErstberechnungTeil1Component;
  let fixture: ComponentFixture<CreateRentenErstberechnungTeil1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRentenErstberechnungTeil1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRentenErstberechnungTeil1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
