
var map;
var locations: MapLocation[];
var _baseUrl: string;

class MapLocation {
    constructor(public  latitude: number, public longitude: number) {}
}

function configure(baseUrl: string) {
    _baseUrl = baseUrl;
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(35.476415, 139.632694),
        zoom: 8
    });
    load("hoge");
}

function load(v: string) {
    jQuery.getJSON("http://joinproto.azurewebsites.net/api/locations", (ls) => {

        for (var i = 0; i < ls.length; i++) {
            var l = ls[i];
            var latlng = new google.maps.LatLng(l.Latitude, l.Longitude);
            var marker = new google.maps.Marker({ position: latlng, map: map, title: l.DisplayName });
            console.log(marker);
        }
    });
}

