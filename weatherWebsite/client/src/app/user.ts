export class User {
    email : String;
    firstName : String;
    lastName : String;
    username : String;

    constructor(obj : any){
        this.email = obj.email;
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.username = obj.username;
    }
}
