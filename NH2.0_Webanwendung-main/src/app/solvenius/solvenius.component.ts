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
    this.personService.getSolveniusExport().subscribe({
      next: (data: any[]) => {
        if (!data || data.length === 0) {
          alert('Keine Daten für den Solvenius-Export vorhanden.');
          return;
        }

        const txtContent = this.generateTxtContent(data);
        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });

        const link = document.createElement('a');
        const now = new Date();
        const stamp =
          now.getFullYear() + '-' +
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0') + '_' +
          String(now.getHours()).padStart(2, '0') +
          String(now.getMinutes()).padStart(2, '0') +
          String(now.getSeconds()).padStart(2, '0');

        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `Solvenius_Export_${stamp}.txt`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Fehler beim Solvenius-Export:', err);
        alert('Fehler beim Erstellen des Solvenius-Exports.');
      }
    });
  }

  private generateTxtContent(data: any[]): string {
    let content = 'Personalnummer;Name;AktuelleRente\n';

    data.forEach(item => {
      content += `${item.personalnummer};${item.name};${this.formatNumber(item.aktuelleRente)}\n`;
    });

    return content;
  }

  private formatNumber(value: any): string {
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(2).replace('.', ',') : '0,00';
  }

  back(): void {
    this.router.navigate(['/list-person']);
  }
}