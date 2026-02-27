import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-anpassung-rgo-halbjahr2',
  templateUrl: './anpassung-rgohalbjahr2.component.html',
  styleUrls: ['./anpassung-rgohalbjahr2.component.css']
})
export class AnpassungRGOHalbjahr2Component {
  form: FormGroup;
  adjustmentDetails: any[] = [];

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router
  ) {
    this.form = this.fb.group({
      terminangabe: ['', Validators.required],
      gueltigVon: ['', Validators.required],
      gueltigBis: ['', Validators.required],
      monatlicheMindestrente: [0, [Validators.required]],
      sollGesetzlicheRenteAngepasstWerden: [true, Validators.required],
      anpassungswertInPct: [0, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      alert('Bitte alle Felder korrekt ausfüllen.');
      return;
    }

    this.personService.submitRGOHalfYear2Adjustment(this.form.value).subscribe({
      next: (res) => {
        alert(res.message);
        this.adjustmentDetails = res.adjustmentDetails || [];

        if (this.adjustmentDetails.length > 0) {
          if (confirm('Möchten Sie eine Kontrolliste herunterladen?')) {
            this.downloadCSV(this.adjustmentDetails);
          }
        }

        this.router.navigate(['/list-person']);
      },
      error: (err) => {
        console.error(err);
        alert('Fehler bei der Berechnung. Bitte Konsole/Backend prüfen.');
      }
    });
  }

  private downloadCSV(details: any[]): void {
    const header =
      'Personalnummer,Name,gesetzl. SV-Rente letztes Halbjahr,gesetzl. SV-Rente neues Halbjahr,BetrRente letztes Halbjahr,BetrRente neues Halbjahr\n';

    const rows = details.map(d =>
      `${d.personalnummer},"${(d.name || '').replace(/"/g, '""')}",${this.f2(d.gesetzlicheSVRenteLastHalf)},${this.f2(d.gesetzlicheSVRenteNewHalf)},${this.f2(d.betrRenteLastHalf)},${this.f2(d.betrRenteNewHalf)}`
    );

    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const currentDate = new Date().toISOString().split('T')[0];
    link.href = URL.createObjectURL(blob);
    link.download = `Kontrolliste_RGO_Halbjahr2_${currentDate}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  navigateToPersonList() {
    this.router.navigate(['/list-person']);
  }

  private f2(v: any): string {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : '0.00';
  }
}