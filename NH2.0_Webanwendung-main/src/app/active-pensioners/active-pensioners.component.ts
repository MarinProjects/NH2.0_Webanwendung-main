import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-active-pensioners',
  templateUrl: './active-pensioners.component.html',
  styleUrls: ['./active-pensioners.component.css']
})
export class ActivePensionersComponent implements OnInit {
  persons: any[] = [];

  constructor(
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getActivePensioners().subscribe({
      next: (data) => {
        this.persons = data;
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Laden der aktiven Rentner.');
      }
    });
  }

  showPersonDetail(personId: string) {
    this.router.navigate(['/person', personId]);
  }

  back(): void {
    this.router.navigate(['/list-person']);
  }
}