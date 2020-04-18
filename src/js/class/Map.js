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

    /**
    * Cette fonction va calculer l'itinéraire initial entre le point de départ et d'arrivée
    * Elle va retourner une liste de point contenant ou pas des points de recharge
    * Elle consitue le coeur de notre programme
    */
    getItinerary(markerDepart,markerArrivee,autonomieDebutVehiculeAssocie,autonomieMaxVehiculeAssocie, chargeList){
        var originLatLng = markerDepart.getLatLng();
        var destinationLatLng = markerArrivee.getLatLng();
        var waypoints = [];
        var waypointsDeRecharge = [];

        //On ajoute le premier point de la liste (le markerDepart)
        waypoints.push(L.latLng(originLatLng['lat'],originLatLng['lng']));

        //On ajoute le dernier point de la liste (le markerArrivee)
        waypoints.push(L.latLng(destinationLatLng['lat'],destinationLatLng['lng']));

        console.log("autonomieDebut : " + autonomieDebutVehiculeAssocie + " autonomieMaxVehiculeAssocie rechargé : " + autonomieMaxVehiculeAssocie);

        let Point1 = waypoints[0];
        let Point2 = waypoints[1];
        let distancePoints = 0;
        var stringToReturn = [];
        var bool = true;

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
            if(bool){
                var routes = e.routes;
                distancePoints = (routes[0].summary.totalDistance) /1000;
                stringToReturn = returnWaypoints(distancePoints, autonomieDebutVehiculeAssocie, autonomieMaxVehiculeAssocie, routes, routeControl, chargeList);         
                console.log(stringToReturn);

                let i = 0;
                for(i ; i < stringToReturn.length ; i++ ){
                    routeControl.spliceWaypoints(i+1,0,stringToReturn[i]);
                }
                bool = false;
            }
        });
        
        
        /**
        * Cette fonction permet de gérer la synchronisation pour le calcul d'un éventuel point de recharge
        */
        function returnWaypoints(distancePoints, autonomieDebutVehiculeAssocie, autonomieMaxVehiculeAssocie, routes, routeControl, chargeList) {
            if(distancePoints > autonomieDebutVehiculeAssocie) {
                // Alors on va être obligé de recharger sur le trajet
                console.log("Distance trop élevée, rechargement de la batterie obligatoire sur le trajet. :(");
                let distanceCumulee = 0; 
                let seuilAutonomieAcceptable = 80; //seuil de début de recherche d'une borne aux alentours == Passage en réserve
                let autonomieRestante = 0;
                var point;
                var pointDeRecharge;
                let pointOrigine;
                let pointDestination;
                let chargeDestination;
                var distanceEnKm = originLatLng.distanceTo(destinationLatLng);
                //console.log(routes[0].coordinates.length);

                /* On va parcourir tous les points calculés pour effectuer le dessin */ 
                for(point = 0; point < routes[0].coordinates.length-1; point++){
                    pointOrigine = L.latLng(routes[0].coordinates[point].lat,routes[0].coordinates[point].lng);
                    pointDestination = L.latLng(routes[0].coordinates[point+1].lat,routes[0].coordinates[point+1].lng);
                    distanceCumulee += pointOrigine.distanceTo(pointDestination)/1000; 
                    //console.log("Distance cumulée : " + distanceCumulee);
                    autonomieRestante = autonomieDebutVehiculeAssocie - distanceCumulee;
                    //console.log("Autonomie restante : " + autonomieRestante);
                    var bool = false;

                    if(autonomieRestante < seuilAutonomieAcceptable){
                        bool = true;
                        console.log("On a atteint la réserve minimum acceptable de " + seuilAutonomieAcceptable + "km au bout de " + distanceCumulee + "km, on cherche donc un point de recharge...");
                        // On va parcourir toute la liste des points de recharge
                        for(pointDeRecharge = 0; pointDeRecharge<chargeList.length ; pointDeRecharge++){
                            // On est à pointDestination
                            chargeDestination = L.latLng(chargeList[pointDeRecharge].getAddress().getLatitude(),chargeList[pointDeRecharge].getAddress().getLongitude());
                            if(pointDestination.distanceTo(chargeDestination)/1000 < autonomieRestante && bool){
                                //Alors le point est atteignable avec l'autonomie qui nous reste

                                //On ajoute ici le point de recharge trouvé sur l'itinéraire à la liste
                                waypointsDeRecharge.push(chargeDestination);
                                
                                console.log("On a rechargé la batterie à 100% au point de recharge de "
                                    + chargeList[pointDeRecharge].getAddress().getCity()                                    
                                    + " "
                                    + chargeList[pointDeRecharge].getAddress().getLatitude()
                                    + " "
                                    + chargeList[pointDeRecharge].getAddress().getLongitude()
                                );
                                autonomieRestante = autonomieMaxVehiculeAssocie - chargeDestination.distanceTo(L.latLng(routes[0].coordinates[point+2].lat,routes[0].coordinates[point+2].lng))/1000;
                                autonomieDebutVehiculeAssocie = autonomieRestante;
                                distanceCumulee = 0;
                                bool = false;
                                //console.log("distance au point de recharge : " + chargeDestination.distanceTo(L.latLng(routes[0].coordinates[point+2].lat,routes[0].coordinates[point+2].lng))/1000);
                            }

                        }
                    }
                }

            }
            else {
                /* Dans ce cas l'autonomie est suffisante pour faire le trajet */
                console.log("Distance réalisable en 1 trajet, pas besoin de s'arrêter ! :)");   
            }
            //console.log("On retourne :");
            //console.log(waypointsDeRecharge);

            return waypointsDeRecharge;
        }

    }


    /**
    * Cette fonction va calculer et tracer l'itinéraire final, avec les points de recharges éventuels ajoutés au parcours 
    */
    navCalculator(markerDepart, markerArrivee, autonomie, autonomieMaximale) {
        var that = this;
        let waypointsOfficiel = this.getItinerary(markerDepart, markerArrivee, autonomie, autonomieMaximale, this.chargeTerminalList);
    }

    getMap() {
        return this.map;
    }

}

export { Map };