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
