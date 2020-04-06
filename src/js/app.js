import { MapService } from './service/MapService.js';
import { Address } from './class/Address.js';
import { ChargeTerminal } from './class/ChargeTerminal.js';

window.onload = function(){

    // View
    var showForm = true;

    // Autonomie
    var autonomieMaximale = -1;
    var percentage = 0;
    var autonomie = 0;

    //var url = 'https://api.openchargemap.io/v3/poi/?output=json&countrycode=FR&compact=true&verbose=false';
    var url = "http://localhost/GreenTurismo/src/js/json/world.json";
    var mapService = new MapService();
    var map = mapService.getMap();

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
            var pointDeCharge = mapService.getPointDeRechargeList(i);
            markers.addLayer(
                L.marker([
                    pointDeCharge.getAddress().getLatitude(),
                    pointDeCharge.getAddress().getLongitude()
                ]).bindPopup(
                    '<p><b>' + pointDeCharge.getAddress().getRoadName() + '</b>, '
                    + pointDeCharge.getAddress().getZipCode() + ', '
                    + pointDeCharge.getAddress().getCity() + '</p>'
                    + '<button id="add-to-itinerary"><i class="fas fa-map-signs"></i> <span>Ajouter à l\'itinéraire</span></button>'
                )
            );
        }
        map.getMap().addLayer(markers);

    });

    var markerDepart = L.marker([0,0]);
    var markerArrivee = L.marker([0,0]);

    document.getElementById('recherchePoints').onclick = function() {
        var depart = document.getElementById('positionDepart').value;
        var arrivee = document.getElementById('positionArrivee').value;
        if (autonomieMaximale != -1 && percentage > 0.05 && depart.length != 0 && arrivee.length != 0) {
            autonomie = percentage*autonomieMaximale;
            Promise.all([
                map.searchLocation('positionDepart', markerDepart),
                map.searchLocation('positionArrivee',markerArrivee)
            ]).then(function(data) {
                map.navCalculator(markerDepart, markerArrivee, autonomie, autonomieMaximale);
            });
        } else {
            console.log(percentage);
            if (autonomieMaximale == -1) {
                document.getElementById('car-model').style.transition = ".3s ease";
                document.getElementById('car-model').style.border = "1px solid #e84118";
            }
            if (percentage < 0.05) {
                document.getElementById('charge-value').style.color = "#e84118";
            }
            if (depart.length == 0) {
                document.getElementById('positionDepart').style.border = "1px solid #e84118";
            }
            if (arrivee.length == 0) {
                document.getElementById('positionArrivee').style.border = "1px solid #e84118";
            }
        }
    };

    document.getElementById("search").addEventListener("click", function(){
        showForm = !showForm;

        if(showForm) {
            document.getElementById("pathCalculator").style.display = 'block';
        } else {
            document.getElementById("pathCalculator").style.display = 'none';
        }

    });

    document.getElementById('autonomieMaximale').addEventListener("input", function(){
        if (this.value <= 5) {
            document.getElementById('charge-value').style.color = "#e84118";
        } else if (this.value > 5 && this.value < 20) {
            document.getElementById('charge-value').style.color = "#fbc531";
        } else if (this.value >= 20 && this.value < 80) {
            document.getElementById('charge-value').style.color = "#00a8ff";
        } else {
            document.getElementById('charge-value').style.color = "#4cd137";
        } 
        percentage = parseFloat(this.value) / 100;
        document.getElementById('charge-value').innerHTML = this.value + " % ~" + parseInt(autonomieMaximale*percentage) + "km";
    });

    document.getElementById('car-model').addEventListener("change", function(){
        switch (this.value) {
            case '1':
                autonomieMaximale = 250;
                document.getElementById('car-model').style.border = "none";
            break;
            case '2':
                autonomieMaximale = 400;
                document.getElementById('car-model').style.border = "none";
            break;
            default:
                autonomieMaximale = -1;
            break;
        }
    });


};