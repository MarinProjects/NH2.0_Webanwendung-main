import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-generell-ehegatten-daten',
  templateUrl: './show-generell-ehegatten-daten.component.html',
  styleUrls: ['./show-generell-ehegatten-daten.component.css']
})
export class ShowGenerellEhegattenDatenComponent implements OnInit {
  ehegattenDatenList: any[] = [];
  personName: string = ''; // Variable to hold person's name
  personalnummer: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.fetchGenerellEhegattenDaten();
    this.fetchPersonDetails();
  }

  fetchGenerellEhegattenDaten() {
    const personId = this.route.snapshot.params['id'];

    this.personService.getGenerellEhegattenDaten(personId).subscribe(
      (data: any[]) => {
        this.ehegattenDatenList = data;
      },
      (error: any) => {
        console.error('Error fetching generell ehegattenDaten:', error);
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

  viewEhegattenDatenDetail(ehegattenDatenId: string) {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'ehegattenDaten', ehegattenDatenId]);
  }

  addehegattenDaten() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'addehegattenDaten']);
  }
  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
}
