import { Injectable } from '@angular/core';
import { PersonService } from '../create-user/person.service';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class ExportCsvService {
  constructor(private personService: PersonService) {}

  exportPersonsToCsv() {
    this.personService.getAllPersons().subscribe(
      (persons: any[]) => {
        const csvData = this.convertToCsv(persons);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'persons.csv');
      },
      (error) => {
        console.error('Error fetching persons:', error);
        // Handle error as needed
      }
    );
  }


  exportActivePersonsToCsv() {
  this.personService.getAllPersons().subscribe(
    (persons: any[]) => {

      // 🔍 Filter: nur aktive (nicht verstorben)
      const activePersons = persons.filter(p => {
        const status = (p.aktuelleStatusgruppe || '').toLowerCase();
        return !status.startsWith('verst');
      });

      const csvData = this.convertToCsv(activePersons);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      const fileName = `Aktive_Rentner_${day}${month}${year}.csv`;

      saveAs(blob, fileName);
    },
    (error) => {
      console.error('Error fetching persons:', error);
    }
  );
}


  private convertToCsv(data: any[]): string {
    const csv = Papa.unparse({
      fields: ['Name', 'Personalnummer'],
      data: data.map(person => ({
        Name: person.name || '',
        Personalnummer: person.personalnummer || ''
      }))
    });
    return csv;
  }
}
