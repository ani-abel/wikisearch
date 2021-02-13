import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Plugins } from '@capacitor/core';
import { Observable, of } from 'rxjs';
import {
  deleteSearchResults,
  setSearchFocus,
  showClearTextButton
} from '../utils/function.util';
import { HttpService } from '../services/http.service';

const { Browser } = Plugins;

export interface SearchResultType {
  id: string;
  title: string;
  img?: string;
  text: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements
OnInit,
AfterViewInit {
  @ViewChild("searchField", { read: ElementRef }) searchFieldEl: ElementRef;
  searchResults$: Observable<SearchResultType[]>;
  searchForm: FormGroup;
  searchTerm: string;

  constructor(
    private readonly httpSrv: HttpService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initApp();
  }

  ngAfterViewInit(): void {
    this.setSearchFocus();
  }

  //? Main.js - Begins
  initApp(): void {
    const search = document.getElementById("search");
    search.addEventListener("input", showClearTextButton);
  };

  setSearchFocus(): void {
    this.searchFieldEl.nativeElement.focus();
  }

  submitTheSearch(): void {
    if(this.searchForm.invalid) {
      return;
    }
    const { searchField } = this.searchForm.value;
    this.searchTerm = searchField;

    deleteSearchResults();
    this.searchResults$ = this.httpSrv.getSearchDataFromWikipedia(searchField);
    setSearchFocus();
  };
  //? Main.js - Ends

  async onBrowser(searchId: string): Promise<void> {
    await Browser.open({
      url: `https://en.wikipedia.org/?curid=${searchId}`
    });
  }

  private initForm(): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(null, Validators.compose([
        Validators.required
      ]))
    });
  }

  clearForm(): void {
    this.searchForm.reset();
    this.searchResults$ = of([]);
  }

}
