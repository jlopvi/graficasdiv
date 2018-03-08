var datos = [1, 2, 3, 5, 8, 11, 13, 21, 34, 55, 89, 144]

function graficar() {
  d3.select('.miGrafica')
    .selectAll('div')
    .data(datos)
    .enter().append('div')
    .text(function(d){
      if(d == 1) {
        return `Ricardo ha tenido ${d} balon`
      }
      return `Ricardo ha tenido ${d} balones`
    })
    .style('background-color', 'green')
    .style('color', 'white')
    .style('padding', '5px')
    .style('margin-top', '5px')
    .style('width', function(d){
      return 90 / d3.max(datos) * d + '%'
    })
    .style('text-align', 'right')
}
