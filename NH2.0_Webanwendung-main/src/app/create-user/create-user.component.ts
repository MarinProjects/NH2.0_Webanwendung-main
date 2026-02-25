import { Component } from '@angular/core';
import { PersonService } from './person.service';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  person: any = {
    name: '',
    personalnummer: null
  };

  constructor(private route: ActivatedRoute, private personService: PersonService, private router: Router) {}

  savePerson() {
    this.personService.createPerson(this.person).subscribe(() => {
      alert('Person created');
      this.person.name = '';
      this.person.personalnummer = null;
    });
  }

  navigateToPersonList() {
    this.router.navigate(['/list-person']);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = form.value;
      this.personService.createPerson(formData).subscribe(
        () => {
          console.log('Person created successfully');
          alert('Person created');
          form.reset(); // Reset the form after submission
          this.navigateToPersonList();
        },
        error => {
          console.error('Error creating person:', error);
          // Handle error as needed, e.g., display error message to the user
        }
      );
    }
  }

  navigateToPersonlist(){
    const personId = this.route.snapshot.params['id'];
    this.router.navigate([`/list-person`]);


  }
  
}
