export class Game {
    id : String;
    userId : String;
    colors : {
        guessBackground : String,
        textBackground : String,
        wordBackground :String
    };
    font : {
        category : String,
        family : String,
        rule : String,
        url : String
    };
    guesses : String;
    level : {
        name : String,
        minLength : Number,
        maxLength : Number,
        rounds : Number
    };
    remaining : Number;
    status : String;
    target : String;
    timestamp : Number;
    timeToComplete : Number
    view : String;

    constructor(obj : any){
        this.id = obj.id;
        this.userId = obj.userId;
        this.colors = obj.colors;
        this.font = obj.font;
        this.guesses = obj.guesses;
        this.level = obj.level;
        this.remaining = obj.remaining;
        this.status = obj.status;
        this.target = obj.target;
        this.timestamp = obj.timestamp;
        this.timeToComplete = obj.timeToComplete;
        this.view = obj.view;
    }
}
