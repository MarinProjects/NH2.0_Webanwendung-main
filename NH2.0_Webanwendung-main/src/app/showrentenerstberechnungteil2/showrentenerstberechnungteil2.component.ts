import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-showrentenerstberechnungteil2',
  templateUrl: './showrentenerstberechnungteil2.component.html',
  styleUrls: ['./showrentenerstberechnungteil2.component.css']
})
export class Showrentenerstberechnungteil2Component implements OnInit {
  editMode: boolean = false;
  rentenErstberechnungTeil2Daten: any = {
    gesamtversorgung: '',
    gesetzlicheSVRente: '',
    renteAusBefrLebensvers: '',
    andereAnzurechnRente: '',
    abschlag: '',
    zusatzrente: '',
    ratierlicherAnspruch: '',
    anteil: '',
    pension: '',
    ausgleich: '',
    betrRente: '',
    anpassungsschluessel: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    this.fetchRentenErstberechnungTeil2Daten();
  }

  fetchRentenErstberechnungTeil2Daten() {
    const personId = this.route.snapshot.params['id'];
    const rentenErstberechnungTeil2DatenId = this.route.snapshot.params['rentenErstberechnungTeil2DatenId'];

    this.personService.getRentenErstberechnungTeil2Daten(personId, rentenErstberechnungTeil2DatenId).subscribe(
      (data: any) => {
        this.rentenErstberechnungTeil2Daten = data;
      },
      (error: any) => {
        console.error('Error fetching rentenErstberechnungTeil2Daten:', error);
        // Handle error as needed
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    const personId = this.route.snapshot.params['id'];
    const rentenErstberechnungTeil2DatenId = this.route.snapshot.params['rentenErstberechnungTeil2DatenId'];

    this.personService.updateRentenErstberechnungTeil2Daten(personId, rentenErstberechnungTeil2DatenId, this.rentenErstberechnungTeil2Daten).subscribe(
      (updatedRentenErstberechnungTeil2Daten: any) => {
        this.rentenErstberechnungTeil2Daten = updatedRentenErstberechnungTeil2Daten;
        this.editMode = false;
        this.fetchRentenErstberechnungTeil2Daten();
      },
      (error: any) => {
        console.error('Error updating rentenErstberechnungTeil2Daten:', error);
        // Handle error as needed
      }
    );
  }

  deleteRentenerstberechnungteil2() {
    const personId = this.route.snapshot.params['id'];
    const rentenErstberechnungTeil2DatenId = this.route.snapshot.params['rentenErstberechnungTeil2DatenId'];

    this.personService.deleteRentenerstberechnungteil2(personId, rentenErstberechnungTeil2DatenId).subscribe(
      () => {
        console.log('Rentenerstberechnungteil2 deleted successfully');
        alert('Rentenerstberechnungteil2 gelöscht');

        // Redirect to person-detail component or any other desired route
        this.router.navigate(['/person', personId]);
      },
      (error: any) => {
        console.error('Error deleting Rentenerstberechnungteil2:', error);
        // Handle error as needed
      }
    );
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }

}

