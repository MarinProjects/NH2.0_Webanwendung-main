import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-generell-rentenerstberechnungteil2',
  templateUrl: './show-generell-rentenerstberechnungteil2.component.html',
  styleUrls: ['./show-generell-rentenerstberechnungteil2.component.css']
})
export class ShowGenerellRentenerstberechnungteil2Component implements OnInit {
  rentenerstberechnungteil2List: any[] = [];
  personName: string = ''; // Variable to hold person's name
  personalnummer: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.fetchGenerellRentenerstberechnungteil2();
    this.fetchPersonDetails();
  }

  fetchGenerellRentenerstberechnungteil2() {
    const personId = this.route.snapshot.params['id'];

    this.personService.getGenerellRentenerstberechnungteil2(personId).subscribe(
      (data: any[]) => {
        this.rentenerstberechnungteil2List = data;
      },
      (error: any) => {
        console.error('Error fetching generell rentenerstberechnungteil2:', error);
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

  viewRentenerstberechnungteil2Detail(rentenerstberechnungteil2Id: string) {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'rentenerstberechnungteil2', rentenerstberechnungteil2Id]);
  }

  addingRentenerstberechnungteil2() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'addrentenerstberechnungteil2']);
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
}

