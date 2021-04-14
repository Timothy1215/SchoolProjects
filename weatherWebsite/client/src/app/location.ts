export class Location {
    userId : String;
    description : String;
    temp : String;
    weather : String;
    name : String;

    constructor(obj : any){
        this.userId = obj.userId;
        this.description = obj.description;
        this.temp = obj.temp;
        this.weather = obj.weather;
        this.name = obj.name;
    }
}
