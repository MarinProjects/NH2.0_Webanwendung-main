import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRentenErstberechnungTeil2Component } from './create-rentenerstberechnungteil2.component';

describe('CreateRentenerstberechnungteil2Component', () => {
  let component: CreateRentenErstberechnungTeil2Component;
  let fixture: ComponentFixture<CreateRentenErstberechnungTeil2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRentenErstberechnungTeil2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRentenErstberechnungTeil2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
