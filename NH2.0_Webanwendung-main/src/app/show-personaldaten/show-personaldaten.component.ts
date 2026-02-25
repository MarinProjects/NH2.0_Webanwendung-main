import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-personaldaten',
  templateUrl: './show-personaldaten.component.html',
  styleUrls: ['./show-personaldaten.component.css']
})
export class ShowPersonaldatenComponent implements OnInit {
  editMode: boolean = false; // Flag to track edit mode
  personaldaten: any = {
    name: '',
    geburtsdatum: '',
    prozentsatz: ''
    // Add more properties as needed
  };

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    this.fetchPersonalDaten();
  }

  fetchPersonalDaten() {
    const personId = this.route.snapshot.params['id'];
    const personaldatenId = this.route.snapshot.params['personaldatenId'];

    this.personService.getPersonalDaten(personId, personaldatenId).subscribe(
      (data: any) => {
        this.personaldaten = data;
      },
      (error: any) => {
        console.error('Error fetching personaldaten:', error);
        // Handle error as needed
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    const personId = this.route.snapshot.params['id'];
    const personaldatenId = this.route.snapshot.params['personaldatenId'];

    // Call the service to update the personaldaten
    this.personService.updatePersonalDaten(personId, personaldatenId, this.personaldaten).subscribe(
      (updatedPersonalDaten: any) => {
        // Update the personaldaten
        this.personaldaten = updatedPersonalDaten;
        // Exit edit mode after saving changes
        this.editMode = false;
        
        // Fetch the updated data again after saving
        this.fetchPersonalDaten();
      },
      (error: any) => {
        console.error('Error updating personaldaten:', error);
        // Handle error as needed
      }
    );
  }

  deletePersonaldatenZumVerbliebenenAngehoerigen() {
    const personId = this.route.snapshot.params['id'];
    const personaldatenId = this.route.snapshot.params['personaldatenId'];

    this.personService.deletePersonaldatenZumVerbliebenenAngehoerigen(personId, personaldatenId).subscribe(
      () => {
        console.log('Personaldaten zum verbliebenen Angehörigen deleted successfully');
        alert('Personaldaten zum verbliebenen Angehörigen gelöscht');
        
        // Redirect to person detail or any other desired route after deletion
        this.router.navigate(['/person', personId]);
      },
      (error: any) => {
        console.error('Error deleting Personaldaten zum verbliebenen Angehörigen:', error);
      }
    );
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
}
