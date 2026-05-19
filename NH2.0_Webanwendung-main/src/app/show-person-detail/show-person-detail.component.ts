/**
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-person-detail',
  templateUrl: './show-person-detail.component.html',
  styleUrls: ['./show-person-detail.component.css']
})
export class ShowPersonDetailComponent implements OnInit {
  editMode: boolean = false; // Flag to track edit mode
  person: any = {
    name: '',
    personalnummer: '',
    aktuelleStatusgruppe: '',
    alteStatusgruppe: '',
    adresse: '',
    geschlecht: '',
    familienstand: '',
    geburtsdatum: '',
    geheiratetAm: '',
    gesellschaft: '',
    versorgungsordnung: '',
    arbVerhRentTr: '',
    unternehmenseintritt: '',
    unternehmensaustritt: '',
    ruhegeldfaehigAb: '',
    rentenbeginn: '',
    zusagedatum: '',
    verstorbenAm: '',
    bemerkung: ''
    // Add more properties as needed
  };

  constructor(private route: ActivatedRoute, private personService: PersonService) {}

  ngOnInit() {
    const personId = this.route.snapshot.params['id'];


    this.personService.getPersonById(personId).subscribe(
      (data: any) => {
        this.person = data;
      },
      (error: any) => {
        console.error('Error fetching person details:', error);
        // Handle error as needed
      }
    );
  }
}
*/
/**
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-person-detail',
  templateUrl: './show-person-detail.component.html',
  styleUrls: ['./show-person-detail.component.css']
})
export class ShowPersonDetailComponent implements OnInit {
  editMode: boolean = false; // Flag to track edit mode
  person: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService
  ) {}

  ngOnInit() {
    const personId = this.route.snapshot.params['id'];
    this.getPersonDetails(personId);
  }

  getPersonDetails(personId: string) {
    this.personService.getPersonById(personId).subscribe(
      (data: any) => {
        this.person = data;
      },
      (error: any) => {
        console.error('Error fetching person details:', error);
        // Handle error as needed
      }
    );
  }

  // Method to toggle edit mode
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  // Method to save changes

  updatePerson() {
    this.personService.updatePerson(this.person).subscribe(
      (data: any) => {
        console.log('Person updated successfully:', data);
        // Handle success as needed
      },
      (error: any) => {
        console.error('Error updating person:', error);
        // Handle error as needed
      }
    );}
  
}
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';
import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun } from "docx";

@Component({
  selector: 'app-show-person-detail',
  templateUrl: './show-person-detail.component.html',
  styleUrls: ['./show-person-detail.component.css']
})
export class ShowPersonDetailComponent implements OnInit {
  hasEhegatendaten: boolean = false;
  ehegattenDaten: any[] = [];
  editMode: boolean = false; // Flag to track edit mode
  person: any = {
    name: '',
    personalnummer: '',
    aktuelleStatusgruppe: '',
    alteStatusgruppe: '',
    adresse: '',
    geschlecht: '',
    familienstand: '',
    geburtsdatum: '',
    geheiratetAm: '',
    gesellschaft: '',
    versorgungsordnung: '',
    arbVerhRentTr: '',
    unternehmenseintritt: '',
    unternehmensaustritt: '',
    ruhegeldfaehigAb: '',
    rentenbeginn: '',
    zusagedatum: '',
    verstorbenAm: '',
    bemerkung: ''
    // Add more properties as needed
  };

  

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    const personId = this.route.snapshot.params['id'];

    this.personService.getPersonById(personId).subscribe(
      (data: any) => {
        this.person = data;
      },
      (error: any) => {
        console.error('Error fetching person details:', error);
        // Handle error as needed
      }
    );
  }








  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    // Call the service to update the person data
    this.personService.updatePerson(this.person).subscribe(
      (updatedPerson: any) => {
        // Update the person data
        this.person = updatedPerson;
        // Exit edit mode after saving changes
        this.editMode = false;
      },
      (error: any) => {
        console.error('Error updating person:', error);
        // Handle error as needed
      }
    );
  }

  deletePerson() {
    const personId = this.route.snapshot.params['id'];
    this.personService.deletePersonById(personId).subscribe(
      () => {
        console.log(`Person with ID ${personId} deleted successfully.`);
        alert('Person gelöscht');
        this.router.navigate(['/list-person']); // Adjust route as per your application
      },
      (error: any) => {
        console.error('Error deleting person:', error);
        // Handle error as needed
      }
    );
  }

  navigateToShowRentenerstberechnungteil1() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/person/${personId}/rentenerstberechnungteil1`]);
  }

  navigateToShowRentenerstberechnungteil2() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/person/${personId}/rentenerstberechnungteil2`]);
  }

  navigateToEhegattenDaten() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/person/${personId}/ehegattenDaten`]);
  }


  navigateToPensionsDaten(){
    
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/person/${personId}/pensionsDaten`]);
  }

  navigateToDatenbzglderlaufendenrente(){
    
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/person/${personId}/datenbzglderlaufendenrente`]);
  }

  navigateToPersonaldatenzumverbliebenenangehoerigen(){

    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/person/${personId}/personaldatenzumverbliebenenangehoerigen`]);

  }

  navigateToPersonlist(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/list-person`]);
  }

  navigateToPersonaldatenVerstorbener(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/person/${personId}/personaldatenverstorbener`]);

  }

  // Method to export person data to CSV
  exportPersonData() {
    const csvContent = this.generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'person_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private generateCSVContent(): string {
    let csvContent = '';
  
    // Filter keys to include only non-null attributes
    const keys = Object.keys(this.person);
    const fieldsToInclude = keys.filter(key => this.person[key] !== null && this.person[key] !== undefined);
  
    // Construct CSV header dynamically
    const headers = fieldsToInclude.map(field => this.capitalizeFirstLetter(field)).join(',');
  
    // Construct CSV data row dynamically
    const values = fieldsToInclude.map(field => {
      let value = this.person[field];
  
      // Handle special cases for formatting
      if (value instanceof Date) {
        value = this.formatDate(value); // Format Date objects
      } else if (typeof value === 'boolean') {
        value = value ? 'Ja' : 'Nein'; // Convert boolean to German 'Ja' or 'Nein'
      } else if (value === undefined) {
        value = ''; // Handle undefined values
      } else if (value === null) {
        value = ''; // Handle null values
      }
  
      return value;
    }).join(',');
  
    // Append header and values to CSV content only if there are fields to include
    if (fieldsToInclude.length > 0) {
      csvContent += headers + '\r\n';
      csvContent += values + '\r\n';
    }
  
    return csvContent;
  }
  
  // Helper function to capitalize the first letter of a string (if needed)
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Helper function to format Date objects to YYYY-MM-DD format
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
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value);
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





  exportPersonDataToTxt() {
    const content = this.generateTXTContentt();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const fileName = `person_${this.person.personalnummer}.txt`; // Adjust filename as needed
  
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

 



  

  private generateTXTContent(): string {
    let content = '';

    // Filter keys to include only non-null attributes
    const keys = Object.keys(this.person);
    const fieldsToInclude = keys.filter(key => this.person[key] !== null && this.person[key] !== undefined);

    // Construct TXT content dynamically
    fieldsToInclude.forEach(field => {
      let value = this.person[field];

      // Handle special cases for formatting
      if (value instanceof Date) {
        value = this.formatDate(value); // Format Date objects
      } else if (typeof value === 'boolean') {
        value = value ? 'Ja' : 'Nein'; // Convert boolean to German 'Ja' or 'Nein'
      } else if (value === undefined) {
        value = ''; // Handle undefined values
      } else if (value === null) {
        value = ''; // Handle null values
      }

      // Append field name and value to TXT content
      //txtContent += `${this.capitalizeFirstLetterr(field)}: ${value}\r\n`;
      content += `${keys}: ${this.formatValue(value)}\n`;
    });

    return content;
  }

  private capitalizeFirstLetterr(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatDatee(date: Date): string {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  generateTXTContentt(): string {
    let content = '';
    const keys = Object.keys(this.person);
  
    keys.forEach(key => {
      if (key !== '_id' && key !== '__v') { // Skip _id and __v attributes
        const value = this.person[key];
  
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value) && value.length > 0) {
            content += `Daten zu ${key}\n`;
            value.forEach((item: any) => {
              content += `- ${this.formatArrayItem(item)}\n`; // Format each array item
            });
          } else if (!Array.isArray(value)) {
            content += `${key}: ${this.formatValue(value)}\n`;
          }
          // If value is an empty array, it will not be added to the content
        }
      }
    });
  
    return content;
  }
  
  formatArrayItem(item: any): string {
  let formattedItem = '';
  const keys = Object.keys(item);

  keys.forEach((key) => {
    if (
      key !== '_id' &&
      key !== '__v' &&
      item[key] !== null &&
      item[key] !== undefined &&
      item[key] !== ''
    ) {
      const separator = formattedItem === '' ? '' : ', ';
      formattedItem += `${separator}${key}: ${this.formatValue(item[key])}`;
    }
  });

  return formattedItem;
}

markAsDeceased(): void {

  const personId = this.route.snapshot.params['id'];

  // Schritt 1
  const sicher = confirm(
    'Sind Sie sicher, dass diese Person verstorben ist?\n\n' +
    'OK = Ja\n' +
    'Abbrechen = Storno'
  );

  if (!sicher) {
    return;
  }

  // Schritt 2
  const verstorbenAm = prompt(
    'Wann ist die Person verstorben?\n\n' +
    'Bitte Datum im Format YYYY-MM-DD eingeben.\n\n' +
    'Abbrechen = Storno'
  );

  if (verstorbenAm === null || verstorbenAm.trim() === '') {
    return;
  }

  // Schritt 3
  const hasSurvivor = confirm(
    'Gibt es eine hinterbliebene Person?\n\n' +
    'OK = Ja\n' +
    'Abbrechen = Nein'
  );

  // KEINE hinterbliebene Person
  if (!hasSurvivor) {

    const finalConfirm = confirm(
      'Die Person wird nun als verstorben markiert.\n\n' +
      `Sterbedatum: ${verstorbenAm}\n\n` +
      'Es gibt keine hinterbliebene Person.\n\n' +
      'OK = Speichern\n' +
      'Abbrechen = Storno'
    );

    if (!finalConfirm) {
      return;
    }

    this.personService.markPersonAsDeceased(personId, {
      verstorbenAm,
      hasSurvivor: false
    }).subscribe({
      next: (res: any) => {
        alert(res.message);
        window.location.reload();
      },
      error: (err: any) => {
        console.error(err);
        alert('Fehler beim Markieren als verstorben.');
      }
    });

    return;
  }

  // Schritt 4
  const survivorSelection = prompt(
    'Welche Art von hinterbliebener Person gibt es?\n\n' +
    '1 = Ehegatte / Ehegattin\n' +
    '2 = Angehöriger / Angehörige\n\n' +
    'Abbrechen = Storno'
  );

  if (survivorSelection === null) {
    return;
  }

  let survivorType = '';

  if (survivorSelection === '1') {

    survivorType = 'ehegatte';

  } else if (survivorSelection === '2') {

    survivorType = 'angehoeriger';

  } else {

    alert('Ungültige Auswahl.');
    return;
  }

  // Schritt 5
  const survivorPersonalnummer = prompt(
    'Bitte Personalnummer der hinterbliebenen Person eingeben.\n\n' +
    'Abbrechen = Storno'
  );

  if (
    survivorPersonalnummer === null ||
    survivorPersonalnummer.trim() === ''
  ) {
    return;
  }

  // Schritt 6
  const finalConfirm = confirm(
    'Sie sind dabei die Person als verstorben zu markieren.\n\n' +
    `Sterbedatum: ${verstorbenAm}\n` +
    `Hinterbliebene Personalnummer: ${survivorPersonalnummer}\n` +
    `Typ: ${survivorType}\n\n` +

    'Die datenbzglderlaufendenRente der verstorbenen Person\n' +
    'werden bei der hinterbliebenen Person angelegt.\n\n' +

    'Bei der verstorbenen Person werden die\n' +
    'datenbzglderlaufendenRente gelöscht.\n\n' +

    'OK = Durchführung\n' +
    'Abbrechen = Storno'
  );

  if (!finalConfirm) {
    return;
  }

  // Backend-Aufruf
  this.personService.markPersonAsDeceased(personId, {
    verstorbenAm,
    hasSurvivor: true,
    survivorType,
    survivorPersonalnummer
  }).subscribe({
    next: (res: any) => {

      alert(
        'Die Person wurde erfolgreich als verstorben markiert.\n\n' +
        'Die Hinterbliebenen-Daten wurden übernommen.'
      );

      window.location.reload();
    },

    error: (err: any) => {
      console.error(err);

      alert(
        err?.error?.message ||
        'Fehler beim Markieren als verstorben.'
      );
    }
  });
}



  // Word 





  
  
  
  
  
  
  
}

  
  
  
  
  
  
  
  
  
  
  



  
