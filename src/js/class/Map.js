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

    getAccessToken(){
        return this.accessToken;
    }

    addMarker(latitude, longitude) {
        L.marker([latitude, longitude]).addTo(this.map);
    }

    searchLocation(map,idElement,marker) {
        return new Promise(function (resolve, reject) {
            console.log(document.getElementById(idElement).value);
            var search = document.getElementById(idElement).value;
            var requestURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + search + '.json?access_token=' + "pk.eyJ1IjoiZW56b2NvbnRpbmhvIiwiYSI6ImNrNmkyYjVzdjFnM3IzZW52N21ydmgydG8ifQ.t2TaKZvtBCCrGvyLM2UjJA";
            var request = new XMLHttpRequest();
            request.open('GET', requestURL);
            request.responseType = 'json';
            request.send();
            request.onload = function() {
                var addresses = request.response;
                console.log(addresses);
                console.log(map);
                console.log("marker " + marker);


                marker.setLatLng(L.latLng(addresses['features']['0']['center']['1'], addresses['features']['0']['center']['0'])).addTo(this.map);

                
                /* On replace la vue en fonction */
                
                //L.map('gtMap').setView([46.8181124, 2.4826541], 6);
                // niveau de zoom : getbounds et fitbounds de la vue en fonction de la polyline

                resolve();
            }
        });
    }

    navCalculator(map,markerDepart,markerArrivee) {
        return new Promise(function (resolve, reject) {
            var originLatLng = markerDepart.getLatLng()
            var destinationLatLng = markerArrivee.getLatLng()
            var requestURL = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + originLatLng['lng'] + ',' + originLatLng['lat'] + ';' + destinationLatLng['lng'] + ',' + destinationLatLng['lat'] + '.json?geometries=geojson&access_token=' + mapboxToken;
            var request = new XMLHttpRequest();
            request.open('GET', requestURL);
            request.responseType = 'json';
            request.send();
            request.onload = function() {
                var myLines = request.response['routes']['0']['geometry'];
                map.removeLayer(path);
                path = L.geoJSON(myLines, {style: myStyle});
                path.addTo(map);
                resolve();
            }
        });
    }

}

export { Map };