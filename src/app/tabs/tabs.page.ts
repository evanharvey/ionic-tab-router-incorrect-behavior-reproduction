import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private route: Router,
    private router: ActivatedRoute
  ) {}

  handleCheck(ev, tab) {
    ev.stopImmediatePropagation()

    setTimeout(() => {
      this.route.navigate(['tabs', this.route.url.split('/')[2]])
      console.log("move", ['tabs', this.route.url.split('/')[2]])
    
      setTimeout(() => {
        this.route.navigate(['tabs', tab])
        console.log("move", ['tabs', tab])
      }, 50)
    }, 50)
  }

}
