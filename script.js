var centerLng = 48.581556;
var centerLat = 7.750157;

var map = L.map('map').setView([centerLng,centerLat], 17);
var buffer = 0.04;
var collection = [];
var geojsonlist = [];

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '<a style="color:#000" target="_blank" href="http://www.elophe.org">Olivier</a> | <a style="color:#000" href="mailto:olivier.elophe@gmail.com">olivier.elophe@gmail.com</a>'
}).addTo(map);

var nodes = {
    "A":{coord:[48.583425,7.747944]},
    "B":{coord:[48.579613, 7.750659]},
    "C":{coord:[48.581556,7.750157]},
    "D":{coord:[48.581862, 7.746134]},
    "E":{coord:[48.582636, 7.748080]},
    "F":{coord:[48.580843, 7.753084]}
};

// Les arrêtes du graph
var geojson = {"type":"FeatureCollection",
    "features": [
        {"type":"Feature",
            "properties":{
                "id":663,
                "longueur":"0"},
            "geometry":{
                "type":"LineString",
                "coordinates":[[7.747944,48.583425],[7.750157,48.581556]]}},
        {"type":"Feature","properties":{"id":749,"longueur":"0"},
                "geometry":{"type":"LineString","coordinates":[[7.750157,48.581556],
                        [7.750659,48.579613]]}},{"type":"Feature","properties":{"id":765,"longueur":"0"},
            "geometry":{"type":"LineString","coordinates":[[7.753084,48.580843],[7.748080,48.582636]]}},
        {"type":"Feature","properties":{"id":781,"longueur":"0"},
                "geometry":{"type":"LineString","coordinates":[[7.748080,48.581862],
                        [7.750157,48.581556]]}},{"type":"Feature","properties":{"id":797,"longueur":"0"},
            "geometry":{"type":"LineString","coordinates":[[7.750659,48.579613],[7.747944,48.583425]]}},
        {"type":"Feature","properties":{"id":813,"longueur":"0"},"geometry":{"type":"LineString",
                    "coordinates":[[7.753084,48.580843],[7.747944,48.583425]]}},
        {"type":"Feature","properties":{"id":829,"longueur":"0"},
                "geometry":{"type":"LineString","coordinates":[[7.747944,48.583425],
                        [7.753084,48.580843]]}},{"type":"Feature",
            "properties":{"id":845,"longueur":"0"},
            "geometry":{"type":"LineString","coordinates":[[7.747944,48.583425],[7.753084,48.580843]]}}]};

L.geoJSON(geojson, {style: {color:"#ff0000"}}).addTo(map);  // tracé des lignes entre les noeuds

function showNodes(nodes){
    for(var a in nodes){
        L.circleMarker(nodes[a].coord,{radius:5,color:"#0000ff",fillOpacity:1}).bindPopup(a+' Point').addTo(map);
    }
}


var basicGraph = [
    {start:"A",finish:"B",distance:10},
    {start:"A",finish:"C",distance:15},
    {start:"B",finish:"F",distance:15},
    {start:"B",finish:"D",distance:12},
    {start:"C",finish:"E",distance:10},
    {start:"F",finish:"E",distance:5},
    {start:"D",finish:"F",distance:1},
    {start:"D",finish:"E",distance:2}
];

var graph = readyGraph(basicGraph);
var start = "A";
var finish = "B";

var shortestPath = solve(graph,start,finish);
debugger;
showPath(start,shortestPath.path);
showNodes(nodes);
showStartFinish(start,finish);

function showStartFinish(start,finish){
    L.circleMarker(nodes[start].coord,{radius:8,color:"#00ff00",fillOpacity:1}).bindPopup(start+'  Start Point').addTo(map);
    L.circleMarker(nodes[finish].coord,{radius:8,color:"#ff0000",fillOpacity:1}).bindPopup(finish+'  Finish Point').addTo(map);
}

function showPath(start,path){
    var lineCoords = [];
    lineCoords.push(nodes[start].coord);
    for(var i=0;i<path.length;i++){
        var nodeName =path[i];
        lineCoords.push(nodes[nodeName].coord);
    }
    var polyline = L.polyline(lineCoords, {color: 'blue'}).addTo(map);
}

function solve(graph,s,f) {
    debugger;
    var solutions = {};
    solutions[s] = [];
    solutions[s].dist = 0;
    while(true) {
        var parent = null;
        var nearest = null;
        var dist = Infinity;
        for(var n in solutions) {
            if(!solutions[n])
                continue
            var ndist = solutions[n].dist;
            var adj = graph[n];
            for(var a in adj) {
                if(solutions[a])
                    continue;
                var d = adj[a] + ndist;
                if(d < dist) {
                    parent = solutions[n];
                    nearest = a;
                    dist = d;
                }
            }
        }
        if(dist === Infinity) {
            break;
        }
        solutions[nearest] = parent.concat(nearest);
        solutions[nearest].dist = dist;
    }
    var finish = solutions[f];
    return {results:solutions,path:finish,distance:finish.dist};
}


function readyGraph(paths) {
    debugger;
    var graph = {};
    for(var i in paths){
        var path = paths[i];
        var start=path["start"];
        var finish=path["finish"];
        var distance=path["distance"];
        if(typeof graph[start]=="undefined"){
            graph[start]={};
            graph[start][finish]=distance;
        }else{
            graph[start][finish]=distance;
        }
        if(typeof graph[finish]=="undefined"){
            graph[finish]={};
            graph[finish][start]=distance;
        }else{
            graph[finish][start]=distance;
        }
    }
    return graph;
}
