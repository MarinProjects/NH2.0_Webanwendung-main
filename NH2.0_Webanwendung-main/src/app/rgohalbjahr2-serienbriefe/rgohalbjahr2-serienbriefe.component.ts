/**
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      monatlicheMindestrente: [0, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Bitte alle Felder ausfüllen.');
      return;
    }

    const payload = this.form.value;

    this.personService.getRGOHalfYear2LetterData(payload).subscribe({
      next: (data: any[]) => {
        if (!data || data.length === 0) {
          alert('Keine Daten für Serienbriefe gefunden.');
          return;
        }

        const docDefinition = this.buildPdfDefinition(data);
        const dateKey = this.toDateKey(payload.gueltigVon);

        (pdfMake as any).createPdf(docDefinition).download(
          `RGO_Halbjahr2_Sammelbrief_${dateKey}.pdf`
        );
      },
      error: (err: any) => {
        console.error(err);
        alert('Fehler beim Erstellen der Sammel-PDF.');
      }
    });
  }

  private buildPdfDefinition(data: any[]): any {
    const content: any[] = [];

    data.forEach((p, index) => {
      content.push(...this.buildLetter(p));

      if (index < data.length - 1) {
        content.push({ text: '', pageBreak: 'after' });
      }
    });

    return {
      pageSize: 'A4',
      pageMargins: [55, 50, 55, 60],
      defaultStyle: {
        fontSize: 10,
        font: 'Roboto'
      },
      content,
      footer: (currentPage: number) => {
        const p = data[currentPage - 1];

        return {
          columns: [
            { text: p?.footerLeft || '', fontSize: 7, margin: [55, 0, 0, 0] },
            { text: p?.footerRight || '', fontSize: 7, margin: [20, 0, 55, 0] }
          ]
        };
      }
    };
  }

  private buildLetter(p: any): any[] {
    const rows: any[] = [
      [
        { text: 'Rentenzahlung zum', bold: true },
        { text: p.oldDate, alignment: 'right', bold: true },
        { text: p.newDate, alignment: 'right', bold: true }
      ],
      ['', { text: 'EUR', alignment: 'right' }, { text: 'EUR', alignment: 'right' }],

      ['Gesamtversorgung', { text: this.eur(p.oldGesamtversorgung), alignment: 'right' }, { text: this.eur(p.newGesamtversorgung), alignment: 'right' }],
      ['- anrechenbare SV-Rente', { text: this.eur(p.oldGesetzlicheSVRente), alignment: 'right' }, { text: this.eur(p.newGesetzlicheSVRente), alignment: 'right' }]
    ];

    if (Number(p.andereAnzurechnendeRente) > 0) {
      rows.push([
        '- andere anzurechnende Rente',
        { text: this.eur(p.andereAnzurechnendeRente), alignment: 'right' },
        { text: this.eur(p.andereAnzurechnendeRente), alignment: 'right' }
      ]);
    }

    if (Number(p.renteAusBefrLebensvers) > 0) {
      rows.push([
        '- Rente aus befr. Lebensversicherung',
        { text: this.eur(p.renteAusBefrLebensvers), alignment: 'right' },
        { text: this.eur(p.renteAusBefrLebensvers), alignment: 'right' }
      ]);
    }

    rows.push([
      '= Zwischensumme',
      { text: this.eur(p.oldBasis), alignment: 'right' },
      { text: this.eur(p.newBasis), alignment: 'right' }
    ]);

    if (Number(p.abschlagPct) > 0) {
      rows.push([
        `- Abschlag ${this.percent(p.abschlagPct)}`,
        { text: this.eur(p.oldNachAbschlag), alignment: 'right' },
        { text: this.eur(p.newNachAbschlag), alignment: 'right' }
      ]);
    }

    rows.push([
      '= Betriebliche Rente vor Anspruch/Anteil',
      { text: this.eur(p.oldVorRatierlich), alignment: 'right' },
      { text: this.eur(p.newVorRatierlich), alignment: 'right' }
    ]);

    if (Number(p.ratierlicherAnspruchPct) > 0) {
      rows.push([
        `unverfallbarer Anspruch ${this.percent(p.ratierlicherAnspruchPct)}`,
        { text: this.eur(p.oldNachRatierlich), alignment: 'right' },
        { text: this.eur(p.newNachRatierlich), alignment: 'right' }
      ]);
    }

    if (Number(p.anteilPct) > 0 && Number(p.anteilPct) < 100) {
  rows.push([
    `davon zahlt die HVB ${this.percent(p.anteilPct)}`,
    { text: this.eur(p.oldBetrRente), alignment: 'right' },
    { text: this.eur(p.newBetrRente), alignment: 'right' }
  ]);
}

    rows.push([
      { text: '= Betriebliche Rente', bold: true },
      { text: this.eur(p.oldBetrRente), alignment: 'right', bold: true },
      { text: this.eur(p.newBetrRente), alignment: 'right', bold: true }
    ]);

    return [
      { text: p.anrede || '', margin: [0, 0, 0, 2] },
      { text: p.name || '', margin: [0, 0, 0, 2] },
      { text: p.adresse || '', margin: [0, 0, 0, 22] },

      {
        columns: [
          { text: '' },
          { text: `${p.terminangabe}\n${p.aktenzeichen}`, alignment: 'right' }
        ],
        margin: [0, 0, 0, 35]
      },

      { text: 'Betriebliche Altersversorgung', bold: true },
      { text: `Anpassung nach Par. 11 der Ruhegeldordnung zum ${p.gueltigVon}`, bold: true, margin: [0, 0, 0, 30] },

      { text: p.briefAnrede, margin: [0, 0, 0, 18] },

      {
        text:
          `die gesetzlichen Renten wurden zum ${p.gueltigVon} ` +
          `um ${this.percent(p.anpassungswertInPct)} erhöht.`,
        margin: [0, 0, 0, 16]
      },

      { text: `Nachstehend die Neuberechnung Ihrer betrieblichen Rente zum ${p.gueltigVon}.`, margin: [0, 0, 0, 16] },

      {
        table: {
          widths: ['*', 90, 90],
          body: rows
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 28]
      },

      { text: p.closingText || 'Wenn Sie Fragen haben oder weitere Informationen benötigen, rufen Sie uns bitte an.', margin: [0, 0, 0, 28] },

      { text: 'Mit freundlichen Grüßen', margin: [0, 0, 0, 12] },
      { text: 'BGAG\nBeteiligungsgesellschaft der Gewerkschaften GmbH', margin: [0, 0, 0, 35] },

      {
        columns: [
          { text: p.signaturLinks || 'Oliver Richter' },
          { text: p.signaturRechts || 'i. A. Konstantina Daftsidou' }
        ],
        margin: [0, 0, 0, 10]
      }
    ];
  }

  back(): void {
    this.router.navigate(['/list-person']);
  }

  private eur(value: any): string {
    const n = Number(value);
    if (!Number.isFinite(n)) return '0,00';

    return n.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  private percent(value: any): string {
    const n = Number(value);
    if (!Number.isFinite(n)) return '0,00 %';

    return n.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' %';
  }

  private toDateKey(value: any): string {
    const d = new Date(value);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}${month}${year}`;
  }
}

 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

      // Optionales Feld – kein Validator
      benutzerdefinierterText: ['']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    const payload = this.form.value;

    this.personService.getRGOHalfYear2LetterData(payload).subscribe({
      next: (data: any[]) => {
        if (!data || data.length === 0) {
          alert('Keine Daten für Serienbriefe gefunden.');
          return;
        }

        const docDefinition = this.buildPdfDefinition(data, payload);
        const dateKey = this.toDateKey(payload.gueltigVon);

        (pdfMake as any).createPdf(docDefinition).download(
          `RGO_Halbjahr2_Sammelbrief_${dateKey}.pdf`
        );
      },

      error: (err: any) => {
        console.error(err);
        alert('Fehler beim Erstellen der Sammel-PDF.');
      }
    });
  }

  private buildPdfDefinition(data: any[], payload: any): any {
    const content: any[] = [];

    data.forEach((p, index) => {
      content.push(...this.buildLetter(p, payload));

      if (index < data.length - 1) {
        content.push({
          text: '',
          pageBreak: 'after'
        });
      }
    });

    return {
      pageSize: 'A4',

      pageMargins: [55, 50, 55, 60],

      defaultStyle: {
        fontSize: 10,
        font: 'Roboto'
      },

      content,

      footer: (currentPage: number) => {
        const p = data[currentPage - 1];

        return {
          columns: [
            {
              text: p?.footerLeft || '',
              fontSize: 7,
              margin: [55, 0, 0, 0]
            },
            {
              text: p?.footerRight || '',
              fontSize: 7,
              margin: [20, 0, 55, 0]
            }
          ]
        };
      }
    };
  }

  private buildLetter(p: any, payload: any): any[] {
    const rows: any[] = [
      [
        {
          text: 'Rentenzahlung zum',
          bold: true
        },
        {
          text: p.oldDate,
          alignment: 'right',
          bold: true
        },
        {
          text: p.newDate,
          alignment: 'right',
          bold: true
        }
      ],

      [
        '',
        {
          text: 'EUR',
          alignment: 'right'
        },
        {
          text: 'EUR',
          alignment: 'right'
        }
      ],

      [
        'Gesamtversorgung',
        {
          text: this.eur(p.oldGesamtversorgung),
          alignment: 'right'
        },
        {
          text: this.eur(p.newGesamtversorgung),
          alignment: 'right'
        }
      ],

      [
        '- anrechenbare SV-Rente',
        {
          text: this.eur(p.oldGesetzlicheSVRente),
          alignment: 'right'
        },
        {
          text: this.eur(p.newGesetzlicheSVRente),
          alignment: 'right'
        }
      ]
    ];

    if (Number(p.andereAnzurechnendeRente) > 0) {
      rows.push([
        '- andere anzurechnende Rente',
        {
          text: this.eur(p.andereAnzurechnendeRente),
          alignment: 'right'
        },
        {
          text: this.eur(p.andereAnzurechnendeRente),
          alignment: 'right'
        }
      ]);
    }

    if (Number(p.renteAusBefrLebensvers) > 0) {
      rows.push([
        '- Rente aus befr. Lebensversicherung',
        {
          text: this.eur(p.renteAusBefrLebensvers),
          alignment: 'right'
        },
        {
          text: this.eur(p.renteAusBefrLebensvers),
          alignment: 'right'
        }
      ]);
    }

    rows.push([
      '= Zwischensumme',
      {
        text: this.eur(p.oldBasis),
        alignment: 'right'
      },
      {
        text: this.eur(p.newBasis),
        alignment: 'right'
      }
    ]);

    if (Number(p.abschlagPct) > 0) {
      rows.push([
        `- Abschlag ${this.percent(p.abschlagPct)}`,
        {
          text: this.eur(p.oldNachAbschlag),
          alignment: 'right'
        },
        {
          text: this.eur(p.newNachAbschlag),
          alignment: 'right'
        }
      ]);
    }

    rows.push([
      '= Betriebliche Rente vor Anspruch/Anteil',
      {
        text: this.eur(p.oldVorRatierlich),
        alignment: 'right'
      },
      {
        text: this.eur(p.newVorRatierlich),
        alignment: 'right'
      }
    ]);

    if (Number(p.ratierlicherAnspruchPct) > 0) {
      rows.push([
        `unverfallbarer Anspruch ${this.percent(p.ratierlicherAnspruchPct)}`,
        {
          text: this.eur(p.oldNachRatierlich),
          alignment: 'right'
        },
        {
          text: this.eur(p.newNachRatierlich),
          alignment: 'right'
        }
      ]);
    }

    // Nur anzeigen, wenn Anteil größer als 0 und kleiner als 100 ist
    if (
      Number(p.anteilPct) > 0 &&
      Number(p.anteilPct) < 100
    ) {
      rows.push([
        `davon zahlt die HVB ${this.percent(p.anteilPct)}`,
        {
          text: this.eur(p.oldBetrRente),
          alignment: 'right'
        },
        {
          text: this.eur(p.newBetrRente),
          alignment: 'right'
        }
      ]);
    }

    rows.push([
      {
        text: '= Betriebliche Rente',
        bold: true
      },
      {
        text: this.eur(p.oldBetrRente),
        alignment: 'right',
        bold: true
      },
      {
        text: this.eur(p.newBetrRente),
        alignment: 'right',
        bold: true
      }
    ]);

    const serienbriefText = this.getSerienbriefText(payload, p);

    return [
      {
        text: p.anrede || '',
        margin: [0, 0, 0, 2]
      },
      {
        text: p.name || '',
        margin: [0, 0, 0, 2]
      },
      {
        text: p.adresse || '',
        margin: [0, 0, 0, 22]
      },

      {
        columns: [
          {
            text: ''
          },
          {
            text: `${p.terminangabe}\n${p.aktenzeichen}`,
            alignment: 'right'
          }
        ],
        margin: [0, 0, 0, 35]
      },

      {
        text: 'Betriebliche Altersversorgung',
        bold: true
      },

      {
        text:
          `Anpassung nach Par. 11 der Ruhegeldordnung zum ` +
          `${p.gueltigVon}`,
        bold: true,
        margin: [0, 0, 0, 30]
      },

      {
        text: p.briefAnrede,
        margin: [0, 0, 0, 18]
      },

      /*
       * Dieser Block ersetzt die beiden bisherigen Textabsätze.
       * Ist das Eingabefeld leer, wird der Standardtext verwendet.
       */
      {
        text: serienbriefText,
        margin: [0, 0, 0, 18],
        lineHeight: 1.35
      },

      {
        table: {
          widths: ['*', 90, 90],
          body: rows
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 28]
      },

      {
        text:
          p.closingText ||
          'Wenn Sie Fragen haben oder weitere Informationen benötigen, rufen Sie uns bitte an.',
        margin: [0, 0, 0, 28]
      },

      {
        text: 'Mit freundlichen Grüßen',
        margin: [0, 0, 0, 12]
      },

      {
        text:
          'BGAG\n' +
          'Beteiligungsgesellschaft der Gewerkschaften GmbH',
        margin: [0, 0, 0, 35]
      },

      {
        columns: [
          {
            text: p.signaturLinks || 'Oliver Richter'
          },
          {
            text:
              p.signaturRechts ||
              'i. A. Konstantina Daftsidou'
          }
        ],
        margin: [0, 0, 0, 10]
      }
    ];
  }

  /**
   * Benutzerdefinierten Text verwenden, wenn etwas eingegeben wurde.
   * Ansonsten bisherigen Standardtext erzeugen.
   */
  private getSerienbriefText(payload: any, p: any): string {
    const benutzerText = String(
      payload?.benutzerdefinierterText || ''
    ).trim();

    if (benutzerText.length > 0) {
      return benutzerText;
    }

    return (
      `Die gesetzlichen Renten wurden zum ${p.gueltigVon} ` +
      `um ${this.percent(p.anpassungswertInPct)} erhöht.\n\n` +
      `Nachstehend die Neuberechnung Ihrer betrieblichen Rente ` +
      `zum ${p.gueltigVon}.`
    );
  }

  back(): void {
    this.router.navigate(['/list-person']);
  }

  private eur(value: any): string {
    const n = Number(value);

    if (!Number.isFinite(n)) {
      return '0,00';
    }

    return n.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  private percent(value: any): string {
    const n = Number(value);

    if (!Number.isFinite(n)) {
      return '0,00 %';
    }

    return (
      n.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + ' %'
    );
  }

  private toDateKey(value: any): string {
    const d = new Date(value);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}${month}${year}`;
  }
}