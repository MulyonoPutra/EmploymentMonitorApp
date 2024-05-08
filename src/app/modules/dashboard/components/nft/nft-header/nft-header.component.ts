import { Component, OnInit } from '@angular/core';

import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { ButtonModule } from 'primeng/button';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
	selector: 'app-nft-header',
	templateUrl: './nft-header.component.html',
	standalone: true,
	imports: [ButtonComponent, ButtonModule],
	providers: [ToastService],
})
export class NftHeaderComponent implements OnInit {
	isLoading = false;
	constructor(private readonly toastService: ToastService) {}

	ngOnInit(): void {}

	onClick(): void {}

	load() {
		this.isLoading = true;

		setTimeout(() => {
			this.isLoading = false;
			this.toastService.showSuccess('Success!', 'logged in successfully');
		}, 2000);
	}
}
