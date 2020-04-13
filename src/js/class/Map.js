import { ChargeTerminal } from '../class/ChargeTerminal.js';

/**
 * @class Map.js
 * Describe what is a map
 */
class Map {

    /**
    * @param {any} map
    * @param {ChargeTerminal[]} chargeTerminalList
    * @parama {string} accessToken
    */


    constructor() {
        this.accessToken = "pk.eyJ1IjoiZW56b2NvbnRpbmhvIiwiYSI6ImNrNmkyYjVzdjFnM3IzZW52N21ydmgydG8ifQ.t2TaKZvtBCCrGvyLM2UjJA";
        this.chargeTerminalList = new Array();
    }

    addListCharge(chargeList){
        this.chargeTerminalList = chargeList;
        console.log(this.chargeTerminalList);
    }

    render() {
        this.map = L.map('gtMap').setView([46.8181124, 2.4826541], 6);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: this.accessToken
        }).addTo(this.map);

        this.getPointerLocation();
    }

    addMarker(latitude, longitude) {
        L.marker([latitude, longitude]).addTo(this.map);
    }

    searchLocation(idElement,marker) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var search = document.getElementById(idElement).value;
            var requestURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + search + '.json?access_token=' + "pk.eyJ1IjoiZW56b2NvbnRpbmhvIiwiYSI6ImNrNmkyYjVzdjFnM3IzZW52N21ydmgydG8ifQ.t2TaKZvtBCCrGvyLM2UjJA";
            var request = new XMLHttpRequest();
            request.open('GET', requestURL);
            request.responseType = 'json';
            request.send();
            request.onload = function() {
                var addresses = request.response;
                marker.setLatLng(L.latLng(addresses['features']['0']['center']['1'], addresses['features']['0']['center']['0']));
                resolve();
            }
        });
    }

    getPointerLocation(){
        this.map.on('dblclick', function(e){
            const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" +  e.latlng.lng + "," + e.latlng.lat + ".json?access_token=pk.eyJ1IjoiZW56b2NvbnRpbmhvIiwiYSI6ImNrNmkyYjVzdjFnM3IzZW52N21ydmgydG8ifQ.t2TaKZvtBCCrGvyLM2UjJA";
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
            const response = JSON.parse(request.responseText);
            console.log(response.features)
            const startPos = document.getElementById('positionDepart');
            const endPos = document.getElementById('positionArrivee');
            if(startPos.value === '') {
                startPos.value = response.features[0].place_name;
            }else if(endPos.value === ''){
                endPos.value = response.features[0].place_name;
            }
        });
    }

    getCityNameWithCoordinates(){
        const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/chester.json?proximity=" + lng + ", " + lat + "&access_token=" + this.accessToken;
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.responseType = 'json';
        request.send();
        return request.responseText;
    }

    async getDistancePoints(routeControl){
        let test;
        await routeControl.on('routesfound', function(e) {
            var routes = e.routes;
            test = routes[0].summary.totalDistance;
        });
        return test;
    }

    getItinerary(markerDepart,markerArrivee,autonomieDebutVehiculeAssocie,autonomieMaxVehiculeAssocie){
        var originLatLng = markerDepart.getLatLng();
        var destinationLatLng = markerArrivee.getLatLng();
        var waypoints = [];
        var waypointsDeRecharge = [];
        //On ajoute le premier point de la liste (le markerDepart)
        waypoints.push(L.latLng(originLatLng['lat'],originLatLng['lng']));

        //On ajoute le dernier point de la liste (le markerArrivee)
        waypoints.push(L.latLng(destinationLatLng['lat'],destinationLatLng['lng']));

        console.log("autonomieDebut : " + autonomieDebutVehiculeAssocie + " autonomieMaxVehiculeAssocie rechargé : " + autonomieMaxVehiculeAssocie);

        let element=0;
        for(element ; element < waypoints.length -1 ; element++){
            /*console.log(waypoints[element]);
            console.log(waypoints[element+1]);*/
            let stringToReturn;
            let Point1 = waypoints[element];
            let Point2 = waypoints[element+1];
            let distancePoints = 0;

            var routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(Point1.lat,Point1.lng),
                    L.latLng(Point2.lat,Point2.lng)
                ],
                routeWhileDragging: false,
                createMarker: function(i, start, n){
                    if(i === 0){
                        return L.marker(start.latLng, {
                            icon: new L.Icon({
                                iconUrl: 'src/img/marker_green.png',
                                iconSize: [32, 32],
                                shadowUrl: '',
                                shadowSize: [0, 0]
                            })
                        });
                    }else {
                        return L.marker(start.latLng, {
                            icon: new L.Icon({
                                iconUrl: 'src/img/marker_red.png',
                                iconSize: [32, 32],
                                shadowUrl: '',
                                shadowSize: [0, 0]
                            })
                        });
                    }
                }
            }).addTo(this.map);
            routeControl.on('routesfound', (e) => {
                var routes = e.routes;
                distancePoints = (routes[0].summary.totalDistance) /1000;
                stringToReturn = returnWaypoints(distancePoints, autonomieDebutVehiculeAssocie, routes);         
            });
        }

        function returnWaypoints(distancePoints, autonomieDebutVehiculeAssocie, routes) {
            if(distancePoints > autonomieDebutVehiculeAssocie){
                console.log("Distance trop élevée, rechargement de la batterie obligatoire sur le trajet. :(");
                //on va chercher un point de recharge proche cad distance entre A et recharge et entre B et recharge <<<< à distance A B
                //

                //on va parcourir e.routes[0].coordinates, pour chaques coordonnée, on calcule sa ditance au début en ajoutant 

                let distanceCumulee = 0; 
                let seuilAutonomieAcceptable = 80; //seuil de début de recherche d'une borne aux alentours
                let autonomieRestante = 0;
                var point;
                var pointDeRecharge;
                let pointOrigine;
                let pointDestination;
                let chargeDestination;
                var distanceEnKm = originLatLng.distanceTo(destinationLatLng);
                console.log(routes[0].coordinates.length);



                for(point = 0; point < routes[0].coordinates.length-1; point++){
                    pointOrigine = L.point(routes[0].coordinates[point].lat,routes[0].coordinates[point].lng);
                    pointDestination = L.point(routes[0].coordinates[point+1].lat,routes[0].coordinates[point+1].lng);
                    distanceCumulee += 0.92*(pointOrigine.distanceTo(pointDestination)*100); //On s'autorise 8% d'erreur sur le calcul point à point
                    autonomieRestante = autonomieDebutVehiculeAssocie - distanceCumulee

                    if(autonomieRestante < seuilAutonomieAcceptable){
                        console.log("On a des ennuis au bout de " + distanceCumulee + "km.");
                        for(pointDeRecharge = 0; pointDeRecharge<chargeTerminalList.length ; pointDeRecharge++){
                            // On est à pointDestination
                            chargeDestination = L.point(chargeTerminalList[pointDeRecharge].getAddress().getLatitude(),chargeTerminalList[pointDeRecharge].getAddress().getLongitude());
                            if(pointDestination.distanceTo(chargeDestination) < autonomieRestante){
                                //alors le point est atteignable avec l'autonomie qui nous reste
                                waypointsDeRecharge.push(chargeTerminalList[pointDeRecharge].getAddress().getLatitude(),chargeTerminalList[pointDeRecharge].getAddress().getLongitude());
                                console.log("On a rechargé la batterie à 100% au point de recharge de " + chargeTerminalList[pointDeRecharge].getAddress().getCity() + chargeTerminalList[pointDeRecharge].getAddress().getLatitude() + " " + chargeTerminalList[pointDeRecharge].getAddress().getLongitude())
                                autonomieRestante = autonomieMaxVehiculeAssocie - chargeDestination.distanceTo(L.point(routes[0].coordinates[point+2].lat,routes[0].coordinates[point+2].lng));
                            }

                        }

                        //à partir de pointDestination, on parcourt tous les pdr pour trouver celui dont la distanceTo est la plus faible et et qui respecte Aut100 − DR→B > Autcour − DP→B
                        //on doit chercher un point dans un rayon de 80km pour aller recharger on l'ajoute à la liste on remet l'autonomie a 100% 
                        // où :
                        // - Aut100 désigne l’autonomie du véhicule chargé à 100 %,
                        // - Autcour son autonomie courante au point P,
                        // - Dx→y est la distance de x à y.
                    }
                }
                //console.log("Distance finale cumulée : " + distanceCumulee);
            }
            else {
                console.log("Distance réalisable en 1 trajet, pas besoin de s'arrêter ! :)");   
            }
        }
        
        console.log(waypointsDeRecharge);
        return waypointsDeRecharge;
    }



    navCalculator(markerDepart, markerArrivee, autonomie, autonomieMaximale) {
        var that = this;
        this.getItinerary(markerDepart, markerArrivee, autonomie, autonomieMaximale);
        return new Promise(function (resolve, reject) {
            
            var originLatLng = markerDepart.getLatLng();
            var destinationLatLng = markerArrivee.getLatLng();

            var origine =  L.point(originLatLng['lat'],originLatLng['lng']);
            var destination = L.point(destinationLatLng['lat'],destinationLatLng['lng']);

            var distanceEnKm = originLatLng.distanceTo(destinationLatLng)/1000;
            //console.log("distance : ");
            //console.log(distanceEnKm);

            //var niveauDeZoom = distanceEnKm/10;
            //console.log(niveauDeZoom);

            /* On replace la vue en fonction */
            //that.map.setView(originLatLng, destinationLatLng, niveauDeZoom);
            // niveau de zoom : getbounds et fitbounds de la vue en fonction de la polyline

            //that.getItinerary(markerDepart,markerArrivee,10);

            /*L.Routing.control({
              waypoints: [
                    L.latLng(originLatLng['lat'],originLatLng['lng']),
                    L.latLng(destinationLatLng['lat'],destinationLatLng['lng'])
              ]
            }).addTo(that.map);*/

            /*var requestURL = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + originLatLng['lng'] + ',' + originLatLng['lat'] + ';' + destinationLatLng['lng'] + ',' + destinationLatLng['lat'] + '.json?geometries=geojson&access_token=' + mapboxToken;
            var request = new XMLHttpRequest();
            request.open('GET', requestURL);
            request.responseType = 'json';
            request.send();
            request.onload = function() {
                var myLines = request.response['routes']['0']['geometry'];
                map.removeLayer(path);
                path = L.geoJSON(myLines, {style: myStyle});f
                path.addTo(that.map);
                resolve();
            }*/
        });
    }

    getMap() {
        return this.map;
    }

}

export { Map };