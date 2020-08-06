const Traceroute = require('nodejs-traceroute');
const $ = require("jquery");
let ips;
var time;
let ipArray;
let domain;

let Api = {
    getGeolocation: (h) => {
        let {hop, ip, rtt1} = h;

        if (ip == "10.1.0.1") return;
        const url = 'http://ip-api.com/json/' + ip
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
                data.rtt1 = rtt1;
                data.hop = hop;
                return data;
            })
            .catch((err) => {
                console.error('Failed retrieving information', err)
            })
    },

    getValue: () => {
        let ip = document.getElementById('ip').value
        return Api.getGeolocation(ip)
    },

    appendResponse: (data, idx, time) => {
        addPoint({lat: data.lat, lng: data.lon});
        let ip = data.query.split(".").join("");
        $("#ip").append(
        `<li id="ip-${ip}" class="box">
          <p>#${data.hop}</p>
          <p class="ip">${data.query}</p>
          <p class="whois">${data.org}</p>
          <p class="locate">${data.city}, ${data.country}</p>
          <p class="delay">${data.rtt1}</p>
        </li>`);

        $(`#ip-${ip}`).click(function () {
            setCenter({lat: data.lat, lng: data.lon});
        });

        setMarkers(data);
    }
}

window.onkeypress = function (e) {
    ipArray = [];
    domain = $('#src-bar').val();
    let code = e.keyCode ? e.keyCode : e.which;
    if (code === 13 && domain) {
        deleteMarkersAndPath();
        prepareSidebar();

        let p = new Promise((resolve, reject) => {
            const tracer = new Traceroute();
            let destination = null;
            let hops = [];
            tracer
                .on('destination', (dst) => {
                    destination = dst;
                })
                .on('hop', (hop) => {
                    hops.push(hop);
                    if (hop.ip === destination) {
                        resolve(hops);
                    }
                });
            tracer.trace(domain);
        });

        p.then((hops) => {
            const requisicoes = hops.map(h => Api.getGeolocation(h));

            Promise
                .all(requisicoes)
                .then((resultados) => {
                    removeLoader();
                    showSearchedDomain(domain);
                    appendInfos(resultados);
                    setPath();
                })
                .catch(erro => console.error(erro));
        });
    }
};

function removeLoader() {
    $("#loader").remove();
}

function showSearchedDomain(domain) {
    $(".domain-loader").append(`<span id="domain" class="domain">${domain}</span>`);
}

function prepareSidebar() {
    $("#ip").remove();
    $(".domain-loader .loader").remove();
    $(".domain-loader .domain").remove();
    $("#sidebar").append(`<ol id="ip" class="trace-list"></ol>`);
    $(".domain-loader").append(
        `<div id="loader" class="loader"></div>`
    ).hide().fadeIn(400);
}

function appendInfos(resultados) {
    resultados.forEach((data, index) => {
        if (data.status === "success") {
            Api.appendResponse(data, index, time);
            ipArray.push(data.query);
        }
    });
    $('#src-bar').val("");
}