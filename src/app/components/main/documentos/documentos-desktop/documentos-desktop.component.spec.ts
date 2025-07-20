import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosDesktopComponent } from './documentos-desktop.component';

describe('DocumentosDesktopComponent', () => {
  let component: DocumentosDesktopComponent;
  let fixture: ComponentFixture<DocumentosDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentosDesktopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
