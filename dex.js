var dex = {
    version: "0.6"
};

dex.array = {};

dex.array.slice = function(array, rows) {
    var slice = [];
    for (var i = 0; i < rows.length; i++) {
        slice.push(array[rows[i]]);
    }
    return slice;
};

dex.array.extent = function(array, indices) {
    var values = getArrayValues(array, indices);
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    console.log("EXTENT:");
    console.dir(values);
    console.dir([ min, max ]);
    return [ min, max ];
};

dex.color = {};

dex.color.toHex = function(color) {
    if (color.substr(0, 1) === "#") {
        return color;
    }
    var digits = /rgb\((\d+),(\d+),(\d+)\)/.exec(color);
    var red = parseInt(digits[1]);
    var green = parseInt(digits[2]);
    var blue = parseInt(digits[3]);
    var rgb = blue | green << 8 | red << 16;
    return "#" + rgb.toString(16);
};

dex.color.colorScheme = function(colorScheme, numColors) {
    if (colorScheme == "1") {
        return d3.scale.category10();
    } else if (colorScheme == "2") {
        return d3.scale.category20();
    } else if (colorScheme == "3") {
        return d3.scale.category20b();
    } else if (colorScheme == "4") {
        return d3.scale.category20c();
    } else if (colorScheme == "HiContrast") {
        return d3.scale.ordinal().range(colorbrewer[colorScheme][9]);
    } else if (colorScheme in colorbrewer) {
        var effColors = Math.pow(2, Math.ceil(Math.log(numColors) / Math.log(2)));
        if (effColors > 128) {
            effColors = 256;
        }
        for (var c = effColors; c >= 2; c--) {
            if (colorbrewer[colorScheme][c]) {
                return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
            }
        }
        for (var c = effColors; c <= 256; c++) {
            if (colorbrewer[colorScheme][c]) {
                return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
            }
        }
        return d3.scale.category20();
    } else {
        return d3.scale.category20();
    }
};

dex.console = {};

dex.console.log = function() {
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == "object") {
            console.dir(arguments[i]);
        } else {
            console.log(arguments[i]);
        }
    }
    return this;
};

dex.csv = {};

dex.csv.csv = function(header, data) {
    return {
        header: header,
        data: data
    };
};

dex.csv.createMap = function(csv, keyIndex) {
    var map = {};
    for (var ri = 0; ri < csv.data.length; ri++) {
        if (csv.data[ri].length == csv.header.length) {
            var rowMap = {};
            for (var ci = 0; ci < csv.header.length; ci++) {
                rowMap[csv.header[ci]] = csv.data[ri][ci];
            }
            map[csv.data[ri][keyIndex]] = rowMap;
        }
    }
    return map;
};

dex.csv.toJson = function(csv, rowIndex, columnIndex) {
    var jsonData = [];
    if (arguments.length == 3) {
        var jsonRow = {};
        jsonRow[csv.header[columnIndex]] = csv.data[rowIndex][columnIndex];
        return jsonRow;
    } else if (arguments.length == 2) {
        var jsonRow = {};
        for (var ci = 0; ci < csv.header.length; ci++) {
            jsonRow[csv.header[ci]] = csv.data[rowIndex][ci];
        }
        return jsonRow;
    } else {
        for (var ri = 0; ri < csv.data.length; ri++) {
            var jsonRow = {};
            for (var ci = 0; ci < csv.header.length; ci++) {
                jsonRow[csv.header[ci]] = csv.data[ri][ci];
            }
            jsonData.push(jsonRow);
        }
    }
    return jsonData;
};

dex.csv.createRowMap = function(csv, keyIndex) {
    var map = {};
    for (var ri = 0; ri < csv.data.length; ri++) {
        if (csv.data[ri].length == csv.header.length) {
            map[csv.data[ri][keyIndex]] = csv.data[ri];
        }
    }
    return map;
};

dex.csv.getNumericColumnNames = function(csv) {
    var possibleNumeric = {};
    var i, j;
    var numericColumns = [];
    for (i = 0; i < csv.header.length; i++) {
        possibleNumeric[csv.header[i]] = true;
    }
    for (ri = 0; ri < csv.data.length; ri++) {
        for (ci = 0; ci < csv.data[ri].length && ci < csv.header.length; ci++) {
            if (possibleNumeric[csv.header[ci]] && !dex.object.isNumeric(csv.data[ri][ci])) {
                possibleNumeric[csv.header[ci]] = false;
            }
        }
    }
    for (ci = 0; ci < csv.header.length; ci++) {
        if (possibleNumeric[csv.header[ci]]) {
            numericColumns.push(csv.header[ci]);
        }
    }
    return numericColumns;
};

dex.csv.getNumericIndices = function(csv) {
    var possibleNumeric = {};
    var i, j;
    var numericIndices = [];
    for (i = 0; i < csv.header.length; i++) {
        possibleNumeric[csv.header[i]] = true;
    }
    for (i = 1; i < csv.data.length; i++) {
        for (j = 0; j < csv.data[i].length && j < csv.header.length; j++) {
            if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j])) {
                possibleNumeric[csv.header[j]] = false;
            }
        }
    }
    for (i = 0; i < csv.header.length; i++) {
        if (possibleNumeric[csv.header[i]]) {
            numericIndices.push(i);
        }
    }
    return numericIndices;
};

dex.csv.isColumnNumeric = function(csv, columnNum) {
    for (var i = 0; i < csv.data.length; i++) {
        if (!dex.object.isNumeric(csv.data[i][columnNum])) {
            return false;
        }
    }
    return true;
};

dex.csv.toMapArray = function(csv) {
    var mapArray = [];
    for (var i = 0; i < csv.data.length; i++) {
        var row = {};
        for (var j = 0; j < csv.header.length; j++) {
            row[csv.header[j]] = csv.data[i][j];
        }
        mapArray.push(row);
    }
    return mapArray;
};

dex.datagen = {};

dex.datagen.randomMatrix = function(spec) {
    var matrix = [];
    var range = spec.max - spec.min;
    for (var ri = 0; ri < spec.rows; ri++) {
        var row = [];
        for (var ci = 0; ci < spec.columns; ci++) {
            row.push(Math.random() * range + spec.min);
        }
        matrix.push(row);
    }
    return matrix;
};

dex.json = {};

dex.json.toCsv = function(json, header) {
    var csv;
    var data = [];
    if (arguments.length == 2) {
        if (Array.isArray(json)) {
            for (var ri = 0; ri < json.length; ri++) {
                var row = [];
                for (var ci = 0; ci < header.length; ci++) {
                    row.push(json[ri][header[ci]]);
                }
                data.push(row);
            }
        } else {
            var row = [];
            for (var ci = 0; ci < header.length; ci++) {
                row.push(json[ri][header[ci]]);
            }
            data.push(row);
        }
        return dex.csv.csv(header, data);
    } else {
        return dex.json.toCsv(json, dex.json.keys(json));
    }
};

dex.json.keys = function(json) {
    var keyMap = {};
    var keys = [];
    if (Array.isArray(json)) {
        for (var ri = 0; ri < json.length; ri++) {
            for (var key in json[ri]) {
                keyMap[key] = true;
            }
        }
    } else {
        for (var key in json) {
            keyMap[key] = true;
        }
    }
    for (var key in keyMap) {
        keys.push(key);
    }
    return keys;
};

dex.matrix = {};

dex.matrix.slice = function(matrix, columns, rows) {
    var slice = [];
    if (arguments.length === 3) {
        for (var ri = 0; ri < rows.length; ri++) {
            slice.push(dex.array.slice(matrix[rows[ri]]));
        }
    } else {
        for (var ri = 0; ri < matrix.length; ri++) {
            slice.push(dex.array.slice(matrix[ri], columns));
        }
    }
    return slice;
};

dex.matrix.flatten = function(matrix) {
    var array = [];
    for (var ri = 0; ri < matrix.length; ri++) {
        for (var ci = 0; ci < matrix[ri].length; ci++) {
            array.push(matrix[ri][ci]);
        }
    }
    return array;
};

dex.matrix.extent = function(data, indices) {
    var values = data;
    if (arguments.length === 2) {
        values = dex.matrix.slice(data, indices);
        return d3.extent(dex.matrix.flatten(values));
    }
};

dex.matrix.combine = function(matrix1, matrix2) {
    var result = [];
    for (var ri = 0; ri < matrix1.length; ri++) {
        for (var oci = 0; oci < matrix1[ri].length; oci++) {
            for (var ici = 0; ici < matrix2[ri].length; ici++) {
                result.push([ matrix1[ri][oci], matrix2[ri][ici], oci, ici ]);
            }
        }
    }
    return result;
};

dex.matrix.isColumnNumeric = function(data, columnNum) {
    for (var i = 1; i < data.length; i++) {
        if (!dex.object.isNumeric(data[i][columnNum])) {
            return false;
        }
    }
    return true;
};

dex.matrix.max = function(data, columnNum) {
    var maxValue = data[0][columnNum];
    if (dex.matrix.isColumnNumeric(data, columnNum)) {
        maxValue = parseFloat(data[0][columnNum]);
        for (var i = 1; i < data.length; i++) {
            if (maxValue < parseFloat(data[i][columnNum])) {
                maxValue = parseFloat(data[i][columnNum]);
            }
        }
    } else {
        for (var i = 1; i < data.length; i++) {
            if (maxValue < data[i][columnNum]) {
                maxValue = data[i][columnNum];
            }
        }
    }
    return maxValue;
};

dex.matrix.min = function(data, columnNum) {
    var minValue = data[0][columnNum];
    if (dex.matrix.isColumnNumeric(data, columnNum)) {
        minValue = parseFloat(data[0][columnNum]);
        for (var i = 1; i < data.length; i++) {
            if (minValue > parseFloat(data[i][columnNum])) {
                minValue = parseFloat(data[i][columnNum]);
            }
        }
    } else {
        for (var i = 1; i < data.length; i++) {
            if (minValue > data[i][columnNum]) {
                minValue = data[i][columnNum];
            }
        }
    }
    return minValue;
};

dex.object = {};

dex.object.clone = function(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    var clone = obj.constructor();
    for (var key in obj) {
        clone[key] = dex.object.clone(obj[key]);
    }
    return clone;
};

dex.object.overlay = function(top, bottom) {
    var overlay = dex.object.clone(bottom);
    if (top !== "undefined") {
        for (var prop in top) {
            if (typeof top[prop] == "object" && overlay[prop] != null && !(top[prop] instanceof Array)) {
                overlay[prop] = dex.object.overlay(top[prop], overlay[prop]);
            } else {
                overlay[prop] = top[prop];
            }
        }
    }
    return overlay;
};

dex.object.contains = function(container, obj) {
    var i = container.length;
    while (i--) {
        if (container[i] === obj) {
            return true;
        }
    }
    return false;
};

dex.object.setHierarchical = function(hierarchy, name, value, delimiter) {
    if (hierarchy == null) {
        hierarchy = {};
    }
    if (typeof hierarchy != "object") {
        return hierarchy;
    }
    if (arguments.length == 4) {
        return dex.object.setHierarchical(hierarchy, name.split(delimiter), value);
    } else {
        if (name.length == 1) {
            hierarchy[name[0]] = value;
        } else {
            if (!(name[0] in hierarchy)) {
                hierarchy[name[0]] = {};
            }
            dex.object.setHierarchical(hierarchy[name[0]], name.splice(1), value);
        }
    }
    return hierarchy;
};

dex.object.isNumeric = function(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
};

function DexComponent(userConfig, defaultConfig) {
    this.registry = {};
    this.debug = false;
    if (userConfig instanceof DexComponent) {
        this.config = dex.object.overlay(userConfig.config, defaultConfig);
    } else {
        this.config = dex.object.overlay(userConfig, defaultConfig);
    }
}

DexComponent.prototype.attr = function(name, value) {
    if (arguments.length == 1) {
        return this.config[name];
    } else if (arguments.length == 2) {
        dex.object.setHierarchical(this.config, name, value, ".");
    }
    return this;
};

DexComponent.prototype.dump = function(message) {
    console.log("========================");
    if (arguments.length == 1) {
        console.log(message);
        console.log("========================");
    }
    console.log("=== CONFIG ===");
    console.dir(this.config);
    console.log("=== REGISTRY ===");
    console.dir(this.registry);
};

DexComponent.prototype.addListener = function(eventType, target, method) {
    var targets;
    if (this.debug) {
        console.log("Registering Target: " + eventType + "=" + target);
    }
    if (!this.registry.hasOwnProperty(eventType)) {
        this.registry[eventType] = [];
    }
    this.registry[eventType].push({
        target: target,
        method: method
    });
};

DexComponent.prototype.notify = function(event) {
    var targets;
    if (this.debug) {
        console.log("notify: " + event.type);
    }
    if (!this.registry.hasOwnProperty(event.type)) {
        return;
    }
    event.source = this;
    targets = this.registry[event.type];
    for (var i = 0; i < targets.length; i++) {
        targets[i]["method"](event, targets[i]["target"]);
    }
};

DexComponent.prototype.render = function() {
    console.log("Rendering component...");
};

DexComponent.prototype.update = function() {
    console.log("Updating component...");
};

Series.prototype = new DexComponent();

Series.constructor = Series;

function Series(csv, userConfig) {
    DexComponent.call(this, userConfig, {
        name: "series",
        id: "Series",
        "class": "Series",
        csv: csv
    });
    this.series = this;
}

Series.prototype.name = function() {
    var series = this.series;
    var config = this.config;
    return config.name;
};

Series.prototype.csv = function() {
    var config = this.config;
    return config.csv;
};

Series.prototype.dimensions = function() {
    var csv = this.config.csv;
    console.log("CSV");
    console.dir(csv);
    return {
        rows: csv.data.length,
        columns: csv.header.length
    };
};

Series.prototype.value = function(rowIndex, columnIndex) {
    var csv = this.config.csv;
    if (arguments.length == 2) {
        return csv.data[rowIndex][columnIndex];
    }
    return csv.data[rowIndex];
};

Series.prototype.jsonValue = function(rowIndex, columnIndex) {
    var csv = this.config.csv;
    if (arguments.length == 2) {
        return dex.csv.toJson(csv, rowIndex, columnIndex);
    } else if (arguments.length == 1) {
        return dex.csv.toJson(csv, rowIndex);
    }
    return dex.csv.toJson(csv);
};