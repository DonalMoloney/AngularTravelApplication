import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CurrencyInterface } from './module/currency_interface';
//import { TripInterface } from './module/trip_interface';


declare const google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent {
  private mapProp;
  private map;
  private mapsHandlersInitialized = false;
  constructor(private http: HttpClient) {

  }
  background_img = 'assets/img/banner.jpg';



  ngAfterViewInit(): void{
    this.newScreen();
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
  };


makeRequest(tripParam){
  this.http.get<any>('http://localhost:4000/trips/'+tripParam).subscribe(
  // returns base euro for one of each
  data => {
    let dataPoint = data[0].locations; //array of values
    console.log("______________________");
    console.log(data[0]);
    var singleMarker;
    let markers = [3];
    var icon = {
      url: "assets/img/marker.png", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    var infoWindow;
    for(var i=0; i<3; i++){
      console.log("ENTERD");
      var newLatLong = new google.maps.LatLng(parseFloat(dataPoint[i].lat),parseFloat(dataPoint[i].long));
      singleMarker = new google.maps.Marker({
          position: newLatLong,
          map: this.map,
          icon: icon,
          animation: google.maps.Animation.BOUNCE,
          title: data[0].trip_name+ i
        });
        //Todo add info window
        var contentString = '<div id="content">'+
         '<div id="siteNotice">'+
         '</div>'+
         '<h1 id="firstHeading" class="firstHeading">'+data[0].name+'</h1>'+
         '<div id="bodyContent">'+
         '<p>'+data[0].description+'</p>'+
         '<img src="'+data[0].img+ '" alt="ERRR!!! Sorry" height="42" width="42">'
         '</div>'+
         '</div>';
         infoWindow = new google.maps.InfoWindow({
           content: contentString
         });
         //TOdo maybe think about adding custom markers for each trip type
        singleMarker.addListener('click', function() {
          infoWindow.open(this.map, singleMarker);
        })
        singleMarker.setMap(this.map);
    };
  },
  (err: HttpErrorResponse) => {
    if (err.error instanceof Error) {
      console.log("Client-side error occured.");
    } else {
      console.log("Server-side error occured.");
    }
  });};

  customTripModal(){
    // TODO create custom trip modal that allows the user to create their own trip
  }
  newScreen(){
    this.mapProp = {
        center: new google.maps.LatLng(40.4168, -3.7038),
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById("googleMap"), this.mapProp);
  };
}
