let map;
const marker_icon = './assets/img/marker.png';
const marker_hover_icon = './assets/img/marker_hover.png';
let coords = [];
let marker;
let routes;
let markers = [];

const Swal = require('sweetalert2')

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

//Remove Path
function clearPath(map) {
    routes.setMap(map);
    coords = [];
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Deletes all markers
function deleteMarkersAndPath() {
    clearMarkers();
    markers = [];
    if (routes) {
        clearPath(null);
    }
}

function addPoint(point) {
    coords.push(point);
}

//set alert box for each marker
function setInfo(data) {
    marker.addListener('click', function () {
        Swal.fire({
            title: `${data.query}`,
            html: `
              ISP: <span style="color:#00bc64">${data.isp} - ${data.as}</span></br>
              Local: <span style="color:#00bc64">${data.city}, ${data.region} - ${data.country}</span></br>
              Lat/Lon: <span style="color:#00bc64">${data.lat},${data.lon}</span> 
            `,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#00bc64'
        });
    });
}

function setMarkers(data) {
    marker = new google.maps.Marker({
        position: {
            lat: data.lat,
            lng: data.lon
        },
        map: map,
        icon: marker_icon
    });
    markers.push(marker);
    marker.setMap(map);
    setHoverEvents(data);
    setInfo(data);
}

function setHoverEvents(data) {
    const box_id = `ip-${data.query.split(".").join("")}`;
    const box = $(`#${box_id}`)
    marker.addListener('mouseover', function () {
        box.addClass('box-hover');
        this.setIcon(marker_hover_icon);
    });
    marker.addListener('mouseout', function () {
        box.removeClass('box-hover');
        this.setIcon(marker_icon);
    });
}

function setPath() {
    routes = new google.maps.Polyline({
        path: coords,
        strokeColor: '#00bc64',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    routes.setMap(map);
}

function setCenter(center) {
    map.setCenter(center);
    map.setZoom(6);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -22.397,
            lng: 45.644
        },
        disableDefaultUI: true,
        zoom: 2,
        styles: mapStyle
    });
}
