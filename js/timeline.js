function Pricescale() {
  var container;
  var yscale = d3.scale.linear();
  var extent;
  var disabled = false;
  var ticks = [];
  var numTicks = 6;
  var tickFormat = d3.format(".2s");

  function pricescale() { }

  pricescale.init = function () {
    if (!d3.select(".pricescale").empty()) {
      d3.select(".pricescale").remove();
    }
    container = d3.select(".viz").append("div").classed("pricescale", true);
    container.style(
      "transform",
      "translate(" + canvas.margin.left + "px," + 0 + "px)"
    );
  };

  pricescale.setDisabled = function (d) {
    disabled = d;
    container.style("display", disabled ? "none" : "block");
  }

  pricescale.updateDomain = function (_range, _extent) {
    yscale.range(_range).domain(_extent);
    ticks = yscale.ticks(numTicks)
      .filter(function (d) { return d != 0; });
    // remove first tick
    //ticks.shift();
    // var endTick = Math.ceil(_extent[1] / ticks[0]) * ticks[0];
    // console.log("endTick", endTick);
    // ticks.push(endTick);
    console.log("pricescale updateDomain", yscale, _extent, ticks);
    pricescale.update();
  }

  pricescale.update = function (x1, x2, scale, translate) {
    if (disabled || !translate) return;
    // console.log("pricescale update", scale, translate);
    var y0 = -1 * translate[1] || 0;
    var timeY =
      canvas.height() * scale -
      -1 * translate[1] +
      canvas.rangeBandImage() * scale;

    var select = container.selectAll(".container").data(ticks, function (d, i) { return i; });

    container
      .style("transform", "translate3d(" + canvas.margin.left + "px," + timeY + "px, 0px)");

    var enter = select
      .enter()
      .append("div")
      .classed("container", true);

    enter
      .append("div")
      .classed("price", true)
      .text(function (d) {
        return tickFormat(d);
      });

    select
      .style("transform", function (d) {
        var y =  -yscale(d);
        y = y * scale;
        return "translate3d(0px," + y + "px,0px)";
      })
      .text(function (d) {
        return tickFormat(d);
      });

    select.exit().remove();

  };

  return pricescale;
};


function Timeline() {
  var fontScaleYear = d3.scale
    .linear()
    .domain([1, 9])
    .range([7, 20])
    .clamp(true);

  var timelineFontScale = d3.scale
    .linear()
    .domain([40, 8])
    .range([2, 10])
    .clamp(true);

  var timelineScale = d3.scale
    .threshold()
    .domain([3, 10, 20])
    .range(["none", "small", "middle", "large"]);

  var timelineHover = false;
  var container;
  var timeDomain;
  var fontSize = 1;
  var disabled = false;

  function timeline() { }

  timeline.init = function (_timeDomain) {
    timeDomain = _timeDomain;
    if (!d3.select(".timeline").empty()) {
      d3.select(".timeline").remove();
    }
    container = d3.select(".viz").append("div").classed("timeline", true);
    container.style(
      "transform",
      "translate(" + 0 + "px," + (canvas.height() - 30) + "px)"
    );

  };

  timeline.rescale = function (scale) {
    timeDomain.forEach(function (d) {
      d.x = canvas.x(d.key);
    });
    fontSize = timelineFontScale(scale);
  };

  timeline.setDisabled = function (d) {
    disabled = d;
    container.style("display", disabled ? "none" : "block");
  };

  timeline.update = function (x1, x2, scale, translate) {
    if (disabled) return;

    timeDomain.forEach(function (d) {
      d.pos = (d.x - x1) * scale;
      d.visible =
        d.pos > -canvas.rangeBand() * scale && d.pos < canvas.width() + 100;
    });

    var timeY =
      canvas.height() * scale -
      -1 * translate[1] -
      canvas.rangeBandImage() * scale;

    container
      .attr("class", "timeline " + timelineScale(scale * (fontSize / 2)))
      .style("font-size", function () {
        return fontSize * scale + "px";
      })
      .style("transform", "translate3d(" + 0 + "px," + timeY + "px, 0px)");

    var select = container.selectAll(".container").data(timeDomain);

    var enter = select
      .enter()
      .append("div")
      .classed("container", true)
      .on("mouseenter", function (d) {
        timelineHover = true;
        canvas.zoom.center(null);
        // canvas.selectedImage() = null;
      })
      .on("mouseleave", function (d) {
        timelineHover = false;
      });

    enter
      .append("div")
      .classed("year", true)
      .text(function (d) {
        return d.key;
      });

    var e = enter
      .append("div")
      .classed("entries", true)
      .selectAll(".entry")
      .data(function (d) {
        return d.values;
      })
      .enter()
      .append("div")
      .classed("entry", true);

    e.append("div")
      .classed("small", true)
      .append("div")
      .classed("title", true)
      .text(function (d) {
        return d.titel;
      });

    var m = e.append("div").classed("middle", true);

    m.append("div")
      .classed("title", true)
      .text(function (d) {
        return d.titel;
      });

    m.append("div")
      .classed("text", true)
      .text(function (d) {
        return d.text + ".";
      }); //…

    var l = e.append("div").classed("large", true);

    l.append("div")
      .classed("title", true)
      .text(function (d) {
        return d.titel;
      });

    l.append("div")
      .classed("text", true)
      .html(function (d) {
        return d.text + ".<br><br>" + d.extra;
      });

    select
      .style("transform", function (d) {
        return "translate3d(" + parseInt(d.pos) + "px,0px,0px)";
      })
      .style("height", canvas.rangeBand() * scale + "px")
      .style("width", canvas.rangeBand() * scale + "px")
      .style("display", function (d, i) {
        var width = canvas.rangeBand() * scale;
        var hideBecauseOfSpace = width / d.key.length > 5 || i % 2 == 0;
        return hideBecauseOfSpace && d.visible ? "block" : "none";
      });

    select.select(".year").style("font-size", fontScaleYear(scale) + "px");
  };

  return timeline;
}

