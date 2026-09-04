import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { PersonService } from '../create-user/person.service';
import { ExportCsvService } from './export-csv.service';
import { AuthService } from '../auth/auth.service';

import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-listperson',
  templateUrl: './listperson.component.html',
  styleUrls: ['./listperson.component.css']
})
export class ListPersonComponent implements OnInit {

  persons: any[] = [];

  personalnummerSearch: string = '';
  nameSearch: string = '';

  /**
   * Nur Personen mit diesen Versorgungsordnungen
   * werden in die Merser-CSV übernommen.
   */
  private readonly merserVersorgungsordnungen: number[] = [
    71,
    61,
    75,
    65,
    76,
    66,
    77,
    67,
    78,
    68,
    82,
    86,
    90
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private exportCsvService: ExportCsvService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}


  // =====================================================
  // ROLLENSTEUERUNG
  // =====================================================

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }


  ngOnInit(): void {
    this.loadPersons();
  }


  // =====================================================
  // PERSONEN LADEN
  // =====================================================

  loadPersons(): void {

    this.personService.getAllPersons().subscribe({

      next: (data: any[]) => {
        this.persons = data || [];
      },

      error: (error: any) => {

        console.error(
          'Error fetching persons:',
          error
        );

        this.persons = [];
      }

    });
  }


  // =====================================================
  // SUCHE PERSONALNUMMER
  // =====================================================

  searchByPersonalnummer(): void {

    const personalnummer =
      this.personalnummerSearch.trim();

    if (personalnummer === '') {

      this.loadPersons();

      return;
    }

    this.personService
      .getPersonByPersonalnummer(personalnummer)
      .subscribe({

        next: (data: any) => {

          this.persons =
            data ? [data] : [];

        },

        error: (error: any) => {

          console.error(
            'Error fetching person by personalnummer:',
            error
          );

          this.persons = [];
        }

      });
  }


  // =====================================================
  // SUCHE NAME
  // =====================================================

  searchByName(): void {

    const name =
      this.nameSearch.trim();

    if (name === '') {

      this.loadPersons();

      return;
    }

    this.personService
      .getPersonsByName(name)
      .subscribe({

        next: (data: any[]) => {

          this.persons =
            data || [];

        },

        error: (error: any) => {

          console.error(
            'Error fetching persons by name:',
            error
          );

          this.persons = [];

        }

      });
  }


  // =====================================================
  // NAVIGATION
  // =====================================================

  showPersonDetail(personId: string): void {

    this.router.navigate([
      '/person',
      personId
    ]);
  }


  navigateToCreatePerson(): void {

    this.router.navigate([
      '/createperson'
    ]);
  }


  navigateToPVAnpassung(): void {

    this.router.navigate([
      '/PVAnpassung'
    ]);
  }


  navigateToRGOAnpassung(): void {

    this.router.navigate([
      '/RGOAnpassung'
    ]);
  }


  navigateToRGOHalbjahr1(): void {

    this.router.navigate([
      '/RGOHalbjahr1'
    ]);
  }


  navigateToRGOSerienbriefH1(): void {

    this.router.navigate([
      '/rgo-halbjahr1-serienbriefe'
    ]);
  }


  navigateToRGOHalfYear2(): void {

    this.router.navigate([
      '/rgo-halbjahr2'
    ]);
  }


  navigateToRGOHalfYear2Letters(): void {

    this.router.navigate([
      '/rgo-halbjahr2-serienbriefe'
    ]);
  }


  navigateToSolvenius(): void {

    this.router.navigate([
      '/solvenius'
    ]);
  }


  navigateToActivePensioners(): void {

    this.router.navigate([
      '/active-pensioners'
    ]);
  }


  // =====================================================
  // EXPORT
  // =====================================================

  exportPersons(): void {

    this.exportCsvService
      .exportPersonsToCsv();
  }


  exportRGOPersons(): void {

    this.exportCsvService
      .exportRGOPersonsToCsv();
  }


  exportImportFile(): void {

    this.exportCsvService
      .exportImportFile();
  }


  exportAllPersonsToTxt(): void {

    const zip = new JSZip();

    const currentDate =
      new Date();

    const formattedDate =
      `${currentDate.getFullYear()}-` +
      `${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}-` +
      `${String(
        currentDate.getDate()
      ).padStart(2, '0')}`;

    this.persons.forEach(
      (person: any) => {

        const content =
          this.generateTXTContent(
            person
          );

        const fileName =
          `person_${person.personalnummer}.txt`;

        zip.file(
          fileName,
          content
        );
      }
    );

    zip.generateAsync({
      type: 'blob'
    }).then(
      (blob: Blob) => {

        saveAs(
          blob,
          `${formattedDate}_personexport.zip`
        );
      }
    );
  }


  exportPersonDetailsToTxt(
    person: any
  ): void {

    const content =
      this.generateTXTContent(
        person
      );

    const blob =
      new Blob(
        [content],
        {
          type:
            'text/plain;charset=utf-8'
        }
      );

    const fileName =
      `person_${person.personalnummer}.txt`;

    this.downloadFile(
      blob,
      fileName
    );
  }


  // =====================================================
  // TXT ERZEUGEN
  // =====================================================

  private generateTXTContent(
    person: any
  ): string {

    let txtContent =
      `Personalstammsatz zu ${person.personalnummer}\r\n`;

    const keys =
      Object.keys(person);

    keys.forEach(
      (key: string) => {

        if (
          key === '_id' ||
          key === '__v'
        ) {
          return;
        }

        const value =
          person[key];

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

            txtContent +=
              `\r\nDaten zu ${key}\r\n`;

            value.forEach(
              (item: any) => {

                txtContent +=
                  `- ${this.formatArrayItem(item)}\r\n`;

              }
            );

          }

          return;
        }

        txtContent +=
          `${this.capitalizeFirstLetter(key)}: ` +
          `${this.formatValue(value)}\r\n`;

      }
    );

    return txtContent;
  }


  private capitalizeFirstLetter(
    value: string
  ): string {

    if (!value) {
      return '';
    }

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
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
      return this.formatDate(value);
    }

    if (
      typeof value === 'boolean'
    ) {
      return value
        ? 'Ja'
        : 'Nein';
    }

    return String(value);
  }


  private isDateValue(
    value: any
  ): boolean {

    if (
      value instanceof Date
    ) {
      return true;
    }

    if (
      typeof value === 'string'
    ) {

      return /^\d{4}-\d{2}-\d{2}T/
        .test(value);

    }

    return false;
  }


  private formatDate(
    value: any
  ): string {

    const date =
      new Date(value);

    if (
      isNaN(date.getTime())
    ) {
      return String(value);
    }

    const day =
      String(
        date.getUTCDate()
      ).padStart(
        2,
        '0'
      );

    const month =
      String(
        date.getUTCMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const year =
      date.getUTCFullYear();

    return `${day}.${month}.${year}`;
  }


  private formatArrayItem(
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

    Object.keys(item)
      .forEach(
        (key: string) => {

          if (
            key === '_id' ||
            key === '__v'
          ) {
            return;
          }

          const value =
            item[key];

          if (
            value === null ||
            value === undefined ||
            value === ''
          ) {
            return;
          }

          const separator =
            formattedItem === ''
              ? ''
              : ', ';

          formattedItem +=
            `${separator}${this.capitalizeFirstLetter(key)}: ` +
            `${this.formatValue(value)}`;

        }
      );

    return formattedItem;
  }


  // =====================================================
  // DATENBANKSICHERUNG + MERSER
  // =====================================================

  /**
   * Erstellt:
   * 1. die vollständige MongoDB-Sicherung als .gz
   * 2. die gefilterte Merser-Datei als .csv
   */
  backupDatabase(): void {

    const now =
      new Date();

    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        '0'
      );

    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const year =
      now.getFullYear();

    const dateKey =
      `${day}${month}${year}`;

    this.http.get(
      '/api/backupDatabase',
      {
        responseType: 'blob'
      }
    ).subscribe({

      next: (
        backupBlob: Blob
      ) => {

        // Vollständige Datenbanksicherung
        this.downloadFile(
          backupBlob,
          `NeueHeimat_Sicherung_${dateKey}.gz`
        );

        // Personen für Merser laden
        this.personService
          .getAllPersons()
          .subscribe({

            next: (
              persons: any[]
            ) => {

              const merserContent =
                this.generateMerserContent(
                  persons || []
                );

              if (
                !merserContent
              ) {

                alert(
                  'Die Datenbanksicherung wurde erstellt. ' +
                  'Es wurden jedoch keine Personen mit den vorgesehenen ' +
                  'Versorgungsordnungen und gültigen Rentendaten gefunden.'
                );

                return;
              }

              const csvBlob =
                new Blob(
                  [
                    '\uFEFF' +
                    merserContent
                  ],
                  {
                    type:
                      'text/csv;charset=utf-8'
                  }
                );

              this.downloadFile(
                csvBlob,
                `NeueHeimat_Merser_${dateKey}.csv`
              );

            },

            error: (
              error: any
            ) => {

              console.error(
                'Fehler beim Erstellen des Merser-Exports:',
                error
              );

              alert(
                'Die Datenbanksicherung wurde erstellt, ' +
                'aber der Merser-Export konnte nicht erzeugt werden.'
              );

            }

          });
      },

      error: (
        error: any
      ) => {

        console.error(
          'Fehler beim Herunterladen der Datenbanksicherung:',
          error
        );

        alert(
          'Die Datenbanksicherung konnte nicht heruntergeladen werden.'
        );

      }

    });
  }


  /**
   * Merser-Datei erzeugen.
   *
   * Es werden ausschließlich Personen mit den Versorgungsordnungen
   * 71, 61, 75, 65, 76, 66, 77, 67, 78, 68, 82, 86 oder 90 exportiert.
   *
   * Je Person wird nur die aktuellste Rentenperiode verwendet.
   */
  private generateMerserContent(
    persons: any[]
  ): string {

    const lines: string[] = [];

    const filteredPersons =
      persons.filter(
        (person: any) => {

          const versorgungsordnung =
            Number(
              person?.versorgungsordnung
            );

          return (
            this.merserVersorgungsordnungen
              .includes(
                versorgungsordnung
              )
          );

        }
      );

    filteredPersons.forEach(
      (person: any) => {

        const latestRente =
          this.getLatestRentenPeriode(
            person
          );

        if (
          !latestRente
        ) {
          return;
        }

        const values: string[] = [

          this.formatInteger(
            person.personalnummer
          ),

          this.formatMerserDate(
            latestRente.gueltigVon
          ),

          this.formatMerserDate(
            latestRente.eingabedatum
          ),

          this.formatMerserNumber(
            latestRente.gesamtversorgung
          ),

          this.formatMerserNumber(
            latestRente.gesetzlicheSVRente
          ),

          this.formatMerserNumber(
            latestRente.renteAusBefrLebensvers
          ),

          this.formatMerserNumber(
            latestRente.andereAnzurechnendeRente
          ),

          this.formatQuotedText(
            latestRente.andereAnzurechnendeRenteName
          ),

          this.formatMerserNumber(
            latestRente.zusatzrente
          ),

          this.formatQuotedText(
            latestRente.zusatzrenteName
          ),

          this.formatMerserNumber(
            latestRente.pension
          ),

          this.formatMerserNumber(
            latestRente.ausgleich
          ),

          this.formatMerserNumber(
            latestRente.betrRente
          ),

          this.formatInteger(
            latestRente.bezugsart
          ),

          this.formatInteger(
            latestRente.anpassungsschluessel
          ),

          this.formatInteger(
            latestRente.weitereRenteUnterPersNr
          ),

          this.formatInteger(
            latestRente.anzahlKinder
          ),

          this.formatInteger(
            latestRente.steuerklasse
          ),

          this.formatQuotedText(
            latestRente.krankenkassenkennziffer
          ),

          this.formatMerserNumber(
            latestRente.beitragFuerKrankenvers
          ),

          this.formatMerserNumber(
            latestRente.entgeltpunkte
          ),

          this.formatMerserNumber(
            latestRente.zugangsfaktor
          ),

          this.formatMerserNumber(
            latestRente.rentenartfaktor
          ),

          this.formatMerserNumber(
            latestRente.teilrentenfaktor
          )

        ];

        lines.push(
          values.join(' ')
        );

      }
    );

    return lines.join(
      '\r\n'
    );
  }


  /**
   * Liefert die Periode mit dem neuesten gueltigVon.
   */
  private getLatestRentenPeriode(
    person: any
  ): any | null {

    const rentenArray =
      person
        ?.datenbzglderlaufendenRente
      || [];

    const validEntries =
      rentenArray.filter(
        (entry: any) => {

          if (
            !entry?.gueltigVon
          ) {
            return false;
          }

          const date =
            new Date(
              entry.gueltigVon
            );

          return (
            !isNaN(
              date.getTime()
            )
          );

        }
      );

    if (
      validEntries.length === 0
    ) {
      return null;
    }

    return [
      ...validEntries
    ].sort(
      (
        a: any,
        b: any
      ) => {

        const dateA =
          new Date(
            a.gueltigVon
          ).getTime();

        const dateB =
          new Date(
            b.gueltigVon
          ).getTime();

        return dateB - dateA;

      }
    )[0];
  }


  /**
   * Ausgabe beispielsweise:
   * 01/10/2025
   */
  private formatMerserDate(
    value: any
  ): string {

    if (
      !value
    ) {
      return '';
    }

    const date =
      new Date(value);

    if (
      isNaN(
        date.getTime()
      )
    ) {
      return '';
    }

    const day =
      String(
        date.getUTCDate()
      ).padStart(
        2,
        '0'
      );

    const month =
      String(
        date.getUTCMonth() + 1
      ).padStart(
        2,
        '0'
      );

    const year =
      date.getUTCFullYear();

    return (
      `${day}/${month}/${year}`
    );
  }


  /**
   * Ausgabe beispielsweise:
   * 994,01
   * 107,34
   * 0
   */
  private formatMerserNumber(
    value: any
  ): string {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '0';
    }

    let normalizedValue =
      value;

    if (
      typeof normalizedValue
        === 'string'
    ) {

      normalizedValue =
        normalizedValue.trim();

      if (
        normalizedValue.includes(',') &&
        normalizedValue.includes('.')
      ) {

        normalizedValue =
          normalizedValue
            .replace(
              /\./g,
              ''
            )
            .replace(
              ',',
              '.'
            );

      } else if (
        normalizedValue.includes(',')
      ) {

        normalizedValue =
          normalizedValue
            .replace(
              ',',
              '.'
            );

      }
    }

    const numberValue =
      Number(
        normalizedValue
      );

    if (
      !Number.isFinite(
        numberValue
      )
    ) {
      return '0';
    }

    if (
      Number.isInteger(
        numberValue
      )
    ) {

      return String(
        numberValue
      );
    }

    return numberValue
      .toFixed(4)
      .replace(
        /0+$/,
        ''
      )
      .replace(
        /\.$/,
        ''
      )
      .replace(
        '.',
        ','
      );
  }


  /**
   * Für Personalnummer, Bezugsart,
   * Anpassungsschlüssel usw.
   */
  private formatInteger(
    value: any
  ): string {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '0';
    }

    const numberValue =
      Number(value);

    if (
      !Number.isFinite(
        numberValue
      )
    ) {
      return '0';
    }

    return String(
      Math.trunc(
        numberValue
      )
    );
  }


  /**
   * Ausgabe beispielsweise:
   * ""
   * "0472"
   */
  private formatQuotedText(
    value: any
  ): string {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '""';
    }

    const text =
      String(value)
        .trim()
        .replace(
          /"/g,
          '""'
        );

    return `"${text}"`;
  }


  // =====================================================
  // DATEI HERUNTERLADEN
  // =====================================================

  private downloadFile(
    blob: Blob,
    fileName: string
  ): void {

    const url =
      window.URL
        .createObjectURL(
          blob
        );

    const link =
      document.createElement(
        'a'
      );

    link.href =
      url;

    link.download =
      fileName;

    document.body
      .appendChild(
        link
      );

    link.click();

    document.body
      .removeChild(
        link
      );

    window.URL
      .revokeObjectURL(
        url
      );
  }


  // =====================================================
  // CSV
  // =====================================================

  private convertToCsv(
    data: any[]
  ): string {

    return Papa.unparse({

      fields: [
        'Name',
        'Personalnummer'
      ],

      data: data.map(
        (person: any) => ({

          Name:
            person.name || '',

          Personalnummer:
            person.personalnummer || ''

        })
      )

    });
  }


  // =====================================================
  // AKTIVE PERSONEN EXPORTIEREN
  // =====================================================

  exportActivePersonsToCsv(): void {

    this.personService
      .getAllPersons()
      .subscribe({

        next: (
          persons: any[]
        ) => {

          const activePersons =
            persons.filter(
              (person: any) => {

                const status =
                  String(
                    person
                      .aktuelleStatusgruppe
                    || ''
                  ).toLowerCase();

                return (
                  !status.startsWith(
                    'verst'
                  )
                );

              }
            );

          const csvData =
            this.convertToCsv(
              activePersons
            );

          const blob =
            new Blob(
              [csvData],
              {
                type:
                  'text/csv;charset=utf-8'
              }
            );

          const now =
            new Date();

          const day =
            String(
              now.getDate()
            ).padStart(
              2,
              '0'
            );

          const month =
            String(
              now.getMonth() + 1
            ).padStart(
              2,
              '0'
            );

          const year =
            now.getFullYear();

          saveAs(
            blob,
            `Aktive_Rentner_${day}${month}${year}.csv`
          );

        },

        error: (
          error: any
        ) => {

          console.error(
            'Error fetching persons:',
            error
          );

        }

      });
  }


  // =====================================================
  // VERSTORBENE PERSONEN EXPORTIEREN
  // =====================================================

  exportDeceasedPersonsToCsv(): void {

    this.personService
      .getAllPersons()
      .subscribe({

        next: (
          persons: any[]
        ) => {

          const deceasedPersons =
            persons.filter(
              (person: any) => {

                const status =
                  String(
                    person
                      .aktuelleStatusgruppe
                    || ''
                  ).toLowerCase();

                return (
                  status.startsWith(
                    'verst'
                  )
                );

              }
            );

          const csvData =
            this.convertToCsv(
              deceasedPersons
            );

          const blob =
            new Blob(
              [csvData],
              {
                type:
                  'text/csv;charset=utf-8'
              }
            );

          const now =
            new Date();

          const day =
            String(
              now.getDate()
            ).padStart(
              2,
              '0'
            );

          const month =
            String(
              now.getMonth() + 1
            ).padStart(
              2,
              '0'
            );

          const year =
            now.getFullYear();

          saveAs(
            blob,
            `Verstorbene_${day}${month}${year}.csv`
          );

        },

        error: (
          error: any
        ) => {

          console.error(
            'Error fetching persons:',
            error
          );

        }

      });
  }

}
  

