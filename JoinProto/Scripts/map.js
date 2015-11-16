var map;
var locations;
var _baseUrl;
var MapLocation = (function () {
    function MapLocation(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    return MapLocation;
})();
function configure(baseUrl) {
    _baseUrl = baseUrl;
}
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(35.476415, 139.632694),
        zoom: 8
    });
    load("hoge");
}
function load(v) {
    jQuery.getJSON("http://joinproto.azurewebsites.net/api/locations", function (ls) {
        for (var i = 0; i < ls.length; i++) {
            var l = ls[i];
            var latlng = new google.maps.LatLng(l.Latitude, l.Longitude);
            var marker = new google.maps.Marker({ position: latlng, map: map, title: l.DisplayName });
            console.log(marker);
        }
    });
}
