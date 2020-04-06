/**
 * @class Map.js
 * Describe what is a map
 */
class Map {

    /**
    * @param {any} map
    * @parama {string} accessToken
    */
    
    constructor() {
        this.accessToken = "pk.eyJ1IjoiZW56b2NvbnRpbmhvIiwiYSI6ImNrNmkyYjVzdjFnM3IzZW52N21ydmgydG8ifQ.t2TaKZvtBCCrGvyLM2UjJA";
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

        const cityName = this.getPointerLocation();
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
                marker.addTo(that.map);
                resolve();
            }
        });
    }

<<<<<<< Updated upstream
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

    getItinerary(markerDepart,markerArrivee,autonomieDebutVehiculeAssocie,autonomieMaxVehiculeAssocie){
=======
    getItinerary(markerDepart, markerArrivee, autonomieDebutVehiculeAssocie, autonomieMaxVehiculeAssocie){
>>>>>>> Stashed changes
        var originLatLng = markerDepart.getLatLng();
        var destinationLatLng = markerArrivee.getLatLng();
        var waypoints = [];
        //On ajoute le premier point de la liste (le markerDepart)
        console.log("L, ")
        waypoints.push(L.latLng(originLatLng['lat'],originLatLng['lng']));

        //On ajoute le dernier point de la liste (le markerArrivee)
        waypoints.push(L.latLng(destinationLatLng['lat'],destinationLatLng['lng']));

        /*var routeControl = L.Routing.control({
          waypoints: [
                L.latLng(originLatLng['lat'],originLatLng['lng']),
                L.latLng(destinationLatLng['lat'],destinationLatLng['lng'])
          ]
        }).addTo(this.map);
        routeControl.on('routesfound', function(e) {
              var routes = e.routes;
              console.log("Route totale : " + routes[0].summary.totalDistance + ' kilomètres.');
        });*/

        console.log("autonomieDebut : " + autonomieDebutVehiculeAssocie + " autonomieMaxVehiculeAssocie rechargé : " + autonomieMaxVehiculeAssocie);

        let element=0;
        for(element ; element < waypoints.length -1 ; element++){
            /*console.log(waypoints[element]);
            console.log(waypoints[element+1]);*/
            let Point1 = waypoints[element];
            let Point2 = waypoints[element+1];
            let distancePoints = 0;

            //console.log(Point1);
            //console.log(Point2);

            var routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(Point1.lat,Point1.lng),
                    L.latLng(Point2.lat,Point2.lng)
                ]
            }).addTo(this.map);

            routeControl.on('routesfound', function(e) {
                console.log('e : ', e);
                var routes = e.routes;
                distancePoints = routes[0].summary.totalDistance;
                console.log("Route entre le point " + element + " et son suivant : " + distancePoints + ' kilomètres.');
            });
            console.log("La distance entre les deux points est de " + distancePoints + " et l'autonomie restante est de " + autonomieDebutVehiculeAssocie);
            if(distancePoints > autonomieDebutVehiculeAssocie){
                console.log("Distance trop élevée, rechargement de la batterie obligatoire sur le trajet. :(");
            }
            else {
                console.log("Distance réalisable en 1 trajet, pas besoin de s'arrêter ! :)");   
            }
        }
            
        //Tant que la distance entre 2 points de la liste est supérieure à autonomie on va chercher un point 
        // Si point on l'ajoute à la liste et on relance le test à 0
        // Si pas de point on affiche trajet impossible en l'état actuel de la batterie

        return waypoints;
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

            var niveauDeZoom = distanceEnKm/10;
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