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


  createAxesGraph () {
    if(this.chartType == 'bar') {
      this.createBars()
    } else if(this.chartType == 'stackedbar') {
      this.createStackedBars()
    } else if(this.chartType == '3dbar') {
      this.create3dBars()
    } else if(this.chartType == '3dstackedbar') {
      this.create3dStackedBars()
    } else if(this.chartType == 'cylinder') {
      this.createCylinder()
    } else if(this.chartType == 'stackedcylinder') {
      this.createStackedCylinder()
    }
  }
  createAxisYLines (axeY, maxa) {
    let h = this.height*1
    let w = this.width*1
    let max = maxa
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
                      .style('top', 0)
                      .style('font-size', self.fontSizeAxisY + 'px')
                      .style('color', self.areaBackground)
                      .append('span')
                      .text(function(d){
                        return d;
                      })
                      .style('display', 'inline-block') 
                      .style('position', 'absolute')
                      .style('top', function(d, i){
                        var result = Math.round(h - ((h -50)/max  * d ) - 50 )
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
                        var result = Math.round(h - ((h -50)/max  * d ) - 50 )
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
    this.createAxisYLines(axeY, max)
    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    var indexbar = 0
    var widthcontainer =  parseInt($(this.container).find('#charts').css('width'))
    var heightcontainer =  parseInt($(this.container).find('#charts').css('height')) - 42
    section.append('div')
            .style('position', 'absolute')
            .style('width', widthcontainer+'px')
            .style('height', heightcontainer+'px')
            .style('bottom', '42px')
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
          let y = parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) + 'px'
          return y
        })
        .style('position', 'absolute')
        .style('bottom', function(d){
          let y = parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) 
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
      
 
      indexbar++
      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0
      posYr = 0
      posYt = 0

    }
  }
  createStackedCylinder () {

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
    this.createAxisYLines(axeY, max)
    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    var indexbar = 0
    var widthcontainer =  parseInt($(this.container).find('#charts').css('width'))
    var heightcontainer =  parseInt($(this.container).find('#charts').css('height')) - 42
    section.append('div')
            .style('position', 'absolute')
            .style('width', widthcontainer+'px')
            .style('height', heightcontainer+'px')
            .style('bottom', '42px')
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
          .style('top', '102%')
          .style('font-size', self.fontSizeLabel+'px')
          .style('color', self.colorLabel)
          .style('z-index', '55')
      // Arriba 3dstackedbar

      var front = bar.selectAll('div')
        .data(data[key])
        .enter().append('div')
        .style('width', wchart + 'px')
        .style('height', function(d){
          let y = parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) + 'px'
          return y
        })
        .style('position', 'absolute')
        .style('bottom', function(d){
          let y = parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) 
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
        .style('z-index','53')

      // Arriba
      front.append('div')
          .style('width', '100%')
          .style('height', wchart+ 'px')
          .style('border-radius', '50%')
          .style('position', 'absolute')
          .style('top',  -wchart/2+'px')
          .style('left', 0)
          .style('background', function(d, i){
            // var i = i + 1
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
          .style('transform-origin', 'center')
          .style('transform','rotateX(-45deg)')
          .style('z-index','54')


      front.append('div')
          .style('width', '100%')
          .style('height', wchart+ 'px')
          .style('border-radius', '50%')
          .style('position', 'absolute')
          .style('bottom',  -wchart/2+'px')
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
                var bg = `linear-gradient(${self.gradientAngle-180}deg, ${colors.join('')})`
                return bg
              } else {
                var bg = self.palette[i][0]
                return bg
              }
            }
          })
          .style('transform-origin', 'center')
          .style('transform','rotateX(-45deg)')
          .style('z-index','54')


      front.append('span')
          .text(function(d) {
            return d.axeY
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
          
      front.append('span')
          .text(function(d) {
            return d.axisLabel
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
      
 
      indexbar++
      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0
      posYr = 0
      posYt = 0

    }
  }
  createStackedBars () {

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
    this.createAxisYLines(axeY, max)
    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    var indexbar = 0
    var widthcontainer =  parseInt($(this.container).find('#charts').css('width'))
    var heightcontainer =  parseInt($(this.container).find('#charts').css('height')) - 42
    section.append('div')
            .style('position', 'absolute')
            .style('width', widthcontainer+'px')
            .style('height', heightcontainer+'px')
            .style('bottom', '42px')
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
          .style('top', '102%')
          .style('font-size', self.fontSizeLabel+'px')
          .style('color', self.colorLabel)
          .style('z-index', '55')
      // Arriba 3dstackedbar

      var front = bar.selectAll('div')
        .data(data[key])
        .enter().append('div')
        .style('width', wchart + 'px')
        .style('height', function(d){
          let y = parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) + 'px'
          return y
        })
        .style('position', 'absolute')
        .style('bottom', function(d){
          let y = parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) 
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
        .style('z-index','53')

      // Arriba
   




      front.append('span')
          .text(function(d) {
            return d.axeY
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
          
      front.append('span')
          .text(function(d) {
            return d.axisLabel
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
      
 
      indexbar++
      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0
      posYr = 0
      posYt = 0

    }
  }
  create3dBars () {

    let h = this.height*1
    let w = this.width*1
    let max = Math.round(this.maxAllAxesY) + 20
    let data = this.data
    let section = this.section
    let self = this
    // let bar  = section.selectAll('div')
    //             .data(data)
    //             .enter()
    let wchart = this.widthAxe
    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%20 == 0 ) {

        axeY.push(i)
      }
    }
    this.createAxisYLines(axeY, max)
    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    var indexbar = 0
    var widthcontainer =  parseInt($(this.container).find('#charts').css('width'))
    var heightcontainer =  parseInt($(this.container).find('#charts').css('height')) - 42
    section.append('div')
            .style('position', 'absolute')
            .style('width', widthcontainer+'px')
            .style('height', heightcontainer+'px')
            .style('bottom', '42px')
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
                  let x = (wchart*indexbar) 
                  return x+'px'
                })
                .style('height', '100%')
                
      bar.append('span')
          .text(key)
          .style('position', 'absolute')
          .style('top', '102%')
          .style('font-size', self.fontSizeLabel+'px')
          .style('color', self.colorLabel)
          .style('z-index', '55')
      // Arriba 3dstackedbar

      var front = bar.selectAll('div')
        .data(data[key])
        .enter().append('div')
        .style('width', wchart + 'px')
        .style('height', function(d){
          // parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) + 'px'
          // let y = parseInt(h/(max) * d.axeY) + 'px'
          let y = parseInt((h-42)/(max) * d.axeY) + 'px'
          return y
        })
        .style('position', 'absolute')
        .style('bottom', 0)
        .style('left', function(d, i){
          let x =  wchart*i
          indexbar++
          return x+'px'
        })
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
        .style('z-index','53')

      // Arriba
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
          .style('position', 'relative')
          .style('z-index', '55')
          
      front.append('span')
          .text(function(d) {
            return d.axisLabel
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
      
 
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

    let h = this.height*1
    let w = this.width*1
    let max = Math.round(this.maxAllAxesY) + 20
    let data = this.data
    let section = this.section
    let self = this
    // let bar  = section.selectAll('div')
    //             .data(data)
    //             .enter()
    let wchart = this.widthAxe
    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%20 == 0 ) {

        axeY.push(i)
      }
    }
    this.createAxisYLines(axeY, max)
    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    var indexbar = 0
    var widthcontainer =  parseInt($(this.container).find('#charts').css('width'))
    var heightcontainer =  parseInt($(this.container).find('#charts').css('height')) - 42
    section.append('div')
            .style('position', 'absolute')
            .style('width', widthcontainer+'px')
            .style('height', heightcontainer+'px')
            .style('bottom', '42px')
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
                  let x = (wchart*indexbar) 
                  return x+'px'
                })
                .style('height', '100%')
                
      bar.append('span')
          .text(key)
          .style('position', 'absolute')
          .style('top', '102%')
          .style('font-size', self.fontSizeLabel+'px')
          .style('color', self.colorLabel)
          .style('z-index', '55')
      // Arriba 3dstackedbar

      var front = bar.selectAll('div')
        .data(data[key])
        .enter().append('div')
        .style('width', wchart + 'px')
        .style('height', function(d){
          // parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) + 'px'
          // let y = parseInt(h/(max) * d.axeY) + 'px'
          let y = parseInt((h-42)/(max) * d.axeY) + 'px'
          return y
        })
        .style('position', 'absolute')
        .style('bottom', 0)
        .style('left', function(d, i){
          let x =  wchart*i
          indexbar++
          return x+'px'
        })
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
        .style('z-index','53')

      // Arriba
      front.append('div')
          .style('width', '100%')
          .style('height', wchart+ 'px')
          .style('border-radius', '50%')
          .style('position', 'absolute')
          .style('top',  -wchart/2+'px')
          .style('left', 0)
          .style('background', function(d, i){
            // var i = i + 1
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
                    var t = `${self.modColor(0.7, c)} 100% `
                  }
                  x++
                  return t
                })
                var bg = `linear-gradient(${self.gradientAngle-180}deg, ${colors.join('')})`
                debugger
                return bg
              } else {
                var bg = self.modColor(0.5, self.palette[i][0])
                return bg
              }
            }
          })
          .style('transform-origin', 'center')
          .style('transform','rotateX(-45deg)')
          .style('z-index','54')


      front.append('div')
          .style('width', '100%')
          .style('height', wchart+ 'px')
          .style('border-radius', '50%')
          .style('position', 'absolute')
          .style('bottom',  -wchart/2+'px')
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
                var bg = `linear-gradient(${self.gradientAngle-180}deg, ${colors.join('')})`
                return bg
              } else {
                var bg = self.palette[i][0]
                return bg
              }
            }
          })
          .style('transform-origin', 'center')
          .style('transform','rotateX(-45deg)')
          .style('z-index','54')




      front.append('span')
          .text(function(d) {
            return d.axeY
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
          
      front.append('span')
          .text(function(d) {
            return d.axisLabel
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
      
 
      indexbar++
      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0
      posYr = 0
      posYt = 0

    }
  }
 
 

  createBars () {
    let h = this.height*1
    let w = this.width*1
    let max = Math.round(this.maxAllAxesY) + 20
    let data = this.data
    let section = this.section
    let self = this
    // let bar  = section.selectAll('div')
    //             .data(data)
    //             .enter()
    let wchart = this.widthAxe
    let axeY = []
    for (let i = 0; i <= max; i++) {
      if(i%20 == 0 ) {

        axeY.push(i)
      }
    }
    this.createAxisYLines(axeY, max)
    let wacum = 0
    let counterLabel = 0
    let poinacum = 0
    let posY = 0
    let posYr = 0
    let posYText = 0
    let posYt = 0
    var indexbar = 0
    var widthcontainer =  parseInt($(this.container).find('#charts').css('width'))
    var heightcontainer =  parseInt($(this.container).find('#charts').css('height')) - 42
    section.append('div')
            .style('position', 'absolute')
            .style('width', widthcontainer+'px')
            .style('height', heightcontainer+'px')
            .style('bottom', '42px')
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
                  let x = (wchart*indexbar) 
                  return x+'px'
                })
                .style('height', '100%')
                
      bar.append('span')
          .text(key)
          .style('position', 'absolute')
          .style('top', '102%')
          .style('font-size', self.fontSizeLabel+'px')
          .style('color', self.colorLabel)
          .style('z-index', '55')
      // Arriba 3dstackedbar

      var front = bar.selectAll('div')
        .data(data[key])
        .enter().append('div')
        .style('width', wchart + 'px')
        .style('height', function(d){
          // parseInt((h-42)/(self.maxAcumAxesY + 42) * d.axeY) + 'px'
          // let y = parseInt(h/(max) * d.axeY) + 'px'
          let y = parseInt((h-42)/(max) * d.axeY) + 'px'
          return y
        })
        .style('position', 'absolute')
        .style('bottom', 0)
        .style('left', function(d, i){
          let x =  wchart*i
          indexbar++
          return x+'px'
        })
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
        .style('z-index','53')

      front.append('span')
          .text(function(d) {
            return d.axeY
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
          
      front.append('span')
          .text(function(d) {
            return d.axisLabel
          })
          .style('color', self.colorTextAxisX)
          .style('font-size', self.fontSizeAxisX+'px')
          .style('position', 'relative')
          .style('z-index', '55')
      
 
      indexbar++
      counterLabel++
      wacum += wchart
      posY = 0
      posYText = 0
      posYr = 0
      posYt = 0

    }
  }
  get printData () {
    console.log(this.data)
  }
}
