function Tags() {

  var container;

  var fontsize = d3.scale.linear().range([11, 23])

  var filter = { emigrationverfolgung: false, vorbesitzerin: false };
  var kaufer = [];
  var lock = false

  function tags() { }

  tags.init = function (_data, config) {
    console.log("init tags", _data, config)
    data = _data;

    container = d3.select("#kaufer");

    kaufer = d3.nest()
      .key(function (d) { return d.vorbesitzerin; })
      .entries(data)
      .sort(function (a, b) {
        return b.values.length - a.values.length;
      })
    console.log(kaufer)

    fontsize.domain(d3.extent(kaufer, function (d) { return d.values.length; }))

    container.select(".list")
      .selectAll(".kaufer")
      .data(kaufer)
      .enter()
      .append("div")
      .classed("kaufer", true)
      .text(function (d) {
        return d.key// + " " + d.values.length + "";
      })
      .style("font-size", function (d) {
        return fontsize(d.values.length) + "px";
      })
      .on("click", function (d) {
        lock = true;
        filter.vorbesitzerin = filter.vorbesitzerin == d.key ? false : d.key;
        tags.filter();
        tags.update();
        lock = false;
      })
      .on("mouseenter", function (d) {
        if (lock) return;
        tags.filter({ ...filter, vorbesitzerin: d.key });
      })
      .on("mouseleave", function (d) {
        if (lock) return;
        tags.filter();
      })

    container.select("#kauferemi")
      .on("change", function () {
        var isChecked = d3.select(this).property("checked");
        filter.emigrationverfolgung = isChecked ? "JA" : false;
        tags.filter();
      })
  }

  tags.update = function () {
    container.select(".list")
      .selectAll(".kaufer")
      .classed("active", function (d) {
        return filter.vorbesitzerin == d.key;
      })
  }

  tags.filter = function (highlight) {
    console.log("update filter", filter)

    var filters = Object.entries(highlight || filter).filter(function (d) { return d[1]; })
    console.log(filters)
    data.forEach(function (d) {
      var active = filters.filter(function (f) {
        return d[f[0]] == f[1];
      }).length == filters.length;

      if (highlight) {
        d.highlight = active;
      } else {
        d.active = d.highlight = active;
      }
    })
    canvas.highlight();
    if (!highlight) canvas.project();
  }


  return tags;
}