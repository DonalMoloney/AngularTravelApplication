import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CurrencyInterface } from './module/currency_interface';

declare const google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent {

  constructor(private http: HttpClient) {}
  background_img = 'assets/img/banner.jpg';


  ngOnInit():void{
        let mapProp = {
            center: new google.maps.LatLng(40.4168, -3.7038),
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        let map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        var mapDivB = document.getElementById('barcelona');
        var mapDivM = document.getElementById('madrid');
        var mapDivV = document.getElementById('valencia');
        var mapDivSS = document.getElementById('southSpain');
        var mapDivNS = document.getElementById('northSpain');
        var mapDivC = document.getElementById('clear');
        var mapDivCCT = document.getElementById('createCustomTrip'); //TODO plan out how to do this

        //todo make custom events such as what occured below for the item
        google.maps.event.addDomListener(mapDivB, 'click', function() {
          window.alert('Map was clicked!');
          let mapPropB;
          map = new google.maps.Map(document.getElementById("googleMap"), mapPropB)
        });

        google.maps.event.addDomListener(mapDivM, 'click', function() {
          //TODO Implement
        });
        google.maps.event.addDomListener(mapDivV, 'click', function() {
          //TODO Implement
        });

        google.maps.event.addDomListener(mapDivSS, 'click', function() {
          //TODO Implement
        });

        google.maps.event.addDomListener(mapDivNS, 'click', function() {
          //TODO Implement
        });
        google.maps.event.addDomListener(mapDivC, 'click', function() {
          //TODO Implement
        });
        google.maps.event.addDomListener(mapDivCCT, 'click', function() {
           //TODO Implement
        });
    };

    convertToEuros(){
        var start_currency = (<HTMLInputElement>document.getElementById('start_amount')).value;
        var start_id = (<HTMLInputElement>document.getElementById('start_currency')).value;
        if(this.currency_Valid(start_currency) == true && this.start_Currency_Valid(start_id) == true){
            console.warn('SENDING');
            let access_key = 'e46e8adea46d4b5021d575c3865e2edf'
            //TODO not succesfully adding params to this query
            this.http.get<CurrencyInterface>('http://data.fixer.io/api/latest?access_key='+access_key).subscribe(
            // returns base euro for one of each
            data => {
              if(data.rates[start_id] == undefined){
                (<HTMLInputElement>document.getElementById('amount_euros')).value = 'Err: Something went wrong';
              }else{
                console.log(data.rates[start_id]);
                var conversion_factor = data.rates[start_id];
                var float_start_currency = parseFloat(start_currency);
                var float_conversion_factor = parseFloat(conversion_factor);
                var final_amount_Euros = parseFloat(start_currency) / parseFloat(conversion_factor);
                //Truncate this too to decimal places
                (<HTMLInputElement>document.getElementById('amount_euros')).value = (String(final_amount_Euros));
              }
            },
            (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                console.log("Client-side error occured.");
              } else {
                console.log("Server-side error occured.");
              }
            }
          );
        }else{
          //todo tell user the input is invalid
        }
    }

    currency_Valid(to_check){
      return true; //todo change this
    }

    start_Currency_Valid(to_check){
      return true; //todo change this
    }

    makeRequest(param){
      if(param == "b"){
        console.log("b");
        // TODO make request to server
      } else if (param == "ns"){
        console.log("ns");
        // TODO make request to server
      } else if(param == "ss"){
        console.log("ss");
        // TODO make request to server
      } else if(param == "m"){
        console.log("m");
        // TODO make request to server
      }else if(param == "v"){
        console.log("v");
        // TODO make request to server
      }
    };

    setStartingCurrecy(currency){
      console.log(currency);
      (<HTMLInputElement>document.getElementById('start_currency')).value = String(currency);
  };

  increase_or_decrease(action){
    var old_amount = (<HTMLInputElement>document.getElementById('start_amount')).value;
    var regex_obj = new RegExp('^\d*(\.\d{0,2})?');
    console.log();
    console.log((regex_obj.test(old_amount) == false));
    // TODO CHECK IF LESS THAN ZERO
    if((old_amount.length == 0) ||(regex_obj.test(old_amount) == false)){
      (<HTMLInputElement>document.getElementById('start_amount')).value = '0.00';
    }else{
      var old_amount_float = parseFloat(old_amount) // convert old amount to float
      var change_amount = 0.50;
      if(old_amount_float < 0.00){
        old_amount_float = 0.00;
      }else if (action == '+'){
          old_amount_float = old_amount_float + change_amount;
      }else{
        if((old_amount_float - change_amount) >= 0.0){ //Value is only decreased if it is less than zero
          old_amount_float = old_amount_float - change_amount;
        }
      }
      (<HTMLInputElement>document.getElementById('start_amount')).value = String(old_amount_float);
    }
  }
}
