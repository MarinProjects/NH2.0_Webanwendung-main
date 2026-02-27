import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  //private apiUrl = 'http://localhost:4000/api'; // Replace with your backend API URL
  private apiUrl = '/api';
  personid = String;

  constructor(private http: HttpClient) {}


  createPerson(person: any) {
    return this.http.post(`${this.apiUrl}/person`, person);
  }

  addPensionsdaten(personId: string, pensionsDaten: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/person/${personId}/pensionsDaten`, pensionsDaten);
  }

  addRentenErstberechnungTeil1Data(personId: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/person/${personId}/rentenerstberechnungteil1`;
    return this.http.post<any>(url, data);
  }

  addRentenErstberechnungTeil2Data(personId: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/person/${personId}/rentenerstberechnungteil2`;
    return this.http.post<any>(url, data);
  }

  addDatenBzglDerLaufendenRenteData(personId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/person/${personId}/datenbzglderlaufendenrente`, data);
  }

  addEhegattenDaten(personId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/person/${personId}/ehegattenDaten`, data);
  }

  addPersonaldatenzumverbliebenenangehoerigen(personId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/person/${personId}/personaldatenzumverbliebenenangehoerigen`, data);
  }

  getPersonById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${id}`);
  }

  updateMasterData(personId: string, newData: any): Observable<any> {
    const url = `${this.apiUrl}/person/${personId}`;
    return this.http.put<any>(url, newData);
  }

  updatePerson(person: any): Observable<any> {
    const url = `${this.apiUrl}/person/${person._id}`; // Assuming _id is the ObjectId
    return this.http.put(url, person);
  }

  getAllPersons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/person`);
  }

  
  /**
  getPensionsDaten(id: string, pensionsDatenId: string) {
    return this.http.get(`/api/person/${id}/pensionsDaten/${pensionsDatenId}`);
  }
 */
  getPensionsDaten(id: string, pensionsDatenId: string) {
    return this.http.get(`${this.apiUrl}/person/${id}/pensionsDaten/${pensionsDatenId}`);
  }

  updatePensionsDaten(id: string, pensionsdatenId: string, newData: any) {
    return this.http.put(`${this.apiUrl}/person/${id}/pensionsDaten/${pensionsdatenId}`, newData);
  }

  getEhegattenDaten(personId: string, ehegattenDatenId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/ehegattenDaten/${ehegattenDatenId}`);
  }

  updateEhegattenDaten(personId: string, ehegattenDatenId: string, newData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/person/${personId}/ehegattenDaten/${ehegattenDatenId}`, newData);
  }

  getRentenErstberechnungTeil1Daten(personId: string, rentenErstberechnungTeil1DatenId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/rentenErstberechnungteil1/${rentenErstberechnungTeil1DatenId}`);
  }

  updateRentenErstberechnungTeil1Daten(personId: string, rentenErstberechnungTeil1DatenId: string, newData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/person/${personId}/rentenerstberechnungteil1/${rentenErstberechnungTeil1DatenId}`, newData);
  }

  getRentenErstberechnungTeil2Daten(personId: string, rentenErstberechnungTeil2DatenId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/rentenerstberechnungteil2/${rentenErstberechnungTeil2DatenId}`);
  }

  updateRentenErstberechnungTeil2Daten(personId: string, rentenErstberechnungTeil2DatenId: string, newData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/person/${personId}/rentenerstberechnungteil2/${rentenErstberechnungTeil2DatenId}`, newData);
  }

  getDatenBzglDerLaufendenRente(personId: string, datenBzglDerLaufendenRenteId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/datenBzglDerLaufendenRente/${datenBzglDerLaufendenRenteId}`);
  }

  updateDatenBzglDerLaufendenRente(personId: string, datenBzglDerLaufendenRenteId: string, newData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/person/${personId}/datenBzglDerLaufendenRente/${datenBzglDerLaufendenRenteId}`, newData);
  }

  getPersonalDaten(personId: string, personaldatenId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/personaldatenzumverbliebenenangehoerigen/${personaldatenId}`);
  }

  // Function to update personal data
  updatePersonalDaten(personId: string, personaldatenId: string, newData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/person/${personId}/personaldatenzumverbliebenenangehoerigen/${personaldatenId}`, newData);
  }


  getGenerellPensionsDaten(personId: string) {
    return this.http.get(`${this.apiUrl}/person/${personId}/pensionsDaten`);
  }

  getGenerellEhegattenDaten(personId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/ehegattenDaten`);
  }

  getGenerellRentenerstberechnungteil1(personId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/rentenerstberechnungteil1`);
  }

  getGenerellRentenerstberechnungteil2(personId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/rentenerstberechnungteil2`);
  }

  getGenerellDatenbzglderlaufendenRente(personId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/datenbzglderlaufendenrente`);
  }

  // Get all general personal data for the person
  getPersonaldatenzumverbliebenenangehoerigen(personId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/personaldatenzumverbliebenenangehoerigen`);
  }

  // Get detailed personal data for a specific person data entry
  getDetailPersonaldatenzumverbliebenenangehoerigen(personId: string, personaldatenZumVerbliebenenAngehoerigenId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/person/${personId}/personaldatenzumverbliebenenangehoerigen/${personaldatenZumVerbliebenenAngehoerigenId}`);
  }

  getRGOHalfYear1Letters(payload: any) {
  return this.http.post(`${this.apiUrl}/rgoHalfYear1Letters`, payload);
}

getRGOHalfYear2LetterData(payload: any) {
  return this.http.post<any[]>(`${this.apiUrl}/rgoHalfYear2Letters`, payload);
}





  // Freestyle 


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

  getPersonByPersonalnummer(personalnummer: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/persons/${personalnummer}`);
  }




  // delete

  deletePersonById(personId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/persons/${personId}`);
  }

  deleteRentenErstberechnungTeil1Data(personId: string, rentenErstberechnungTeil1DatenId: string): Observable<any> {
    const url = `${this.apiUrl}/person/${personId}/rentenerstberechnungteil1/${rentenErstberechnungTeil1DatenId}`;
    return this.http.delete(url);
  }

  // Delete pensionsDaten
  deletePensionsDaten(personId: string, pensionsDatenId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/person/${personId}/pensionsDaten/${pensionsDatenId}`);
  }

  // Delete ehegattenDaten
  deleteEhegattenDaten(personId: string, ehegattenDatenId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/person/${personId}/ehegattenDaten/${ehegattenDatenId}`);
  }

  // Delete rentenerstberechnungteil2
  deleteRentenerstberechnungteil2(personId: string, rentenErstberechnungTeil2DatenId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/person/${personId}/rentenerstberechnungteil2/${rentenErstberechnungTeil2DatenId}`);
  }

  // Delete datenBzglDerLaufendenRente
  deleteDatenBzglDerLaufendenRente(personId: string, datenBzglDerLaufendenRenteId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/person/${personId}/datenBzglDerLaufendenRente/${datenBzglDerLaufendenRenteId}`);
  }

  // Delete personaldatenZumVerbliebenenAngehoerigen
  deletePersonaldatenZumVerbliebenenAngehoerigen(personId: string, personaldatenZumVerbliebenenAngehoerigenId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/person/${personId}/personaldatenZumVerbliebenenAngehoerigen/${personaldatenZumVerbliebenenAngehoerigenId}`);
  }
  


  // Anpassungen

  addNewDatenBzglDerLaufendenRente(newEntry: any): Observable<any> {
    const url = `${this.apiUrl}/api/persons/addDatenBzglDerLaufendenRente`; // Adjust endpoint as per your API
    return this.http.post<any>(url, newEntry);
  }



   // Example method to submit adjustment
   submitAdjustment(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/adjustPensions`, formData);
  }

  submitPensionAdjustment(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/adjustPensions`, formData);
  }

   // Method to get the two latest adjustments
   getTwoLatestAdjustmentsPV(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latestAdjustments`);
  }

  submitRGOHalfYear1Adjustment(payload: any) {
  return this.http.post<any>(`${this.apiUrl}/adjustRGOHalfYear1`, payload);
}

submitRGOHalfYear2Adjustment(payload: any) {
  return this.http.post<any>(`${this.apiUrl}/adjustRGOHalfYear2`, payload);
}

  
 

    
    

  
  

  
}
  
