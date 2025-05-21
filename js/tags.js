function Tags() {

  var fontsize = d3.scale.linear().range([8, 17])

  // MODIFIED: Filter object updated to only include 'geschlecht'
  var filter = { geschlecht: [] };
  var lock = false;
  var data;
  // MODIFIED: sortArrays updated to include only 'geschlecht'
  var sortArrays = {
    geschlecht: ["Mann", "Frau"]
  }
  // MODIFIED: removeKeys array is now empty as Kunsthaus-specific filters are removed
  var removeKeys = []; // No longer needed for 'besitz' filter

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

  tags.updateDom = function updateDom(key, filteredData) {

    // REMOVED: Kunsthaus-specific logic for 'vorbesitzerin' font sizing
    // if (key === "vorbesitzerin") {
    //   console.log("updateDom", key, filteredData)
    //   fontsize.domain(d3.extent(filteredData, function (d) { return d.size; }))
    // }

    // REMOVED: Kunsthaus-specific logic for 'besitz' filter data cleaning
    // if (key === "besitz") {
    //   filteredData = filteredData.filter(function (d) { return removeKeys.indexOf(d.key) == -1; })
    // }

    if (sortArrays[key]) {
      var sorted = sortArrays[key]
      filteredData.sort(function (a, b) {
        return sorted.indexOf(a.key) - sorted.indexOf(b.key)
      })
    }

    // This targets the HTML element with the class matching the key (e.g., '.geschlecht')
    var container = d3.select("." + key);
    var selection = container
      .selectAll(".item")
      .data(filteredData, function (d) { return d.key; });

    selection
      .enter()
      .append("div")
      .classed("item", true)
      // REMOVED: Kunsthaus-specific classes like 'spacer' and 'raubkunst'
      // .classed("spacer", function (d) {
      //   return d.key === "Fälschung";
      // })
      .text(function (d) {
        return d.key;
      })
      .on("click", function (d) {
        lock = true;
        filter[key] = addOrRemove(filter[key], d.key);
        tags.filter(); // Re-evaluate and apply filters
        tags.update(); // Re-render filter buttons
        lock = false;
      })
      // MODIFIED: Apply font-size filter to 'geschlecht'
      .filter(function (d) {
        return key === "geschlecht"; // Apply dynamic font sizing to 'geschlecht' filter buttons
      })
      .style("font-size", function (d) {
        return fontsize(d.size) + "px";
      })

    selection.exit()
      .classed("active", false)
      .classed("hide", true)
      // MODIFIED: Apply font-size filter to 'geschlecht'
      .filter(function (d) {
        return key === "geschlecht";
      })
      .remove()
      .style("font-size", function (d) {
        return "11px";
      })


    selection
      .classed("active", function (d) {
        return filter[key].indexOf(d.key) > -1;
      })
      .classed("hide", false)
      // MODIFIED: Apply font-size filter to 'geschlecht'
      .filter(function (d) {
        return key === "geschlecht";
      })
      .style("font-size", function (d) {
        return fontsize(d.size) + "px";
      })
      .sort(function (a, b) {
        return b.size - a.size;
      })
  }

  tags.resize = function resize() {
    // Ensure filters update on resize
    tags.updateFilters();
  }

  tags.updateFilters = function updateFilters() {

    // Use Object.keys(filter) to get all defined filter categories (e.g., ['geschlecht'])
    var filtersToUpdate = Object.keys(filter);

    for (var a = 0; a < filtersToUpdate.length; a++) {
      var currentFilterKey = filtersToUpdate[a];
      var index = {};

      var otherActiveFilters = Object.entries(filter).filter(function (d) {
        return d[0] !== currentFilterKey && d[1].length > 0;
      });

      // Iterate through all data items to count how many belong to each value of currentFilterKey,
      // considering other active filters.
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var hit = otherActiveFilters.filter(function (otherFilterEntry) {
          return otherFilterEntry[1].indexOf(d[otherFilterEntry[0]]) > -1;
        }).length == otherActiveFilters.length;

        if (hit) {
          var itemValue = d[currentFilterKey];
          if (itemValue !== undefined && itemValue !== null && itemValue !== "") {
            index[itemValue] = ++index[itemValue] || 1;
          }
        }
      }

      var filteredDataForDom = Object.keys(index)
        .map(function (d) { return { key: d, size: index[d] }; })
        .sort(function (a, b) { return b.size - a.size; })
        .filter(function (d) { return d.key != "" && d.key != "undefined"; });

      tags.updateDom(currentFilterKey, filteredDataForDom);
    }
  }

  tags.init = function (_data, config) {
    data = _data;
    tags.updateFilters(); // Initialize and draw the filter buttons
  }

  tags.update = function () {
    // This `update` function primarily triggers re-calculation and re-rendering of the filter buttons.
    tags.updateFilters();
    // After filters are updated, trigger canvas update as well
    canvas.highlight();
    canvas.project();
  }

  tags.reset = function () {
    // MODIFIED: Reset the filter object to only include 'geschlecht'
    filter = { geschlecht: [] };
    tags.filter(); // Apply the reset
    tags.update(); // Update the UI
  }

  tags.filter = function (highlight) {
    // d3.select(".infobar").classed("sneak", true); // Keep this if you want the infobar to sneak away on filter change

    var filtersToApply = Object.entries(highlight || filter).filter(function (d) { return d[1].length; })

    data.forEach(function (d) {
      var active = filtersToApply.filter(function (f) {
        return f[1].indexOf(d[f[0]]) > -1;
      }).length == filtersToApply.length;

      if (highlight) {
        d.highlight = active;
      } else {
        d.active = d.highlight = active;
      }
    })
    canvas.highlight();
    if (!highlight) canvas.project();
  }

  tags.search = function (query) {
    // Add search functionality here if needed
    // Example:
    // if (query) {
    //    // Implement search logic, e.g., filter 'data' based on 'query'
    //    // Update d.active/d.highlight based on search results
    // }
    // tags.filter();
    // tags.update();
  }

  return tags;
}