import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-create-rentenErstberechnungTeil2',
  templateUrl: './create-rentenErstberechnungteil2.component.html',
  styleUrls: ['./create-rentenErstberechnungteil2.component.css']
})
export class CreateRentenErstberechnungTeil2Component {
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
    this.personService.addRentenErstberechnungTeil2Data(this.personId, this.formData)
      .subscribe(updatedPerson => {
        console.log('Renten Erstberechnung Teil 2 data added:', updatedPerson);
        alert('Daten hinzugefügt'); // Alert message when data is added successfully
        this.router.navigate(['/person', this.personId]); // Navigate back to person detail
      }, error => {
        console.error('Error adding Renten Erstberechnung Teil 2 data:', error);
        // Optionally: Handle error messages or notify the user
      });
  }
}
