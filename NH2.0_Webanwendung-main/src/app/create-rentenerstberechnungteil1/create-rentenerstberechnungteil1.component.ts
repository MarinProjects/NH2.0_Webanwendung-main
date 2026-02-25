import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-create-rentenErstberechnungTeil1',
  templateUrl: './create-rentenErstberechnungteil1.component.html',
  styleUrls: ['./create-rentenErstberechnungteil1.component.css']
})
export class CreateRentenErstberechnungTeil1Component {
  formData: any = {}; // Object to hold form data
  personId: string;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private router: Router,
  ) {
    this.personId = this.route.snapshot.params['id'];
  }
/**
  onSubmit(): void {
    const personId = this.route.snapshot.paramMap.get('id');
    this.personService.addRentenErstberechnungTeil1Data(this.personId, this.formData)
      .subscribe(updatedPerson => {
        console.log('Renten Erstberechnung Teil 1 data added:', updatedPerson);
        alert('Daten hinzugefügt'); // Alert message when data is added successfully
        this.formData = {}; // Clear formData object
      }, error => {
        console.error('Error adding Renten Erstberechnung Teil 1 data:', error);
        // Optionally: Handle error messages or notify the user
      });
  }

  */



  onSubmit(): void {
    this.personService.addRentenErstberechnungTeil1Data(this.personId, this.formData)
      .subscribe(updatedPerson => {
        console.log('Renten Erstberechnung Teil 1 data added:', updatedPerson);
        alert('Daten hinzugefügt'); // Alert message when data is added successfully
        this.router.navigate(['/person', this.personId]); // Navigate back to person detail
      }, error => {
        console.error('Error adding Renten Erstberechnung Teil 1 data:', error);
        // Optionally: Handle error messages or notify the user
      });
  }
}


