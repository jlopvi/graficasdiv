let datos = [
  {
    agente: 'Marina',
    score: 10
  },
  {
    agente: 'Gerson',
    score: 20
  },
  {
    agente: 'Roberto',
    score: 50
  },
  {
    agente: 'Violeta',
    score: 100
  }
]

function graficar() {
  let scores = datos.map(d=>d.score)
  let w = '100%';
  let h = 300;
  var svg = d3.select('#graf1')
              .attr('width', w)
              .attr('height', h)

  let r = svg.selectAll('rect')
              .data(datos)
              .enter()

  r.append('rect')
    // .attr('x', 0)
    .attr('y', 0)
    .attr('width',20)
    // .attr('height', 100)
    .attr('x', function(d, i) {
      console.log(i)
      return i * 22 * 3 + 15
    })
    .attr('height', function(d){
      return (h-40)/d3.max(scores) * d.score
    })
    .attr('y', function(d){
      return h - ((h-40)/d3.max(scores) * d.score) - 20
    })
    .style('fill', 'url(#grad3)')

  r.append('rect')
    // .attr('x', 0)
    .attr('y', 0)
    .attr('width',10)
    // .attr('height', 100)
    .attr('x', function(d, i) {
      console.log(i)
      return i * 22 * 3  + 15 + 20
    })
    .attr('height', function(d){
      return (h-40)/d3.max(scores) * d.score
    })
    .attr('y', function(d){
      return h - ((h-40)/d3.max(scores) * d.score) - 20
    })
    .style('fill', 'url(#grad2)')
    .style('transform-origin', 'bottom left')
    .style('transform', 'skewY(-45deg)')
  r.append('rect')
    // .attr('x', 0)
    .attr('y', 0)
    .attr('width',20)
    // .attr('height', 100)
    .attr('x', function(d, i) {
      console.log(i)
      return i * 22 * 3  + 15
    })
    .attr('height', 10)
    .attr('y', function(d){
      return h - ((h-40)/d3.max(scores) * d.score) - 30
    })
    .style('fill', 'url(#grad1)')
    .style('transform-origin', 'bottom right')
    .style('transform', 'skewX(-45deg)')
let text =  svg.selectAll('text')
              .data(datos)
              .enter()

text.append('text')
    .text(function(d){
      return d.agente
    })
    .attr('x', function(d, i) {
      console.log(i)
      return i * 22 * 3 + 25 + 5
    })
    .attr('y', function(d){
      return h  - 5
    })
text.append('text')
    .text(function(d){
      return d.score
    })
    .attr('x', function(d, i) {
      console.log(i)
      return i * 22 * 3 + 25 + 5
    })
    .attr('y', function(d){
      return h  - ((h-40)/d3.max(scores) * d.score) - 31
    })

}
