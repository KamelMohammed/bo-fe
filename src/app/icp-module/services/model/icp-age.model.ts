export class IcpAgeTemplate {
    id:string;
    label:string;
    operatorId:string;
    itemId:string;
    //solo nel caso in cui è una valutazione finale o intermedia
    //se rappresenta una sessione allora non è necessario il paiId;
    paiId:string;
    localDateTime:Date;
    eventType:EventType;
}

//nell'agenda ci sono solo valutazioni intermedie finali e sessioni
export enum EventType{
    MIDTERM_EVALUATION="MIDTERM_EVALUATION",
	FINAL_EVALUATION="FINAL_EVALUATION",
	SESSION="SESSION"
}

export class IcpAgeSearchCriteria {
    date: Date;
}
