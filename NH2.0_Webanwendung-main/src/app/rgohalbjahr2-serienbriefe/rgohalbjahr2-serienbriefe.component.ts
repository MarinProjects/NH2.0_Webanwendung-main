import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).addVirtualFileSystem(pdfFonts);

@Component({
  selector: 'app-rgohalbjahr2-serienbriefe',
  templateUrl: './rgohalbjahr2-serienbriefe.component.html',
  styleUrls: ['./rgohalbjahr2-serienbriefe.component.css']
})
export class RGOHalbjahr2SerienbriefeComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router
  ) {
    this.form = this.fb.group({
      terminangabe: ['', Validators.required],
      gueltigVon: ['', Validators.required],
      anpassungswertInPct: [0, Validators.required],
      monatlicheMindestrente: [0, Validators.required],

      // Optionales Feld
      benutzerdefinierterText: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    const payload = this.form.value;

    this.personService
      .getRGOHalfYear2LetterData(payload)
      .subscribe({
        next: (data: any[]) => {
          if (!data || data.length === 0) {
            alert(
              'Keine Daten für Serienbriefe gefunden.'
            );
            return;
          }

          const docDefinition =
            this.buildPdfDefinition(
              data,
              payload
            );

          const dateKey =
            this.toDateKey(
              payload.gueltigVon
            );

          (pdfMake as any)
            .createPdf(docDefinition)
            .download(
              `RGO_Halbjahr2_Sammelbrief_${dateKey}.pdf`
            );
        },

        error: (err: any) => {
          console.error(
            'Fehler beim Erstellen der Sammel-PDF:',
            err
          );

          alert(
            'Fehler beim Erstellen der Sammel-PDF.'
          );
        }
      });
  }

  private buildPdfDefinition(
    data: any[],
    payload: any
  ): any {
    const content: any[] = [];

    data.forEach(
      (person: any, index: number) => {
        content.push(
          ...this.buildLetter(
            person,
            payload
          )
        );

        if (index < data.length - 1) {
          content.push({
            text: '',
            pageBreak: 'after'
          });
        }
      }
    );

    return {
      pageSize: 'A4',

      /*
       * Der obere Rand wurde vergrößert,
       * damit Anschrift und Inhalt weiter unten beginnen.
       */
      pageMargins: [
        70,
        185,
        55,
        65
      ],

      defaultStyle: {
        fontSize: 10,
        font: 'Roboto'
      },

      content,

      footer: (
        currentPage: number
      ) => {
        const person =
          data[currentPage - 1];

        return {
          columns: [
            {
              text:
                person?.footerLeft || '',
              fontSize: 7,
              margin: [
                55,
                0,
                10,
                0
              ]
            },

            {
              text:
                person?.footerRight || '',
              fontSize: 7,
              margin: [
                10,
                0,
                55,
                0
              ]
            }
          ]
        };
      }
    };
  }

  private buildLetter(
    person: any,
    payload: any
  ): any[] {
    const rows: any[] = [];

    /*
     * Tabellenüberschrift
     */
    rows.push([
      {
        text: 'Rentenzahlung zum',
        bold: true
      },
      {
        text:
          this.formatGermanDate(
            person.oldDate
          ),
        alignment: 'right',
        bold: true
      },
      {
        text:
          this.formatGermanDate(
            person.newDate
          ),
        alignment: 'right',
        bold: true
      }
    ]);

    rows.push([
      '',
      {
        text: 'EUR',
        alignment: 'right'
      },
      {
        text: 'EUR',
        alignment: 'right'
      }
    ]);

    /*
     * Gesamtversorgung
     */
    rows.push([
      'Gesamtversorgung',
      {
        text:
          this.eur(
            person.oldGesamtversorgung
          ),
        alignment: 'right'
      },
      {
        text:
          this.eur(
            person.newGesamtversorgung
          ),
        alignment: 'right'
      }
    ]);

    /*
     * Gesetzliche SV-Rente
     */
    rows.push([
      '- anrechenbare SV-Rente',
      {
        text:
          this.eur(
            person.oldGesetzlicheSVRente
          ),
        alignment: 'right'
      },
      {
        text:
          this.eur(
            person.newGesetzlicheSVRente
          ),
        alignment: 'right'
      }
    ]);

    /*
     * Andere anzurechnende Rente
     */
    if (
      Number(
        person.andereAnzurechnendeRente
      ) > 0
    ) {
      const andereRenteName =
        String(
          person.andereAnzurechnendeRenteName ||
          ''
        ).trim();

      const label = andereRenteName
        ? `- andere anzurechnende Rente (${andereRenteName})`
        : '- andere anzurechnende Rente';

      rows.push([
        label,
        {
          text:
            this.eur(
              person.andereAnzurechnendeRente
            ),
          alignment: 'right'
        },
        {
          text:
            this.eur(
              person.andereAnzurechnendeRente
            ),
          alignment: 'right'
        }
      ]);
    }

    /*
     * Rente aus befristeter Lebensversicherung
     */
    if (
      Number(
        person.renteAusBefrLebensvers
      ) > 0
    ) {
      rows.push([
        '- Rente aus befr. Lebensversicherung',
        {
          text:
            this.eur(
              person.renteAusBefrLebensvers
            ),
          alignment: 'right'
        },
        {
          text:
            this.eur(
              person.renteAusBefrLebensvers
            ),
          alignment: 'right'
        }
      ]);
    }

    /*
     * Die sichtbare Zeile "= Zwischensumme"
     * wurde entfernt.
     *
     * Die Werte person.oldBasis und person.newBasis
     * bleiben im Backend erhalten und können intern
     * weiterhin für die Berechnung verwendet werden.
     */

    /*
     * Abschlag
     */
    if (
      Number(
        person.abschlagPct
      ) > 0
    ) {
      rows.push([
        `- Abschlag ${this.percent(
          person.abschlagPct
        )}`,
        {
          text:
            this.eur(
              person.oldAbschlagBetrag ??
              this.calculateAbschlagBetrag(
                person.oldBasis,
                person.abschlagPct
              )
            ),
          alignment: 'right'
        },
        {
          text:
            this.eur(
              person.newAbschlagBetrag ??
              this.calculateAbschlagBetrag(
                person.newBasis,
                person.abschlagPct
              )
            ),
          alignment: 'right'
        }
      ]);
    }

    /*
     * Die sichtbare Zeile
     * "= Betriebliche Rente vor Anspruch/Anteil"
     * wurde entfernt.
     */

    /*
     * Unverfallbarer bzw. ratierlicher Anspruch
     */
    if (
      Number(
        person.ratierlicherAnspruchPct
      ) > 0
    ) {
      rows.push([
        `unverfallbarer Anspruch ${this.percent(
          person.ratierlicherAnspruchPct
        )}`,
        {
          text:
            this.eur(
              this.getOldValueAfterRatierlich(
                person
              )
            ),
          alignment: 'right'
        },
        {
          text:
            this.eur(
              this.getNewValueAfterRatierlich(
                person
              )
            ),
          alignment: 'right'
        }
      ]);
    }

    /*
     * HVB-Anteil nur anzeigen, wenn:
     * Anteil > 0 und Anteil < 100
     */
    if (
      Number(person.anteilPct) > 0 &&
      Number(person.anteilPct) < 100
    ) {
      rows.push([
        `davon zahlt die HVB ${this.percent(
          person.anteilPct
        )}`,
        {
          text:
            this.eur(
              person.oldBetrRente
            ),
          alignment: 'right'
        },
        {
          text:
            this.eur(
              person.newBetrRente
            ),
          alignment: 'right'
        }
      ]);
    }

    /*
     * Abschließende betriebliche Rente
     */
    rows.push([
      {
        text: '= Betriebliche Rente',
        bold: true
      },
      {
        text:
          this.eur(
            person.oldBetrRente
          ),
        alignment: 'right',
        bold: true
      },
      {
        text:
          this.eur(
            person.newBetrRente
          ),
        alignment: 'right',
        bold: true
      }
    ]);

    const serienbriefText =
      this.getSerienbriefText(
        payload,
        person
      );

    const addressData =
      this.prepareAddress(
        person.adresse
      );

    const addressTitle =
      person.anrede ||
      this.getAddressTitle(
        person.geschlecht
      );

    const briefAnrede =
      this.createBriefSalutation(
        person
      );

    return [
      /*
       * Anschriftblock und Datum/Aktenzeichen.
       *
       * Beide Bereiche stehen jetzt nebeneinander.
       * Die Anschrift berücksichtigt Zeilenumbrüche.
       */
      {
        columns: [
          {
            width: '*',

            stack: [
              {
                text: addressTitle,
                margin: [0, 0, 0, 1]
              },

              {
                text: person.name || '',
                margin: [0, 0, 0, 1]
              },

              {
                text: addressData.street,
                margin: [0, 0, 0, 8]
              },

              {
                text: addressData.city,
                margin: [0, 0, 0, 0]
              }
            ]
          },

          {
            width: 125,

            stack: [
              {
                text:
                  this.formatGermanDate(
                    person.terminangabe ||
                    payload.terminangabe
                  ),
                alignment: 'right',
                margin: [0, 55, 0, 1]
              },

              {
                text:
                  person.aktenzeichen ||
                  `${person.gesellschaft || ''}-${person.personalnummer || ''}`,
                alignment: 'right'
              }
            ]
          }
        ],

        /*
         * Abstand nach dem Anschriftfenster.
         */
        margin: [
          0,
          0,
          0,
          38
        ]
      },

      /*
       * Betreff
       */
      {
        text:
          'Betriebliche Altersversorgung',
        bold: true
      },

      {
        text:
          `Anpassung nach Par. 11 der Ruhegeldordnung zum ` +
          `${this.formatGermanDate(
            person.gueltigVon ||
            payload.gueltigVon
          )}`,
        bold: true,
        margin: [
          0,
          0,
          0,
          28
        ]
      },

      /*
       * Persönliche Anrede:
       * nur der erste Namensbestandteil.
       */
      {
        text: briefAnrede,
        margin: [
          0,
          0,
          0,
          14
        ]
      },

      /*
       * Benutzerdefinierter Text oder Standardtext
       */
      {
        text: serienbriefText,
        margin: [
          0,
          0,
          0,
          8
        ],
        lineHeight: 1.05
      },

      /*
       * Kalkulation
       */
      {
        table: {
          widths: [
            '*',
            90,
            90
          ],
          body: rows
        },

        layout: 'noBorders',

        margin: [
          0,
          0,
          0,
          26
        ]
      },

      /*
       * Abschlusstext
       */
      {
        text:
          person.closingText ||
          'Wenn Sie Fragen haben oder weitere Informationen benötigen, rufen Sie uns bitte an.',
        margin: [
          0,
          0,
          0,
          27
        ]
      },

      {
        text:
          'Mit freundlichen Grüßen',
        margin: [
          0,
          0,
          0,
          12
        ]
      },

      {
        text:
          'BGAG\n' +
          'Beteiligungsgesellschaft der Gewerkschaften GmbH',
        margin: [
          0,
          0,
          0,
          32
        ]
      },

      /*
       * Namen der Unterzeichner.
       *
       * Verwendet wird eine kleine Tabelle mit festen Breiten,
       * damit die Namen näher zusammenstehen.
       */
      {
        table: {
          widths: [
            150,
            210
          ],

          body: [
            [
              {
                text:
                  person.signaturLinks ||
                  'Oliver Richter',
                border: [
                  false,
                  false,
                  false,
                  false
                ]
              },

              {
                text:
                  person.signaturRechts ||
                  'i. A. Konstantina Daftsidou',
                border: [
                  false,
                  false,
                  false,
                  false
                ]
              }
            ]
          ]
        },

        layout: 'noBorders',

        margin: [
          0,
          0,
          0,
          10
        ]
      }
    ];
  }

  /**
   * Bereitet die Anschrift für ein Brieffenster auf.
   *
   * Beispiele:
   *
   * "Hanftstaenglstr. 1,80638 München"
   *
   * wird:
   *
   * Hanftstaenglstr. 1
   *
   * 80638 München
   *
   * Bereits vorhandene Zeilenumbrüche werden ebenfalls berücksichtigt.
   */
  private prepareAddress(
    address: any
  ): {
    street: string;
    city: string;
  } {
    const rawAddress =
      String(address || '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim();

    if (!rawAddress) {
      return {
        street: '',
        city: ''
      };
    }

    /*
     * Bereits vorhandene Zeilenumbrüche beachten.
     */
    const existingLines =
      rawAddress
        .split('\n')
        .map(
          (line: string) =>
            line.trim()
        )
        .filter(Boolean);

    if (
      existingLines.length >= 2
    ) {
      return {
        street:
          existingLines[0],

        city:
          existingLines
            .slice(1)
            .join('\n')
      };
    }

    /*
     * Üblicher Datenbankwert:
     * Straße, PLZ Ort
     */
    const commaIndex =
      rawAddress.indexOf(',');

    if (commaIndex !== -1) {
      const street =
        rawAddress
          .slice(0, commaIndex)
          .trim();

      const city =
        rawAddress
          .slice(commaIndex + 1)
          .trim();

      return {
        street,
        city
      };
    }

    /*
     * Fallback:
     * Versuche PLZ am Ende der Anschrift zu erkennen.
     */
    const postalCodeMatch =
      rawAddress.match(
        /^(.*?)(\d{5}\s+.+)$/
      );

    if (postalCodeMatch) {
      return {
        street:
          postalCodeMatch[1]
            .trim(),

        city:
          postalCodeMatch[2]
            .trim()
      };
    }

    return {
      street: rawAddress,
      city: ''
    };
  }

  /**
   * Erstellt die persönliche Briefanrede.
   *
   * Laut Vorgabe wird der Name am ersten Leerzeichen
   * getrennt und nur der erste Namensbestandteil verwendet.
   *
   * Beispiel:
   * "Friedberg Sibylle" -> "Friedberg"
   */
  private createBriefSalutation(
    person: any
  ): string {
    const name =
      this.getFirstNamePart(
        person.name
      );

    const gender =
      this.normalizeGender(
        person.geschlecht
      );

    if (gender === 'female') {
      return `Sehr geehrte Frau ${name},`;
    }

    if (gender === 'male') {
      return `Sehr geehrter Herr ${name},`;
    }

    /*
     * Falls Geschlecht unbekannt ist,
     * vorhandene Backend-Anrede als Fallback verwenden.
     */
    if (person.briefAnrede) {
      return this.replaceFullNameInSalutation(
        person.briefAnrede,
        person.name,
        name
      );
    }

    return `Sehr geehrte Damen und Herren,`;
  }

  /**
   * Gibt den ersten Teil des gespeicherten Namens zurück.
   */
  private getFirstNamePart(
    fullName: any
  ): string {
    const normalizedName =
      String(fullName || '')
        .trim();

    if (!normalizedName) {
      return '';
    }

    return normalizedName
      .split(/\s+/)[0];
  }

  /**
   * Ersetzt in einer bereits vom Backend erzeugten
   * Anrede den vollständigen Namen durch den gewünschten
   * ersten Namensbestandteil.
   */
  private replaceFullNameInSalutation(
    salutation: any,
    fullName: any,
    firstNamePart: string
  ): string {
    const salutationText =
      String(salutation || '');

    const completeName =
      String(fullName || '')
        .trim();

    if (
      completeName &&
      salutationText.includes(
        completeName
      )
    ) {
      return salutationText.replace(
        completeName,
        firstNamePart
      );
    }

    return salutationText;
  }

  /**
   * Gibt Frau oder Herr für den Anschriftblock zurück.
   */
  private getAddressTitle(
    geschlecht: any
  ): string {
    const gender =
      this.normalizeGender(
        geschlecht
      );

    if (gender === 'female') {
      return 'Frau';
    }

    if (gender === 'male') {
      return 'Herrn';
    }

    return '';
  }

  /**
   * Erkennt verschiedene Schreibweisen von Geschlecht.
   */
  private normalizeGender(
    value: any
  ): 'female' | 'male' | 'unknown' {
    const normalized =
      String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\./g, '');

    const femaleValues = [
      'w',
      'weiblich',
      'weibl',
      'weib',
      'frau',
      'f'
    ];

    const maleValues = [
      'm',
      'männlich',
      'maennlich',
      'männl',
      'maennl',
      'män',
      'maen',
      'mann',
      'herr'
    ];

    if (
      femaleValues.includes(
        normalized
      )
    ) {
      return 'female';
    }

    if (
      maleValues.includes(
        normalized
      )
    ) {
      return 'male';
    }

    return 'unknown';
  }

  /**
   * Benutzerdefinierten Text verwenden,
   * wenn etwas eingegeben wurde.
   *
   * Ansonsten Standardtext erzeugen.
   */
  private getSerienbriefText(
    payload: any,
    person: any
  ): string {
    const benutzerText =
      String(
        payload?.benutzerdefinierterText ||
        ''
      ).trim();

    if (
      benutzerText.length > 0
    ) {
      return benutzerText;
    }

    const gueltigVon =
      this.formatGermanDate(
        person.gueltigVon ||
        payload.gueltigVon
      );

    const prozentsatz =
      person.anpassungswertInPct ??
      payload.anpassungswertInPct;

    return (
      `die gesetzlichen Renten wurden zum ${gueltigVon} ` +
      `um ${this.percent(prozentsatz)} erhöht.\n\n` +
      `Nachstehend die Neuberechnung Ihrer betrieblichen Rente ` +
      `zum ${gueltigVon}.`
    );
  }

  /**
   * Ermittelt den Wert nach ratierlichem Anspruch
   * für die alte Periode.
   */
  private getOldValueAfterRatierlich(
    person: any
  ): number {
    return this.firstNumber(
      person.oldNachRatierlich,
      person.oldAfterRatierlich,
      person.oldBetrRenteVorAnteil,
      person.oldBetrRente
    );
  }

  /**
   * Ermittelt den Wert nach ratierlichem Anspruch
   * für die neue Periode.
   */
  private getNewValueAfterRatierlich(
    person: any
  ): number {
    return this.firstNumber(
      person.newNachRatierlich,
      person.newAfterRatierlich,
      person.newBetrRenteVorAnteil,
      person.newBetrRente
    );
  }

  private firstNumber(
    ...values: any[]
  ): number {
    for (const value of values) {
      if (
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
        const numberValue =
          Number(value);

        if (
          Number.isFinite(
            numberValue
          )
        ) {
          return numberValue;
        }
      }
    }

    return 0;
  }

  private calculateAbschlagBetrag(
    basis: any,
    abschlagPct: any
  ): number {
    const basisNumber =
      Number(basis);

    const percentage =
      Number(abschlagPct);

    if (
      !Number.isFinite(
        basisNumber
      ) ||
      !Number.isFinite(
        percentage
      )
    ) {
      return 0;
    }

    return (
      basisNumber *
      percentage /
      100
    );
  }

  private eur(
    value: any
  ): string {
    const numberValue =
      Number(value);

    if (
      !Number.isFinite(
        numberValue
      )
    ) {
      return '0,00';
    }

    return numberValue
      .toLocaleString(
        'de-DE',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );
  }

  private percent(
    value: any
  ): string {
    const numberValue =
      Number(value);

    if (
      !Number.isFinite(
        numberValue
      )
    ) {
      return '0,00 %';
    }

    return (
      numberValue.toLocaleString(
        'de-DE',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      ) +
      ' %'
    );
  }

  /**
   * Formatiert ein Datum nach TT.MM.JJJJ.
   */
  private formatGermanDate(
    value: any
  ): string {
    if (!value) {
      return '';
    }

    /*
     * Bereits formatiertes deutsches Datum übernehmen.
     */
    if (
      typeof value === 'string' &&
      /^\d{2}\.\d{2}\.\d{4}$/.test(
        value
      )
    ) {
      return value;
    }

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
      ).padStart(2, '0');

    const month =
      String(
        date.getUTCMonth() + 1
      ).padStart(2, '0');

    const year =
      date.getUTCFullYear();

    return `${day}.${month}.${year}`;
  }

  private toDateKey(
    value: any
  ): string {
    const date =
      new Date(value);

    if (
      isNaN(date.getTime())
    ) {
      return '';
    }

    const day =
      String(
        date.getUTCDate()
      ).padStart(2, '0');

    const month =
      String(
        date.getUTCMonth() + 1
      ).padStart(2, '0');

    const year =
      date.getUTCFullYear();

    return `${day}${month}${year}`;
  }

  back(): void {
    this.router.navigate([
      '/list-person'
    ]);
  }
}
