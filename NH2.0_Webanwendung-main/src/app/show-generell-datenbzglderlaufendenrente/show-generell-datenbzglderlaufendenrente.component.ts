import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-generell-datenbzglderlaufendenrente',
  templateUrl: './show-generell-datenbzglderlaufendenrente.component.html',
  styleUrls: ['./show-generell-datenbzglderlaufendenrente.component.css']
})
export class ShowGenerellDatenbzglderlaufendenRenteComponent implements OnInit {
  datenbzglderlaufendenRenteList: any[] = [];
  personName: string = ''; // Variable to hold person's name
  personalnummer: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.fetchGenerellDatenbzglderlaufendenRente();
    this.fetchPersonDetails();
  }

  fetchGenerellDatenbzglderlaufendenRente() {
    const personId = this.route.snapshot.params['id'];

    this.personService.getGenerellDatenbzglderlaufendenRente(personId).subscribe(
      (data: any[]) => {
        this.datenbzglderlaufendenRenteList = data;
      },
      (error: any) => {
        console.error('Error fetching generell datenbzglderlaufendenRente:', error);
      }
    );
  }

  fetchPersonDetails() {
    const personId = this.route.snapshot.params['id'];

    this.personService.getPersonById(personId).subscribe(
      (person: any) => {
        this.personName = person.name; // Assuming 'name' is the attribute in your person schema
        this.personalnummer = person.personalnummer;
      },
      (error: any) => {
        console.error('Error fetching person details:', error);
      }
    );
  }

  viewDatenbzglderlaufendenRenteDetail(datenbzglderlaufendenRenteId: string) {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'datenbzglderlaufendenrente', datenbzglderlaufendenRenteId]);
  }

  addingdatenbzglderlaufendenrente() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'adddatenbzglderlaufendenrente']);
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
  
}




