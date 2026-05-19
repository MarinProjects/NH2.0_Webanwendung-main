import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from '../create-user/person.service';

@Component({
  selector: 'app-personaldaten-verstorbener',
  templateUrl: './personaldaten-verstorbener.component.html',
  styleUrls: ['./personaldaten-verstorbener.component.css']
})
export class PersonaldatenVerstorbenerComponent implements OnInit {
  personId!: string;
  form: FormGroup;
  eintraege: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      geburtsdatum: [''],
      prozentsatz: [null]
    });
  }

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id'];
    this.loadData();
  }

  loadData(): void {
    this.personService.getPersonaldatenVerstorbener(this.personId).subscribe({
      next: data => this.eintraege = data || [],
      error: err => console.error(err)
    });
  }

  speichern(): void {
    if (this.form.invalid) {
      alert('Bitte mindestens den Namen eingeben.');
      return;
    }

    this.personService.addPersonaldatenVerstorbener(this.personId, this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.loadData();
      },
      error: err => console.error(err)
    });
  }

  loeschen(entryId: string): void {
    if (!confirm('Eintrag wirklich löschen?')) return;

    this.personService.deletePersonaldatenVerstorbener(this.personId, entryId).subscribe({
      next: () => this.loadData(),
      error: err => console.error(err)
    });
  }

  zurueck(): void {
    this.router.navigate(['/person', this.personId]);
  }
}