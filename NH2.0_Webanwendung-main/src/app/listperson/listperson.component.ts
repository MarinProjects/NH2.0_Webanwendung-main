/** 
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-listperson',
  templateUrl: './listperson.component.html',
  styleUrls: ['./listperson.component.css']
})
export class ListPersonComponent implements OnInit {
  persons: any[] = [];
  searchPersonalnummer: string = '';

  constructor(private router: Router, private personService: PersonService) { }

  ngOnInit() {
    this.loadPersons();
  }


loadPersons() {
  if (this.searchPersonalnummer.trim() !== '') {
    this.personService.getPersonByPersonalnummer(this.searchPersonalnummer).subscribe(
      (data: any) => {
        this.persons = data ? [data] : []; // Wrap single object in array or empty array if not found
      },
      (error: any) => {
        console.error('Error fetching person by personalnummer:', error);
        // Handle error as needed
      }
    );
  } else {
    this.personService.getAllPersons().subscribe(
      (data: any) => {
        this.persons = data;
      },
      (error: any) => {
        console.error('Error fetching persons:', error);
        // Handle error as needed
      }
    );
  }
}
  showPersonDetail(personId: string) {
    this.router.navigate(['/person', personId]);
  }

  searchByPersonalnummer() {
    this.loadPersons(); // Reload persons based on updated searchPersonalnummer
  }

}
*/

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonService } from '../create-user/person.service';
import { ExportCsvService } from './export-csv.service';
import { saveAs } from 'file-saver'; 
import JSZip from 'jszip';
import * as Papa from 'papaparse';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listperson',
  templateUrl: './listperson.component.html',
  styleUrls: ['./listperson.component.css']
})
export class ListPersonComponent implements OnInit {
  persons: any[] = [];
  personalnummerSearch: string = '';

  constructor(private http: HttpClient ,private router: Router, private exportCsvService: ExportCsvService, private personService: PersonService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadPersons();
  }

 

  exportPersons() {
    this.exportCsvService.exportPersonsToCsv();
  }

  exportAllPersonsToTxt() {
    const zip = new JSZip();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    this.persons.forEach(person => {
      const content = this.generateTXTContent(person);
      const fileName = `person_${person.personalnummer}.txt`;
      zip.file(fileName, content);
    });

    zip.generateAsync({ type: 'blob' }).then(blob => {
      saveAs(blob, `${formattedDate}_personexport.zip`);
    });
  }

  loadPersons() {
    this.personService.getAllPersons().subscribe(
      (data: any) => {
        this.persons = data;
      },
      (error: any) => {
        console.error('Error fetching persons:', error);
      }
    );
  }

  navigateToCreatePerson(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/createperson`]);
  }

  navigateToPVAnpassung(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/PVAnpassung`]);
  }

  navigateToRGOAnpassung(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/RGOAnpassung`]);

  }

  navigateToRGOHalbjahr1() {
  this.router.navigate([`/RGOHalbjahr1`]);
}

navigateToRGOSerienbriefH1() {
  this.router.navigate(['/rgo-halbjahr1-serienbriefe']);
}

navigateToRGOHalfYear2() {
  this.router.navigate(['/rgo-halbjahr2']);
}

navigateToRGOHalfYear2Letters() {
  this.router.navigate(['/rgo-halbjahr2-serienbriefe']);
}

navigateToSolvenius() {
  this.router.navigate(['/solvenius']);
}

navigateToActivePensioners() {
  this.router.navigate(['/active-pensioners']);
}




  showPersonDetail(personId: string) {
    this.router.navigate(['/person', personId]);
  }

  searchByPersonalnummer() {
    if (this.personalnummerSearch.trim() === '') {
      this.loadPersons();
      return;
    }

    this.personService.getPersonByPersonalnummer(this.personalnummerSearch.trim()).subscribe(
      (data: any) => {
        this.persons = data ? [data] : [];
      },
      (error: any) => {
        console.error('Error fetching person by personalnummer:', error);
        this.persons = [];
      }
    );
  }


  


  exportPersonDetailsToTxt(person: any) {
    const content = this.generateTXTContent(person);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const fileName = `person_${person.personalnummer}.txt`;

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);

    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private generateTXTContent(person: any): string {
    let txtContent = `Personalstammsatz zu ${person.personalnummer}\r\n`;

    const keys = Object.keys(person);

    keys.forEach(key => {
      if (key !== '_id' && key !== '__v') { // Skip _id and __v attributes
        const value = person[key];

        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value) && value.length > 0) {
            txtContent += `\r\nDaten zu ${key}\r\n`;
            value.forEach((item: any) => {
              txtContent += `- ${this.formatArrayItem(item)}\r\n`; // Format each array item
            });
          } else if (!Array.isArray(value)) {
            txtContent += `${this.capitalizeFirstLetter(key)}: ${this.formatValue(value)}\r\n`;
          }
        }
      }
    });

    return txtContent;
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

private formatValue(value: any): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  if (this.isDateValue(value)) {
    return this.formatDate(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Ja' : 'Nein';
  }

  return `${value}`;
}

private isDateValue(value: any): boolean {
  if (value instanceof Date) {
    return true;
  }

  if (typeof value === 'string') {
    return /^\d{4}-\d{2}-\d{2}T/.test(value);
  }

  return false;
}

private formatDate(value: any): string {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return `${value}`;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

private formatArrayItem(item: any): string {
  let formattedItem = '';
  const keys = Object.keys(item);

  keys.forEach((key, index) => {
    if (
      key !== '_id' &&
      key !== '__v' &&
      item[key] !== null &&
      item[key] !== undefined &&
      item[key] !== ''
    ) {
      const separator = formattedItem === '' ? '' : ', ';
      formattedItem += `${separator}${this.capitalizeFirstLetter(key)}: ${this.formatValue(item[key])}`;
    }
  });

  return formattedItem;
}


  backupDatabase() {
  this.http.get('/api/backupDatabase', { responseType: 'blob' }).subscribe(
    (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      const fileName = `NeueHeimat_Sicherung_${day}${month}${year}.gz`;

      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    (error: any) => {
      console.error('Error downloading backup:', error);
      alert('Failed to download database backup.');
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


exportDeceasedPersonsToCsv() {
  this.personService.getAllPersons().subscribe(
    (persons: any[]) => {

      // 🔍 Filter: nur Verstorbene
      const deceasedPersons = persons.filter(p => {
        const status = (p.aktuelleStatusgruppe || '').toLowerCase();
        return status.startsWith('verst');
      });

      const csvData = this.convertToCsv(deceasedPersons);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      const fileName = `Verstorbene_${day}${month}${year}.csv`;

      saveAs(blob, fileName);
    },
    (error) => {
      console.error('Error fetching persons:', error);
    }
  );
}


exportRGOPersons() {
  this.exportCsvService.exportRGOPersonsToCsv();
}

exportImportFile() {
  this.exportCsvService.exportImportFile();
}











}




  

  

