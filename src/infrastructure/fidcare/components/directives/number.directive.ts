import { Directive, HostListener } from '@angular/core';

@Directive()
export abstract class NumberDirective {
    protected allowedCharacters:Set<number> = new Set<number>();

    constructor() {
        //Create allowed characters Set
        //Numbers
        for (let i=0;i<10;i++){
            this.allowedCharacters.add(i+48);
            this.allowedCharacters.add(i+96);
        }
        //backspace
        this.allowedCharacters.add(8);
        //Tab
        this.allowedCharacters.add(9);
        //End
        this.allowedCharacters.add(35);
        //Home
        this.allowedCharacters.add(36);
        //left
        this.allowedCharacters.add(37);
        //Up
        this.allowedCharacters.add(38);
        //Right
        this.allowedCharacters.add(39);
        //Down
        this.allowedCharacters.add(40);
        //Canc
        this.allowedCharacters.add(46);

        //Subtract
        this.allowedCharacters.add(109);
        this.allowedCharacters.add(189);
    }
    
    @HostListener('keydown', [ '$event' ])
    onKeyDown(event: KeyboardEvent) {
        if(!this.allowedCharacters.has(event.keyCode)){
            if(!this.additionalCheck(event)){
                event.preventDefault();
                return false;
            }
        }
    }

    protected abstract additionalCheck(event: KeyboardEvent):boolean;
}