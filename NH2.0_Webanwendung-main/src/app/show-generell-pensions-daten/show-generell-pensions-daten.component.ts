import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-generell-pensions-daten',
  templateUrl: './show-generell-pensions-daten.component.html',
  styleUrls: ['./show-generell-pensions-daten.component.css']
})
export class ShowGenerellPensionsDatenComponent implements OnInit {
  pensionsDatenList: any[] = [];
  personName: string = ''; // Variable to hold person's name
  personalnummer: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit() {
    this.fetchGenerellPensionsDaten();
    this.fetchPersonDetails();
  }

  fetchGenerellPensionsDaten() {
    const personId = this.route.snapshot.params['id'];

    this.personService.getGenerellPensionsDaten(personId).subscribe(
      (data: any) => {
        this.pensionsDatenList = data as any[]; // Explicit casting here
      },
      (error: any) => {
        console.error('Error fetching generell pensionsdaten:', error);
        // Handle error as needed
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

  navigateToPersonDetail(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId]);

  }

  navigateToDetail(pensionsDatenId: string) {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/person/${personId}/pensionsDaten/${pensionsDatenId}`]);
    
  }

  addpensionsDaten() {
    const personId = this.route.snapshot.params['id'];
    this.router.navigate(['/person', personId, 'addpensionsDaten']);
  }
}

