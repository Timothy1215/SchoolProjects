export default class Utils {
    static createDate(inputDate: string) : string {
        if (!inputDate.includes("-")) {
          return inputDate;
        }
        const year = inputDate.substring(0, inputDate.indexOf("-"));
        const month = inputDate.substring(inputDate.indexOf("-") +1, inputDate.lastIndexOf("-"));
        const day = inputDate.substring(inputDate.lastIndexOf("-") + 1);
    
        return month + "/" + day + "/" + year;
    }

    static createFormDate(inputDate: string) : string {
        const month = inputDate.substring(0, inputDate.indexOf("/"));
        const day = inputDate.substring(inputDate.indexOf("/") +1, inputDate.lastIndexOf("/"));
        const year = inputDate.substring(inputDate.lastIndexOf("/") + 1);
    
        return year + '-' + month + '-' + day;
    }
    
    static createFormTime(inputTime: string) : string {
        const hour:number = +inputTime.substring(0,  inputTime.indexOf(":"));
    
        if (inputTime.includes("pm")){
          if (hour == 12){
            return 12 + ":" + inputTime.substring(inputTime.indexOf(":") +1, inputTime.indexOf("pm"));
          }
          return hour + 12 + ":" + inputTime.substring(inputTime.indexOf(":") +1, inputTime.indexOf("pm"));
        } else {
          const newTime = inputTime.substring(0, inputTime.indexOf("am"));
          if (hour == 12){
            return "00:" + newTime.substring(inputTime.indexOf(":") +1); 
          }
          if (hour < 10 )
             return 0 + newTime;
    
          return newTime
        }
      }
    
    static createTime(inputTime: string) : string {
        if (inputTime.includes("am") || inputTime.includes("pm")){
          return inputTime;
        }
        const hour = inputTime.substring(0,  inputTime.indexOf(":"));
        const minute = inputTime.substring(inputTime.indexOf(":")); //has ':' in it still
        const hourValue:number = +hour;
    
        let retTime = "";
        
        if (hourValue < 12 && hourValue != 0){
          retTime = hourValue  + minute + "am"
        } else if (hourValue  == 12) {
          retTime = "12" + minute + "pm";
        } else if (hourValue  == 0 || hourValue  == 24) {
          retTime = "12" + minute + "am";
        }else{
          retTime = hourValue - 12 +  minute + "pm";
        }
        return retTime;
    }
}
    