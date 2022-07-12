import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {PatientDTO} from "../../../../../../services/api/cdr";
import {FindPatologyResponse, PathologyService} from "../../../../../../services/api/atm";
import {map, startWith} from "rxjs/operators";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-quesiti-diagnostici',
  templateUrl: './quesiti-diagnostici.component.html',
  styleUrls: ['./quesiti-diagnostici.component.scss']
})
export class QuesitiDiagnosticiComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  partecipantiCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  partecipantiSelected: string[] = [];
  @Input() isNew: boolean;
  @Input() alreadySelected?: string =null ;
  @Input() quesiti: string[]=[];
  @Input() isDoctor: boolean;
  @Input() valid: boolean=true;
  @Input() label: string;
  @Input() readonly:boolean;
  @Output() public addSelected : EventEmitter<any[]>= new EventEmitter();

  allList: string[] = [];
  otherContracts: any[]=[];
  canAdd:boolean=true;
  goo:boolean=false;
  valueInput : string = '';
  patologie: FindPatologyResponse[]=[];
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(private patologieService:PathologyService) {
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
    if(this.readonly) {

      const index = this.partecipantiSelected.indexOf(fruit);
      let contacts: any[] = [];
      if (index >= 0) {
        for (let i = 0; i < this.otherContracts.length; i++) {
          if (this.otherContracts[i] === this.partecipantiSelected[index]) {
            delete this.otherContracts[i]
            break
          }
        }

        for (let o of this.otherContracts) {
          if (o) {
            contacts.push(o)
          }
        }
        this.otherContracts = contacts
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
      if (this.otherContracts.find((test) => test=== event.option.viewValue) === undefined) {
        this.otherContracts.push(event.option.viewValue)
      }


    }
    this.fruitInput.nativeElement.value = '';
    this.partecipantiCtrl.setValue(null);
    this.addSelected.emit(this.otherContracts)

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allList.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
  change(){
    if(this.isDoctor && this.alreadySelected==null){
      if(this.valueInput.length >=3){
        this.patologieService.listPathologies(this.valueInput).subscribe(res =>{
          this.patologie=res;
          this.patologie.map(m1 => this.allList.push(m1.value));
          this.goo=true;
        })
      }
      else {
        this.allList=[];
        this.goo=false;
      }
    }
  }

  ngOnInit(): void {

    if(this.quesiti.length>0){
      this.quesiti.map(m => this.partecipantiSelected.push(m))
      this.otherContracts=this.partecipantiSelected
    }


  }
}
