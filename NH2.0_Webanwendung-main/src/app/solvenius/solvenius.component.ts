/** 
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-solvenius',
  templateUrl: './solvenius.component.html',
  styleUrls: ['./solvenius.component.css']
})
export class SolveniusComponent {

  constructor(
    private personService: PersonService,
    private router: Router
  ) {}

  createExport(): void {
    this.personService.getAllPersons().subscribe({
      next: (persons: any[]) => {

        const rgoPersons = persons.filter(p =>
          [72, 73, 79].includes(Number(p.versorgungsordnung))
        );

        const lines81A: string[] = [];
        const linesOther: string[] = [];

        let fileDay = '01';

        rgoPersons.forEach(person => {
          const latest = this.getLatestRentenEintrag(person);

          if (!latest) {
            return;
          }

          const line = this.createSolveniusLine(person, latest);

          const dayFromGueltigVon = this.getDayFromDate(latest.gueltigVon);
          if (dayFromGueltigVon) {
            fileDay = dayFromGueltigVon;
          }

          if (person.gesellschaft === '81A') {
            lines81A.push(line);
          } else {
            linesOther.push(line);
          }
        });

        if (lines81A.length === 0 && linesOther.length === 0) {
          alert('Keine RGO-Daten für Solvenius-Export vorhanden.');
          return;
        }

        if (lines81A.length > 0) {
          this.downloadTxt(`ANP01${fileDay}.TXT`, lines81A.join('\r\n'));
        }

        if (linesOther.length > 0) {
          this.downloadTxt(`ANP02${fileDay}.TXT`, linesOther.join('\r\n'));
        }

        alert('Solvenius-Export wurde erstellt.');
      },

      error: (err: any) => {
        console.error('Fehler beim Solvenius-Export:', err);
        alert('Fehler beim Erstellen des Solvenius-Exports.');
      }
    });
  }

  private getLatestRentenEintrag(person: any): any {
    const arr = person.datenbzglderlaufendenRente || [];

    if (arr.length === 0) {
      return null;
    }

    return arr
      .filter((e: any) => e.gueltigVon)
      .sort((a: any, b: any) =>
        new Date(b.gueltigVon).getTime() - new Date(a.gueltigVon).getTime()
      )[0];
  }

  private createSolveniusLine(person: any, rente: any): string {
    const gesellschaftCode = person.gesellschaft === '81A' ? '181' : '191';

    const personalnummer = String(person.personalnummer || '').padStart(6, '0');

    const ersterTeil = `P34 ${gesellschaftCode}000${personalnummer}`;

    const gueltigVon = this.formatDateDDMMYYYY(rente.gueltigVon);

    const bezugsart = String(rente.bezugsart || 0).padStart(3, '0');

    const betragOhneKomma = this.formatBetrRente(rente.betrRente);

    const zweiterTeil = `${gueltigVon}0${bezugsart}=0220${betragOhneKomma}*`;

    return `${ersterTeil}  ${zweiterTeil}`;
  }

  private formatDateDDMMYYYY(value: any): string {
    const d = new Date(value);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}${month}${year}`;
  }

  private getDayFromDate(value: any): string {
    const d = new Date(value);

    if (isNaN(d.getTime())) {
      return '01';
    }

    return String(d.getDate()).padStart(2, '0');
  }

  private formatBetrRente(value: any): string {
    const n = Number(value);

    if (!Number.isFinite(n)) {
      return '000000';
    }

    const cents = Math.round(n * 100);

    return String(cents).padStart(6, '0');
  }

  private downloadTxt(fileName: string, content: string): void {
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  back(): void {
    this.router.navigate(['/list-person']);
  }
}

*/

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-solvenius',
  templateUrl: './solvenius.component.html',
  styleUrls: ['./solvenius.component.css']
})
export class SolveniusComponent {

  constructor(
    private personService: PersonService,
    private router: Router
  ) {}

  createExport(): void {
    this.personService.getAllPersons().subscribe({
      next: (persons: any[]) => {

        const rgoPersons = persons.filter(p =>
          [72, 73, 79].includes(Number(p.versorgungsordnung))
        );

        const lines81A: string[] = [];
        const linesOther: string[] = [];

        let fileDayMonth = '0107';

        rgoPersons.forEach(person => {
          const latest = this.getLatestRentenEintrag(person);

          if (!latest) {
            return;
          }

          const line = this.createSolveniusLine(person, latest);

          const dayMonthFromGueltigVon = this.getDayMonthFromDate(latest.gueltigVon);

          if (dayMonthFromGueltigVon) {
            fileDayMonth = dayMonthFromGueltigVon;
          }

          if (person.gesellschaft === '81A') {
            lines81A.push(line);
          } else {
            linesOther.push(line);
          }
        });

        if (lines81A.length === 0 && linesOther.length === 0) {
          alert('Keine RGO-Daten für Solvenius-Export vorhanden.');
          return;
        }

        if (lines81A.length > 0) {
          this.downloadTxt(`ANP${fileDayMonth}.GSP`, lines81A.join('\r\n'));
        }

        if (linesOther.length > 0) {
          this.downloadTxt(`ANP${fileDayMonth}.NH`, linesOther.join('\r\n'));
        }

        alert('Solvenius-Export wurde erstellt.');
      },

      error: (err: any) => {
        console.error('Fehler beim Solvenius-Export:', err);
        alert('Fehler beim Erstellen des Solvenius-Exports.');
      }
    });
  }

  private getLatestRentenEintrag(person: any): any {
    const arr = person.datenbzglderlaufendenRente || [];

    if (arr.length === 0) {
      return null;
    }

    return arr
      .filter((e: any) => e.gueltigVon)
      .sort((a: any, b: any) =>
        new Date(b.gueltigVon).getTime() - new Date(a.gueltigVon).getTime()
      )[0];
  }

  private createSolveniusLine(person: any, rente: any): string {
    const gesellschaftCode = person.gesellschaft === '81A' ? '181' : '191';

    const personalnummer = String(person.personalnummer || '').padStart(6, '0');

    const ersterTeil = `P34 ${gesellschaftCode}000${personalnummer}`;

    const gueltigVon = this.formatDateDDMMYYYY(rente.gueltigVon);

    const bezugsart = String(rente.bezugsart || 0).padStart(3, '0');

    const betragOhneKomma = this.formatBetrRente(rente.betrRente);

    const zweiterTeil = `${gueltigVon}0${bezugsart}=0220${betragOhneKomma}*`;

    return `${ersterTeil}      ${zweiterTeil}`;
  }

  private formatDateDDMMYYYY(value: any): string {
    const d = new Date(value);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}${month}${year}`;
  }

  private getDayMonthFromDate(value: any): string {
    const d = new Date(value);

    if (isNaN(d.getTime())) {
      return '0107';
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');

    return `${day}${month}`;
  }

  private formatBetrRente(value: any): string {
    const n = Number(value);

    if (!Number.isFinite(n)) {
      return '000000';
    }

    const cents = Math.round(n * 100);

    return String(cents).padStart(6, '0');
  }

  private downloadTxt(fileName: string, content: string): void {
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  back(): void {
    this.router.navigate(['/list-person']);
  }
}