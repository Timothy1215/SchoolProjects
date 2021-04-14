export class Program {
    name : String;
    location : String;
    description : String;
    capacity : Number;
    fee : Number;
    startTime: String;
    endTime: String;
    startDate: String;
    endDate: String;
    day : String[];
  
    constructor(obj : any){
        this.name = obj.name;
        this.location = obj.location;
        this.description = obj.description;
        this.startTime = obj.startTime;
        this.endTime = obj.endTime;
        this.startDate = obj.startDate;
        this.endDate = obj.endDate;
        this.day = obj.day;
        this.capacity = obj.capacity;
        this.fee = obj.fee;
    }
}
