import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../create-user/person.service';
import { Router } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).addVirtualFileSystem(pdfFonts);

@Component({
  selector: 'app-rgo-halbjahr1-serienbriefe',
  templateUrl: './rgohalbjahr1-serienbriefe.component.html',
  styleUrls: ['./rgohalbjahr1-serienbriefe.component.css']
})
export class RGOHalbjahr1SerienbriefeComponent {
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

    this.personService.getRGOHalfYear1Letters(this.form.value).subscribe({
      next: (res: any) => {
        const letters = res.letters || [];

        if (letters.length === 0) {
          alert('Keine Briefe gefunden.');
          return;
        }

        this.createCollectivePdf(letters);
      },
      error: err => {
        console.error(err);
        alert('Fehler beim Laden der Briefdaten.');
      }
    });
  }

  private createCollectivePdf(letters: any[]): void {
    const content: any[] = [];

    letters.forEach((p, idx) => {
      content.push(...this.buildLetter(p));

      if (idx < letters.length - 1) {
        content.push({ text: '', pageBreak: 'after' });
      }
    });

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [55, 50, 55, 60],
      defaultStyle: {
        fontSize: 10,
        font: 'Roboto'
      },
      content,
      footer: (currentPage: number) => {
        const p = letters[currentPage - 1];

        return {
          columns: [
            { text: p?.footerLeft || '', fontSize: 7, margin: [55, 0, 0, 0] },
            { text: p?.footerRight || '', fontSize: 7, margin: [20, 0, 55, 0] }
          ]
        };
      }
    };

    const date = new Date().toISOString().split('T')[0];
    (pdfMake as any).createPdf(docDefinition).download(`RGO_Halbjahr1_Bescheide_${date}.pdf`);
  }

  private buildLetter(p: any): any[] {
    const rows: any[] = [
      [
        { text: 'Rentenzahlung zum', bold: true },
        { text: p.oldDateLabel, bold: true, alignment: 'right' },
        { text: p.gueltigVon, bold: true, alignment: 'right' }
      ],
      ['', { text: 'EUR', alignment: 'right' }, { text: 'EUR', alignment: 'right' }],

      ['Gesamtversorgung', { text: this.euro(p.oldGesamt), alignment: 'right' }, { text: this.euro(p.newGesamt), alignment: 'right' }],
      ['- anrechenbare SV-Rente', { text: this.euro(p.oldGesetzliche), alignment: 'right' }, { text: this.euro(p.newGesetzliche), alignment: 'right' }]
    ];

    if (Number(p.andereAnzurechnendeRente) > 0) {
      rows.push([
        '- andere anzurechnende Rente',
        { text: this.euro(p.andereAnzurechnendeRente), alignment: 'right' },
        { text: this.euro(p.andereAnzurechnendeRente), alignment: 'right' }
      ]);
    }

    if (Number(p.renteBefrLV) > 0) {
      rows.push([
        '- Rente aus befr. Lebensversicherung',
        { text: this.euro(p.renteBefrLV), alignment: 'right' },
        { text: this.euro(p.renteBefrLV), alignment: 'right' }
      ]);
    }

    rows.push([
      '= Zwischensumme',
      { text: this.euro(p.oldBasis), alignment: 'right' },
      { text: this.euro(p.newBasis), alignment: 'right' }
    ]);

    if (Number(p.abschlagPct) > 0) {
      rows.push([
        `- Abschlag ${this.pct(p.abschlagPct)} %`,
        { text: this.euro(p.oldNachAbschlag), alignment: 'right' },
        { text: this.euro(p.newNachAbschlag), alignment: 'right' }
      ]);
    }

    rows.push([
      '= Betriebliche Rente vor Anspruch/Anteil',
      { text: this.euro(p.oldNachMindestrente ?? p.oldNachAbschlag ?? p.oldBasis), alignment: 'right' },
      { text: this.euro(p.newNachMindestrente ?? p.newNachAbschlag ?? p.newBasis), alignment: 'right' }
    ]);

    if (Number(p.ratierlicherPct) > 0) {
      rows.push([
        `unverfallbarer Anspruch ${this.pct(p.ratierlicherPct)} %`,
        { text: this.euro(p.oldNachRatierlich), alignment: 'right' },
        { text: this.euro(p.newNachRatierlich), alignment: 'right' }
      ]);
    }

    if (Number(p.anteilPct) > 0) {
      rows.push([
        `davon zahlt die HVB ${this.pct(p.anteilPct)} %`,
        { text: this.euro(p.oldBetrRente), alignment: 'right' },
        { text: this.euro(p.newBetrRente), alignment: 'right' }
      ]);
    }

    rows.push([
      { text: '= Betriebliche Rente', bold: true },
      { text: this.euro(p.oldBetrRente), bold: true, alignment: 'right' },
      { text: this.euro(p.newBetrRente), bold: true, alignment: 'right' }
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
          `der Tarifvertrag über die Anpassung der Gehälter in der Wohnungswirtschaft ` +
          `sieht eine Erhöhung um ${this.pct(p.pctUsed)} % ab dem ${p.gueltigVon} vor.`,
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

      { text: p.closingText || '', margin: [0, 0, 0, 28] },

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

  private euro(v: any): string {
    const n = Number(v);
    if (!Number.isFinite(n)) return '0,00';
    return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private pct(v: any): string {
    const n = Number(v);
    if (!Number.isFinite(n)) return '0,00';
    return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}