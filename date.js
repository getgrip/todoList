let today = new Date(); 
exports.getDate = 
    function getDate(){
        let options = {
            weekday:"long", 
            day: "numeric", 
            month: "long"
        };
        let day =today.toLocaleDateString("en-US", options); 
        return day; 
    }

exports.getDay =
    function getDay(){
        return today.toLocaleDateString("en-US");
    }