import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-generell-rentenerstberechnungteil1',
  templateUrl: './show-generell-rentenerstberechnungteil1.component.html',
  styleUrls: ['./show-generell-rentenerstberechnungteil1.component.css']
})
export class ShowGenerellRentenerstberechnungteil1Component implements OnInit {
  rentenerstberechnungteil1List: any[] = [];
  personName: string = ''; // Variable to hold person's name
  personalnummer: string = '';


  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.fetchGenerellRentenerstberechnungteil1();
    this.fetchPersonDetails();
  }

  fetchGenerellRentenerstberechnungteil1() {
    const personId = this.route.snapshot.params['id'];

    this.personService.getGenerellRentenerstberechnungteil1(personId).subscribe(
      (data: any[]) => {
        this.rentenerstberechnungteil1List = data;
      },
      (error: any) => {
        console.error('Error fetching generell rentenerstberechnungteil1:', error);
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

  viewRentenerstberechnungteil1Detail(rentenerstberechnungteil1Id: string) {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'rentenerstberechnungteil1', rentenerstberechnungteil1Id]);
  }

  addingRentenerstberechnungteil1() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'addrentenerstberechnungteil1']);
  }

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }
}
