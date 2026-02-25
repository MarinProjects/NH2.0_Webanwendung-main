import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-create-datenBzglDerLaufendenRente',
  templateUrl: './create-daten-bzgl-der-laufenden-rente.component.html',
  styleUrls: ['./create-daten-bzgl-der-laufenden-rente.component.css']
})
export class CreateDatenBzglDerLaufendenRenteComponent {
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
    this.personService.addDatenBzglDerLaufendenRenteData(this.personId, this.formData)
      .subscribe(
        (updatedPerson: any) => {
          console.log('Daten bzgl. der laufenden Rente added:', updatedPerson);
          alert('Daten hinzugefügt'); // Alert message when data is added successfully
          this.router.navigate(['/person', this.personId]); // Navigate back to person detail
          this.formData = {}; // Clear formData object
        },
        (error: any) => {
          console.error('Error adding Daten bzgl. der laufenden Rente:', error);
          // Optionally: Handle error messages or notify the user
        }
      );
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
}
