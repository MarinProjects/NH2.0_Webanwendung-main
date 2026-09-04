import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from '../create-user/person.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-show-personaldaten',
  templateUrl: './show-personaldaten.component.html',
  styleUrls: ['./show-personaldaten.component.css']
})
export class ShowPersonaldatenComponent implements OnInit {

  editMode: boolean = false;

  personaldaten: any = {
    name: '',
    geburtsdatum: '',
    prozentsatz: ''
  };


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
    this.fetchPersonalDaten();
  }


  // =====================================================
  // PERSONALDATEN LADEN
  // ADMIN + READONLY
  // =====================================================

  fetchPersonalDaten(): void {

    const personId =
      this.route.snapshot.params['id'];

    const personaldatenId =
      this.route.snapshot.params['personaldatenId'];


    this.personService
      .getPersonalDaten(
        personId,
        personaldatenId
      )
      .subscribe({

        next: (data: any) => {

          this.personaldaten = data;

        },

        error: (error: any) => {

          console.error(
            'Error fetching personaldaten:',
            error
          );

        }

      });

  }


  // =====================================================
  // BEARBEITUNGSMODUS
  // NUR ADMIN
  // =====================================================

  toggleEditMode(): void {

    if (!this.isAdmin) {
      return;
    }

    this.editMode = !this.editMode;

  }


  // =====================================================
  // ÄNDERUNGEN SPEICHERN
  // NUR ADMIN
  // =====================================================

  saveChanges(): void {

    if (!this.isAdmin) {
      return;
    }


    const personId =
      this.route.snapshot.params['id'];

    const personaldatenId =
      this.route.snapshot.params['personaldatenId'];


    this.personService
      .updatePersonalDaten(
        personId,
        personaldatenId,
        this.personaldaten
      )
      .subscribe({

        next: (updatedPersonalDaten: any) => {

          this.personaldaten =
            updatedPersonalDaten;

          this.editMode =
            false;

          this.fetchPersonalDaten();

        },

        error: (error: any) => {

          console.error(
            'Error updating personaldaten:',
            error
          );

        }

      });

  }


  // =====================================================
  // PERSONALDATEN LÖSCHEN
  // NUR ADMIN
  // =====================================================

  deletePersonaldatenZumVerbliebenenAngehoerigen(): void {

    if (!this.isAdmin) {
      return;
    }


    const personId =
      this.route.snapshot.params['id'];

    const personaldatenId =
      this.route.snapshot.params['personaldatenId'];


    const sicher = confirm(
      'Sollen diese Personaldaten zum verbliebenen Angehörigen wirklich gelöscht werden?'
    );

    if (!sicher) {
      return;
    }


    this.personService
      .deletePersonaldatenZumVerbliebenenAngehoerigen(
        personId,
        personaldatenId
      )
      .subscribe({

        next: () => {

          console.log(
            'Personaldaten zum verbliebenen Angehörigen deleted successfully'
          );

          alert(
            'Personaldaten zum verbliebenen Angehörigen gelöscht'
          );

          this.router.navigate([
            '/person',
            personId
          ]);

        },

        error: (error: any) => {

          console.error(
            'Error deleting Personaldaten zum verbliebenen Angehörigen:',
            error
          );

        }

      });

  }


  // =====================================================
  // ZURÜCK ZUM STAMMDATENBEREICH
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