import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of, from } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = "api/heroes";

  httpOptions = {
    headers: new HttpHeaders({'Content-type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  /**
   * Get heroes from the server.
   */
  getHeroes(): Observable<Hero[]> {
    // TODO: send message _after_ fetching the heroes.
    this.messageService.add("HeroSerivce: fetched heroes");
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    // TODO: send message _after_ fetching hero
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched heror id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`)),
    )
  }

  /**
   * PUT: update hero on the server
   * 
   * @param hero 
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updatedHero'))
    )
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transforming error to user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app kepping running by returning an empty result
      return of(result as T);
    }
  }
}
