import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { throttleTime, retry, map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { SearchResultType } from '../home/home.page';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getSearchDataFromWikipedia(searchTerm: string)
  : Observable<SearchResultType[]> {
    try {
      const maxChars: number = this.getMaxChars();
      const encodedURL: string = encodeURI(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`);
      return this.httpClient
                  .get<any>(encodedURL)
                  .pipe(
                    throttleTime(500),
                    retry(3),
                    map((data) => {
                      if (data.hasOwnProperty("query")) {
                        const dt = this.processWikiResults(data.query.pages);
                        return dt;
                      }
                      return data;
                    })
                  );
    }
    catch(ex) {
      throw ex;
    }
  }

  processWikiResults(results): SearchResultType[] {
    const resultArray = [];
    Object.keys(results).forEach((key) => {
      const id = key;
      const title = results[key].title;
      const text = results[key].extract;
      const img = results[key].hasOwnProperty("thumbnail")
        ? results[key].thumbnail.source
        : null;
      const item = {
        id: id,
        title: title,
        img: img,
        text: text
      };
      resultArray.push(item);
    });
    return resultArray;
  }

  private getMaxChars(): number {
    const width = window.innerWidth || document.body.clientWidth;
    let maxChars: number;
    if (width < 414) maxChars = 65;
    if (width >= 414 && width < 1400) maxChars = 100;
    if (width >= 1400) maxChars = 130;
    return maxChars;
  }
}
