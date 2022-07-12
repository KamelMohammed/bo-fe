import {EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {empty, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {OtherContactDTO, PatientDTO} from "../../../../../../services/api/cdr";

@Component({
  selector: 'app-chips-list',
  templateUrl: './altri-partecipanti.component.html',
  styleUrls: ['./altri-partecipanti.component.scss']
})
export class AltriPartecipantiComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  partecipantiCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  partecipantiSelected: string[] = [];
  @Input() assistito: PatientDTO;
  @Input() isNew: boolean;
  @Input() alreadySelected: string;
  @Input() isDoctor: boolean;
  @Input() label: string;
  readonly:boolean=true;
  @Output() public addSelected : EventEmitter<any[]>= new EventEmitter();
  @Input() stato: string;


  allList: string[] = [];
  otherContracts: any[]=[];
  canAdd:boolean=true;

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor() {
    this.filteredFruits = this.partecipantiCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allList.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.partecipantiSelected.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.partecipantiCtrl.setValue(null);
  }

  remove(fruit: string): void {
    if(!this.readonly){
    const index = this.partecipantiSelected.indexOf(fruit);
    let contacts: OtherContactDTO[]=[];
    if (index >= 0) {
      for (let i=0; i<  this.otherContracts.length ; i++){
        if(this.otherContracts[i].name+" "+this.otherContracts[i].surname == this.partecipantiSelected[index]){
          delete this.otherContracts[i]
          break
        }
      }
      for(let o of this.otherContracts){
        if(o){
          contacts.push(o)
        }
      }
      this.otherContracts=contacts
      this.addSelected.emit(this.otherContracts)
      this.partecipantiSelected.splice(index, 1);
    }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.canAdd=true;
    for (let p of this.partecipantiSelected){
      if(p === event.option.viewValue){
        this.canAdd=false;
      }
    }
    if(this.canAdd){
    this.partecipantiSelected.push(event.option.viewValue);
    for(let p of this.assistito.otherContacts){
      if(p.name+" "+p.surname == event.option.viewValue){
        this.otherContracts.push(p)
      }
    }
    this.fruitInput.nativeElement.value = '';
    this.partecipantiCtrl.setValue(null);
    this.addSelected.emit(this.otherContracts)

    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allList.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
  ngOnInit(): void {
    if(!this.isNew && !this.isDoctor && this.stato==="PRESENTATA"){
      this.readonly=false;
    }
    if(this.isNew && this.readonly){
      this.readonly=false
    }
    else if(this.isDoctor && (this.stato=== "PRESENTATA" || this.stato=== "PRESA_IN_CARICO")){
      this.readonly=false
    }
    if(!this.isNew){
      if(this.alreadySelected.length>0){
      let splitted:string[] = this.alreadySelected.split("-")
      for (let e of splitted){
        this.partecipantiSelected.push(e)
      }
    }
    }
    for (let p of this.assistito.otherContacts) {
      this.allList.push(p.name + " " + p.surname)
    }

  }
}
