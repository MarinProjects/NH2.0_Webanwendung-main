import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { ShowPersonDetailComponent } from './show-person-detail/show-person-detail.component';
import { ListPersonComponent } from './listperson/listperson.component';
import { ShowPensionsDatenComponent } from './show-pensions-daten/show-pensions-daten.component';
import { ShowEhegattenDatenComponent } from './show-ehegatten-daten/show-ehegatten-daten.component';
import { ShowGenerellRentenerstberechnungteil2Component } from './show-generell-rentenerstberechnungteil2/show-generell-rentenerstberechnungteil2.component';
import { Showrentenerstberechnungteil1Component} from './showrentenerstberechnungteil1/showrentenerstberechnungteil1.component';
import { Showrentenerstberechnungteil2Component } from './showrentenerstberechnungteil2/showrentenerstberechnungteil2.component';
import { ShowdatenBzglDerLaufendenRenteComponent } from './showdaten-bzgl-der-laufenden-rente/showdaten-bzgl-der-laufenden-rente.component';
import { ShowGenerellPensionsDatenComponent } from './show-generell-pensions-daten/show-generell-pensions-daten.component';
import { ShowPersonaldatenComponent } from './show-personaldaten/show-personaldaten.component';
//import { ShowGenerellPensionsDatenComponent } from './show-generell-pensions-daten/show-generell-pensions-daten.component';
import { ShowGenerellEhegattenDatenComponent } from './show-generell-ehegatten-daten/show-generell-ehegatten-daten.component';
import { ShowGenerellRentenerstberechnungteil1Component } from './show-generell-rentenerstberechnungteil1/show-generell-rentenerstberechnungteil1.component';
//import { ShowGenerellDatenbzglderlaufendenRenteComponent } from './show-generell-datenbzglderlaufenden-rente/show-generell-datenbzglderlaufenden-rente.component';
import { ShowGenerellDatenbzglderlaufendenRenteComponent } from './show-generell-datenbzglderlaufendenrente/show-generell-datenbzglderlaufendenrente.component';
import { ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent } from './show-detail-personaldatenzumverbliebenenangehoerigen/show-detail-personaldatenzumverbliebenenangehoerigen.component';
import { ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent } from './show-generell-personaldatenzumverbliebenenangehoerigen/show-generell-personaldatenzumverbliebenenangehoerigen.component';
import { CreatePensionsdatenComponent } from './create-pensionsdaten/create-pensionsdaten.component';
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
const routes: Routes = [
  { path: 'createperson', component: CreateUserComponent },
  { path: 'person/:id', component: ShowPersonDetailComponent },
  { path: 'list-person', component: ListPersonComponent },
  { path: 'PVAnpassung', component: AnpassungPensionsverordnungComponent },
  { path: 'RGOHalbjahr1', component: AnpassungRGOHalbjahr1Component },
  { path: 'rgo-halbjahr1-serienbriefe', component: RGOHalbjahr1SerienbriefeComponent },
  { path: 'rgo-halbjahr2', component: AnpassungRGOHalbjahr2Component },
  { path: 'rgo-halbjahr2-serienbriefe', component: RGOHalbjahr2SerienbriefeComponent },

  
  


  { path: 'person/:id/ehegattenDaten/:ehegattenDatenId', component: ShowEhegattenDatenComponent },
  { path: 'person/:id/ehegattenDaten', component: ShowGenerellEhegattenDatenComponent},
  { path: 'person/:id/addehegattenDaten', component: CreateEhegattenDatenComponent},

  { path: 'person/:id/rentenerstberechnungteil1/:rentenErstberechnungTeil1DatenId', component: Showrentenerstberechnungteil1Component },
  { path: 'person/:id/rentenerstberechnungteil1', component: ShowGenerellRentenerstberechnungteil1Component },
  { path: 'person/:id/addrentenerstberechnungteil1', component: CreateRentenErstberechnungTeil1Component },


  { path: 'person/:id/rentenerstberechnungteil2/:rentenErstberechnungTeil2DatenId', component: Showrentenerstberechnungteil2Component },
  { path: 'person/:id/rentenerstberechnungteil2', component: ShowGenerellRentenerstberechnungteil2Component },
  { path: 'person/:id/addrentenerstberechnungteil2', component: CreateRentenErstberechnungTeil2Component },


  { path: 'person/:id/datenbzglderlaufendenrente/:datenBzglDerLaufendenRenteId', component: ShowdatenBzglDerLaufendenRenteComponent },
  { path: 'person/:id/datenbzglderlaufendenrente', component: ShowGenerellDatenbzglderlaufendenRenteComponent },
  { path: 'person/:id/adddatenbzglderlaufendenrente', component: CreateDatenBzglDerLaufendenRenteComponent },



  { path: 'person/:id/personaldatenzumverbliebenenangehoerigen/:personaldatenId', component: ShowPersonaldatenComponent },
  { path: 'person/:id/personaldatenzumverbliebenenangehoerigen', component: ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent },
  { path: 'person/:id/addpersonaldatenzumverbliebenenangehoerigen', component: CreatePersonaldatenzumverbliebenenangehoerigenComponent },


  { path: 'person/:id/pensionsDaten', component: ShowGenerellPensionsDatenComponent },
  { path: 'person/:id/pensionsDaten/:pensionsDatenId', component: ShowPensionsDatenComponent },
  { path: 'person/:id/addpensionsDaten', component: CreatePensionsdatenComponent },

  { path: 'solvenius', component: SolveniusComponent },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
