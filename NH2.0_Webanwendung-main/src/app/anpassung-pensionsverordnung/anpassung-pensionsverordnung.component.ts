// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

@Component({
  selector: 'app-anpassung-pensionsverordnung',
  templateUrl: './anpassung-pensionsverordnung.component.html',
  styleUrls: ['./anpassung-pensionsverordnung.component.css']
})
export class AnpassungPensionsverordnungComponent implements OnInit {
  adjustmentForm: FormGroup;
  showSuccessAlert: boolean = false;
  adjustmentDetails: any[] = []; // Store adjustment details
  latestAdjustments: { [personalnummer: string]: any } = {};

  constructor(private formBuilder: FormBuilder, private personService: PersonService, private router: Router) {
    this.adjustmentForm = this.formBuilder.group({
      dateOnAdjustmentOccurs: ['', Validators.required],
      monatlicheMindestrente: ['', Validators.required],
      lebensunterhaltungskosteindizesInPct: ['', Validators.required],
      steigungssatzInDerWohnungswirtschaftInPct: ['', Validators.required],
      beitragsbemessungsgrenze: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }


onSubmit(): void {
  if (this.adjustmentForm.valid) {
    const formData = this.adjustmentForm.value;

    this.personService.submitAdjustment(formData).subscribe(
      response => {
        alert(response.message); // Show the number of adjusted persons

        // Ask the user if they want to create letters
        if (confirm('Möchten Sie Bescheide erstellen?')) {
          this.promptForAdjustmentDetails(); // Prompt for adjustment details and create letters
        } else {
          this.router.navigate(['/list-person']); // Redirect if user does not want to create letters
        }
      },
      error => {
        console.error('Error submitting adjustment:', error);
        alert('An error occurred while submitting the adjustment.');
      }
    );
  } else {
    console.error('Form is invalid. Cannot submit.');
  }
}


  public getLatestAdjustments(details: any[]): { [personalnummer: string]: any } {
    const latestAdjustments: { [personalnummer: string]: any } = {};

    details.forEach(detail => {
      const personalnummer = detail.personalnummer;
      if (!latestAdjustments[personalnummer] || detail.date > latestAdjustments[personalnummer].date) {
        latestAdjustments[personalnummer] = {
          ...detail,
          date: detail.date // Assuming 'date' is a field indicating the date of the adjustment
        };
      }
    });

    return latestAdjustments;
  }

  private downloadCSV(details: any[]): void {
    const csvContent = this.convertToCSV(details);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    link.href = URL.createObjectURL(blob);
    link.download = `Kontrolliste_Anpassungen_PV_${currentDate}.csv`;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  }

  public convertToCSV(details: any[]): string {
    const header = 'Personalnummer,Name,Pension der letzten Periode,Pension der neuen Periode,BetrRente der alten Periode,BetrRente der neuen Periode\n';
    const rows = details.map(detail =>
      `${detail.personalnummer},${detail.name},${this.formatNumber(detail.pensionLastPeriod)},${this.formatNumber(detail.pensionNewPeriod)},${this.formatNumber(detail.betrRenteLastPeriod)},${this.formatNumber(detail.betrRenteNewPeriod)}`
    );
    return header + rows.join('\n');
  }

  private formatNumber(value: number): string {
    return value ? value.toFixed(2) : '0.00';
  }

  closeAlert(): void {
    this.showSuccessAlert = false; // Close the success alert
  }

  navigateToPersonList() {
    this.router.navigate(['/list-person']);
  }


  promptForAdjustmentDetails(): void {
    const lebensunterhaltungskosteindizesInPct = prompt("Enter Lebensunterhaltungskosteindizes in %:");
    const steigungssatzInDerWohnungswirtschaftInPct = prompt("Enter Steigungssatz in der Wohnungsiwrtschaft in %:");
    const beitragsbemessungsgrenze = prompt("Enter Beitragsbemessungsgrenze:");

    if (lebensunterhaltungskosteindizesInPct !== null && steigungssatzInDerWohnungswirtschaftInPct !== null && beitragsbemessungsgrenze !== null) {
      const parsedLebensunterhaltungskosteindizesInPct = parseFloat(lebensunterhaltungskosteindizesInPct);
      const parsedSteigungssatzInDerWohnungswirtschaftInPct = parseFloat(steigungssatzInDerWohnungswirtschaftInPct);
      const parsedBeitragsbemessungsgrenze = parseFloat(beitragsbemessungsgrenze);

      if (!isNaN(parsedLebensunterhaltungskosteindizesInPct) && !isNaN(parsedSteigungssatzInDerWohnungswirtschaftInPct) && !isNaN(parsedBeitragsbemessungsgrenze)) {
        this.createLetters(parsedLebensunterhaltungskosteindizesInPct, parsedSteigungssatzInDerWohnungswirtschaftInPct, parsedBeitragsbemessungsgrenze);
      } else {
        alert('Invalid input. Please enter valid numbers.');
      }
    } else {
      alert('Input cancelled.');
    }
  }

  createLetters(lebensunterhaltungskosteindizesInPct: number, steigungssatzInDerWohnungswirtschaftInPct: number, beitragsbemessungsgrenze: number): void {
    const zip = new JSZip();
    const folderName = `${new Date().toISOString().split('T')[0]}_Bescheide`;
    const folder = zip.folder(folderName);

    if (folder) {
      this.personService.getTwoLatestAdjustmentsPV().subscribe(
        data => {
          if (data.length === 0) {
            alert('No latest adjustment details available for letter creation.');
            return;
          }

          const letters = [];
          const csvData: any[] = [];

          data.forEach((person: { adjustments: any; name: any; adresse: any; personalnummer: any; geburtsdatum: string | number | Date; }) => {
            const details = person.adjustments;

            if (details.length < 2) {
              return; // Skip if less than 2 periods
            }

            const latestAdjustment = details[0];
            const previousAdjustment = details[1]; // Second most recent

            const letterContent = `
              Name: ${person.name || 'N/A'}
              Street: ${person.adresse || 'N/A'}
              Personalnummer: ${person.personalnummer || 'N/A'}
              Birthdate: ${person.geburtsdatum ? new Date(person.geburtsdatum).toLocaleDateString() : 'N/A'}

              Gehaltsabrechnung ${this.adjustmentForm.get('dateOnAdjustmentOccurs')?.value}

              Alte BetrRente: ${this.formatNumber(previousAdjustment.betrRente)}
              Neue BetrRente: ${this.formatNumber(latestAdjustment.betrRente)}


              Anpassung zum: ${this.adjustmentForm.get('dateOnAdjustmentOccurs')?.value}

              Lebensunterhaltungskosteindizes: ${lebensunterhaltungskosteindizesInPct}%
              Steigungssatz in der Wohnungsiwrtschaft: ${steigungssatzInDerWohnungswirtschaftInPct}%
              Beitragsbemessungsgrenze: ${this.formatNumber(beitragsbemessungsgrenze)}
            `;

            folder.file(`Letter_${person.personalnummer}.txt`, letterContent);

            // Collect data for CSV
            csvData.push({
              personalnummer: person.personalnummer,
              name: person.name || 'N/A',
              pensionLastPeriod: this.formatNumber(previousAdjustment.pension),
              pensionNewPeriod: this.formatNumber(latestAdjustment.pension),
              betrRenteLastPeriod: this.formatNumber(previousAdjustment.betrRente),
              betrRenteNewPeriod: this.formatNumber(latestAdjustment.betrRente)
            });

            letters.push(letterContent);
          });

          zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, `${folderName}.zip`);

            // After the letters are downloaded, ask if the user wants to create a checklist
            if (confirm('Möchten Sie eine Kontrolliste erstellen?')) {
              this.createCSV(csvData);
            }
          });
        },
        error => {
          console.error('Error fetching latest adjustments:', error);
          alert('An error occurred while fetching the latest adjustments.');
        }
      );
    } else {
      alert('Could not create the folder. Please try again.');
    }
  }


  createCSV(data: any[]): void {
    const csv = Papa.unparse(data);
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, 'Kontrolliste.csv');
  }


}
