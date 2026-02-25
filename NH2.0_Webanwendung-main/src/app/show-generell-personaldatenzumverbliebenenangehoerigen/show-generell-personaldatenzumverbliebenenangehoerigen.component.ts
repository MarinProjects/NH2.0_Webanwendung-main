import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-generell-personaldatenzumverbliebenenangehoerigen',
  templateUrl: './show-generell-personaldatenzumverbliebenenangehoerigen.component.html',
  styleUrls: ['./show-generell-personaldatenzumverbliebenenangehoerigen.component.css']
})
export class ShowGenerellPersonaldatenzumverbliebenenangehoerigenComponent implements OnInit {
  personaldatenZumVerbliebenenAngehoerigenList: any[] = [];
  personName: string = ''; // Variable to hold person's name
  personalnummer: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    const personId = this.route.snapshot.params['id'];
    this.fetchPersonDetails();
    this.personService.getPersonaldatenzumverbliebenenangehoerigen(personId).subscribe(
      (data: any[]) => {
        this.personaldatenZumVerbliebenenAngehoerigenList = data;
      },
      (error: any) => {
        console.error('Error fetching personaldatenZumVerbliebenenAngehoerigen:', error);
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

  navigateToDetail(personaldatenZumVerbliebenenAngehoerigenId: string) {
    //this.router.navigate([`/show-detail-personaldatenzumverbliebenenangehoerigen/${this.route.snapshot.params['id']}/${personaldatenId}`]);
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'personaldatenzumverbliebenenangehoerigen', personaldatenZumVerbliebenenAngehoerigenId]);
  }

  addpersonaldatenzumverbliebenenangehoerigen() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'addpersonaldatenzumverbliebenenangehoerigen']);
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
}

