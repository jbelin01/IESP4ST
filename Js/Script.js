function showHistogram() {
    document.getElementById("chart-container").innerHTML = "<h3>Exibindo Histograma</h3><canvas id='histogramChart'></canvas>";
    
}

function showHeatmap() {
    document.getElementById("chart-container").innerHTML = "<h3>Exibindo Mapa de Calor</h3><div id='heatmap'></div>";

}

function showOther() {
    document.getElementById("chart-container").innerHTML = "<h3>Exibindo Outro Gráfico</h3><canvas id='otherChart'></canvas>";
    
}
