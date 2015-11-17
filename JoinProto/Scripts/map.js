if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) { return (typeof args[number] != 'undefined'
            ? args[number]
            : match); });
    };
}
var map;
var locations;
var baseUrl;
var colorTable = [
    'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'];
var MapLocation = (function () {
    function MapLocation(id, latitude, longitude, type, user) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.user = user;
        console.log(this.toString());
    }
    MapLocation.prototype.toString = function () {
        return "{0}: {1}, {2}<br />type: {3}<br />{4}".format(this.id.toString(), this.latitude.toString(), this.longitude.toString(), this.type, this.user.toString());
    };
    MapLocation.fromJson = function (j) {
        return new MapLocation(j.Id, j.Latitude, j.Longitude, j.Type, User.fromJson(j.User));
    };
    return MapLocation;
})();
var User = (function () {
    function User(id, displayName) {
        this.id = id;
        this.displayName = displayName;
    }
    User.prototype.toString = function () {
        return "{0} ({1})".format(this.displayName, this.id.toString());
    };
    User.fromJson = function (j) {
        return new User(j.Id, j.DisplayName);
    };
    return User;
})();
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(35.476415, 139.632694),
        zoom: 8
    });
    load("hoge");
}
function load(v) {
    jQuery.getJSON(baseUrl + "locations", function (ls) {
        for (var i = 0; i < ls.length; i++) {
            var l = MapLocation.fromJson(ls[i]);
            var latlng = new google.maps.LatLng(l.latitude, l.longitude);
            var marker = new google.maps.Marker({
                position: latlng,
                map: map, title: l.type,
                icon: colorTable[l.user.id % colorTable.length]
            });
            google.maps.event.addListener(marker, 'click', function (event) {
                new google.maps.InfoWindow({
                    content: l.toString()
                }).open(marker.getMap(), marker);
            });
            console.log(marker);
        }
    });
}
//# sourceMappingURL=map.js.map