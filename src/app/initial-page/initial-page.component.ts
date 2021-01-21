import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-initial-page',
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss'],
})
export class InitialPageComponent {

  constructor(
    private router: Router,
  ) {}

  click() {
    this.router.navigate(['tabs']).then();
  }

}
