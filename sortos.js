class ToGraph {
  constructor(container, data) {
    this.data = data.series

    this.acumAxesY = this.getAcumAxesY
    this.allAxesY = this.getAllAxesY

    this.maxAcumAxesY = this.getMaxAcumAxesY
    this.maxAllAxesY = this.getMaxAllAxesY

    this.container = container
    this.type = data.type || 'bar3d'

    this.width =  data.width || 1000
    this.height = data.height || 500

    this.background = data.background || '#f3f3f3'
    this.color = data.palette
    this.lengthPalette = this.getLengthPalette
    this.fontColor = data.color
    this.rotate = this.getGradientRotate(data.rotate)
    this.rotatetop = this.getGradientRotate(data.rotate-180)

    this.angle = data.rotate
    this.widthAxe = data.widthAxe || this.getWidthAxe
    this.widthStackedAxe = data.widthAxe || this.getWidthStackedAxe


  }

  get getLengthPalette () {
    let maxLength = 0
    let iter = this.color.map(palette => {
      maxLength = palette.length > maxLength ? palette.length : maxLength;
    })

    return maxLength
  }

  getGradientRotate(angle) {
    let anglePI = (angle) * (Math.PI / 180);
    let angleCoords = {
        'x1': Math.round(50 + Math.sin(anglePI) * 50) + '%',
        'y1': Math.round(50 + Math.cos(anglePI) * 50) + '%',
        'x2': Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%',
        'y2': Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + '%',
    }

    return angleCoords
  }

  get getAcumAxesY () {
    let data = this.data
    let acum = []
    for(let key in data) {
      let a = 0
      let arr = data[key].map(d=>{
        a += d.axeY
      })
      acum.push(a)
    }
    return acum

  }
  get getAllAxesY () {
    let data = this.data
    let all = []
    for(let key in data) {
      let arr = data[key].map(d=>{
        all.push(d.axeY)
      })
    }
    return all
  }
  get getMaxAllAxesY () {
    let axesY = this.allAxesY
    return d3.max(axesY)
  }
  get getMaxAcumAxesY () {
    let axesY = this.acumAxesY
    return d3.max(axesY)
  }
  get getWidthAxe () {
    let data = this.data
    let dataLegth = Object.keys(this.data).length
    let coutChart = 0
    for(let key in data) {
      coutChart += (data[key].length)
    }

    let widthForchart = (this.width - 60) / (coutChart + dataLegth -1)
    // let widthForchart = parseInt(widthForLabel / d3.max(coutChart) + 1)

    return widthForchart
  }
  get getWidthStackedAxe () {
    let data = this.data
    let dataLegth = Object.keys(this.data).length
    let coutChart = 0

    for(let key in data) {
      coutChart += (data[key].length)
    }

    let widthForchart = (this.width - 60) / ( dataLegth * 2 - 1 )
    // let widthForchart = parseInt(widthForLabel / d3.max(coutChart) + 1)

    return widthForchart
  }
  createTable () {
    let container = $(this.container)
    let data = this.data
    let self = this
    let rows
    Object.keys(data).map((key,i) => {
                  let thisdata = data[key]

                  let row = []
                  for(let key in thisdata) {
                    row.push(thisdata[key].axisLabel)
                  }
                  if(i < 1) {
                    rows = row
                  }

                })

    let table = `<table width='${this.width}' style="border-collapse: collapse">
                  <thead>
                    <th>
                      color
                    </th>
                    ${Object.keys(data).map(key => {

                      return `<th>${key}</th>`
                    }).join('')}
                  </thead>
                  <tbody>
                    ${rows.map((key, i) => {
                      let thisi = i
                      let thisKey = key
                      let colors = self.color[i] ? self.color[i]  : self.color[0]

                      let background
                      if(colors.length == 1) {
                        background = `background: ${colors[0]}`

                      }else{

                        let brakePoints = 100/(colors.length-1)
                        let cl = colors.length-1
                        background = `background: linear-gradient(to right,${colors.map((color, i) => {
                          return ` ${color} ${ i == 0 ? 0 : Math.round(brakePoints * (i))}% ${ i < cl ? ',' : ''}`
                        }).join('')})`
                      }

                      return `
                          <tr>
                            <td><span style="border-radius: 50%; display: inline-block; width: 15px; height: 15px; margin: 0 5px; ${background} ; transform: rotate(-${self.angle+90}deg)"></span>${thisKey}</td>
                            ${Object.keys(data).map(key => {
                              return `<td style="text-align: center">${data[key][thisi].axeY}</td>`
                            }).join('')}
                          </tr>`
                    }).join('')}
                  </tbody>
                </table>`
    container.find('table').remove()
    container.append(table)

  }

  createSVG () {

    let container = d3.select(this.container)
    container.selectAll('svg')
              .remove()
    let svg = container
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height)
                .style('background-color', this.background)

    svg.append('defs')



    this.svg = svg
    this.graphContainer = container

    if(this.lengthPalette > 1) {
        this.addGradient()
      }
    this.createAxesGraph()


  }

  modColor(p,c0,c1) {

    var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
    }
  }
  addGradient () {
    let self = this
    let svg =  $(this.container)[0].querySelector('svg')
    let color = this.color
    let rotate = this.rotate
    let rotatetop = this.rotatetop


    let gradients = color.map(function(palette, i){
      let brakePoints = 100/(palette.length-1)
      let id = $(svg).parent().attr('id')+i
      let idright = $(svg).parent().attr('id')+i+'right'
      let idtop = $(svg).parent().attr('id')+i+'top'
      let stops = palette.map(function (color, i) {

        return {
          offset: `${ i == 0 ? 0 : Math.round(brakePoints * (i))}%`,
          'stop-color': `${color}`
       }
      })
      let stopsright = palette.map(function (color, i) {

        return {
          offset: `${ i == 0 ? 0 : Math.round(brakePoints * (i))}%`,
          'stop-color': `${self.modColor(-0.2,color)}`
       }
      })
      let stopstop = palette.map(function (color, i) {

        return {
          offset: `${ i == 0 ? 0 : Math.round(brakePoints * (i))}%`,
          'stop-color': `${self.modColor(0.5,color)}`
       }
      })

      self.createGradient(svg,id,stops,rotate);
      self.createGradient(svg,idright,stopsright,rotate);
      self.createGradient(svg,idtop,stopstop,rotatetop);
    })


  }
  createGradient(svg,id,stops,rotate){
    var svgNS = svg.namespaceURI;
    var grad  = document.createElementNS(svgNS,'linearGradient');
    grad.setAttribute('id',id);
    grad.setAttribute('x1', rotate.x1)
    grad.setAttribute('x2', rotate.x2)
    grad.setAttribute('y1', rotate.y1)
    grad.setAttribute('y2', rotate.y2)
    for (var i=0;i<stops.length;i++){
      var attrs = stops[i];
      var stop = document.createElementNS(svgNS,'stop');
      for (var attr in attrs){
        if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
      }
      grad.appendChild(stop);
    }

    var defs = svg.querySelector('defs') ||
        svg.insertBefore( document.createElementNS(svgNS,'defs'), svg.firstChild);

    return defs.appendChild(grad);

  }
  createAxesGraph () {
    if(this.type == 'bar') {
      this.createBars()
    } else if(this.type == 'stackedbar') {
      this.createStackedBars()
    } else if(this.type == '3dbar') {
      this.create3dBars()
    } else if(this.type == '3dstackedbar') {
      this.create3dStackedBars()
    } else if(this.type == 'cylinder') {
      this.createCylinder()
    } else if(this.type == 'stackedcylinder') {
      this.createStackedCylinder()
    }
  }
  createCylinder () {

    let h = parseInt(this.height)
    let w = parseInt(this.width)


    let max = (Math.round(this.maxAllAxesY / 10) * 10)
    let data = this.data
    let svg = this.svg
    let self = this
    let bar  = svg.selectAll('rect')
                .data(data)
                .enter()


    let wchart = this.widthAxe

    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%10 == 0 ) {

        axeY.push(i)
      }
    }

    let axes = svg.selectAll('line')
                  .data(axeY)
                  .enter().append('line')
                  .attr('x1',30)
                  .attr('x2', w)
                  .style('stroke', self.fontColor)
                  .style('stroke-width', '0.15')
                  .attr('y1', function(d, i){
                    return Math.round(h - ((h -60)/self.maxAllAxesY * d) -30) - (wchart/2)
                  })
                  .attr('y2', function(d, i){

                    return  Math.round(h - ((h -60)/self.maxAllAxesY * d) -30) - (wchart/2)
                  })
    let axesText = svg.selectAll('text')

    axesText.data(axeY)
            .enter().append('text')
            .text(function(d){
              return d;
            })
            .attr('x', 25)
            .attr('y', function(d, i){
              return Math.round(h - ((h -60)/self.maxAllAxesY * d) -25) - (wchart/2)
            })
            .style('fill', self.fontColor)
            .style('text-anchor', 'end')

    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let wacumt = 0
    let wacumb = 0
    for(let key in data) {

      let bar  = svg.append('g')
                  .selectAll('rect')
                  .data(data[key])
                  .enter()
      axesText.data([key])
              .enter().append('text')
              .text(function(d){
                return d
              })
              .attr('y', function() {
                return Math.round(h - 10)

              })
              .attr('x', function (d, i) {
                let x = (40 +  wacum+ (wchart*counterLabel))
                return x
              })
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')

      axesText.data(data[key])
              .enter().append('text')
              .text(function(d) {
                return d.axeY
              })
              .attr('x', function(d, i ){
                let x = 40 +  poinacum+ (wchart*counterLabel) + (wchart/2)
                poinacum += wchart

                return x
              })
              .attr('y', function(d,i){
                return 0
              })
              .style('text-anchor', 'middle')
              .style('fill', function(d,i) {
                if(self.color[i]) {
                  return self.modColor(-0.5,self.color[i][0])
                } else {
                  return self.modColor(-0.5,self.color[0][0])
                }
              })
              .style('font-weight', 'bold')
              .style('fill-opacity', 0)
              .attr('font-family','Roboto')
              .transition()
              .delay(function(d, i){return i*300 })
              .duration(500)
              .style('fill-opacity', 1)
              .attr('y', function(d,i){
                return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 35
              })






      bar.append('rect')
          .attr('width', wchart)
          .attr('x', function(d, i){
            let x = 40 +  wacum+ (wchart*counterLabel)
            wacum += wchart
            return x
          })
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.color[i]
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i})`
                return url
              } else if(self.color[0].length == 1) {
                return self.color[0]
              }
              return `url(#${myCont}0)`

            }
          })
          .attr('height', function(d){
            return (h-60)/self.maxAllAxesY * d.axeY
          })
          .attr('y', function(d){
            return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 30
          })
          .style('fill-opacity', 0)
          .transition()
          .delay(function(d, i){return i*50 })
          .duration(500)
          .style('fill-opacity', 1)

      // top
      bar.append('circle')
          .attr('r', wchart/2)

          .attr('cx', function(d, i){
            let x = 40 +  wacumt + (wchart*counterLabel) + wchart/2
            wacumt += wchart
            return x
          })
          .style('transform-origin','center')
          .attr('cy', function(d){
            return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 30  + 0.5
          })
          .style('transform','rotateX(60deg)')
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.modColor(0.2,self.color[i][0])
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i}top)`
                return url
              } else if(self.color[0].length == 1) {
                return self.modColor(0.5,self.color[0][0])
              }
              return `url(#${myCont}0top)`

            }
          })
          .style('fill-opacity', 0)
          .transition()
          .delay(function(d, i){return i*50 })
          .duration(500)
          .style('fill-opacity', 1)
      // Bottom

      bar.append('circle')
          .attr('r', wchart/2)

          .attr('cx', function(d, i){
            let x = 40 +  wacumb + (wchart*counterLabel) + wchart/2
            wacumb += wchart
            return x
          })
          .style('transform-origin','center')
          .attr('cy', function(d){
            return h - 60 + 30
          })
          .style('transform','rotateX(120deg)')
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.color[i][0]
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i})`
                return url
              } else if(self.color[0].length == 1) {
                return self.modColor(0.5,self.color[0][0])
              }
              return `url(#${myCont}0top)`
            }
          })
          .style('fill-opacity', 0)
          .transition()
          .delay(function(d, i){return i*50 })
          .duration(500)
          .style('fill-opacity', 1)







      counterLabel++


    }
  }
  createStackedCylinder () {

    let h = parseInt(this.height)
    let w = parseInt(this.width)
    let max = (Math.round(this.maxAcumAxesY / 10) * 10)
    let data = this.data
    let svg = this.svg
    let self = this
    let bar  = svg.selectAll('rect')
                .data(data)
                .enter()
    let wchart = this.widthStackedAxe
    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%10 == 0 ) {

        axeY.push(i)
      }
    }

    let axes = svg.selectAll('line')
                  .data(axeY)
                  .enter().append('line')
                  .attr('x1',30)
                  .attr('x2', w)
                  .style('stroke', self.fontColor)
                  .style('stroke-width', '0.5')
                  .attr('y1', function(d, i){
                    return Math.round(h - ((h -60)/self.maxAcumAxesY * d) -30  -(wchart/4))
                  })
                  .attr('y2', function(d, i){

                    return  Math.round(h - ((h -60)/self.maxAcumAxesY * d) -30 -(wchart/4))
                  })
    let axesText = svg.selectAll('text')

    axesText.data(axeY)
            .enter().append('text')
            .text(function(d){
              return d;
            })
            .attr('x', 25)
            .attr('y', function(d, i){
              return Math.round(h - ((h -60)/self.maxAcumAxesY * d) -25  -(wchart/4))
            })
            .style('fill', self.fontColor)
            .style('text-anchor', 'end')

    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    for(let key in data) {

      let bar  = svg.append('g')
                  .selectAll('rect')
                  .data(data[key])
                  .enter()
      axesText.data([key])
              .enter().append('text')
              .text(function(d){
                return d
              })
              .attr('y', function() {
                return Math.round(h - 10)

              })
              .attr('x', function (d, i) {
                let x = (40 +  wacum+ (wchart*counterLabel))
                return x
              })
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')

      axesText.data(data[key])
              .enter().append('text')
              .text(function(d) {
                return d.axeY
              })
              .attr('x', function(d, i ){
                let x = 40 + wacum +(wchart*counterLabel) + (wchart/2)

                return x
              })
              .attr('y', function(d,i){
                let y = ((h-60)/self.maxAcumAxesY * d.axeY )
                let oldPosY = posYText
                posYText += y
                return h - y + (y/2) -25 - oldPosY
              })
              .style('text-anchor', 'middle')
              .style('fill', function(d,i) {
                if(self.color[i]) {
                  return self.modColor(0.8,self.color[i][0])
                } else {
                  return self.modColor(0.8,self.color[0][0])
                }
              })
              .style('font-weight','bold')
              .style('fill-opacity', 0)
              .attr('font-family','Roboto')
              .transition()
              .delay(400)
              .duration(500)
              .style('fill-opacity', 1)





      bar.append('rect')
          .attr('width', wchart)
          .attr('height', function(d){
            return 0
          })
          .attr('x', function(d, i){
            let x = 40 + (wchart*counterLabel) + (wchart*counterLabel)

            return x
          })

          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.color[i][0]
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i})`
                return url
              } else if(self.color[0].length == 1) {
                return self.color[0][0]
              }
              return `url(#${myCont}0)`

            }
          })
          .attr('height', function(d){
            let y = (h-60)/self.maxAcumAxesY * d.axeY

            return y
          })
          .attr('y', function(d, i){
            let y = (h-60)/self.maxAcumAxesY * d.axeY
            let oldPosY = posY
            posY += y
            return h - ((h-60)/self.maxAcumAxesY * d.axeY ) - 30 - oldPosY
          })
          .style('fill-opacity', 0)
          .transition()
          .delay(function(d, i){return 0 })
          .duration(500)
          .style('fill-opacity', 1)

      // Arriba 3dstackedbar
      bar.append('circle')
          .attr('r', wchart/2)

          .attr('cx', function(d, i){
            let x = 40 + (wchart*counterLabel) + (wchart*counterLabel) +  wchart/2

            return x
          })

          .style('transform-origin','center')
          .style('transform',function(d,i){
            let ba = bar.data().length - 1

            if(i == ba) {
              return 'rotateX(60deg)'
            } else {
              return 'rotateX(120deg)'
            }


          })
          .attr('cy', function(d, i){
            let y = (h-60)/self.maxAcumAxesY * d.axeY
            let oldPosY = posYt
            posYt += y
            return h - ((h-60)/self.maxAcumAxesY * d.axeY ) - 30 - oldPosY  + 0.5
          })
          .style('fill', function(d, i) {
            let da = data
            let ba = bar.data().length - 1
            if(i == ba ) {
              if(self.color[i] && self.color[i].length == 1) {
                return self.modColor(0.5,self.color[i][0])
              } else {
                let mysvg = $(self.container).children('svg')
                let myCont = mysvg.parent().attr('id')
                if($('#'+myCont+i)[0]) {
                  let url = `url(#${myCont}${i}top)`
                  return url
                } else if(self.color[0].length == 1) {
                  return self.modColor(0.5,self.color[0][0])
                }
                return `url(#${myCont}0)`

              }
            } else {
              if(self.color[i+1] && self.color[i+1].length == 1) {
                return self.color[i+1][0]
              } else {
                let mysvg = $(self.container).children('svg')
                let myCont = mysvg.parent().attr('id')
                if($('#'+myCont+(i+1))[0]) {
                  let url = `url(#${myCont}${i+1})`
                  return url
                } else if(self.color[0].length == 1) {
                  return self.modColor(0.5,self.color[0][0])
                }

                return `url(#${myCont}0)`
              }
            }


          })
          .style('fill-opacity', 0)
          .transition()
          .delay(function(d, i){return 5 })
          .duration(500)
          .style('fill-opacity', 1)

      bar.append('circle')
          .attr('r', wchart/2)

          .attr('cx', function(d, i){
            let x = 40 + (wchart*counterLabel) + (wchart*counterLabel) +  wchart/2
            return x
          })
          .style('transform-origin','center')
          .style('transform',function(d,i){
            let ba = bar.data().length - 1

            if(i == ba) {
              return 'rotateX(60deg)'
            } else {
              return 'rotateX(120deg)'
            }

          })
          .attr('cy', function(d, i){
            let y =  h - 60 + 30
            return y
          })
          .style('fill', function(d, i) {
            let da = data
            let ba = bar.data().length - 1
            if(i == 0 ) {
              if(self.color[i] && self.color[i].length == 1) {
                return self.color[i][0]
              } else {
                let mysvg = $(self.container).children('svg')
                let myCont = mysvg.parent().attr('id')
                if($('#'+myCont+i)[0]) {
                  let url = `url(#${myCont}${i})`
                  return url
                } else if(self.color[0].length == 1) {
                  return self.modColor(0.5,self.color[0][0])
                }
                return `url(#${myCont}0)`

              }
            } else {
            return 'transparent'
            }


          })
          .style('fill-opacity', 0)
          .transition()
          .delay(function(d, i){return 5 })
          .duration(500)
          .style('fill-opacity', 1)






      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0
      posYr = 0
      posYt = 0

    }
  }
  create3dStackedBars () {

    let h = parseInt(this.height)
    let w = parseInt(this.width)
    let max = (Math.round(this.maxAcumAxesY / 10) * 10)
    let data = this.data
    let svg = this.svg
    let self = this
    let bar  = svg.selectAll('rect')
                .data(data)
                .enter()
    let wchart = this.widthStackedAxe
    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%10 == 0 ) {

        axeY.push(i)
      }
    }

    let axes = svg.selectAll('line')
                  .data(axeY)
                  .enter().append('line')
                  .attr('x1',30)
                  .attr('x2', w)
                  .style('stroke', self.fontColor)
                  .style('stroke-width', '0.5')
                  .attr('y1', function(d, i){
                    return Math.round(h - ((h -60)/self.maxAcumAxesY * d) -30 - (wchart/2))
                  })
                  .attr('y2', function(d, i){

                    return  Math.round(h - ((h -60)/self.maxAcumAxesY * d) -30 - (wchart/2))
                  })
    let axesText = svg.selectAll('text')

    axesText.data(axeY)
            .enter().append('text')
            .text(function(d){
              return d;
            })
            .attr('x', 25)
            .attr('y', function(d, i){
              return Math.round(h - ((h -60)/self.maxAcumAxesY * d) -25 - (wchart/2))
            })
            .style('fill', self.fontColor)
            .style('text-anchor', 'end')

    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    for(let key in data) {

      let bar  = svg.append('g')
                  .selectAll('rect')
                  .data(data[key])
                  .enter()
      axesText.data([key])
              .enter().append('text')
              .text(function(d){
                return d
              })
              .attr('y', function() {
                return Math.round(h - 10)

              })
              .attr('x', function (d, i) {
                let x = (40 +  wacum+ (wchart*counterLabel))
                return x
              })
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')

      axesText.data(data[key])
              .enter().append('text')
              .text(function(d) {
                return d.axeY
              })
              .attr('x', function(d, i ){
                let x = 40 + wacum +(wchart*counterLabel) + (wchart/2)

                return x
              })
              .attr('y', function(d,i){
                let y = ((h-60)/self.maxAcumAxesY * d.axeY )
                let oldPosY = posYText
                posYText += y
                return h - y + (y/2) -25 - oldPosY
              })
              .style('text-anchor', 'middle')
              .style('fill', function(d,i) {
                if(self.color[i]) {
                  return self.modColor(0.8,self.color[i][0])
                } else {
                  return self.modColor(0.8,self.color[0][0])
                }
              })
              .style('font-weight','bold')
              .style('fill-opacity', 0)
              .attr('font-family','Roboto')
              .transition()
              .delay(400)
              .duration(500)
              .style('fill-opacity', 1)



      // Arriba 3dstackedbar
      bar.append('rect')
          .attr('width', wchart)
          .attr('height', function(d){
            return wchart/2
          })
          .attr('x', function(d, i){
            let x = 40 + (wchart*counterLabel) + (wchart*counterLabel)

            return x
          })
          .attr('y', function (d, i) {
            return h - 30
          })
          .style('transform-origin','right bottom ')
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.modColor(0.5,self.color[i][0])
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i})`
                return url
              } else if(self.color[0].length == 1) {
                return self.modColor(0.5,self.color[0][0])
              }
              return `url(#${myCont}0)`

            }
          })
          .transition()
          .delay(function(d, i){return 0 })
          .duration(500)

          .attr('y', function(d, i){
            let y = (h-60)/self.maxAcumAxesY * d.axeY
            let oldPosY = posYt
            posYt += y
            return h - ((h-60)/self.maxAcumAxesY * d.axeY ) - 30 - oldPosY - (wchart/2) + 0.5
          })
          .style('transform','skewX(-45deg)')
      // Dercha 3dstackedbar
      bar.append('rect')
          .attr('width', wchart/2)
          .attr('height', function(d){
            return 0
          })
          .attr('x', function(d, i){
            let x = 40 + (wchart*counterLabel) + (wchart*counterLabel) + wchart - 0.5
            return x
          })
          .attr('y', function (d, i) {
            return h - 30
          })
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.modColor(-0.2,self.color[i][0])
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i}right)`
                return url
              } else if(self.color[0].length == 1) {
                return self.modColor(-0.5,self.color[0][0])
              }
              return `url(#${myCont}0right)`

            }
          })
          .style('transform-origin','bottom left')
          .style('transform', 'skewY(-45deg)')
          .style('-moz-transform', function(d, i){
            let height = (h-60)/self.maxAcumAxesY * d.axeY
            let g = 0.45
            let w = wchart/2
            let t = `skewY(-45deg) translateY(${height*g-w}px)`
            return t
          })
          .transition()
          .delay(function(d, i){return 0 })
          .duration(500)
          .attr('height', function(d){
            let y = (h-60)/self.maxAcumAxesY * d.axeY

            return y
          })
          .attr('y', function(d, i){
            let y = (h-60)/self.maxAcumAxesY * d.axeY
            let oldPosY = posYr
            posYr += y
            return h - ((h-60)/self.maxAcumAxesY * d.axeY ) - 30 - oldPosY
          })
      bar.append('rect')
          .attr('width', wchart)
          .attr('height', function(d){
            return 0
          })
          .attr('x', function(d, i){
            let x = 40 + (wchart*counterLabel) + (wchart*counterLabel)

            return x
          })
          .attr('y', function (d, i) {
            return h - 30
          })
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.color[i][0]
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i})`
                return url
              } else if(self.color[0].length == 1) {
                return self.color[0][0]
              }
              return `url(#${myCont}0)`

            }
          })
          .transition()
          .delay(function(d, i){return 0 })
          .duration(500)
          .attr('height', function(d){
            let y = (h-60)/self.maxAcumAxesY * d.axeY

            return y
          })
          .attr('y', function(d, i){
            let y = (h-60)/self.maxAcumAxesY * d.axeY
            let oldPosY = posY
            posY += y
            return h - ((h-60)/self.maxAcumAxesY * d.axeY ) - 30 - oldPosY
          })

      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0
      posYr = 0
      posYt = 0

    }
  }
  create3dBars () {

    let h = parseInt(this.height)
    let w = parseInt(this.width)


    let max = (Math.round(this.maxAllAxesY / 10) * 10)
    let data = this.data
    let svg = this.svg
    let self = this
    let bar  = svg.selectAll('rect')
                .data(data)
                .enter()


    let wchart = this.widthAxe

    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%10 == 0 ) {

        axeY.push(i)
      }
    }

    let axes = svg.selectAll('line')
                  .data(axeY)
                  .enter().append('line')
                  .attr('x1',30)
                  .attr('x2', w)
                  .style('stroke', self.fontColor)
                  .style('stroke-width', '0.15')
                  .attr('y1', function(d, i){
                    return Math.round(h - ((h -60)/self.maxAllAxesY * d) -30) - (wchart/2)
                  })
                  .attr('y2', function(d, i){

                    return  Math.round(h - ((h -60)/self.maxAllAxesY * d) -30) - (wchart/2)
                  })
    let axesText = svg.selectAll('text')

    axesText.data(axeY)
            .enter().append('text')
            .text(function(d){
              return d;
            })
            .attr('x', 25)
            .attr('y', function(d, i){
              return Math.round(h - ((h -60)/self.maxAllAxesY * d) -25) - (wchart/2)
            })
            .style('fill', self.fontColor)
            .style('text-anchor', 'end')

    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    for(let key in data) {

      let bar  = svg.append('g')
                  .selectAll('rect')
                  .data(data[key])
                  .enter()
      axesText.data([key])
              .enter().append('text')
              .text(function(d){
                return d
              })
              .attr('y', function() {
                return Math.round(h - 10)

              })
              .attr('x', function (d, i) {
                let x = (40 +  wacum+ (wchart*counterLabel))
                return x
              })
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')

      axesText.data(data[key])
              .enter().append('text')
              .text(function(d) {
                return d.axeY
              })
              .attr('x', function(d, i ){
                let x = 40 +  poinacum+ (wchart*counterLabel) + (wchart/2)
                poinacum += wchart

                return x
              })
              .attr('y', function(d,i){
                return h  - 35
              })
              .style('text-anchor', 'middle')
              .style('fill', function(d,i) {
                if(self.color[i]) {
                  return self.modColor(-0.5,self.color[i][0])
                } else {
                  return self.modColor(-0.5,self.color[0][0])
                }
              })
              .style('font-weight', 'bold')
              .attr('font-family','Roboto')
              .transition()
              .delay(function(d, i){return i*50 })
              .duration(500)
              .attr('y', function(d,i){
                return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 35
              })
      // derecha
      bar.append('rect')
                  .attr('width', wchart/2)
                  .attr('height', function(d){
                    return 0
                  })
                  .attr('x', function(d, i){

                    let x = 40 +  wacum  + wchart + (wchart*i) + (wchart*counterLabel) - 0.5
                    return x
                  })
                  .attr('y', function (d, i) {
                    return h - 30
                  })
                  .style('transform-origin', 'bottom left')
                  .style('transform', 'skewY(-45deg)')
                  .style('fill', function(d, i) {
                    if(self.color[i] && self.color[i].length == 1) {
                      return self.modColor(-0.2,self.color[i][0])
                    } else {
                      let mysvg = $(self.container).children('svg')
                      let myCont = mysvg.parent().attr('id')
                      if($('#'+myCont+i)[0]) {
                        let url = `url(#${myCont}${i}right)`
                        return url
                      } else if(self.color[0].length == 1) {
                        return self.modColor(-0.2,self.color[0][0])
                      }
                      return `url(#${myCont}0right)`

                    }
                  })
                  .transition()
                  .delay(function(d, i){return i*50 })
                  .duration(500)
                  .attr('height', function(d){
                    return (h-60)/self.maxAllAxesY * d.axeY
                  })
                  .attr('y', function(d){
                    return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 30
                  })
      // top
      bar.append('rect')
          .attr('width', wchart)
          .attr('height', function(d){
            return 0
          })
          .attr('x', function(d, i){
            let x = 40 +  (wchart*i) + wacum + (wchart*counterLabel)
            return x
          })
          .attr('y', function(d){
            return h - 30 - wchart/2 + 0.5
          })
          .attr('height', function(d){
            return wchart/2
          })
          .style('transform-origin','right bottom ')

          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.modColor(0.2,self.color[i][0])
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i}top)`
                return url
              } else if(self.color[0].length == 1) {
                return self.modColor(0.5,self.color[0][0])
              }
              return `url(#${myCont}0top)`

            }
          })
          .transition()
          .delay(function(d, i){return i*50 })
          .duration(500)

          .attr('y', function(d){
            return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 30 - wchart/2 + 0.5
          })
          .style('transform','skewX(-45deg)')


      bar.append('rect')
          .attr('width', wchart)
          .attr('height', function(d){
            return 0
          })
          .attr('x', function(d, i){
            let x = 40 +  wacum+ (wchart*counterLabel)
            wacum += wchart
            return x
          })
          .attr('y', function (d, i) {
            return h - 30
          })
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.color[i]
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i})`
                return url
              } else if(self.color[0].length == 1) {
                return self.color[0]
              }
              return `url(#${myCont}0)`

            }
          })
          .transition()
          .delay(function(d, i){return i*50 })
          .duration(500)
          .attr('height', function(d){
            return (h-60)/self.maxAllAxesY * d.axeY
          })
          .attr('y', function(d){
            return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 30
          })


      counterLabel++

    }
  }
  createStackedBars () {

    let h = parseInt(this.height)
    let w = parseInt(this.width)
    let max = (Math.round(this.maxAcumAxesY / 10) * 10)
    let data = this.data
    let svg = this.svg
    let self = this
    let bar  = svg.selectAll('rect')
                .data(data)
                .enter()
    let wchart = this.widthStackedAxe
    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%10 == 0 ) {

        axeY.push(i)
      }
    }

    let axes = svg.selectAll('line')
                  .data(axeY)
                  .enter().append('line')
                  .attr('x1',30)
                  .attr('x2', w)
                  .style('stroke', self.fontColor)
                  .style('stroke-width', '0.5')
                  .attr('y1', function(d, i){
                    return Math.round(h - ((h -60)/self.maxAcumAxesY * d) -30)
                  })
                  .attr('y2', function(d, i){

                    return  Math.round(h - ((h -60)/self.maxAcumAxesY * d) -30)
                  })
    let axesText = svg.selectAll('text')

    axesText.data(axeY)
            .enter().append('text')
            .text(function(d){
              return d;
            })
            .attr('x', 25)
            .attr('y', function(d, i){
              return Math.round(h - ((h -60)/self.maxAcumAxesY * d) -25)
            })
            .style('fill', self.fontColor)
            .style('text-anchor', 'end')

    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYText = 0
    for(let key in data) {

      let bar  = svg.append('g')
                  .selectAll('rect')
                  .data(data[key])
                  .enter()
      axesText.data([key])
              .enter().append('text')
              .text(function(d){
                return d
              })
              .attr('y', function() {
                return Math.round(h - 10)

              })
              .attr('x', function (d, i) {
                let x = (40 +  wacum+ (wchart*counterLabel))
                return x
              })
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')

      axesText.data(data[key])
              .enter().append('text')
              .text(function(d) {
                return d.axeY
              })
              .attr('x', function(d, i ){
                let x = 40 + wacum +(wchart*counterLabel) + (wchart/2)

                return x
              })
              .attr('y', function(d,i){
                let y = ((h-60)/self.maxAcumAxesY * d.axeY )
                let oldPosY = posYText
                posYText += y
                return h - y + (y/2) -25 - oldPosY
              })
              .style('text-anchor', 'middle')
              .style('fill', function(d,i) {
                if(self.color[i] && self.color[i].length == 1) {
                  return self.modColor(0.8,self.color[i][0])
                } else {
                  return self.modColor(0.8,self.color[0][0])
                }
              })
              .style('fill-opacity', 0)
              .attr('font-family','Roboto')
              .transition()
              .delay(400)
              .duration(500)
              .style('fill-opacity', 1)



      bar.append('rect')
          .attr('width', wchart)
          .attr('height', function(d){
            return 0
          })
          .attr('x', function(d, i){
            let x = 40 + (wchart*counterLabel) + (wchart*counterLabel)

            return x
          })
          .attr('y', function (d, i) {
            return h - 30
          })
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.color[i][0]
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i})`
                return url
              } else if(self.color[0].length == 1) {
                return self.color[0][0]
              }
              return `url(#${myCont}0)`

            }
          })
          .transition()
          .delay(function(d, i){return 0 })
          .duration(500)
          .attr('height', function(d){
            let y = (h-60)/self.maxAcumAxesY * d.axeY

            return y
          })
          .attr('y', function(d, i){
            let y = (h-60)/self.maxAcumAxesY * d.axeY
            let oldPosY = posY
            posY += y
            return h - ((h-60)/self.maxAcumAxesY * d.axeY ) - 30 - oldPosY
          })

      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0


    }
  }
  createBars () {

    let h = parseInt(this.height)
    let w = parseInt(this.width)


    let max = (Math.round(this.maxAllAxesY / 10) * 10)
    let data = this.data
    let svg = this.svg
    let self = this
    let bar  = svg.selectAll('rect')
                .data(data)
                .enter()


    let wchart = this.widthAxe

    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%10 == 0 ) {

        axeY.push(i)
      }
    }

    let axes = svg.selectAll('line')
                  .data(axeY)
                  .enter().append('line')
                  .attr('x1',30)
                  .attr('x2', w)
                  .style('stroke', self.fontColor)
                  .style('stroke-width', '0.5')
                  .attr('y1', function(d, i){
                    return Math.round(h - ((h -60)/self.maxAllAxesY * d) -30)
                  })
                  .attr('y2', function(d, i){

                    return  Math.round(h - ((h -60)/self.maxAllAxesY * d) -30)
                  })
    let axesText = svg.selectAll('text')

    axesText.data(axeY)
            .enter().append('text')
            .text(function(d){
              return d;
            })
            .attr('x', 25)
            .attr('y', function(d, i){
              return Math.round(h - ((h -60)/self.maxAllAxesY * d) -25)
            })
            .style('fill', self.fontColor)
            .style('text-anchor', 'end')

    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    for(let key in data) {

      let bar  = svg.append('g')
                  .selectAll('rect')
                  .data(data[key])
                  .enter()
      axesText.data([key])
              .enter().append('text')
              .text(function(d){
                return d
              })
              .attr('y', function() {
                return Math.round(h - 10)

              })
              .attr('x', function (d, i) {
                let x = (40 +  wacum+ (wchart*counterLabel))
                return x
              })
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')

      axesText.data(data[key])
              .enter().append('text')
              .text(function(d) {
                return d.axeY
              })
              .attr('x', function(d, i ){
                let x = 40 +  poinacum+ (wchart*counterLabel) + (wchart/2)
                poinacum += wchart

                return x
              })
              .attr('y', function(d,i){
                return h  - 35
              })
              .style('text-anchor', 'middle')
              .style('fill', self.fontColor)
              .attr('font-family','Roboto')
              .transition()
              .delay(function(d, i){return i*50 })
              .duration(500)
              .attr('y', function(d,i){
                return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 35
              })


      bar.append('rect')
          .attr('width', wchart)
          .attr('height', function(d){
            return 0
          })
          .attr('x', function(d, i){
            let x = 40 +  wacum+ (wchart*counterLabel)
            wacum += wchart
            return x
          })
          .attr('y', function (d, i) {
            return h - 30
          })
          .style('fill', function(d, i) {
            if(self.color[i] && self.color[i].length == 1) {
              return self.color[i]
            } else {
              let mysvg = $(self.container).children('svg')
              let myCont = mysvg.parent().attr('id')
              if($('#'+myCont+i)[0]) {
                let url = `url(#${myCont}${i})`
                return url
              } else if(self.color[0].length == 1) {
                return self.color[0]
              }
              return `url(#${myCont}0)`

            }
          })
          .transition()
          .delay(function(d, i){return i*50 })
          .duration(500)
          .attr('height', function(d){
            return (h-60)/self.maxAllAxesY * d.axeY
          })
          .attr('y', function(d){
            return h - ((h-60)/self.maxAllAxesY * d.axeY ) - 30
          })

      counterLabel++

    }
  }
  get printData () {
    console.log(this.data)
  }
}
