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


// Export RGO Persons
exportRGOPersonsToCsv() {
  this.personService.getAllPersons().subscribe(
    (persons: any[]) => {

      const rgoPersons = persons.filter(p =>
        [72, 73, 79].includes(Number(p.versorgungsordnung))
      );

      const csvData = this.convertRGOPersonsToCsv(rgoPersons);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      const fileName = `RGO_Personen_${day}${month}${year}.csv`;

      saveAs(blob, fileName);
    },
    (error) => {
      console.error('Error fetching RGO persons:', error);
    }
  );
}

// Help function for exportRGOPersonsToCsv

private convertRGOPersonsToCsv(data: any[]): string {
  const csv = Papa.unparse({
    fields: ['Personalnummer', 'Name', 'Versorgungsordnung'],
    data: data.map(person => ({
      Personalnummer: person.personalnummer || '',
      Name: person.name || '',
      Versorgungsordnung: person.versorgungsordnung || ''
    }))
  });

  return csv;
}


exportImportFile() {

  this.personService.getAllPersons().subscribe(
    (persons: any[]) => {

      const content = this.generateImportFile(persons);

      const blob = new Blob(
        [content],
        { type: 'application/javascript;charset=utf-8' }
      );

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      saveAs(
        blob,
        `Import_${day}${month}${year}.js`
      );
    },
    (error) => {
      console.error(error);
    }
  );
}

private generateImportFile(persons: any[]): string {

  const jsonData = persons.map(person => {

    const clone = JSON.parse(JSON.stringify(person));

    delete clone._id;
    delete clone.__v;

    return this.convertDatesToJS(clone);

  });

  return `
const axios = require('axios');

const dataToInsert = ${JSON.stringify(jsonData, null, 2)}
  .map(person => reviveDates(person));

function reviveDates(obj) {

  const dateFields = [
    'geburtsdatum',
    'geheiratetAm',
    'unternehmenseintritt',
    'unternehmensaustritt',
    'ruhegeldfaehigAb',
    'rentenbeginn',
    'zusagedatum',
    'verstorbenAm'
  ];

  dateFields.forEach(field => {

    if (obj[field]) {
      obj[field] = new Date(obj[field]);
    }

  });

  return obj;
}

async function insertData() {

  for (let i = 0; i < dataToInsert.length; i++) {

    const person = dataToInsert[i];

    try {

      await axios.post(
        'http://localhost:4000/api/person',
        person
      );

      console.log(
        \`✔️ Inserted personalnummer \${person.personalnummer}\`
      );

    } catch (error) {

      if (error.response) {

        if (error.response.status === 400) {

          console.warn(
            \`⚠️ personalnummer \${person.personalnummer} exists – skipped\`
          );

          continue;
        }

        console.error(
          \`❌ HTTP \${error.response.status}\`,
          error.response.data
        );

      } else {

        console.error(error.message);

      }
    }
  }

  console.log('✅ Import finished.');
}

insertData();
`;
}

private convertDatesToJS(obj: any): any {

  Object.keys(obj).forEach(key => {

    const value = obj[key];

    if (value instanceof Array) {

      value.forEach(v => this.convertDatesToJS(v));

    } else if (
      value &&
      typeof value === 'object'
    ) {

      this.convertDatesToJS(value);

    }
  });

  return obj;
}




}
