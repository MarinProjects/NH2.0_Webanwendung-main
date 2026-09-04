import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from '../create-user/person.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-show-generell-rentenerstberechnungteil2',
  templateUrl: './show-generell-rentenerstberechnungteil2.component.html',
  styleUrls: ['./show-generell-rentenerstberechnungteil2.component.css']
})
export class ShowGenerellRentenerstberechnungteil2Component implements OnInit {

  rentenerstberechnungteil2List: any[] = [];

  personName: string = '';

  personalnummer: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private authService: AuthService
  ) {}


  // =====================================================
  // ROLLENSTEUERUNG
  // =====================================================

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }


  // =====================================================
  // INITIALISIERUNG
  // =====================================================

  ngOnInit(): void {

    this.fetchGenerellRentenerstberechnungteil2();

    this.fetchPersonDetails();

  }


  // =====================================================
  // RENTENERSTBERECHNUNG TEIL 2 LADEN
  // ADMIN + READONLY
  // =====================================================

  fetchGenerellRentenerstberechnungteil2(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.personService
      .getGenerellRentenerstberechnungteil2(personId)
      .subscribe({

        next: (data: any[]) => {

          this.rentenerstberechnungteil2List =
            data;

        },

        error: (error: any) => {

          console.error(
            'Error fetching generell rentenerstberechnungteil2:',
            error
          );

        }

      });

  }


  // =====================================================
  // PERSONENDATEN LADEN
  // ADMIN + READONLY
  // =====================================================

  fetchPersonDetails(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.personService
      .getPersonById(personId)
      .subscribe({

        next: (person: any) => {

          this.personName =
            person.name;

          this.personalnummer =
            person.personalnummer;

        },

        error: (error: any) => {

          console.error(
            'Error fetching person details:',
            error
          );

        }

      });

  }


  // =====================================================
  // DETAILANSICHT ÖFFNEN
  // ADMIN + READONLY
  // =====================================================

  viewRentenerstberechnungteil2Detail(
    rentenerstberechnungteil2Id: string
  ): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      '/person',
      personId,
      'rentenerstberechnungteil2',
      rentenerstberechnungteil2Id
    ]);

  }


  // =====================================================
  // NEUEN DATENSATZ HINZUFÜGEN
  // NUR ADMIN
  // =====================================================

  addingRentenerstberechnungteil2(): void {

    if (!this.isAdmin) {
      return;
    }

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      '/person',
      personId,
      'addrentenerstberechnungteil2'
    ]);

  }


  // =====================================================
  // ZURÜCK ZUM PERSONENSTAMMSATZ
  // ADMIN + READONLY
  // =====================================================

  navigateToPersonDetail(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      '/person',
      personId
    ]);

  }

}
