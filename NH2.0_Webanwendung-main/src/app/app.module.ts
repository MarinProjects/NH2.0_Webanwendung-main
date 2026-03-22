import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { FormsModule } from '@angular/forms';
import { ShowPersonDetailComponent } from './show-person-detail/show-person-detail.component';
import { ListPersonComponent } from './listperson/listperson.component';
import { ShowPensionsDatenComponent } from './show-pensions-daten/show-pensions-daten.component';
import { ShowEhegattenDatenComponent } from './show-ehegatten-daten/show-ehegatten-daten.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Showrentenerstberechnungteil1Component } from './showrentenerstberechnungteil1/showrentenerstberechnungteil1.component';
import { Showrentenerstberechnungteil2Component } from './showrentenerstberechnungteil2/showrentenerstberechnungteil2.component';
import { ShowdatenBzglDerLaufendenRenteComponent } from './showdaten-bzgl-der-laufenden-rente/showdaten-bzgl-der-laufenden-rente.component';
import { ShowPersonaldatenComponent } from './show-personaldaten/show-personaldaten.component';
import { ShowGenerellPensionsDatenComponent } from './show-generell-pensions-daten/show-generell-pensions-daten.component';
import { ShowGenerellEhegattenDatenComponent } from './show-generell-ehegatten-daten/show-generell-ehegatten-daten.component';
import { ShowGenerellRentenerstberechnungteil1Component } from './show-generell-rentenerstberechnungteil1/show-generell-rentenerstberechnungteil1.component';
import { ShowGenerellRentenerstberechnungteil2Component } from './show-generell-rentenerstberechnungteil2/show-generell-rentenerstberechnungteil2.component';
import { ShowGenerellDatenbzglderlaufendenRenteComponent } from './show-generell-datenbzglderlaufendenrente/show-generell-datenbzglderlaufendenrente.component';
import { ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent } from './show-generell-personaldatenzumverbliebenenangehoerigen/show-generell-personaldatenzumverbliebenenangehoerigen.component';
import { ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent } from './show-detail-personaldatenzumverbliebenenangehoerigen/show-detail-personaldatenzumverbliebenenangehoerigen.component';
import { CreatePensionsdatenComponent } from './create-pensionsdaten/create-pensionsdaten.component';
//import { CreateRentenerstberechnungteil1Component } from './create-rentenerstberechnungteil1/create-rentenerstberechnungteil1.component';
//import { ShowGenerellDatenbzglderlaufendenRenteComponent } from './show-generell-datenbzglderlaufenden-rente/show-generell-datenbzglderlaufenden-rente.component';
import { CreateRentenErstberechnungTeil1Component } from './create-rentenerstberechnungteil1/create-rentenerstberechnungteil1.component';
import { CreateRentenErstberechnungTeil2Component } from './create-rentenerstberechnungteil2/create-rentenerstberechnungteil2.component';
import { CreateDatenBzglDerLaufendenRenteComponent } from './create-daten-bzgl-der-laufenden-rente/create-daten-bzgl-der-laufenden-rente.component';
import { CreateEhegattenDatenComponent } from './create-ehegatten-daten/create-ehegatten-daten.component';
import { CreatePersonaldatenzumverbliebenenangehoerigenComponent } from './create-personaldatenzumverbliebenenangehoerigen/create-personaldatenzumverbliebenenangehoerigen.component';
import { AnpassungPensionsverordnungComponent } from './anpassung-pensionsverordnung/anpassung-pensionsverordnung.component';
import { AnpassungRGOHalbjahr1Component } from './anpassung-rgohalbjahr1/anpassung-rgohalbjahr1.component';
import { RGOHalbjahr1SerienbriefeComponent } from './rgohalbjahr1-serienbriefe/rgohalbjahr1-serienbriefe.component';
import { AnpassungRGOHalbjahr2Component } from './anpassung-rgohalbjahr2/anpassung-rgohalbjahr2.component';
import { RGOHalbjahr2SerienbriefeComponent } from './rgohalbjahr2-serienbriefe/rgohalbjahr2-serienbriefe.component';
import { SolveniusComponent } from './solvenius/solvenius.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    ShowPersonDetailComponent,
    ListPersonComponent,
    ShowPensionsDatenComponent,
    ShowEhegattenDatenComponent,
    ShowEhegattenDatenComponent,
    Showrentenerstberechnungteil1Component,
    Showrentenerstberechnungteil1Component,
    Showrentenerstberechnungteil2Component,
    ShowdatenBzglDerLaufendenRenteComponent,
    ShowPersonaldatenComponent,
    ShowGenerellPensionsDatenComponent,
    ShowGenerellEhegattenDatenComponent,
    ShowGenerellRentenerstberechnungteil1Component,
    ShowGenerellRentenerstberechnungteil2Component,
    ShowGenerellDatenbzglderlaufendenRenteComponent,
    ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent,
    ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent,
    CreatePensionsdatenComponent,
    CreateRentenErstberechnungTeil1Component,
    CreateRentenErstberechnungTeil2Component,
    CreateDatenBzglDerLaufendenRenteComponent,
    CreateEhegattenDatenComponent,
    CreatePersonaldatenzumverbliebenenangehoerigenComponent,
    AnpassungPensionsverordnungComponent,
    AnpassungRGOHalbjahr1Component,
    RGOHalbjahr1SerienbriefeComponent,
    AnpassungRGOHalbjahr2Component,
    RGOHalbjahr2SerienbriefeComponent,
    SolveniusComponent
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
