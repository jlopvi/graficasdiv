let datos = [
  {
    agente: 'Marina',
    score: 50
  },
  {
    agente: 'Gerson',
    score: 50
  },
  {
    agente: 'Roberto',
    score: 50
  },
  {
    agente: 'Violeta',
    score: 50
  }
]


function graficar() {
  function getporcentaje(){
    let sum = 0
    datos.map((d)=>{
      sum += d.score
    })
    let result = 100/sum
    debugger
    return parseFloat(result.toFixed(2))
  }

  let width = 300
  let height = 300
  let porcentaje = getporcentaje()
  let radius = Math.min(width, height)/2
  let color = d3.scaleOrdinal()
                .range([
                  "#C0392B",
                  "#E74C3C",
                  "#884EA0",
                  "#6C3483",
                  "#1F618D",
                  "#2874A6",
                  "#148F77",
                  "#117A65",
                  "#1E8449",
                  "#239B56",
                  "#D4AC0D",
                  "#D68910",
                  "#CA6F1E",
                  "#A04000"])

  let arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0)

  let pie = d3.pie()
              .value(function(d){
                return d.score
              })
  let svg = d3.select('#graf1')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width/2}, ${height/2})`)
  let g = svg.selectAll('arc')
            .data(pie(datos))
            .enter().append('g')
            .attr('class', 'arc')

  g.append('path')
    .attr('d', arc)
    .style('fill', function(d) {
      return color(d.data.agente)
    })

  g.append('text')
    .text(function(d){
      debugger
      return `${d.data.agente }(${d.data.score}) ${d.data.score*porcentaje}%`
    })
    .attr('transform', function(d){
      return `translate(${arc.centroid(d)}), rotate(${angle(d)})`
    })

  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90
    return a > 90 ? a -180 : a
  }
}
