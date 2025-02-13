import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesCompraComponent } from './solicitacoes-compra.component';

describe('SolicitacoesCompraComponent', () => {
  let component: SolicitacoesCompraComponent;
  let fixture: ComponentFixture<SolicitacoesCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitacoesCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
