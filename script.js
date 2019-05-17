var centerLng = 38.42293213401053;
var centerLat = 27.14404106140137;

var map = L.map('map').setView([centerLng,centerLat], 14);
var buffer = 0.04;
var collection = [];
var geojsonlist = [];

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '<a style="color:#000" target="_blank" href="http://www.elophe.org">Olivier</a> | <a style="color:#000" href="mailto:olivier.elophe@gmail.com">olivier.elophe@gmail.com</a>'
}).addTo(map);

var nodes = {
    "A":{coord:[38.42216,27.13199]},
    "B":{coord:[38.42412,27.13854]},
    "C":{coord:[38.41785,27.14395]},
    "D":{coord:[38.42118,27.14511]},
    "E":{coord:[38.42047,27.15631]},
    "F":{coord:[38.42451,27.14790]}
};

var geojson = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"id":663,"adi":"İsimsiz Polyline","fid":"0","uzunluk":"0"},"geometry":{"type":"LineString","coordinates":[[27.131992578506473,38.42216723394987],[27.13854789733887,38.424125698143435]]}},{"type":"Feature","properties":{"id":749,"adi":"İsimsiz Polyline","fid":"0","uzunluk":"0"},"geometry":{"type":"LineString","coordinates":[[27.13854789733887,38.424125698143435],[27.147903442382816,38.424512341449876]]}},{"type":"Feature","properties":{"id":765,"adi":"İsimsiz Polyline","fid":"0","uzunluk":"0"},"geometry":{"type":"LineString","coordinates":[[27.147903442382816,38.424512341449876],[27.156314849853516,38.42047770071574]]}},{"type":"Feature","properties":{"id":781,"adi":"İsimsiz Polyline","fid":"0","uzunluk":"0"},"geometry":{"type":"LineString","coordinates":[[27.131992578506473,38.42216723394987],[27.143955230712894,38.417855063388195]]}},{"type":"Feature","properties":{"id":797,"adi":"İsimsiz Polyline","fid":"0","uzunluk":"0"},"geometry":{"type":"LineString","coordinates":[[27.143955230712894,38.417855063388195],[27.156314849853516,38.42047770071574]]}},{"type":"Feature","properties":{"id":813,"adi":"İsimsiz Polyline","fid":"0","uzunluk":"0"},"geometry":{"type":"LineString","coordinates":[[27.13854789733887,38.424125698143435],[27.145113945007328,38.421183779112695]]}},{"type":"Feature","properties":{"id":829,"adi":"İsimsiz Polyline","fid":"0","uzunluk":"0"},"geometry":{"type":"LineString","coordinates":[[27.145113945007328,38.421183779112695],[27.147903442382816,38.424512341449876]]}},{"type":"Feature","properties":{"id":845,"adi":"İsimsiz Polyline","fid":"0","uzunluk":"0"},"geometry":{"type":"LineString","coordinates":[[27.145113945007328,38.421183779112695],[27.156314849853516,38.42047770071574]]}}]};

L.geoJSON(geojson, {style: {color:"#ff0000"}}).addTo(map);

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
