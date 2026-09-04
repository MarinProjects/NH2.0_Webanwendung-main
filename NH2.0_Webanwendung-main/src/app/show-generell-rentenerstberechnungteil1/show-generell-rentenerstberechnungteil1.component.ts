import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from '../create-user/person.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-show-generell-rentenerstberechnungteil1',
  templateUrl: './show-generell-rentenerstberechnungteil1.component.html',
  styleUrls: ['./show-generell-rentenerstberechnungteil1.component.css']
})
export class ShowGenerellRentenerstberechnungteil1Component implements OnInit {

  rentenerstberechnungteil1List: any[] = [];

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

    this.fetchGenerellRentenerstberechnungteil1();

    this.fetchPersonDetails();

  }


  // =====================================================
  // RENTENERSTBERECHNUNG TEIL 1 LADEN
  // ADMIN + READONLY
  // =====================================================

  fetchGenerellRentenerstberechnungteil1(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.personService
      .getGenerellRentenerstberechnungteil1(personId)
      .subscribe({

        next: (data: any[]) => {

          this.rentenerstberechnungteil1List =
            data;

        },

        error: (error: any) => {

          console.error(
            'Error fetching generell rentenerstberechnungteil1:',
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

  viewRentenerstberechnungteil1Detail(
    rentenerstberechnungteil1Id: string
  ): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      '/person',
      personId,
      'rentenerstberechnungteil1',
      rentenerstberechnungteil1Id
    ]);

  }


  // =====================================================
  // NEUEN DATENSATZ HINZUFÜGEN
  // NUR ADMIN
  // =====================================================

  addingRentenerstberechnungteil1(): void {

    if (!this.isAdmin) {
      return;
    }

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      '/person',
      personId,
      'addrentenerstberechnungteil1'
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