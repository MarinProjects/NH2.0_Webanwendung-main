import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateUserComponent } from './create-user/create-user.component';
import { ShowPersonDetailComponent } from './show-person-detail/show-person-detail.component';
import { ListPersonComponent } from './listperson/listperson.component';

import { ShowPensionsDatenComponent } from './show-pensions-daten/show-pensions-daten.component';
import { ShowEhegattenDatenComponent } from './show-ehegatten-daten/show-ehegatten-daten.component';

import { ShowGenerellRentenerstberechnungteil2Component }
  from './show-generell-rentenerstberechnungteil2/show-generell-rentenerstberechnungteil2.component';

import { Showrentenerstberechnungteil1Component }
  from './showrentenerstberechnungteil1/showrentenerstberechnungteil1.component';

import { Showrentenerstberechnungteil2Component }
  from './showrentenerstberechnungteil2/showrentenerstberechnungteil2.component';

import { ShowdatenBzglDerLaufendenRenteComponent }
  from './showdaten-bzgl-der-laufenden-rente/showdaten-bzgl-der-laufenden-rente.component';

import { ShowGenerellPensionsDatenComponent }
  from './show-generell-pensions-daten/show-generell-pensions-daten.component';

import { ShowPersonaldatenComponent }
  from './show-personaldaten/show-personaldaten.component';

import { ShowGenerellEhegattenDatenComponent }
  from './show-generell-ehegatten-daten/show-generell-ehegatten-daten.component';

import { ShowGenerellRentenerstberechnungteil1Component }
  from './show-generell-rentenerstberechnungteil1/show-generell-rentenerstberechnungteil1.component';

import { ShowGenerellDatenbzglderlaufendenRenteComponent }
  from './show-generell-datenbzglderlaufendenrente/show-generell-datenbzglderlaufendenrente.component';

import { ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent }
  from './show-generell-personaldatenzumverbliebenenangehoerigen/show-generell-personaldatenzumverbliebenenangehoerigen.component';

import { CreatePensionsdatenComponent }
  from './create-pensionsdaten/create-pensionsdaten.component';

import { CreateRentenErstberechnungTeil1Component }
  from './create-rentenerstberechnungteil1/create-rentenerstberechnungteil1.component';

import { CreateRentenErstberechnungTeil2Component }
  from './create-rentenerstberechnungteil2/create-rentenerstberechnungteil2.component';

import { CreateDatenBzglDerLaufendenRenteComponent }
  from './create-daten-bzgl-der-laufenden-rente/create-daten-bzgl-der-laufenden-rente.component';

import { CreateEhegattenDatenComponent }
  from './create-ehegatten-daten/create-ehegatten-daten.component';

import { CreatePersonaldatenzumverbliebenenangehoerigenComponent }
  from './create-personaldatenzumverbliebenenangehoerigen/create-personaldatenzumverbliebenenangehoerigen.component';

import { AnpassungPensionsverordnungComponent }
  from './anpassung-pensionsverordnung/anpassung-pensionsverordnung.component';

import { AnpassungRGOHalbjahr1Component }
  from './anpassung-rgohalbjahr1/anpassung-rgohalbjahr1.component';

import { RGOHalbjahr1SerienbriefeComponent }
  from './rgohalbjahr1-serienbriefe/rgohalbjahr1-serienbriefe.component';

import { AnpassungRGOHalbjahr2Component }
  from './anpassung-rgohalbjahr2/anpassung-rgohalbjahr2.component';

import { RGOHalbjahr2SerienbriefeComponent }
  from './rgohalbjahr2-serienbriefe/rgohalbjahr2-serienbriefe.component';

import { SolveniusComponent }
  from './solvenius/solvenius.component';

import { ActivePensionersComponent }
  from './active-pensioners/active-pensioners.component';

import { PersonaldatenVerstorbenerComponent }
  from './personaldaten-verstorbener/personaldaten-verstorbener.component';

import { LoginComponent }
  from './login/login.component';

import { AuthGuard }
  from './auth/auth.guard';

import { AdminGuard }
  from './auth/admin.guard';


const routes: Routes = [

  // =====================================================
  // LOGIN - OHNE ANMELDUNG ERREICHBAR
  // =====================================================

  {
    path: 'login',
    component: LoginComponent
  },


  // =====================================================
  // PERSONENÜBERSICHT
  // ADMIN + READONLY
  // =====================================================

  {
    path: 'list-person',
    component: ListPersonComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'active-pensioners',
    component: ActivePensionersComponent,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // PERSON ANZEIGEN
  // ADMIN + READONLY
  // =====================================================

  {
    path: 'person/:id',
    component: ShowPersonDetailComponent,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // PERSON ANLEGEN
  // NUR ADMIN
  // =====================================================

  {
    path: 'createperson',
    component: CreateUserComponent,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // ANPASSUNGEN / SERIENBRIEFE
  // NUR ADMIN
  // =====================================================

  {
    path: 'PVAnpassung',
    component: AnpassungPensionsverordnungComponent,
    canActivate: [AdminGuard]
  },

  {
    path: 'RGOHalbjahr1',
    component: AnpassungRGOHalbjahr1Component,
    canActivate: [AdminGuard]
  },

  {
    path: 'rgo-halbjahr1-serienbriefe',
    component: RGOHalbjahr1SerienbriefeComponent,
    canActivate: [AdminGuard]
  },

  {
    path: 'rgo-halbjahr2',
    component: AnpassungRGOHalbjahr2Component,
    canActivate: [AdminGuard]
  },

  {
    path: 'rgo-halbjahr2-serienbriefe',
    component: RGOHalbjahr2SerienbriefeComponent,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // EHEGATTENDATEN ANZEIGEN
  // ADMIN + READONLY
  // =====================================================

  {
    path: 'person/:id/ehegattenDaten/:ehegattenDatenId',
    component: ShowEhegattenDatenComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'person/:id/ehegattenDaten',
    component: ShowGenerellEhegattenDatenComponent,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // EHEGATTENDATEN ANLEGEN
  // NUR ADMIN
  // =====================================================

  {
    path: 'person/:id/addehegattenDaten',
    component: CreateEhegattenDatenComponent,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // RENTENERSTBERECHNUNG TEIL 1 ANZEIGEN
  // ADMIN + READONLY
  // =====================================================

  {
    path: 'person/:id/rentenerstberechnungteil1/:rentenErstberechnungTeil1DatenId',
    component: Showrentenerstberechnungteil1Component,
    canActivate: [AuthGuard]
  },

  {
    path: 'person/:id/rentenerstberechnungteil1',
    component: ShowGenerellRentenerstberechnungteil1Component,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // RENTENERSTBERECHNUNG TEIL 1 ANLEGEN
  // NUR ADMIN
  // =====================================================

  {
    path: 'person/:id/addrentenerstberechnungteil1',
    component: CreateRentenErstberechnungTeil1Component,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // RENTENERSTBERECHNUNG TEIL 2 ANZEIGEN
  // ADMIN + READONLY
  // =====================================================

  {
    path: 'person/:id/rentenerstberechnungteil2/:rentenErstberechnungTeil2DatenId',
    component: Showrentenerstberechnungteil2Component,
    canActivate: [AuthGuard]
  },

  {
    path: 'person/:id/rentenerstberechnungteil2',
    component: ShowGenerellRentenerstberechnungteil2Component,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // RENTENERSTBERECHNUNG TEIL 2 ANLEGEN
  // NUR ADMIN
  // =====================================================

  {
    path: 'person/:id/addrentenerstberechnungteil2',
    component: CreateRentenErstberechnungTeil2Component,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // LAUFENDE RENTE ANZEIGEN
  // ADMIN + READONLY
  // =====================================================

  {
    path: 'person/:id/datenbzglderlaufendenrente/:datenBzglDerLaufendenRenteId',
    component: ShowdatenBzglDerLaufendenRenteComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'person/:id/datenbzglderlaufendenrente',
    component: ShowGenerellDatenbzglderlaufendenRenteComponent,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // LAUFENDE RENTE ANLEGEN
  // NUR ADMIN
  // =====================================================

  {
    path: 'person/:id/adddatenbzglderlaufendenrente',
    component: CreateDatenBzglDerLaufendenRenteComponent,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // VERBLIEBENE ANGEHÖRIGE ANZEIGEN
  // ADMIN + READONLY
  // =====================================================

  {
    path: 'person/:id/personaldatenzumverbliebenenangehoerigen/:personaldatenId',
    component: ShowPersonaldatenComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'person/:id/personaldatenzumverbliebenenangehoerigen',
    component: ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // VERBLIEBENE ANGEHÖRIGE ANLEGEN
  // NUR ADMIN
  // =====================================================

  {
    path: 'person/:id/addpersonaldatenzumverbliebenenangehoerigen',
    component: CreatePersonaldatenzumverbliebenenangehoerigenComponent,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // PENSIONSDATEN ANZEIGEN
  // ADMIN + READONLY
  // =====================================================

  {
    path: 'person/:id/pensionsDaten',
    component: ShowGenerellPensionsDatenComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'person/:id/pensionsDaten/:pensionsDatenId',
    component: ShowPensionsDatenComponent,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // PENSIONSDATEN ANLEGEN
  // NUR ADMIN
  // =====================================================

  {
    path: 'person/:id/addpensionsDaten',
    component: CreatePensionsdatenComponent,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // DATEN VERSTORBENER
  // ANZEIGEN -> ADMIN + READONLY
  // =====================================================

  {
    path: 'person/:id/personaldatenverstorbener',
    component: PersonaldatenVerstorbenerComponent,
    canActivate: [AuthGuard]
  },


  // =====================================================
  // SOLVENIUS
  // NUR ADMIN
  // =====================================================

  {
    path: 'solvenius',
    component: SolveniusComponent,
    canActivate: [AdminGuard]
  },


  // =====================================================
  // STANDARDWEG
  // =====================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }