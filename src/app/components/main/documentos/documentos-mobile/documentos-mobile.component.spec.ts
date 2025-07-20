import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosMobileComponent } from './documentos-mobile.component';

describe('DocumentosMobileComponent', () => {
  let component: DocumentosMobileComponent;
  let fixture: ComponentFixture<DocumentosMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentosMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
