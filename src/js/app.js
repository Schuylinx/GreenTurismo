import { MapService } from './service/MapService.js';
import { Address } from './class/Address.js';
import { ChargeTerminal } from './class/ChargeTerminal.js';

// View
var showForm = false;

//var url = 'https://api.openchargemap.io/v3/poi/?output=json&countrycode=FR&compact=true&verbose=false';
var url = "http://localhost/GreenTurismo/src/js/json/OpenChargeMapData.json";
var mapService = new MapService();
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
    
    var markers = L.markerClusterGroup();

    for (let i = 0; i < mapService.getPointDeRechargeListSize(); i++) {
        markers.addLayer(
            L.marker([
                mapService.getPointDeRechargeList(i).getAddress().getLatitude(),
                mapService.getPointDeRechargeList(i).getAddress().getLongitude()
            ])
        );
    }
    map.getMap().addLayer(markers);

});

document.getElementById("search").addEventListener("click", function(){
    showForm = !showForm;

    if(showForm) {
        document.getElementById("pathCalculator").style.display = 'block';
    } else {
        document.getElementById("pathCalculator").style.display = 'none';
    }

});