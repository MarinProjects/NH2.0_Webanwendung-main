import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from '../create-user/person.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-show-person-detail',
  templateUrl: './show-person-detail.component.html',
  styleUrls: ['./show-person-detail.component.css']
})
export class ShowPersonDetailComponent implements OnInit {

  hasEhegatendaten: boolean = false;
  ehegattenDaten: any[] = [];

  editMode: boolean = false;

  person: any = {
    name: '',
    personalnummer: '',
    aktuelleStatusgruppe: '',
    alteStatusgruppe: '',
    adresse: '',
    geschlecht: '',
    familienstand: '',
    geburtsdatum: '',
    geheiratetAm: '',
    gesellschaft: '',
    versorgungsordnung: '',
    arbVerhRentTr: '',
    unternehmenseintritt: '',
    unternehmensaustritt: '',
    ruhegeldfaehigAb: '',
    rentenbeginn: '',
    zusagedatum: '',
    verstorbenAm: '',
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

    const personId =
      this.route.snapshot.params['id'];

    this.personService
      .getPersonById(personId)
      .subscribe({

        next: (data: any) => {
          this.person = data;
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
  // BEARBEITEN
  // =====================================================

  toggleEditMode(): void {

    if (!this.isAdmin) {
      return;
    }

    this.editMode =
      !this.editMode;
  }


  saveChanges(): void {

    if (!this.isAdmin) {
      return;
    }

    this.personService
      .updatePerson(this.person)
      .subscribe({

        next: (
          updatedPerson: any
        ) => {

          this.person =
            updatedPerson;

          this.editMode =
            false;

        },

        error: (
          error: any
        ) => {

          console.error(
            'Error updating person:',
            error
          );

        }

      });
  }


  // =====================================================
  // PERSON LÖSCHEN
  // =====================================================

  deletePerson(): void {

    if (!this.isAdmin) {
      return;
    }

    const personId =
      this.route.snapshot.params['id'];

    const sicher =
      confirm(
        'Soll dieser Personenstammsatz wirklich gelöscht werden?'
      );

    if (!sicher) {
      return;
    }

    this.personService
      .deletePersonById(personId)
      .subscribe({

        next: () => {

          console.log(
            `Person with ID ${personId} deleted successfully.`
          );

          alert(
            'Person gelöscht'
          );

          this.router.navigate([
            '/list-person'
          ]);

        },

        error: (
          error: any
        ) => {

          console.error(
            'Error deleting person:',
            error
          );

        }

      });
  }


  // =====================================================
  // NAVIGATION
  // ADMIN + READONLY
  // =====================================================

  navigateToShowRentenerstberechnungteil1(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      `/person/${personId}/rentenerstberechnungteil1`
    ]);
  }


  navigateToShowRentenerstberechnungteil2(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      `/person/${personId}/rentenerstberechnungteil2`
    ]);
  }


  navigateToEhegattenDaten(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      `/person/${personId}/ehegattenDaten`
    ]);
  }


  navigateToPensionsDaten(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      `/person/${personId}/pensionsDaten`
    ]);
  }


  navigateToDatenbzglderlaufendenrente(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      `/person/${personId}/datenbzglderlaufendenrente`
    ]);
  }


  navigateToPersonaldatenzumverbliebenenangehoerigen(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      `/person/${personId}/personaldatenzumverbliebenenangehoerigen`
    ]);
  }


  navigateToPersonaldatenVerstorbener(): void {

    const personId =
      this.route.snapshot.params['id'];

    this.router.navigate([
      `/person/${personId}/personaldatenverstorbener`
    ]);
  }


  navigateToPersonlist(): void {

    this.router.navigate([
      '/list-person'
    ]);
  }


  // =====================================================
  // CSV EXPORT
  // ADMIN + READONLY
  // =====================================================

  exportPersonData(): void {

    const csvContent =
      this.generateCSVContent();

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            'text/csv;charset=utf-8'
        }
      );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        'a'
      );

    a.href =
      url;

    a.download =
      `person_${this.person.personalnummer}.csv`;

    document.body
      .appendChild(a);

    a.click();

    document.body
      .removeChild(a);

    window.URL
      .revokeObjectURL(url);
  }


  private generateCSVContent(): string {

    let csvContent = '';

    const keys =
      Object.keys(this.person);

    const fieldsToInclude =
      keys.filter(
        (key: string) =>
          key !== '_id' &&
          key !== '__v' &&
          this.person[key] !== null &&
          this.person[key] !== undefined
      );

    const headers =
      fieldsToInclude
        .map(
          (field: string) =>
            this.capitalizeFirstLetter(
              field
            )
        )
        .join(',');

    const values =
      fieldsToInclude
        .map(
          (field: string) => {

            const value =
              this.person[field];

            if (
              Array.isArray(value)
            ) {

              return `"${this.escapeCsvValue(
                value
                  .map(
                    (item: any) =>
                      this.formatArrayItem(
                        item
                      )
                  )
                  .join(' | ')
              )}"`;

            }

            return `"${this.escapeCsvValue(
              this.formatValue(value)
            )}"`;

          }
        )
        .join(',');

    if (
      fieldsToInclude.length > 0
    ) {

      csvContent +=
        headers + '\r\n';

      csvContent +=
        values + '\r\n';

    }

    return csvContent;
  }


  private escapeCsvValue(
    value: any
  ): string {

    return String(
      value ?? ''
    ).replace(
      /"/g,
      '""'
    );
  }


  // =====================================================
  // TXT EXPORT
  // ADMIN + READONLY
  // =====================================================

  exportPersonDataToTxt(): void {

    const content =
      this.generateTXTContentt();

    const blob =
      new Blob(
        [content],
        {
          type:
            'text/plain;charset=utf-8'
        }
      );

    const fileName =
      `person_${this.person.personalnummer}.txt`;

    const link =
      document.createElement(
        'a'
      );

    const url =
      URL.createObjectURL(
        blob
      );

    link.setAttribute(
      'href',
      url
    );

    link.setAttribute(
      'download',
      fileName
    );

    document.body
      .appendChild(link);

    link.click();

    document.body
      .removeChild(link);

    URL.revokeObjectURL(
      url
    );
  }


  generateTXTContentt(): string {

    let content = '';

    const keys =
      Object.keys(this.person);

    keys.forEach(
      (key: string) => {

        if (
          key === '_id' ||
          key === '__v'
        ) {
          return;
        }

        const value =
          this.person[key];

        if (
          value === null ||
          value === undefined ||
          value === ''
        ) {
          return;
        }

        if (
          Array.isArray(value)
        ) {

          if (
            value.length > 0
          ) {

            content +=
              `Daten zu ${key}\n`;

            value.forEach(
              (item: any) => {

                content +=
                  `- ${this.formatArrayItem(item)}\n`;

              }
            );

          }

        } else {

          content +=
            `${key}: ${this.formatValue(value)}\n`;

        }

      }
    );

    return content;
  }


  // =====================================================
  // FORMATIERUNG
  // =====================================================

  private capitalizeFirstLetter(
    str: string
  ): string {

    if (!str) {
      return '';
    }

    return (
      str.charAt(0).toUpperCase() +
      str.slice(1)
    );
  }


  private formatValue(
    value: any
  ): string {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '';
    }

    if (
      this.isDateValue(value)
    ) {

      return this.formatDate(
        value
      );

    }

    if (
      value instanceof Date
    ) {

      return this.formatDate(
        value
      );

    }

    if (
      typeof value === 'boolean'
    ) {

      return value
        ? 'Ja'
        : 'Nein';

    }

    return `${value}`;
  }


  private isDateValue(
    value: any
  ): boolean {

    return (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}T/.test(
        value
      )
    );
  }


  private formatDate(
    value: any
  ): string {

    const date =
      new Date(value);

    if (
      isNaN(
        date.getTime()
      )
    ) {

      return `${value}`;

    }

    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        '0'
      );

    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const year =
      date.getFullYear();

    return (
      `${day}.${month}.${year}`
    );
  }


  formatArrayItem(
    item: any
  ): string {

    if (
      item === null ||
      item === undefined
    ) {
      return '';
    }

    if (
      typeof item !== 'object'
    ) {

      return this.formatValue(
        item
      );

    }

    let formattedItem = '';

    const keys =
      Object.keys(item);

    keys.forEach(
      (key: string) => {

        if (
          key !== '_id' &&
          key !== '__v' &&
          item[key] !== null &&
          item[key] !== undefined &&
          item[key] !== ''
        ) {

          const separator =
            formattedItem === ''
              ? ''
              : ', ';

          formattedItem +=
            `${separator}${key}: ${this.formatValue(
              item[key]
            )}`;

        }

      }
    );

    return formattedItem;
  }


  // =====================================================
  // PERSON ALS VERSTORBEN MARKIEREN
  // NUR ADMIN
  // =====================================================

  markAsDeceased(): void {

    if (!this.isAdmin) {
      return;
    }

    const personId =
      this.route.snapshot.params['id'];

    // Schritt 1
    const sicher =
      confirm(
        'Sind Sie sicher, dass diese Person verstorben ist?\n\n' +
        'OK = Ja\n' +
        'Abbrechen = Storno'
      );

    if (!sicher) {
      return;
    }


    // Schritt 2
    const verstorbenAm =
      prompt(
        'Wann ist die Person verstorben?\n\n' +
        'Bitte Datum im Format YYYY-MM-DD eingeben.\n\n' +
        'Abbrechen = Storno'
      );

    if (
      verstorbenAm === null ||
      verstorbenAm.trim() === ''
    ) {
      return;
    }


    // Schritt 3
    const hasSurvivor =
      confirm(
        'Gibt es eine hinterbliebene Person?\n\n' +
        'OK = Ja\n' +
        'Abbrechen = Nein'
      );


    // ===================================================
    // KEINE HINTERBLIEBENE PERSON
    // ===================================================

    if (!hasSurvivor) {

      const finalConfirm =
        confirm(
          'Die Person wird nun als verstorben markiert.\n\n' +
          `Sterbedatum: ${verstorbenAm}\n\n` +
          'Es gibt keine hinterbliebene Person.\n\n' +
          'OK = Speichern\n' +
          'Abbrechen = Storno'
        );

      if (!finalConfirm) {
        return;
      }

      this.personService
        .markPersonAsDeceased(
          personId,
          {
            verstorbenAm,
            hasSurvivor: false
          }
        )
        .subscribe({

          next: (
            res: any
          ) => {

            alert(
              res.message
            );

            window.location
              .reload();

          },

          error: (
            err: any
          ) => {

            console.error(
              err
            );

            alert(
              'Fehler beim Markieren als verstorben.'
            );

          }

        });

      return;
    }


    // ===================================================
    // HINTERBLIEBENE PERSON VORHANDEN
    // ===================================================

    const survivorSelection =
      prompt(
        'Welche Art von hinterbliebener Person gibt es?\n\n' +
        '1 = Ehegatte / Ehegattin\n' +
        '2 = Angehöriger / Angehörige\n\n' +
        'Abbrechen = Storno'
      );

    if (
      survivorSelection === null
    ) {
      return;
    }

    let survivorType = '';

    if (
      survivorSelection === '1'
    ) {

      survivorType =
        'ehegatte';

    } else if (
      survivorSelection === '2'
    ) {

      survivorType =
        'angehoeriger';

    } else {

      alert(
        'Ungültige Auswahl.'
      );

      return;
    }


    // Schritt 5
    const survivorPersonalnummer =
      prompt(
        'Bitte Personalnummer der hinterbliebenen Person eingeben.\n\n' +
        'Abbrechen = Storno'
      );

    if (
      survivorPersonalnummer === null ||
      survivorPersonalnummer.trim() === ''
    ) {
      return;
    }


    // Schritt 6
    const finalConfirm =
      confirm(
        'Sie sind dabei die Person als verstorben zu markieren.\n\n' +
        `Sterbedatum: ${verstorbenAm}\n` +
        `Hinterbliebene Personalnummer: ${survivorPersonalnummer}\n` +
        `Typ: ${survivorType}\n\n` +

        'Die datenbzglderlaufendenRente der verstorbenen Person\n' +
        'werden bei der hinterbliebenen Person angelegt.\n\n' +

        'Bei der verstorbenen Person werden die\n' +
        'datenbzglderlaufendenRente gelöscht.\n\n' +

        'OK = Durchführung\n' +
        'Abbrechen = Storno'
      );

    if (!finalConfirm) {
      return;
    }


    this.personService
      .markPersonAsDeceased(
        personId,
        {
          verstorbenAm,
          hasSurvivor: true,
          survivorType,
          survivorPersonalnummer
        }
      )
      .subscribe({

        next: () => {

          alert(
            'Die Person wurde erfolgreich als verstorben markiert.\n\n' +
            'Die Hinterbliebenen-Daten wurden übernommen.'
          );

          window.location
            .reload();

        },

        error: (
          err: any
        ) => {

          console.error(
            err
          );

          alert(
            err?.error?.message ||
            'Fehler beim Markieren als verstorben.'
          );

        }

      });
  }

}

  
  
  
  
  
  
  
  
  
  
  



  
