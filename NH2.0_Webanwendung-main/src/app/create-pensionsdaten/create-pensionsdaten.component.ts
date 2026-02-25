import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-pensionsdaten',
  templateUrl: './create-pensionsdaten.component.html',
  styleUrls: ['./create-pensionsdaten.component.css']
})
export class CreatePensionsdatenComponent {
  pensionsDaten: any = {
    ratierlicherAnspruch: null,
    prozentsatzTeiluebertragung: null,
    pensionsfaehigesDurchschnittsgehaltVA: null,
    sozVersPflJahresgehaltVA: null,
    ruhegeldfaehigesDurchschnittsgehalt: null,
    durchschnittsgehaltNachSozialplan: null,
    teilzeitgrad: null,
    sozVersFreieJahreAb20: null,
    schwerbehindert: '',
    anzahlKinder: null,
    steuerklasse: '',
    bemerkung: ''
    // Add more fields as needed
  };
  personId: string;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private router: Router
  ) {
    this.personId = this.route.snapshot.params['id'];
  }

  savePensionsdaten() {
    this.personService.addPensionsdaten(this.personId, this.pensionsDaten).subscribe(
      (updatedPerson: any) => {
        alert('Pensionsdaten added successfully');
        this.pensionsDaten = {
          ratierlicherAnspruch: null,
          prozentsatzTeiluebertragung: null,
          pensionsfaehigesDurchschnittsgehaltVA: null,
          sozVersPflJahresgehaltVA: null,
          ruhegeldfaehigesDurchschnittsgehalt: null,
          durchschnittsgehaltNachSozialplan: null,
          teilzeitgrad: null,
          sozVersFreieJahreAb20: null,
          schwerbehindert: '',
          anzahlKinder: null,
          steuerklasse: '',
          bemerkung: ''
        };
      },
      (error: any) => {
        console.error('Error adding pensionsdaten:', error);
        // Handle error as needed
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const formData = form.value;
      this.personService.addPensionsdaten(this.personId, formData).subscribe(
        (updatedPerson: any) => {
          console.log('Pensionsdaten added successfully');
          alert('Pensionsdaten added successfully'); // Alert message when data is added successfully
          this.router.navigate(['/person', this.personId]); // Navigate back to person detail
          form.resetForm(); // Reset the form after submission
        },
        (error: any) => {
          console.error('Error adding pensionsdaten:', error);
          // Optionally: Handle error messages or notify the user
        }
      );
    }
  }
}
