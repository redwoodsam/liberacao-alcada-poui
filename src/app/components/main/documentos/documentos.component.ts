import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss'
})
export class DocumentosComponent {

  isMobile: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]) 
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

}
