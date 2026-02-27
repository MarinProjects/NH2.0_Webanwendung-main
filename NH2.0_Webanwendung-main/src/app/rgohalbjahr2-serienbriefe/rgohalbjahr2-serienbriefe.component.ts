import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

import * as pdfMakeModule from 'pdfmake/build/pdfmake';
import * as pdfFontsModule from 'pdfmake/build/vfs_fonts';

// pdfMake in Angular/ESM: kann unter .default liegen -> sauber abfangen
const pdfMake: any = (pdfMakeModule as any).default || pdfMakeModule;
const pdfFonts: any = (pdfFontsModule as any).default || pdfFontsModule;

// VFS registrieren (Fonts)
pdfMake.vfs = (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;


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
    public router: Router
  ) {
    this.form = this.fb.group({
      terminangabe: ['', Validators.required], // Briefdatum
      gueltigVon: ['', Validators.required],   // Start neues Halbjahr (z.B. 01.07.2025)
      anpassungswertInPct: [0, Validators.required], // z.B. 3.74
      monatlicheMindestrente: [0, Validators.required], // z.B. 196
      sollGesetzlicheRenteAngepasstWerden: [true, Validators.required] // Standard: Ja
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Bitte alle Felder ausfüllen.');
      return;
    }

    const payload = this.form.value;

    // ✅ Daten holen (analog zu Halbjahr 1)
    this.personService.getRGOHalfYear2LetterData(payload).subscribe({
      next: (data: any[]) => {
        if (!data || data.length === 0) {
          alert('Keine Daten für Serienbriefe vorhanden.');
          return;
        }

        const dd = this.buildPdfDefinition(data, payload);

        const dateKey = this.toDateKey(payload.gueltigVon);
        (pdfMake as any).createPdf(dd).download(`RGO_Halbjahr2_Sammelbrief_${dateKey}.pdf`);
      },
      error: (err) => {
        console.error('Fehler beim Erstellen der Sammel-PDF:', err);
        alert('Fehler beim Erstellen der Sammel-PDF. Bitte Konsole prüfen.');
      }
    });
  }

  back(): void {
    this.router.navigate(['/list-person']);
  }

  // =========================
  // PDF BUILDING
  // =========================

  private buildPdfDefinition(letterData: any[], payload: any): any {
    const content: any[] = [];

    letterData.forEach((p: any, index: number) => {
      content.push(this.buildSingleLetter(p, payload));

      // Seitenumbruch zwischen Briefen (nicht nach letztem)
      if (index < letterData.length - 1) {
        content.push({ text: '', pageBreak: 'after' });
      }
    });

    return {
      pageSize: 'A4',
      pageMargins: [50, 40, 50, 40],
      defaultStyle: {
        fontSize: 11
      },
      content
    };
  }

  private buildSingleLetter(p: any, payload: any): any[] {
    // Erwartet: p.name, p.adresse, p.plzOrt optional,
    // p.gesellschaft, p.personalnummer
    // p.oldHalf, p.newHalf (Vorperiode/Neuperiode)
    // p.calculation (vorgefertigte Zahlen für Darstellung)
    //
    // Damit du nicht blockierst, arbeite ich defensiv mit Fallbacks.

    const termin = this.formatDateDE(payload.terminangabe);
    const gueltigVon = this.formatDateDE(payload.gueltigVon);

    const aktenzeichen = `${p.gesellschaft || ''}-${p.personalnummer || ''}`.trim();

    // Vorperiode / Neuperiode:
    const oldGV = p?.oldHalf?.gueltigVon ? this.formatDateDE(p.oldHalf.gueltigVon) : '';
    const newGV = p?.newHalf?.gueltigVon ? this.formatDateDE(p.newHalf.gueltigVon) : gueltigVon;

    const oldGesamt = this.f2(p?.oldHalf?.gesamtversorgung);
    const newGesamt = this.f2(p?.newHalf?.gesamtversorgung);

    const oldSV = this.f2(p?.oldHalf?.gesetzlicheSVRente);
    const newSV = this.f2(p?.newHalf?.gesetzlicheSVRente);

    const oldBetr = this.f2(p?.oldHalf?.betrRente);
    const newBetr = this.f2(p?.newHalf?.betrRente);

    const mindestrente = this.f2(payload.monatlicheMindestrente);
    const pct = this.f2(payload.anpassungswertInPct);

    // Optional: Abschlag/Anspruch/LV für Text + Rechnung
    const abschlagPct = this.f2(p?.calculation?.abschlagPct);
    const ratPct = this.f2(p?.calculation?.ratierlicherAnspruchPct);
    const lv = this.f2(p?.calculation?.renteAusBefrLebensvers);

    // Aufbau der Tabelle (wie Briefvorlagen)
    const tableBody: any[] = [
      [
        { text: 'Rentenzahlung zum', bold: true, margin: [0, 6, 0, 6] },
        { text: oldGV || '', alignment: 'right', bold: true, margin: [0, 6, 0, 6] },
        { text: newGV || '', alignment: 'right', bold: true, margin: [0, 6, 0, 6] }
      ],
      [
        { text: '', border: [false, false, false, false] },
        { text: 'EUR', alignment: 'right', bold: true },
        { text: 'EUR', alignment: 'right', bold: true }
      ],
      [
        { text: 'Gesamtversorgung', margin: [0, 4, 0, 0] },
        { text: oldGesamt, alignment: 'right' },
        { text: newGesamt, alignment: 'right' }
      ],
      [
        { text: '- anrechenbare SV-Rente', margin: [0, 2, 0, 0] },
        { text: oldSV, alignment: 'right' },
        { text: newSV, alignment: 'right' }
      ]
    ];

    // Rente aus befr. LV optional anzeigen (wie Vorlage)
    if (Number(p?.calculation?.renteAusBefrLebensvers) > 0) {
      tableBody.push([
        { text: '- Rente aus befr. Leb.vers.', margin: [0, 2, 0, 0] },
        { text: this.f2(p?.oldHalf?.renteAusBefrLebensvers), alignment: 'right' },
        { text: this.f2(p?.newHalf?.renteAusBefrLebensvers), alignment: 'right' }
      ]);
    }

    // Wenn Abschlag genutzt wird, zeigen wir Zwischensumme/Abschlag (wie Screenshot 2)
    if (Number(p?.calculation?.abschlagPct) > 0) {
      tableBody.push([
        { text: 'Zwischensumme', margin: [0, 2, 0, 0] },
        { text: this.f2(p?.calculation?.zwischensummeAlt), alignment: 'right' },
        { text: this.f2(p?.calculation?.zwischensummeNeu), alignment: 'right' }
      ]);

      tableBody.push([
        { text: '- Abschlag', margin: [0, 2, 0, 0] },
        { text: `${abschlagPct} %`, alignment: 'right' },
        { text: '', alignment: 'right' }
      ]);

      tableBody.push([
        { text: '', border: [false, false, false, false] },
        { text: this.f2(p?.calculation?.nachAbschlagAlt), alignment: 'right' },
        { text: this.f2(p?.calculation?.nachAbschlagNeu), alignment: 'right' }
      ]);
    }

    // Mindestrente Hinweis (wenn angewendet)
    if (p?.calculation?.mindestGreift === true) {
      tableBody.push([
        { text: 'Betriebliche Rente erhöht auf Mindestrente', margin: [0, 2, 0, 0] },
        { text: mindestrente, alignment: 'right' },
        { text: mindestrente, alignment: 'right' }
      ]);
    }

    // Ratierlicher Anspruch anzeigen (wie „unverfallbarer Anspruch“)
    if (Number(p?.calculation?.ratierlicherAnspruchPct) > 0) {
      tableBody.push([
        { text: 'unverfallbarer Anspruch', margin: [0, 2, 0, 0] },
        { text: `${ratPct} %`, alignment: 'right' },
        { text: '', alignment: 'right' }
      ]);
    }

    // Endbetrag betriebliche Rente (wie Vorlage)
    tableBody.push([
      { text: '= Betriebliche Rente', bold: true, margin: [0, 6, 0, 0] },
      { text: oldBetr, alignment: 'right', bold: true, margin: [0, 6, 0, 0] },
      { text: newBetr, alignment: 'right', bold: true, margin: [0, 6, 0, 0] }
    ]);

    // Kopf + Text (angepasst für Halbjahr 2)
    const letter: any[] = [
      // Adresse links / Datum + Aktenzeichen rechts
      {
        columns: [
          {
            width: '*',
            text: [
              `${p.name || ''}\n`,
              `${p.adresse || ''}\n`,
              `${p.plzOrt || ''}\n`
            ]
          },
          {
            width: 180,
            text: [
              `${termin}\n`,
              `${aktenzeichen}\n`
            ],
            alignment: 'right'
          }
        ]
      },

      { text: '\n' },

      { text: 'Betriebliche Altersversorgung', bold: true },
      { text: `Anpassung nach Par. 11 der Ruhegeldordnung zum ${gueltigVon}`, margin: [0, 0, 0, 10] },

      { text: `Sehr geehrte(r) ${this.getAnredeName(p.name)},`, margin: [0, 0, 0, 10] },

      {
        text:
          `die gesetzliche Rente wurde zum ${gueltigVon} um ${pct} % ` +
          `angepasst. Nachstehend die Neuberechnung Ihrer betrieblichen Rente.`,
        margin: [0, 0, 0, 10]
      },

      {
        table: {
          widths: ['*', 120, 120],
          body: tableBody
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 14]
      },

      { text: 'Mit freundlichen Grüßen', margin: [0, 20, 0, 4] },
      { text: 'BGAG\nBeteiligungsgesellschaft der Gewerkschaften GmbH' }
    ];

    return letter;
  }

  // =========================
  // Helpers
  // =========================

  private toDateKey(d: any): string {
    const x = new Date(d);
    const yyyy = x.getFullYear();
    const mm = String(x.getMonth() + 1).padStart(2, '0');
    const dd = String(x.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private formatDateDE(d: any): string {
    if (!d) return '';
    const x = new Date(d);
    const dd = String(x.getDate()).padStart(2, '0');
    const mm = String(x.getMonth() + 1).padStart(2, '0');
    const yyyy = x.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

  private f2(v: any): string {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : '0.00';
  }

  private getAnredeName(name: string): string {
    if (!name) return 'Damen und Herren';
    // Wenn du „Frau/Herr“ getrennt speichern willst, sag Bescheid.
    // Hier wird einfach Name genutzt (wie deine bisherigen Texte).
    return name;
  }
}
