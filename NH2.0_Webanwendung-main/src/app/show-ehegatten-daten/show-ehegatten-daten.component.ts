import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-ehegatten-daten',
  templateUrl: './show-ehegatten-daten.component.html',
  styleUrls: ['./show-ehegatten-daten.component.css']
})
export class ShowEhegattenDatenComponent implements OnInit {
  editMode: boolean = false;
  ehegattenDaten: any = {
    name: '',
    geburtsdatum: '',
    prozentsatzWitwenWitwerrente: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    this.fetchEhegattenDaten();
  }

  fetchEhegattenDaten() {
    const personId = this.route.snapshot.params['id'];
    const ehegattenDatenId = this.route.snapshot.params['ehegattenDatenId'];

    this.personService.getEhegattenDaten(personId, ehegattenDatenId).subscribe(
      (data: any) => {
        this.ehegattenDaten = data;
      },
      (error: any) => {
        console.error('Error fetching ehegattenDaten:', error);
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    const personId = this.route.snapshot.params['id'];
    const ehegattenDatenId = this.route.snapshot.params['ehegattenDatenId'];

    this.personService.updateEhegattenDaten(personId, ehegattenDatenId, this.ehegattenDaten).subscribe(
      (updatedEhegattenDaten: any) => {
        this.ehegattenDaten = updatedEhegattenDaten;
        this.editMode = false;
        this.fetchEhegattenDaten();
      },
      (error: any) => {
        console.error('Error updating ehegattenDaten:', error);
      }
    );
  }

  deleteEhegattenDaten() {
    const personId = this.route.snapshot.params['id'];
    const ehegattenDatenId = this.route.snapshot.params['ehegattenDatenId'];

    this.personService.deleteEhegattenDaten(personId, ehegattenDatenId).subscribe(
      () => {
        console.log('EhegattenDaten deleted successfully');
        alert('EhegattenDaten gelöscht');
        
        // Redirect to person detail or any other desired route after deletion
        this.router.navigate(['/person', personId]);
      },
      (error: any) => {
        console.error('Error deleting EhegattenDaten:', error);
      }
    );
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
  
}
