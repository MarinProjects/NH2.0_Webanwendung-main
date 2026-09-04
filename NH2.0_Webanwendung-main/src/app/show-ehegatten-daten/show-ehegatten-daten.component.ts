import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from '../create-user/person.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-show-ehegatten-daten',
  templateUrl: './show-ehegatten-daten.component.html',
  styleUrls: ['./show-ehegatten-daten.component.css']
})
export class ShowEhegattenDatenComponent implements OnInit {

  editMode: boolean = false;

  ehegattenDaten: any = {
    name: '',
    geburtsdatum: '',
    prozentsatzWitwenWitwerrente: ''
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

    this.fetchEhegattenDaten();

  }


  // =====================================================
  // EHEGATTENDATEN LADEN
  // ADMIN + READONLY
  // =====================================================

  fetchEhegattenDaten(): void {

    const personId =
      this.route.snapshot.params['id'];

    const ehegattenDatenId =
      this.route.snapshot.params['ehegattenDatenId'];

    this.personService
      .getEhegattenDaten(
        personId,
        ehegattenDatenId
      )
      .subscribe({

        next: (data: any) => {

          this.ehegattenDaten =
            data;

        },

        error: (error: any) => {

          console.error(
            'Error fetching ehegattenDaten:',
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

    this.editMode =
      !this.editMode;

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

    const ehegattenDatenId =
      this.route.snapshot.params['ehegattenDatenId'];

    this.personService
      .updateEhegattenDaten(
        personId,
        ehegattenDatenId,
        this.ehegattenDaten
      )
      .subscribe({

        next: (
          updatedEhegattenDaten: any
        ) => {

          this.ehegattenDaten =
            updatedEhegattenDaten;

          this.editMode =
            false;

          this.fetchEhegattenDaten();

        },

        error: (error: any) => {

          console.error(
            'Error updating ehegattenDaten:',
            error
          );

        }

      });

  }


  // =====================================================
  // EHEGATTENDATEN LÖSCHEN
  // NUR ADMIN
  // =====================================================

  deleteEhegattenDaten(): void {

    if (!this.isAdmin) {
      return;
    }

    const personId =
      this.route.snapshot.params['id'];

    const ehegattenDatenId =
      this.route.snapshot.params['ehegattenDatenId'];


    const sicher =
      confirm(
        'Sollen diese Ehegattendaten wirklich gelöscht werden?'
      );

    if (!sicher) {
      return;
    }


    this.personService
      .deleteEhegattenDaten(
        personId,
        ehegattenDatenId
      )
      .subscribe({

        next: () => {

          console.log(
            'EhegattenDaten deleted successfully'
          );

          alert(
            'EhegattenDaten gelöscht'
          );

          this.router.navigate([
            '/person',
            personId
          ]);

        },

        error: (error: any) => {

          console.error(
            'Error deleting EhegattenDaten:',
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