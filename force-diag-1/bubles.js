(function() {
  var width = 900;
  var height = 500;

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)");

  var imgPattern = svg
    .append("defs")
    .append("pattern")
    .attr("id", "kohli")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("patternUnits", "objectBoundingBox")
    .append("image")
    .attr("width", 1)
    .attr("height", 1)
    .attr("xlink:href", "kohli.jpg");
  //" + width / 2 + "," + height / 2 + "
  var radiusScale = d3
    .scaleSqrt()
    .domain([40, 400])
    .range([10, 90]);

  var forceX = d3
    .forceX(function(d) {
      if (d.decade === "pre-2000") {
        return 200;
      } else {
        return 800;
      }
      //return width / 2;
    })
    .strength(0.05);

  var forceY = d3
    .forceY(function() {
      return height / 2;
    })
    .strength(0.05);

  var forceCollide = d3.forceCollide(function(d) {
    console.log(d);
    return radiusScale(d.sales) + 1;
  });

  // Simulation collection of forces
  /*
  on load push the bubbles to x and y with collide force 
  */
  var simulation = d3
    .forceSimulation()
    .force("x", forceX)
    .force("y", forceY)
    .force("collide", forceCollide);

  d3.select("#decade").on("click", () => {
    simulation
      .force("x", forceX)
      .force("y", forceY)
      .force(
        "collide",
        d3.forceCollide(function(d) {
          //console.log(d);
          return radiusScale(d.sales) + 1;
        })
      )
      .alphaTarget(0.5)
      .restart();
  });

  d3.select("#combine").on("click", () => {
    simulation
      .force("x", d3.forceX(width / 2).strength(0.04))
      .force("y", d3.forceY(height / 2).strength(0.04))
      .force(
        "collide",
        d3.forceCollide(function(d) {
          //console.log(d);
          return radiusScale(d.sales) + 1;
        })
      )
      .alphaTarget(0.2)
      .restart();
  });

  d3.queue()
    .defer(d3.csv, "sales.csv")
    .await(ready);

  function ready(error, datapoints) {
    var circles = svg
      .selectAll(".artist")
      .data(datapoints)
      .enter()
      .append("circle")
      .attr("class", "artist")
      .attr("r", function(d) {
        return radiusScale(d.sales);
      })
      .attr("fill", "lightblue")
      .on("click", function(d) {
        console.log(d.name);
      });

    simulation.nodes(datapoints).on("tick", ticked);

    function ticked() {
      circles
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        });
    }
  }
})();
