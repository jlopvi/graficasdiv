function selecciona() {
  d3.selectAll('div')
    .style('background-color', 'green')
}
 function seleccionaBloque() {
   d3.select('.block')
      .selectAll('div')
      .style('background-color', 'red')
 }
