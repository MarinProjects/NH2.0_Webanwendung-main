import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-create-ehegattenDaten',
  templateUrl: './create-ehegatten-daten.component.html',
  styleUrls: ['./create-ehegatten-daten.component.css']
})
export class CreateEhegattenDatenComponent {
  formData: any = {}; // Object to hold form data
  personId: string;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private router: Router
  ) {
    this.personId = this.route.snapshot.params['id'];
  }

  onSubmit(): void {
    this.personService.addEhegattenDaten(this.personId, this.formData)
      .subscribe(
        (updatedPerson: any) => {
          console.log('Ehegatten Daten added:', updatedPerson);
          alert('Daten hinzugefügt'); // Alert message when data is added successfully
          this.router.navigate(['/person', this.personId]); // Navigate back to person detail
          this.formData = {}; // Clear formData object
        },
        (error: any) => {
          console.error('Error adding Ehegatten Daten:', error);
          // Optionally: Handle error messages or notify the user
        }
      );
  }
}
