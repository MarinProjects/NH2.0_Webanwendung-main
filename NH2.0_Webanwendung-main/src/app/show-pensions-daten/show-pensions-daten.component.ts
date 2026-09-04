import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from '../create-user/person.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-show-pensions-daten',
  templateUrl: './show-pensions-daten.component.html',
  styleUrls: ['./show-pensions-daten.component.css']
})
export class ShowPensionsDatenComponent implements OnInit {

  editMode: boolean = false;

  pensionsDaten: any = {
    ratierlicherAnspruch: '',
    prozentsatzTeiluebertragung: '',
    pensionsfaehigesDurchschnittsgehaltVA: '',
    sozVersPflJahresgehaltVA: '',
    ruhegeldfaehigesDurchschnittsgehalt: '',
    durchschnittsgehaltNachSozialplan: '',
    teilzeitgrad: '',
    sozVersFreieJahreAb20: '',
    schwerbehindert: '',
    anzahlKinder: '',
    steuerklasse: '',
    bemerkung: ''
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
    this.fetchPensionsDaten();
  }


  // =====================================================
  // PENSIONSDATEN LADEN
  // ADMIN + READONLY
  // =====================================================

  fetchPensionsDaten(): void {

    const personId =
      this.route.snapshot.params['id'];

    const pensionsDatenId =
      this.route.snapshot.params['pensionsDatenId'];


    this.personService
      .getPensionsDaten(
        personId,
        pensionsDatenId
      )
      .subscribe({

        next: (data: any) => {

          this.pensionsDaten =
            data;

        },

        error: (error: any) => {

          console.error(
            'Error fetching pensionsdaten:',
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

    const pensionsDatenId =
      this.route.snapshot.params['pensionsDatenId'];


    this.personService
      .updatePensionsDaten(
        personId,
        pensionsDatenId,
        this.pensionsDaten
      )
      .subscribe({

        next: (
          updatedPensionsDaten: any
        ) => {

          this.pensionsDaten =
            updatedPensionsDaten;

          this.editMode =
            false;

          this.fetchPensionsDaten();

        },

        error: (error: any) => {

          console.error(
            'Error updating pensionsDaten:',
            error
          );

        }

      });

  }


  // =====================================================
  // PENSIONSDATEN LÖSCHEN
  // NUR ADMIN
  // =====================================================

  deletePensionsDaten(): void {

    if (!this.isAdmin) {
      return;
    }


    const personId =
      this.route.snapshot.params['id'];

    const pensionsDatenId =
      this.route.snapshot.params['pensionsDatenId'];


    const sicher =
      confirm(
        'Sollen diese Pensionsdaten wirklich gelöscht werden?'
      );

    if (!sicher) {
      return;
    }


    this.personService
      .deletePensionsDaten(
        personId,
        pensionsDatenId
      )
      .subscribe({

        next: () => {

          console.log(
            'PensionsDaten deleted successfully'
          );

          alert(
            'PensionsDaten gelöscht'
          );

          this.router.navigate([
            '/person',
            personId
          ]);

        },

        error: (error: any) => {

          console.error(
            'Error deleting PensionsDaten:',
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