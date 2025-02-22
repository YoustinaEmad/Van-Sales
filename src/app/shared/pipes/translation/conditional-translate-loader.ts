import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { catchError, switchMap, map } from "rxjs/operators";

export class ConditionalTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, public defaultPrefix: string, public overridePrefix?: string, public suffix: string = ".json") {}

  getTranslation(lang: string): Observable<any> {
    const defaultPath = `${this.defaultPrefix}${lang}${this.suffix}`;
    const overridePath = `${this.overridePrefix}${lang}${this.suffix}`;

    return this.http.get(defaultPath).pipe(
      catchError(() => {
        // If the default translation file doesn't exist, return an empty object.
        return of({});
      }),
      switchMap((defaultData) => {
        return this.http.get(overridePath).pipe(
          map((overrideData) => {
            deepMerge(defaultData, overrideData);
            return defaultData;
          }),
          catchError(() => {
            // If the override translation file doesn't exist, return the default translations.
            return of(defaultData);
          })
        );
      })
    );
  }
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && target[key] instanceof Object) {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}
