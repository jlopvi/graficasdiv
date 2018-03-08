class ToGraph {
  constructor(container, data) {
    
    this.data = data.series

    this.acumAxesY = this.getAcumAxesY
    this.allAxesY = this.getAllAxesY

    this.maxAcumAxesY = this.getMaxAcumAxesY
    this.maxAllAxesY = this.getMaxAllAxesY

    this.container = container
    this.chartType = data.chartType || 'bar3d'

    this.width =  data.width || parseInt($('#graf1').css('width'))
    this.height = data.height || data.width * 0.562 || parseInt($('#graf1').css('width')) * 0.562

    this.areaBackground = data.areaBackground || 'transparent'
    this.palette = data.palette
    this.lengthPalette = this.getLengthPalette
    this.colorTextAxisY = data.colorTextAxisY || "#000"
    this.colorTextAxisX = data.colorTextAxisX || "#000"
    this.colorLineAxisY = data.colorLineAxisY || "#000"
    this.colorLabel = data.colorLabel || "#000"
    this.fontSizeAxisY = data.fontSizeAxisY || 16
    this.fontSizeAxisX = data.fontSizeAxisX || 16
    this.fontSizeLabel = data.fontSizeLabel || 16
    this.gradientAngle = data.gradientAngle
    this.angle = data.gradientAngle
    this.widthAxe = data.widthAxe || this.getWidthAxe
    this.widthStackedAxe = data.widthAxe || this.getWidthStackedAxe
    this.symbol = data.symbol || ""
    this.symbolPosition = data.symbolPosition || 'l'

  }

  get getLengthPalette () {
    var t = 0;
    this.palette.map(function(e) {
        t = e.length > t ? e.length : t
    });
    return t
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

  createContainer () {
    let container = d3.select(this.container)
    container.selectAll('section')
              .remove()
    let section = container
                .append('section')
                .style('width', this.width + 'px')
                .style('height', this.height + 'px')
                .style('background-color', this.areaBackground)
                .style('position', 'relative')

    this.section = section
    this.graphContainer = container

    // if(this.lengthPalette > 1) {
    //     this.addGradient()
    //   }
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
    // var svgNS = svg.namespaceURI;
    // var grad  = document.createElementNS(svgNS,'linearGradient');
    // grad.setAttribute('id',id);
    // grad.setAttribute('x1', rotate.x1)
    // grad.setAttribute('x2', rotate.x2)
    // grad.setAttribute('y1', rotate.y1)
    // grad.setAttribute('y2', rotate.y2)
    // for (var i=0;i<stops.length;i++){
    //   var attrs = stops[i];
    //   var stop = document.createElementNS(svgNS,'stop');
    //   for (var attr in attrs){
    //     if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr,attrs[attr]);
    //   }
    //   grad.appendChild(stop);
    // }

    // var defs = svg.querySelector('defs') ||
    //     svg.insertBefore( document.createElementNS(svgNS,'defs'), svg.firstChild);

    // return defs.appendChild(grad);

  }
  createAxesGraph () {
    if(this.chartType == 'bar') {
    //   this.createBars()
    } else if(this.chartType == 'stackedbar') {
      // this.createStackedBars()
    } else if(this.chartType == '3dbar') {
      // this.create3dBars()
    } else if(this.chartType == '3dstackedbar') {
      this.create3dStackedBars()
    } else if(this.chartType == 'cylinder') {
      // this.createCylinder()
    } else if(this.chartType == 'stackedcylinder') {
      // this.createStackedCylinder()
    }
  }
  createAxisYLines (axeY) {
    let h = this.height*1
    let w = this.width*1
    let max = Math.round(this.maxAcumAxesY)
    let data = this.data
    let section = this.section
    let self = this
    let bar  = section.selectAll('div')
                .data(data)
                .enter()
    let wchart = this.widthStackedAxe
    let axesYTextcontainer = section
                              .append('header')
                              .attr('id', 'axiY')
                              .style('background', this.areaBackground)
                              .style('height', '100%')
                              .style('position', 'absolute')
                              .style('z-index', '50')
                              .style('padding', '0 5px')
                              .style('box-sizing', 'border-box')
    // Letras
   axesYTextcontainer.selectAll('span')
                      .data(axeY)
                      .enter().append('span')
                      .text(function(d){
                        return d;
                      })
                      .style('display', 'block') 
                      .style('top', function(d, i){
                        var result = Math.round(h - ((h -60)/self.maxAcumAxesY * d) -30 - (wchart/2))
                        return `${result}px`
                      })
                      .style('font-size', self.fontSizeAxisY + 'px')
                      .style('color', self.areaBackground)
                      .append('span')
                      .text(function(d){
                        return d;
                      })
                      .style('display', 'inline-block') 
                      .style('position', 'absolute')
                      .style('top', function(d, i){
                        var result = Math.round(h - ((h -60)/(self.maxAcumAxesY + 50) * d) -30 - (wchart/2))
                        return `${result}px`
                      })
                      .style('right', '5px')
                      .style('color', self.colorTextAxisY)
                      .style('text-align', 'right')
                      .style('font-size', self.fontSizeAxisY + 'px')
    // Lineas
    var lineswidth =  parseInt($(this.container).find('#axiY').css('width'))
    let axes = section.append('div')
                      .attr('id', 'lines')
                      .style('position', 'absolute')
                      .style('right', 0)
                      .style('width', function(){
                        var result = `${self.width - lineswidth}px`
                        return result
                      })
                      .style('height', '100%')
                      .append('div')
                      .attr('id', 'charts')
                      .style('position', 'relative')
                      .style('height', '100%')
                      .style('width', '100%')
                      .selectAll('hr')
                      .data(axeY)
                      .enter().append('hr')
                      .style('position', 'absolute')
                      // .style('width', self.width + 'px')
                      .style('width', '100%')
                      .style('border', '0 none')
                      .style('border-bottom', '1px solid' + self.colorLineAxisY)
                      .style('top', function(d, i){
                        var result = Math.round(h - ((h -60)/(self.maxAcumAxesY + 50) * d) -30 - (wchart/2))
                        return `${result}px`
                      })

    
  }
  create3dStackedBars () {

    let h = this.height*1
    let w = this.width*1
    let max = Math.round(this.maxAcumAxesY) + 20
    let data = this.data
    let section = this.section
    let self = this
    // let bar  = section.selectAll('div')
    //             .data(data)
    //             .enter()
    let wchart = this.widthStackedAxe
    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%20 == 0 ) {

        axeY.push(i)
      }
    }
    this.createAxisYLines(axeY)

    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    var indexbar = 0
    var widthcontainer =  parseInt($(this.container).find('#charts').css('width'))
    var heightcontainer =  parseInt($(this.container).find('#charts').css('height')) - 50
    section.append('div')
            .style('position', 'absolute')
            .style('width', widthcontainer+'px')
            .style('height', heightcontainer+'px')
            .style('top', 0)
            .style('right', 0)
            .append('div')
            .attr('id', 'bars')
            .style('position', 'relative')
            .style('width', '100%')            
            .style('height', '100%')            

    for(let key in data) {
      var bar = section.select('#bars')
                .append('div')
                .style('position', 'absolute')
                .style('left',  function(){
                  let x = (wchart*counterLabel) + (wchart*counterLabel)
                  return x+'px'
                })
                .style('height', '100%')
                
      bar.append('span')
          .text(key)
          .style('position', 'absolute')
          .style('top', '101%')
          .style('font-size', self.fontSizeLabel+'px')
          .style('color', self.colorLabel)
      // Arriba 3dstackedbar

      var front = bar.selectAll('div')
        .data(data[key])
        .enter().append('div')
        .style('width', wchart + 'px')
        .style('height', function(d){
          let y = parseInt((h-60)/(self.maxAcumAxesY + 50) * d.axeY) + 'px'
          return y
        })
        .style('position', 'absolute')
        .style('bottom', function(d){
          let y = parseInt((h-60)/(self.maxAcumAxesY + 50) * d.axeY) 
          let oldPosY = posYr
          posYr += y
          return oldPosY  + 'px'
        })
        .style('left', 0)
        .style('background', function(d, i){
          if(self.palette[i] && self.lengthPalette == 1) {
            return self.modColor(0.5,self.palette[i][0])
          } else {
            // linear-gradient(to right, rgba(248,80,50,1) 0%, rgba(39,55,230,1) 28%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%)
            if(self.palette[i].length > 1) {
              var l = self.palette[i].length
              var m = 100 / l
              var x = 0
              var colors = self.palette[i].map(function(c){
                var t = `${c} ${m * x}%, `
                if(x == l-1){
                  var t = `${c} 100% `
                }
                x++
                return t
              })
              var bg = `linear-gradient(${self.gradientAngle}deg, ${colors.join('')})`
              debugger
              return bg
            } else {
              var bg = self.palette[i][0]
              return bg
            }
          }
        })
        .style('display', 'flex')
        .style('justify-content', 'center')
        .style('align-items', 'center')
        .style('flex-direction', 'column')

      // Arriba
      front.append('div')
          .style('width', '100%')
          .style('height', wchart/3 + 'px')
          .style('position', 'absolute')
          .style('bottom',  '100%')
          .style('left', 0)
          .style('background', function(d, i){
            if(self.palette[i] && self.lengthPalette == 1) {
              return self.modColor(0.5,self.palette[i][0])
            } else {
              // linear-gradient(to right, rgba(248,80,50,1) 0%, rgba(39,55,230,1) 28%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%)
              if(self.palette[i].length > 1) {
                var l = self.palette[i].length
                var m = 100 / l
                var x = 0
                var colors = self.palette[i].map(function(c){
                  var t = `${self.modColor(0.7, c)} ${m * x}%, `
                  if(x == l-1){
                    var t = `${self.modColor(0.1, c)} 100% `
                  }
                  x++
                  return t
                })
                var bg = `linear-gradient(${self.gradientAngle-180}deg, ${colors.join('')})`
                debugger
                return bg
              } else {
                var bg = self.palette[i][0]
                return bg
              }
            }
          })
          .style('transform-origin', 'left bottom')
          .style('transform','skewX(-45deg)')

      // derecha
      front.append('div')
        .style('background',  function(d, i){
          if(self.palette[i] && self.lengthPalette == 1) {
            return self.modColor(0.5,self.palette[i][0])
          } else {
            // linear-gradient(to right, rgba(248,80,50,1) 0%, rgba(39,55,230,1) 28%, rgba(240,47,23,1) 71%, rgba(231,56,39,1) 100%)
            if(self.palette[i].length > 1) {
              var l = self.palette[i].length
              var m = 100 / l
              var x = 0
              var colors = self.palette[i].map(function(c){
                var t = `${self.modColor(0.5, c)} ${m * x}%, `
                if(x == l-1){
                  var t = `${self.modColor(0.5, c)} 100% `
                }
                x++
                return t
              })
              if(self.gradientAngle == 0){
                var bg = `linear-gradient(${self.gradientAngle}deg, ${colors.join('')})`
              } else {
                var bg = `linear-gradient(${-self.gradientAngle}deg, ${colors.join('')})`
              }
              debugger
              return bg
            } else {
              var bg = self.palette[i][0]
              return bg
            }
          }
        })
        .style('position', 'absolute')
        .style('width', '33%')
        .style('height', '100%')
        .style('top', '0')
        .style('left', '100%')
        .style('transform-origin', 'bottom left')
        .style('transform', 'skewY(-45deg)')

      front.append('span')
          .text(function(d) {
            return d.axeY
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
      front.append('span')
          .text(function(d) {
            return d.axisLabel
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
      
      // axesText.data([key])
      //         .enter().append('text')
      //         .text(function(d){
      //           return d
      //         })
      //         .attr('y', function() {
      //           return Math.round(h - 10)

      //         })
      //         .attr('x', function (d, i) {
      //           let x = (40 +  wacum+ (wchart*counterLabel))
      //           return x
      //         })
      //         .style('fill', self.fontColor)
      //         .attr('font-family','Roboto')

      // axesText.data(data[key])
      //         .enter().append('text')
      //         .text(function(d) {
      //           return d.axeY
      //         })
      //         .attr('x', function(d, i ){
      //           let x = 40 + wacum +(wchart*counterLabel) + (wchart/2)

      //           return x
      //         })
      //         .attr('y', function(d,i){
      //           let y = ((h-60)/self.maxAcumAxesY * d.axeY )
      //           let oldPosY = posYText
      //           posYText += y
      //           return h - y + (y/2) -25 - oldPosY
      //         })
      //         .style('text-anchor', 'middle')
      //         .style('fill', function(d,i) {
      //           if(self.color[i]) {
      //             return self.modColor(0.8,self.color[i][0])
      //           } else {
      //             return self.modColor(0.8,self.color[0][0])
      //           }
      //         })
      //         .style('font-weight','bold')
      //         .style('fill-opacity', 0)
      //         .attr('font-family','Roboto')
      //         .transition()
      //         .delay(400)
      //         .duration(500)
      //         .style('fill-opacity', 1)



      // Arriba 3dstackedbar



      // Dercha 3dstackedbar
      // bar.append('rect')
      //     .attr('width', wchart/2)
      //     .attr('height', function(d){
      //       return 0
      //     })
      //     .attr('x', function(d, i){
      //       let x = 40 + (wchart*counterLabel) + (wchart*counterLabel) + wchart - 0.5
      //       return x
      //     })
      //     .attr('y', function (d, i) {
      //       return h - 30
      //     })
      //     .style('fill', function(d, i) {
      //       if(self.color[i] && self.color[i].length == 1) {
      //         return self.modColor(-0.2,self.color[i][0])
      //       } else {
      //         let mysvg = $(self.container).children('svg')
      //         let myCont = mysvg.parent().attr('id')
      //         if($('#'+myCont+i)[0]) {
      //           let url = `url(#${myCont}${i}right)`
      //           return url
      //         } else if(self.color[0].length == 1) {
      //           return self.modColor(-0.5,self.color[0][0])
      //         }
      //         return `url(#${myCont}0right)`

      //       }
      //     })
      //     .style('transform-origin','bottom left')
      //     .style('transform', function(d, i){
      //       let x = 87 * indexbar
      //       let y = 83 + x
            
      //       return `skewY(-45deg) translateY(${y}px)`
      //     })
      //     .style('-moz-transform', function(d, i){
      //       let height = (h-60)/self.maxAcumAxesY * d.axeY
      //       let g = 0.45
      //       let w = wchart/2
      //       let t = `skewY(-45deg) translateY(${height*g-w}px)`
      //       return t
      //     })
      //     .transition()
      //     .delay(function(d, i){return 0 })
      //     .duration(500)
      //     .attr('height', function(d){
      //       let y = (h-60)/self.maxAcumAxesY * d.axeY

      //       return y
      //     })
      //     .attr('y', function(d, i){
      //       let y = (h-60)/self.maxAcumAxesY * d.axeY
      //       let oldPosY = posYr
      //       posYr += y
      //       return h - ((h-60)/self.maxAcumAxesY * d.axeY ) - 30 - oldPosY
      //     })
      // bar.append('rect')
          // .attr('width', wchart)
          // .attr('height', function(d){
          //   return 0
          // })
          // .attr('x', function(d, i){
          //   let x = 40 + (wchart*counterLabel) + (wchart*counterLabel)

          //   return x
          // })
          // .attr('y', function (d, i) {
          //   return h - 30
          // })
          // .style('fill', function(d, i) {
          //   if(self.color[i] && self.color[i].length == 1) {
          //     return self.color[i][0]
          //   } else {
          //     let mysvg = $(self.container).children('svg')
          //     let myCont = mysvg.parent().attr('id')
          //     if($('#'+myCont+i)[0]) {
          //       let url = `url(#${myCont}${i})`
          //       return url
          //     } else if(self.color[0].length == 1) {
          //       return self.color[0][0]
          //     }
          //     return `url(#${myCont}0)`

          //   }
          // })
          // .transition()
          // .delay(function(d, i){return 0 })
          // .duration(500)
          // .attr('height', function(d){
          //   let y = (h-60)/self.maxAcumAxesY * d.axeY

          //   return y
          // })
          // .attr('y', function(d, i){
          //   let y = (h-60)/self.maxAcumAxesY * d.axeY
          //   let oldPosY = posY
          //   posY += y
          //   return h - ((h-60)/self.maxAcumAxesY * d.axeY ) - 30 - oldPosY
          // })
      indexbar++
      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0
      posYr = 0
      posYt = 0

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
