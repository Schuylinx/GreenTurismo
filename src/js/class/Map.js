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

    navCalculator(markerDepart,markerArrivee,path,itinerary) {
        return new Promise(function (resolve, reject) {
            console.log("markerDepart : ");
            console.log(markerDepart);

            var originLatLng = markerDepart.getLatLng();
            var destinationLatLng = markerArrivee.getLatLng();

            var origine =  L.point(originLatLng['lng'],originLatLng['lat']);
            var destination = L.point(destinationLatLng['lng'],destinationLatLng['lat']);

            var distanceEnKm = originLatLng.distanceTo(destinationLatLng)/1000;
            console.log("distance : ");
            console.log(distanceEnKm);

            var niveauDeZoom = distanceEnKm/10;

            /* On replace la vue en fonction */
            that.map.setView(originLatLng, destinationLatLng, niveauDeZoom);
            // niveau de zoom : getbounds et fitbounds de la vue en fonction de la polyline

            var requestURL = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + originLatLng['lng'] + ',' + originLatLng['lat'] + ';' + destinationLatLng['lng'] + ',' + destinationLatLng['lat'] + '.json?geometries=geojson&access_token=' + mapboxToken;
            var request = new XMLHttpRequest();
            request.open('GET', requestURL);
            request.responseType = 'json';
            request.send();
            request.onload = function() {
                var myLines = request.response['routes']['0']['geometry'];
                map.removeLayer(path);
                path = L.geoJSON(myLines, {style: myStyle});
                path.addTo(that.map);
                resolve();
            }
        });
    }

    getMap() {
        return this.map;
    }

}

export { Map };
