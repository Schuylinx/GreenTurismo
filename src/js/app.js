import { MapService } from './service/MapService.js';
import { Address } from './class/Address.js';
import { ChargeTerminal } from './class/ChargeTerminal.js';

// View
var showForm = false;

//var url = 'https://api.openchargemap.io/v3/poi/?output=json&countrycode=FR&compact=true&verbose=false';
var url = "http://localhost/GreenTurismo/src/js/json/OpenChargeMapData.json";
var mapService = new MapService();

window.onload=function(){

    var markGreen = L.icon({
        iconUrl: 'src/img/marker_green.png',
        iconSize: [64, 64],
        iconAnchor: [32,64],
        shadowUrl: '',
        shadowSize: [0, 0]
    }); 


    var markRed = L.icon({
        iconUrl: 'src/img/marker_red.png',
        iconSize: [64, 64],
        iconAnchor: [32,64],
        shadowUrl: '',
        shadowSize: [0, 0]
    });

    mapService.loadMapDataFrom(url).then(function(response){
    
        var data = JSON.parse(response);
        var tmpList = new Array();
        var map = mapService.getMap();

        for (let i = 0; i < data.length; i++) {
            var object = data[i];
            var addressInfo = object.AddressInfo;
            var chargeTerminalName = addressInfo.Title;
            var roadName = addressInfo.AddressLine1;
            var zipCode = addressInfo.Postcode
            var city = addressInfo.Town;
            var latitude = parseFloat(addressInfo.Latitude);
            var longitude = parseFloat(addressInfo.Longitude);
            var plugNumber = parseInt(object.NumberOfPoints, 10);

            tmpList.push(
                new ChargeTerminal(
                    chargeTerminalName,
                    new Address(roadName, zipCode, city, latitude, longitude),
                    plugNumber
                )
            );

            mapService.setPointDeRechargeList(tmpList);
        }

        map.render();
        
        for (let i = 0; i < mapService.getPointDeRechargeListSize(); i++) {
            mapService.getMap().addMarker(
                mapService.getPointDeRechargeList(i).getAddress().getLatitude(),
                mapService.getPointDeRechargeList(i).getAddress().getLongitude()
            );
        }


        var markerDepart = L.marker([0,0]);
        markerDepart.setIcon(markGreen);

        var markerArrivee = L.marker([0,0]);
        markerArrivee.setIcon(markRed);

        var path = L.geoJSON();
        var itinerary = {};

        document.getElementById('recherchePoints').onclick = function() {
            console.log("Recherche...");
            Promise.all([
                map.searchLocation('positionDepart', markerDepart), 
                map.searchLocation('positionArrivee',markerArrivee)]).then(function(data) {
                    map.navCalculator(markerDepart,markerArrivee,path,itinerary);
            });
        }
    });
};

});

document.getElementById("search").addEventListener("click", function(){
    showForm = !showForm;

    if(showForm) {
        document.getElementById("pathCalculator").style.display = 'block';
    } else {
        document.getElementById("pathCalculator").style.display = 'none';
    }

});
});
