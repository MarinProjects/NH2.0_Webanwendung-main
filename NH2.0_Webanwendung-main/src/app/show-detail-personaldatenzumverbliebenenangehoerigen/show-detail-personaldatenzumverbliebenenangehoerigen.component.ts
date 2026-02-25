import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-show-detail-personaldatenzumverbliebenenangehoerigen',
  templateUrl: './show-detail-personaldatenzumverbliebenenangehoerigen.component.html',
  styleUrls: ['./show-detail-personaldatenzumverbliebenenangehoerigen.component.css']
})
export class ShowDetailPersonaldatenzumverbliebenenangehoerigenComponent implements OnInit {
  personaldatenZumVerbliebenenAngehoerigen: any = {};

  constructor(private route: ActivatedRoute, private personService: PersonService) {}

  ngOnInit() {
    const personId = this.route.snapshot.params['id'];
    const personaldatenZumVerbliebenenAngehoerigenId = this.route.snapshot.params['personaldatenZumVerbliebenenAngehoerigenId'];
    this.personService.getDetailPersonaldatenzumverbliebenenangehoerigen(personId, personaldatenZumVerbliebenenAngehoerigenId).subscribe(
      (data: any) => {
        this.personaldatenZumVerbliebenenAngehoerigen = data;
      },
      (error: any) => {
        console.error('Error fetching personaldatenZumVerbliebenenAngehoerigen detail:', error);
      }
    );
  }
}
