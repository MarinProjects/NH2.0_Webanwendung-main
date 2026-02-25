import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-showrentenerstberechnungteil1',
  templateUrl: './showrentenerstberechnungteil1.component.html',
  styleUrl: './showrentenerstberechnungteil1.component.css'
})
export class Showrentenerstberechnungteil1Component implements OnInit {
  editMode: boolean = false; // Flag to track edit mode
  rentenErstberechnungTeil1Daten: any = {
    pensionsfaehigesMonatsgehalt: '',
    sozVersPflJahresgehaltRB: '',
    ruhegeldfaehigesDurchschnittsgehalt: '',
    durchschnittsgehaltNachSozialplan: '',
    teilzeitgrad : '',
    sozVersFreieJahreAb20: '',
    schwerbehindert : '',
    versorgungsausgleichDurchgefuehrt: '',
    entgeltpunkte : '',
    zugangsfaktor : '',
    rentenartfaktor: '',
    teilrentenfaktor: ''


    // Add more properties as needed
  };

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    this.fetchRentenErstberechnungTeil1Daten();
  }

  fetchRentenErstberechnungTeil1Daten() {
    const personId = this.route.snapshot.params['id'];
    const rentenErstberechnungTeil1DatenId = this.route.snapshot.params['rentenErstberechnungTeil1DatenId'];

    this.personService.getRentenErstberechnungTeil1Daten(personId, rentenErstberechnungTeil1DatenId).subscribe(
      (data: any) => {
        this.rentenErstberechnungTeil1Daten = data;
      },
      (error: any) => {
        console.error('Error fetching rentenErstberechnungTeil1Daten:', error);
        // Handle error as needed
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    const personId = this.route.snapshot.params['id'];
    const rentenErstberechnungTeil1DatenId = this.route.snapshot.params['rentenErstberechnungTeil1DatenId'];

    // Call the service to update the rentenErstberechnungTeil1Daten
    this.personService.updateRentenErstberechnungTeil1Daten(personId, rentenErstberechnungTeil1DatenId, this.rentenErstberechnungTeil1Daten).subscribe(
      (updatedRentenErstberechnungTeil1Daten: any) => {
        // Update the rentenErstberechnungTeil1Daten
        this.rentenErstberechnungTeil1Daten = updatedRentenErstberechnungTeil1Daten;
        // Exit edit mode after saving changes
        this.editMode = false;
        
        // Fetch the updated data again after saving
        this.fetchRentenErstberechnungTeil1Daten();
      },
      (error: any) => {
        console.error('Error updating rentenErstberechnungTeil1Daten:', error);
        // Handle error as needed
      }
    );
  }

  deleteRentenErstberechnungTeil1() {
    const personId = this.route.snapshot.params['id'];
    const rentenErstberechnungTeil1DatenId = this.route.snapshot.params['rentenErstberechnungTeil1DatenId'];

    this.personService.deleteRentenErstberechnungTeil1Data(personId, rentenErstberechnungTeil1DatenId).subscribe(
      () => {
        console.log(`RentenErstberechnungTeil1Daten with ID ${rentenErstberechnungTeil1DatenId} deleted successfully.`);
        alert('RentenErstberechnungTeil1Daten gelöscht');
        
        // Navigate back to person-detail component
        this.router.navigate(['/person', personId]);
      },
      (error: any) => {
        console.error('Error deleting RentenErstberechnungTeil1Daten:', error);
        // Handle error as needed
      }
    );
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }

}
