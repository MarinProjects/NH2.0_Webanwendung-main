import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../create-user/person.service';
import { Router } from '@angular/router';

import * as pdfMakeModule from 'pdfmake/build/pdfmake';
import * as pdfFontsModule from 'pdfmake/build/vfs_fonts';

// pdfMake in Angular/ESM: kann unter .default liegen -> sauber abfangen
const pdfMake: any = (pdfMakeModule as any).default || pdfMakeModule;
const pdfFonts: any = (pdfFontsModule as any).default || pdfFontsModule;

// VFS registrieren (Fonts)
pdfMake.vfs = (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;




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

    const payload = this.form.value;

    this.personService.getRGOHalfYear1Letters(payload).subscribe({
      next: (res: any) => {
        const letters = res.letters || [];
        if (letters.length === 0) {
          alert('Keine Briefe gefunden. (Wichtig: neue Periode muss bereits berechnet/gespeichert sein.)');
          return;
        }

        this.createCollectivePdf(letters);
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Laden der Briefdaten.');
      }
    });
  }

  private euro(v: any): string {
    const n = Number(v);
    if (!Number.isFinite(n)) return '0,00';
    return n.toFixed(2).replace('.', ',');
  }

  private pct(v: any): string {
    const n = Number(v);
    if (!Number.isFinite(n)) return '0,00';
    return n.toFixed(2).replace('.', ',');
  }

  private createCollectivePdf(letters: any[]): void {
    const content: any[] = [];

    letters.forEach((p, idx) => {
      // Kopf / Anschriftblock (wie in deinen Beispielen)
      content.push(
        { text: p.name, margin: [0, 0, 0, 2] },
        { text: p.adresse, margin: [0, 0, 0, 12] },
        { text: p.terminangabe, alignment: 'right', margin: [0, 0, 0, 20] },

        { text: 'Betriebliche Altersversorgung', bold: true, margin: [0, 0, 0, 2] },
        { text: `Anpassung nach Par. 11 der Ruhegeldordnung zum ${p.gueltigVon}`, margin: [0, 0, 0, 14] },

        { text: `Sehr geehrte Frau / sehr geehrter Herr ${p.name.split(' ').slice(-1)[0]},`, margin: [0, 0, 0, 10] },

        {
          text:
            `der Tarifvertrag über die Anpassung der Gehälter in der Wohnungswirtschaft ` +
            `sieht eine Erhöhung um ${this.pct(p.pctUsed)} % ab dem ${p.gueltigVon} vor.`,
          margin: [0, 0, 0, 10]
        },

        { text: `Nachstehend die Neuberechnung Ihrer betrieblichen Rente zum ${p.gueltigVon}.`, margin: [0, 0, 0, 12] }
      );

      // „Tabelle“ / Rechenweg (wie Screenshot)
      const rows: any[] = [];

      // Überschrift Zeile
      rows.push([
        { text: 'Rentenzahlung zum', bold: true, border: [false, false, false, false] },
        { text: p.oldDateLabel, bold: true, alignment: 'right', border: [false, false, false, false] },
        { text: p.gueltigVon, bold: true, alignment: 'right', border: [false, false, false, false] }
      ]);

      rows.push([
        { text: '', border: [false, false, false, true] },
        { text: 'EUR', alignment: 'right', border: [false, false, false, true] },
        { text: 'EUR', alignment: 'right', border: [false, false, false, true] }
      ]);

      rows.push([
        { text: 'Gesamtversorgung', border: [false, false, false, false] },
        { text: this.euro(p.oldGesamt), alignment: 'right', border: [false, false, false, false] },
        { text: this.euro(p.newGesamt), alignment: 'right', border: [false, false, false, false] }
      ]);

      rows.push([
        { text: '- anrechenbare SV-Rente', border: [false, false, false, false] },
        { text: this.euro(p.oldGesetzliche), alignment: 'right', border: [false, false, false, false] },
        { text: this.euro(p.oldGesetzliche), alignment: 'right', border: [false, false, false, false] }
      ]);

      if (Number(p.renteBefrLV) > 0) {
        rows.push([
          { text: '- Rente aus befr. Leb.vers.', border: [false, false, false, false] },
          { text: this.euro(p.renteBefrLV), alignment: 'right', border: [false, false, false, false] },
          { text: this.euro(p.renteBefrLV), alignment: 'right', border: [false, false, false, false] }
        ]);
      }

      if (Number(p.abschlagPct) > 0) {
        rows.push([
          { text: 'Zwischensumme', border: [false, false, false, false] },
          { text: '', alignment: 'right', border: [false, false, false, false] },
          { text: this.euro(p.basis), alignment: 'right', border: [false, false, false, false] }
        ]);

        rows.push([
          { text: `- Abschlag (${this.pct(p.abschlagPct)} %)`, border: [false, false, false, false] },
          { text: '', alignment: 'right', border: [false, false, false, false] },
          { text: this.euro(p.nachAbschlag), alignment: 'right', border: [false, false, false, false] }
        ]);
      }

      // Mindestrente Hinweis (wenn greift)
      if (Number(p.nachAbschlag) < Number(p.mindestRente ?? p.mindestrente)) {
        rows.push([
          { text: 'Betriebliche Rente erhöht auf Mindestrente', italics: true, border: [false, false, false, false] },
          { text: '', alignment: 'right', border: [false, false, false, false] },
          { text: this.euro(p.mindestrente), alignment: 'right', border: [false, false, false, false] }
        ]);
      }

      // ratierlicher Anspruch Hinweis
      if (Number(p.ratierlicherPct) > 0) {
        rows.push([
          { text: `unverfallbarer Anspruch ${this.pct(p.ratierlicherPct)} %`, italics: true, border: [false, false, false, false] },
          { text: '', alignment: 'right', border: [false, false, false, false] },
          { text: this.euro(p.newBetrRente), alignment: 'right', border: [false, false, false, false] }
        ]);
      }

      rows.push([
        { text: 'Betriebliche Rente', bold: true, border: [false, true, false, false] },
        { text: this.euro(p.oldBetrRente), bold: true, alignment: 'right', border: [false, true, false, false] },
        { text: this.euro(p.newBetrRente), bold: true, alignment: 'right', border: [false, true, false, false] }
      ]);

      content.push({
        table: {
          widths: ['*', 90, 90],
          body: rows
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 18]
      });

      content.push(
        { text: 'Mit freundlichen Grüßen', margin: [0, 20, 0, 6] },
        { text: 'BGAG', bold: true },
        { text: 'Beteiligungsgesellschaft der Gewerkschaften GmbH' }
      );

      // Seitenumbruch
      if (idx < letters.length - 1) {
        content.push({ text: '', pageBreak: 'after' });
      }
    });

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [50, 50, 50, 50],
      defaultStyle: { fontSize: 11 },
      content
    };

    const date = new Date().toISOString().split('T')[0];
    pdfMake.createPdf(docDefinition).download(`RGO_Halbjahr1_Bescheide_${date}.pdf`);
  }

  back(): void {
    this.router.navigate(['/list-person']);
  }
}
