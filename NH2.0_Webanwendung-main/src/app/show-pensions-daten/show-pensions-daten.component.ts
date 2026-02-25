
/**
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-pensions-daten',
  templateUrl: './show-pensions-daten.component.html',
  styleUrls: ['./show-pensions-daten.component.css']
})
export class ShowPensionsDatenComponent implements OnInit {
  editMode: boolean = false; // Flag to track edit mode
  pensionsDaten: any = {
    
    ratierlicherAnspruch: '',
    prozentsatzTeiluebertragung: '',
    pensionsfaehigesDurchschnittsgehaltVA: '',
    sozVersPflJahresgehaltVA: '',
    ruhegeldfaehigesDurchschnittsgehalt: '',
    durchschnittsgehaltNachSozialplan: '',
    teilzeitgrad: '',
    sozVersFreieJahreAb20: '',
    schwerbehindert: '',
    anzahlKinder: '',
    steuerklasse: '',
    bemerkung: ''
    // Add more properties as needed
  };

  constructor(private route: ActivatedRoute, private personService: PersonService) {}

  ngOnInit() {
    
    const personId = this.route.snapshot.params['id'];
    const pensionsDatenId = this.route.snapshot.params['pensionsDatenId'];
    console.log(personId);
    console.log(pensionsDatenId);
    this.personService.getPensionsDaten(personId, pensionsDatenId).subscribe(
      (data: any) => {
        this.pensionsDaten = data;
      },
      (error: any) => {
        console.error('Error fetching pensionsdaten:', error);
        // Handle error as needed
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    const personId = this.route.snapshot.params['id'];
    //const pensionsDatenId = this.pensionsDaten._id; // Assuming the ID is stored in the _id attribute
    const pensionsDatenId = this.route.snapshot.params['pensionsDatenId'];

    // Call the service to update the pensionsDaten
    this.personService.updatePensionsDaten(personId, pensionsDatenId, this.pensionsDaten).subscribe(
      (updatedPensionsDaten: any) => {
        // Update the pensionsDaten
        this.pensionsDaten = updatedPensionsDaten;
        // Exit edit mode after saving changes
        this.editMode = false;
      },
      (error: any) => {
        console.error('Error updating pensionsDaten:', error);
        // Handle error as needed
      }
    );
  }
}

*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-pensions-daten',
  templateUrl: './show-pensions-daten.component.html',
  styleUrls: ['./show-pensions-daten.component.css']
})
export class ShowPensionsDatenComponent implements OnInit {
  editMode: boolean = false; // Flag to track edit mode
  pensionsDaten: any = {
    ratierlicherAnspruch: '',
    prozentsatzTeiluebertragung: '',
    pensionsfaehigesDurchschnittsgehaltVA: '',
    sozVersPflJahresgehaltVA: '',
    ruhegeldfaehigesDurchschnittsgehalt: '',
    durchschnittsgehaltNachSozialplan: '',
    teilzeitgrad: '',
    sozVersFreieJahreAb20: '',
    schwerbehindert: '',
    anzahlKinder: '',
    steuerklasse: '',
    bemerkung: ''
    // Add more properties as needed
  };

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    this.fetchPensionsDaten();
  }

  fetchPensionsDaten() {
    const personId = this.route.snapshot.params['id'];
    const pensionsDatenId = this.route.snapshot.params['pensionsDatenId'];

    this.personService.getPensionsDaten(personId, pensionsDatenId).subscribe(
      (data: any) => {
        this.pensionsDaten = data;
      },
      (error: any) => {
        console.error('Error fetching pensionsdaten:', error);
        // Handle error as needed
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    const personId = this.route.snapshot.params['id'];
    const pensionsDatenId = this.route.snapshot.params['pensionsDatenId'];

    // Call the service to update the pensionsDaten
    this.personService.updatePensionsDaten(personId, pensionsDatenId, this.pensionsDaten).subscribe(
      (updatedPensionsDaten: any) => {
        // Update the pensionsDaten
        this.pensionsDaten = updatedPensionsDaten;
        // Exit edit mode after saving changes
        this.editMode = false;
        
        // Fetch the updated data again after saving
        this.fetchPensionsDaten();
      },
      (error: any) => {
        console.error('Error updating pensionsDaten:', error);
        // Handle error as needed
      }
    );
  }

  deletePensionsDaten() {
    const personId = this.route.snapshot.params['id'];
    const pensionsDatenId = this.route.snapshot.params['pensionsDatenId'];

    this.personService.deletePensionsDaten(personId, pensionsDatenId).subscribe(
      () => {
        console.log('PensionsDaten deleted successfully');
        alert('PensionsDaten gelöscht');
        
        // Redirect to person detail or any other desired route after deletion
        this.router.navigate(['/person', personId]);
      },
      (error: any) => {
        console.error('Error deleting PensionsDaten:', error);
      }
    );
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
  
}
