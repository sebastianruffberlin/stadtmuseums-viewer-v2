function Tags() {

  var containerVorbesitzerin;

  var fontsize = d3.scale.linear().range([11, 23])

  var filter = { emigrationverfolgung: [], vorbesitzerin: [], alteanonymemoderne: [] };
  var lock = false

  function addOrRemove(array, value) {
    array = array.slice();
    var index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(value);
    }
    return array;
  }

  function tags() { }

  tags.updateFilter = function updateFilter() {
    alteanonymemoderneData = d3.nest()
      .key(function (d) { return d.alteanonymemoderne; })
      .entries(data.filter(function (d) { return d.active; }));

    alteanonymemoderneContainer = d3.select(".alteanonymemoderne .items");
    var selection = alteanonymemoderneContainer
      .selectAll(".item")
      .data(alteanonymemoderneData, function (d) { return d.key; });

    selection
      .enter()
      .append("div")
      .classed("item", true)
      .text(function (d) {
        return d.key;
      })
      .on("click", function (d) {
        lock = true;
        filter.alteanonymemoderne = addOrRemove(filter.alteanonymemoderne, d.key);
        tags.filter();
        tags.update();
        lock = false;
      });

    selection.exit()
      .classed("active", false)
      .classed("hide", true)

    selection.classed("active", function (d) {
      return filter.alteanonymemoderne.indexOf(d.key) > -1;
    }).classed("hide", false)
  }

  tags.init = function (_data, config) {
    // console.log("init tags", _data, config)
    data = _data;

    tags.updateFilter()

    vorbesitzerinData = d3.nest()
      .key(function (d) { return d.vorbesitzerin; })
      .entries(data)
      .sort(function (a, b) {
        return b.values.length - a.values.length;
      })

    fontsize.domain(d3.extent(vorbesitzerinData, function (d) { return d.values.length; }))

    containerVorbesitzerin = d3.select(".verkaufer .list");
    containerVorbesitzerin
      .selectAll(".item")
      .data(vorbesitzerinData, function (d) { return d.key; })
      .enter()
      .append("div")
      .classed("item", true)
      .text(function (d) {
        return d.key// + " " + d.values.length + "";
      })
      .style("font-size", function (d) {
        return fontsize(d.values.length) + "px";
      })
      .on("click", function (d) {
        lock = true;
        filter.vorbesitzerin = addOrRemove(filter.vorbesitzerin, d.key);
        tags.filter();
        tags.update();
        lock = false;
      })
      .on("mouseenter", function (d) {
        if (lock) return;
        filtercopy = Object.assign({}, filter);
        filtercopy.vorbesitzerin = addOrRemove(filter.vorbesitzerin, d.key)
        tags.filter(filtercopy);
      })
      .on("mouseleave", function (d) {
        if (lock) return;
        tags.filter();
      })

    // container.select("#kauferemi")
    //   .on("change", function () {
    //     var isChecked = d3.select(this).property("checked");
    //     // filter.emigrationverfolgung = isChecked ? "JA" : false;
    //     tags.filter();
    //   })
  }


  tags.update = function () {
    containerVorbesitzerin
      .selectAll(".item")
      .classed("active", function (d) {
        return filter.vorbesitzerin.indexOf(d.key) > -1;
      })

    tags.updateFilter();
  }

  tags.filter = function (highlight) {
    console.log("update filter", filter, highlight)

    var filters = Object.entries(highlight || filter).filter(function (d) { return d[1].length; })
    // console.log(filters)
    data.forEach(function (d) {
      var active = filters.filter(function (f) {
        return f[1].indexOf(d[f[0]]) > -1;
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