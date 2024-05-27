import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { AuthInterceptor } from './app/core/interceptor/auth.interceptor';
import { MessageService } from 'primeng/api';
import { ToastService } from './app/shared/services/toast.service';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
	if (window) {
		selfXSSWarning();
	}
}

bootstrapApplication(AppComponent, {
	providers: [
		MessageService,
    ToastService,
		provideAnimations(),
		importProvidersFrom(BrowserModule, AppRoutingModule, BrowserAnimationsModule),
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
		HttpClientModule,
		provideHttpClient(),
	],
}).catch((err) => console.error(err));

function selfXSSWarning() {
	setTimeout(() => {
		console.log(
			'%c** STOP **',
			'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;'
		);
		console.log(
			`\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
			'font-weight:bold; font: 2em Arial; color: #e11d48;'
		);
	});
}
