import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    FooterComponent,
  ],
  entryComponents: [],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    FooterComponent,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule {}
