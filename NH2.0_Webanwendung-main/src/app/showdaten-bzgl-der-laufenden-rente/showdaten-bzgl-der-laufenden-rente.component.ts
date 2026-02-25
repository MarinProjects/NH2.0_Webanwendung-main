import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-showdaten-bzgl-der-laufenden-rente',
  templateUrl: './showdaten-bzgl-der-laufenden-rente.component.html',
  styleUrls: ['./showdaten-bzgl-der-laufenden-rente.component.css']
})
export class ShowdatenBzglDerLaufendenRenteComponent implements OnInit {
  editMode: boolean = false; // Flag to track edit mode
  datenBzglDerLaufendenRente: any = {
    gueltigVonBis: '',
    eingabedatum: '',
    gesamtversorgung: '',
    andereAnzurechnendeRente: '',
    andereAnzurechnendeRenteName: '',
    gesetzlicheSVRente: '',
    renteAusBefrLebensvers: '',
    zusatzrente: '',
    zusatzrenteName: '',
    pension: '',
    ausgleich: '',
    betrRente: '',
    bezugsart: '',
    weitereRenteUnterPersNr: '',
    anzahlKinder: '',
    entgeltpunkte: '',
    steuerklasse: '',
    zugangsfaktor: '',
    krankenkassenkennziffer: '',
    beitragFuerKrankenvers: '',
    rentenartfaktor: '',
    teilrentenfaktor: ''
    // Add more properties as needed
  };

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    this.fetchDatenBzglDerLaufendenRente();
  }

  fetchDatenBzglDerLaufendenRente() {
    const personId = this.route.snapshot.params['id'];
    const datenBzglDerLaufendenRenteId = this.route.snapshot.params['datenBzglDerLaufendenRenteId'];

    this.personService.getDatenBzglDerLaufendenRente(personId, datenBzglDerLaufendenRenteId).subscribe(
      (data: any) => {
        this.datenBzglDerLaufendenRente = data;
      },
      (error: any) => {
        console.error('Error fetching datenBzglDerLaufendenRente:', error);
        // Handle error as needed
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
    const personId = this.route.snapshot.params['id'];
    const datenBzglDerLaufendenRenteId = this.route.snapshot.params['datenBzglDerLaufendenRenteId'];

    // Call the service to update the datenBzglDerLaufendenRente
    this.personService.updateDatenBzglDerLaufendenRente(personId, datenBzglDerLaufendenRenteId, this.datenBzglDerLaufendenRente).subscribe(
      (updatedDatenBzglDerLaufendenRente: any) => {
        // Update the datenBzglDerLaufendenRente
        this.datenBzglDerLaufendenRente = updatedDatenBzglDerLaufendenRente;
        // Exit edit mode after saving changes
        this.editMode = false;
        
        // Fetch the updated data again after saving
        this.fetchDatenBzglDerLaufendenRente();
      },
      (error: any) => {
        console.error('Error updating datenBzglDerLaufendenRente:', error);
        // Handle error as needed
      }
    );
  }

  deleteDatenBzglDerLaufendenRente() {
    const personId = this.route.snapshot.params['id'];
    const datenBzglDerLaufendenRenteId = this.route.snapshot.params['datenBzglDerLaufendenRenteId'];

    this.personService.deleteDatenBzglDerLaufendenRente(personId, datenBzglDerLaufendenRenteId).subscribe(
      () => {
        console.log('DatenBzglDerLaufendenRente deleted successfully');
        alert('DatenBzglDerLaufendenRente gelöscht');
        
        // Redirect to person detail or any other desired route after deletion
        this.router.navigate(['/person', personId]);
      },
      (error: any) => {
        console.error('Error deleting DatenBzglDerLaufendenRente:', error);
      }
    );
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
  
}

