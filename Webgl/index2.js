(function(global) {

  var canvas, gl, program;

  glUtils.SL.init({ callback:function() { main(); } });

	
  function main() {
    window.addEventListener('resize', resizer);

    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    initGlSize();
	
    //shaders
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    resizer();
  }

  function initGlSize() {
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    if (width) {
      gl.maxWidth = width;
    }
    if (height) {
      gl.maxHeight = height;
    }
  }

  // dibujar el objeto
  function draw() {
    var n = initBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
	  
	drawTriangle();
	var triangleVertices = new Float32Array([
      +0.5, -0.5,  0.0, 0.25,  +0.5, 0.0
    ]);
	drawA(gl.TRIANGLES, triangleVertices);
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }

  function initBuffers() {
    var vertexBuffer = gl.createBuffer(),
        vertices = [],
        vertCount = 2;
    for (var i=0.0; i<=360; i+=1) {
      var j = i * Math.PI / 180;
      
      var vert1 = [
        Math.sin(j)*0.5,//X
        Math.cos(j)*0.3,//Y
      ];
      var vert2 = [
        0,
        0,
      ];
      vertices = vertices.concat(vert1);
      vertices = vertices.concat(vert2);
    }
    var n = vertices.length / vertCount;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, vertCount, gl.FLOAT, false, 0, 0);

    return n;
  }
  
  function drawTriangle() {
    var n = initTriangleBuffers();
    if (n < 0) {
      console.log('Error vertices');
      return;
    }
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
  
    function initTriangleBuffers() {
    var vertices = new Float32Array([
      +0.9, -1,  0.0, 0.0,  +0.5, 0.0
    ]);
    var n = 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function resizer() {
    var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
    if (!width || width < 0) {
      canvas.width = window.innerWidth;
      gl.maxWidth = window.innerWidth;
    }
    if (!height || height < 0) {
      canvas.height = window.innerHeight;
      gl.maxHeight = window.innerHeight;
    }

    var min = Math.min.apply( Math, [gl.maxWidth, gl.maxHeight, window.innerWidth, window.innerHeight]);
    canvas.width = min;
    canvas.height = min;
	
    draw();
  }

})(window || this);
