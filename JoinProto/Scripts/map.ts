interface String {
    format(...replacements: string[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, (match, number) => (typeof args[number] != 'undefined'
            ? args[number]
            : match));
    };
}

var map;
var locations: MapLocation[];
var baseUrl: string;
var targetDate: string;
var colorTable = [
    'http://maps.google.com/mapfiles/ms/icons/yellow.png',
    'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/red.png',
    'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/blue.png',
    'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/green.png',
    'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    'http://maps.google.com/mapfiles/ms/icons/purple.png',
    'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'];

class MapLocation {
    constructor(public id: number, public latitude: number, public longitude: number, public type: string, public time: Date, public user: User) {
        console.log(this.toString());
    }
    toString() {
        return "{0}: {1}, {2}<br />type: {3}<br />{4}<br />{5}".format(
            this.id.toString(),
            this.latitude.toString(),
            this.longitude.toString(),
            this.type,
            this.user.toString(),
            this.time.toString());
    }
    static fromJson(j: any): MapLocation {
        return new MapLocation(j.Id, j.Latitude, j.Longitude, j.Type, j.Time, User.fromJson(j.User));
    }
}

class User {
    constructor(public id: number, public displayName: string) { }

    toString() {
        return "{0} ({1})".format(this.displayName, this.id.toString());
    }

    static fromJson(j: any): User {
        return new User(j.Id, j.DisplayName);
    }
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(35.65597440083904, 139.6530764476981),
        zoom: 10
    });
    load("hoge");
}

function load(v: string) {
    locations = [];
    var url = baseUrl + "locations";
    if (targetDate != null && targetDate.length > 0) {
        url = "{0}?date={1}".format(url, targetDate);
    }
    jQuery.getJSON(url, (ls) => {

        for (var i = 0; i < ls.length; i++) {
            var l = MapLocation.fromJson(ls[i]);
            var latlng = new google.maps.LatLng(l.latitude, l.longitude);
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                icon: colorTable[l.user.id % (colorTable.length/2) * 2 + (l.type == 'significant_change' ? 0 : 1)]
            });
            bindInfoWindow(marker, l.toString());
        }
    });
}

function bindInfoWindow(marker: google.maps.Marker, description: string) {
    google.maps.event.addListener(marker, 'click', () => {
        new google.maps.InfoWindow({
            content:description
        }).open(map, marker);
    });
}

