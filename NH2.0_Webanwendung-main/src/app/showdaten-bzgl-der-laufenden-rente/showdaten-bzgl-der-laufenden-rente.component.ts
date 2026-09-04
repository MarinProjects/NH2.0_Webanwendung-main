import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from '../create-user/person.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-showdaten-bzgl-der-laufenden-rente',
  templateUrl: './showdaten-bzgl-der-laufenden-rente.component.html',
  styleUrls: ['./showdaten-bzgl-der-laufenden-rente.component.css']
})
export class ShowdatenBzglDerLaufendenRenteComponent implements OnInit {

  editMode: boolean = false;

  datenBzglDerLaufendenRente: any = {
    gueltigVon: '',
    gueltigBis: '',
    eingabedatum: '',
    gesamtversorgung: '',
    andereAnzurechnendeRente: '',
    andereAnzurechnendeRenteName: '',
    gesetzlicheSVRente: '',
    renteAusBefrLebensvers: '',
    zusatzrente: '',
    zusatzrenteName: '',
    pension: '',
    ausgleich: '',
    betrRente: '',
    bezugsart: '',
    weitereRenteUnterPersNr: '',
    anzahlKinder: '',
    entgeltpunkte: '',
    steuerklasse: '',
    zugangsfaktor: '',
    krankenkassenkennziffer: '',
    beitragFuerKrankenvers: '',
    rentenartfaktor: '',
    teilrentenfaktor: ''
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
    this.fetchDatenBzglDerLaufendenRente();
  }


  // =====================================================
  // DATEN LADEN
  // ADMIN + READONLY
  // =====================================================

  fetchDatenBzglDerLaufendenRente(): void {

    const personId =
      this.route.snapshot.params['id'];

    const datenBzglDerLaufendenRenteId =
      this.route.snapshot.params['datenBzglDerLaufendenRenteId'];


    this.personService
      .getDatenBzglDerLaufendenRente(
        personId,
        datenBzglDerLaufendenRenteId
      )
      .subscribe({

        next: (data: any) => {

          this.datenBzglDerLaufendenRente =
            data;

        },

        error: (error: any) => {

          console.error(
            'Error fetching datenBzglDerLaufendenRente:',
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

    const datenBzglDerLaufendenRenteId =
      this.route.snapshot.params['datenBzglDerLaufendenRenteId'];


    this.personService
      .updateDatenBzglDerLaufendenRente(
        personId,
        datenBzglDerLaufendenRenteId,
        this.datenBzglDerLaufendenRente
      )
      .subscribe({

        next: (
          updatedDatenBzglDerLaufendenRente: any
        ) => {

          this.datenBzglDerLaufendenRente =
            updatedDatenBzglDerLaufendenRente;

          this.editMode =
            false;

          this.fetchDatenBzglDerLaufendenRente();

        },

        error: (error: any) => {

          console.error(
            'Error updating datenBzglDerLaufendenRente:',
            error
          );

        }

      });

  }


  // =====================================================
  // DATENSATZ LÖSCHEN
  // NUR ADMIN
  // =====================================================

  deleteDatenBzglDerLaufendenRente(): void {

    if (!this.isAdmin) {
      return;
    }


    const personId =
      this.route.snapshot.params['id'];

    const datenBzglDerLaufendenRenteId =
      this.route.snapshot.params['datenBzglDerLaufendenRenteId'];


    const sicher =
      confirm(
        'Sollen diese Daten bzgl. der laufenden Rente wirklich gelöscht werden?'
      );

    if (!sicher) {
      return;
    }


    this.personService
      .deleteDatenBzglDerLaufendenRente(
        personId,
        datenBzglDerLaufendenRenteId
      )
      .subscribe({

        next: () => {

          console.log(
            'DatenBzglDerLaufendenRente deleted successfully'
          );

          alert(
            'Daten bzgl. der laufenden Rente gelöscht'
          );

          this.router.navigate([
            '/person',
            personId
          ]);

        },

        error: (error: any) => {

          console.error(
            'Error deleting DatenBzglDerLaufendenRente:',
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