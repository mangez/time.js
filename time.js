
var _controlID;
function callOpenCalender(controlid) {
   
    _controlID = controlid;
    let objCalender = new calendar(new Date());
    objCalender.openCalendar();
    setevent(objCalender);
}

arrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function monthadd(date, month)
{
    var temp = date;
    temp = new Date(date.getFullYear(), date.getMonth(), 1);
    temp.setMonth(temp.getMonth() + month + 1);
    temp.setDate(temp.getDate() - 1);
    if (date.getDate() < temp.getDate()) {
        temp.setDate(date.getDate())
    }
    return temp;
}

function navigateToPreviousMonth(day,month ,year) {
    var d = new Date(month+1 + " " + day + "," + year);
    var preD = monthadd(d, -1);
    let objCalender = new calendar(preD);
    objCalender.openCalendar();
    setevent(objCalender);
}


function navigateToNextMonth(day, month, year){
    var d = new Date(month + 1 + " " + day + "," + year);
    var preD = monthadd(d, 1);
    let objCalender = new calendar(preD);
    objCalender.openCalendar();
    setevent(objCalender);
}
class calendar{

    constructor(stDate)
    {
        //alert(stDate);
        this.d = stDate;//new Date(stDate);
       // alert(this.d);
        this.strDay = this.d.getDate();
        this.strMonth = this.d.getMonth();
        this.strYear = this.d.getFullYear();
        this.strStartDay = new Date(this.strYear, this.strMonth, 1);
        this.strLastDay = new Date(this.strYear, this.strMonth + 1, 0);
        this.arrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        this.CurrentDate = new Date();
        this.CurrentstrDay = this.CurrentDate.getDate();
        this.CurrentstrMonth = this.CurrentDate.getMonth();
        this.CurrentstrYear = this.CurrentDate.getFullYear();

    };
    openCalendar() {
        //alert("hi"+this.d);

        var calContent = "<table id='calTable' class='calendar-container'>";
        calContent += "<Caption ><div onclick='navigateToPreviousMonth(" + this.strDay + "," + this.strMonth + "," + this.strYear+ ");' id='navLeft' class='navigationArrow navLeft'>&#9664;</div>"
            + this.arrMonth[this.strMonth] + " "
            + this.strYear + "<div id='navRight' onclick='navigateToNextMonth(" + this.strDay + "," + this.strMonth + "," + this.strYear + ");' class='navigationArrow navRight'>&#9654;</div></caption>";

        calContent += "<thead><th class='sunday'>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></thead>";
        var counter = 0
        var prevMonthDaysPadding = this.strStartDay.getDay();
        var currentMonthLastDay = this.strLastDay.getDate();
        //alert(currentMonthLastDay);
        for (let i = 0; i < 6 && currentMonthLastDay > counter; i++) {
            calContent += "<tr>";
            for (let j = 0; j < 7 && currentMonthLastDay > counter; j++) {
                if (prevMonthDaysPadding <= 0) {
                    counter++;
                    var stclass = "";
                    if (counter == this.strDay && this.strDay == this.CurrentstrDay
                        && this.strMonth == this.CurrentstrMonth
                        && this.strYear == this.CurrentstrYear) {
                        stclass += " today ";
                    }
                    if (j == 0) {
                        stclass += " sunday ";
                    }

                    calContent += "<td name='days' class='" + stclass + "'>" + counter + "</td>"


                } else {
                    prevMonthDaysPadding--;
                    calContent += "<td></td>"
                }

            }
            calContent += "</tr>";
        }
         calContent += "</table >";
        document.getElementById('time').innerHTML = calContent;


      
    }
 
}


function setevent(objCalender) {
    let selectedTD;
    document.getElementById("calTable").onclick = function (event) {
        let target = event.target;
        if (target.tagName != 'TD') { return; }
		 if (target.parentElement.tagName != 'TR') { return; }

        cellClick(target, objCalender);
    }

    function cellClick(td, objCalender) {
       
        if (td.innerHTML != "") {

            document.getElementById(_controlID).value = td.innerHTML + "/" + arrMonth[ objCalender.strMonth]+ "/" + objCalender.strYear;
        document.getElementById("time").innerHTML="";
		}
    }
}