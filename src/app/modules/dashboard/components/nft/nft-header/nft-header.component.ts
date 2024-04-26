import { Component, OnInit } from '@angular/core';

import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-nft-header',
    templateUrl: './nft-header.component.html',
    standalone: true,
    imports: [
      ButtonComponent,
      ButtonModule
    ],
})
export class NftHeaderComponent implements OnInit {
  isLoading = false;
  constructor() {}

  ngOnInit(): void {}

  onClick(): void {}

  load() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false
    }, 2000);
  }
}
