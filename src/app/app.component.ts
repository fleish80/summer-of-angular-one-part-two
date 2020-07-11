import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, shareReplay, startWith, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'summer-of-angular-one-part-two';
  repos;

  constructor(private http: HttpClient) {
    const path = 'http://api.github.com/search/repositories?q=angular';
    this.repos = http.get<any>(path)
      .pipe(map(list => list.items),
        shareAndCache('github-repolist'));
  }
}

export function shareAndCache<T>(storageKey: string): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => {
    return source.pipe(
      tap(value => localStorage[storageKey] = JSON.stringify(value)),
      startWith(JSON.parse(localStorage[storageKey] || '[]')),
      shareReplay(1)
    );
  };
}
