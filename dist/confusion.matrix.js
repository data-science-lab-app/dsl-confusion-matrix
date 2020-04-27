"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_science_lab_core_1 = require("data-science-lab-core");
;
var ConfusionMatrix = /** @class */ (function (_super) {
    __extends(ConfusionMatrix, _super);
    function ConfusionMatrix() {
        var _this = _super.call(this) || this;
        _this.options = new ConfusionMatrixPluginOptions(_this);
        _this.inputs = new ConfusionMatrixPluginInputs(_this);
        _this.expected = [];
        _this.predicted = [];
        _this.title = 'Confusion Matrix';
        return _this;
    }
    ConfusionMatrix.prototype.getOptions = function () {
        return this.options;
    };
    ConfusionMatrix.prototype.getInputs = function () {
        return this.inputs;
    };
    ConfusionMatrix.prototype.visualization = function () {
        var binary = this.isBinary();
        var matrix = this.getConfusionMatrix();
        return "<!DOCTYPE html>\n        <html>\n        <head>\n            <meta charset=\"utf-8\">\n            <style>\n                body {\n                    font-family: Arial, Helvetica, sans-serif;\n                }\n                table,\n                th,\n                td {\n                    border: 1px solid transparent;\n                    text-align: center;\n                    font-weight: normal;\n                    font-size: xx-large;\n                }\n                th,\n                td {\n                    padding: 10px;\n                }\n                td {\n                    background: rgb(251, 229, 214);\n                }\n                .downward span {\n                    writing-mode: vertical-lr;\n                    -webkit-writing-mode: vertical-lr;\n                    -ms-writing-mode: vertical-lr;\n                    text-align: center;\n                }\n                .gold {\n                    background: rgb(215, 183, 64);\n                    color: white;\n                    font-weight: bolder;\n                }\n                .dark-blue {\n                    background: #3ad8ff;\n                    color: white;\n                    font-weight: bolder;\n                }\n                .blue {\n                    background: rgb(218, 227, 243);\n                    color: black;\n                }\n                .green {\n                    background: rgb(197, 224, 180);\n                }\n            </style>\n        </head>\n        \n        <body>\n            " + this.getConfusionMatrixTable(binary, matrix) + "\n            " + this.getReport(binary, matrix) + "\n        </body>";
    };
    ConfusionMatrix.prototype.getConfusionMatrix = function () {
        var set = new Set();
        for (var i = 0; i < this.expected.length; ++i) {
            set.add(this.expected[i]);
            set.add(this.predicted[i]);
        }
        var labels = Array.from(set).sort(function (a, b) { return a - b; });
        var values = Array(labels.length).fill([]).map(function (value) { return Array(labels.length).fill(0); });
        var correct = 0.0;
        for (var i = 0; i < this.expected.length; ++i) {
            var expected = labels.indexOf(this.expected[i]);
            var predicted = labels.indexOf(this.predicted[i]);
            correct += this.expected[i] === this.predicted[i] ? 1 : 0;
            values[predicted][expected] += 1.0;
        }
        return {
            labels: labels,
            values: values,
            accuracy: correct / this.expected.length
        };
    };
    ConfusionMatrix.prototype.getConfusionMatrixTable = function (isBinary, matrix) {
        if (isBinary) {
            return "\n            <table>\n                <thead>\n                    <tr>\n                        <th colspan=\"2\" rowspan=\"2\" class=\"dark-blue\">\n                            " + this.title + "\n                        </th>\n                        <th colspan=\"2\" class=\"gold\">\n                            Expected\n                        </th>\n                    </tr>\n                    <tr>\n                        <th class=\"blue\">Positive</th>\n                        <th class=\"blue\">Negative</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td class=\"downward gold\" rowspan=\"2\">\n                            <span>Predicted</span>\n                        </td>\n                        <td class=\"blue\">Positive</td>\n                        <td class=\"green\">" + matrix.values[1][1] + "</td>\n                        <td>" + matrix.values[1][0] + "</td>\n                    </tr>\n                    <tr>\n                        <td class=\"blue\">Negative</td>\n                        <td>" + matrix.values[0][1] + "</td>\n                        <td class=\"green\">" + matrix.values[0][0] + "</td>\n                    </tr>\n                </tbody>\n            </table>";
        }
        else {
            return "\n                <table>\n                <thead>\n                    <tr>\n                        <th colspan=\"2\" rowspan=\"2\" class=\"dark-blue\">\n                            " + this.title + "\n                        </th>\n                        <th colspan=\"" + matrix.labels.length + "\" class=\"gold\">\n                            Expected\n                        </th>\n                    </tr>\n                    <tr>\n                        " + matrix.labels.map(function (value) { return "<td>" + value + "</td>"; }).join('\n') + "\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td class=\"downward gold\" rowspan=\"" + matrix.labels.length + "\">\n                            <span>Predicted</span>\n                        </td>\n                        <td class=\"blue\">" + matrix.labels[0] + "</td>\n                        <td class=\"green\">" + matrix.values[0][0] + "</td>\n                        " + matrix.values[0].slice(1).map(function (value) { return "<td>" + value + "</td>"; }).join('\n') + "\n                    </tr>\n                    " + matrix.values.slice(1).map(function (row, index) { return "\n                            <tr>\n                                <td class=\"blue\">" + matrix.labels[index + 1] + "</td>\n                                " + row.map(function (value, cmpIndex) { return "<td class=\"" + (index + 1 === cmpIndex ? 'green' : '') + "\">" + value + "</td>"; }).join('\n') + "\n                            </tr>\n                        "; }).join('\n') + "\n                </tbody>\n                </table>\n            ";
        }
    };
    ConfusionMatrix.prototype.getReport = function (isBinary, matrix) {
        var _this = this;
        if (isBinary) {
            return "\n            <table>\n                <thead>\n                    <tr>\n                        <th rowspan=\"2\" class=\"dark-blue\">\n                            Report\n                        </th>\n                        <th colspan=\"4\" class=\"gold\">\n                            Accuracy " + matrix.accuracy * 100 + "%\n                        </th>\n                    </tr>\n                    <tr>\n                        <th class=\"blue\">Precision</th>\n                        <th class=\"blue\">Recall</th>\n                        <th class=\"blue\">F1-Score</th>\n                        <th class=\"blue\">Support</th>  \n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td class=\"blue\">0</td>\n                        <td>" + this.getPrecision(0, matrix) + "</td>\n                        <td>" + this.getRecall(0, matrix) + "</td>\n                        <td>" + this.getF1Score(0, matrix) + "</td>\n                        <td>" + this.getSupport(0, matrix) + "</td>\n                    </tr>\n                    <tr>\n                        <td class=\"blue\">1</td>\n                        <td>" + this.getPrecision(1, matrix) + "</td>\n                        <td>" + this.getRecall(1, matrix) + "</td>\n                        <td>" + this.getF1Score(1, matrix) + "</td>\n                        <td>" + this.getSupport(1, matrix) + "</td>\n                    </tr>\n                    <tr>\n                        <td class=\"blue\">avg / total</td>\n                        <td>" + this.getAvgPrecision(matrix) + "</td>\n                        <td>" + this.getAvgRecall(matrix) + "</td>\n                        <td>" + this.getAvgF1Score(matrix) + "</td>\n                        <td>" + this.getTotalSupport(matrix) + "</td>\n                    </tr>\n                </tbody>\n            </table>";
        }
        else {
            return "\n            <table>\n            <thead>\n            <tr>\n                <th rowspan=\"2\" class=\"dark-blue\">\n                    Report\n                </th>\n                <th colspan=\"4\" class=\"gold\">\n                    Accuracy " + matrix.accuracy * 100 + "%\n                </th>\n            </tr>\n            <tr>\n                <th class=\"blue\">Precision</th>\n                <th class=\"blue\">Recall</th>\n                <th class=\"blue\">F1-Score</th>\n                <th class=\"blue\">Support</th>  \n            </tr>\n        </thead>\n        <tbody>\n            " + matrix.labels.map(function (label, index) {
                return "\n                    <tr>\n                        <td class=\"blue\">" + label + "</td>\n                        <td>" + _this.getPrecision(index, matrix) + "</td>\n                        <td>" + _this.getRecall(index, matrix) + "</td>\n                        <td>" + _this.getF1Score(index, matrix) + "</td>\n                        <td>" + _this.getSupport(index, matrix) + "</td>\n                    </tr>\n                    ";
            }).join('\n') + "\n            <tr>\n                <td class=\"blue\">avg / total</td>\n                <td>" + this.getAvgPrecision(matrix) + "</td>\n                <td>" + this.getAvgRecall(matrix) + "</td>\n                <td>" + this.getAvgF1Score(matrix) + "</td>\n                <td>" + this.getTotalSupport(matrix) + "</td>\n            </tr>\n        </tbody>\n            </table>\n            ";
        }
    };
    ConfusionMatrix.prototype.getPrecision = function (index, matrix) {
        var total = matrix.values[index].reduce(function (acc, current) { return acc + current; });
        return matrix.values[index][index] / total;
    };
    ConfusionMatrix.prototype.getRecall = function (index, matrix) {
        var total = matrix.values.reduce(function (acc, current) { return __spreadArrays(acc, [current[index]]); }, [])
            .reduce(function (acc, current) { return acc + current; });
        return matrix.values[index][index] / total;
    };
    ConfusionMatrix.prototype.getF1Score = function (index, matrix) {
        var precision = this.getPrecision(index, matrix);
        var recall = this.getRecall(index, matrix);
        if (precision + recall === 0) {
            return 0;
        }
        return 2 * (precision * recall) / (precision + recall);
    };
    ConfusionMatrix.prototype.getSupport = function (index, matrix) {
        return matrix.values[index].reduce(function (acc, current) { return acc + current; });
    };
    ConfusionMatrix.prototype.getAvgPrecision = function (matrix) {
        var _this = this;
        return matrix.labels
            .map(function (_, index) { return _this.getPrecision(index, matrix); })
            .reduce(function (acc, curr) { return acc + curr; }) / matrix.labels.length;
    };
    ConfusionMatrix.prototype.getAvgRecall = function (matrix) {
        var _this = this;
        return matrix.labels
            .map(function (_, index) { return _this.getRecall(index, matrix); })
            .reduce(function (acc, curr) { return acc + curr; }) / matrix.labels.length;
    };
    ConfusionMatrix.prototype.getAvgF1Score = function (matrix) {
        var _this = this;
        return matrix.labels
            .map(function (_, index) { return _this.getF1Score(index, matrix); })
            .reduce(function (acc, curr) { return acc + curr; }) / matrix.labels.length;
    };
    ConfusionMatrix.prototype.getTotalSupport = function (matrix) {
        var _this = this;
        return matrix.labels
            .map(function (_, index) { return _this.getSupport(index, matrix); })
            .reduce(function (acc, curr) { return acc + curr; });
    };
    ConfusionMatrix.prototype.isBinary = function () {
        for (var i = 0; i < this.expected.length; ++i) {
            if (this.expected[i] !== 0 && this.expected[i] !== 1) {
                return false;
            }
            if (this.predicted[i] !== 0 && this.predicted[i] !== 1) {
                return false;
            }
        }
        return true;
    };
    ConfusionMatrix.prototype.setTitle = function (title) {
        this.title = title;
    };
    ConfusionMatrix.prototype.setExpected = function (expected) {
        this.expected = expected;
    };
    ConfusionMatrix.prototype.setPredicted = function (predicted) {
        this.predicted = predicted;
    };
    return ConfusionMatrix;
}(data_science_lab_core_1.VisualizationPlugin));
exports.ConfusionMatrix = ConfusionMatrix;
var ConfusionMatrixPluginInputs = /** @class */ (function (_super) {
    __extends(ConfusionMatrixPluginInputs, _super);
    function ConfusionMatrixPluginInputs(visualization) {
        var _this = _super.call(this) || this;
        _this.visualization = visualization;
        return _this;
    }
    ConfusionMatrixPluginInputs.prototype.submit = function (inputs) {
        if (inputs['expected'] === undefined) {
            throw new Error("Confusion Matrix's submit expecting plugin data with key expected");
        }
        else {
            this.visualization.setExpected(inputs['expected'].examples.map(function (value) { return value[0]; }));
        }
        if (inputs['predicted'] === undefined) {
            throw new Error("Confusion Matrix's submit expecting plugin data with key predicted");
        }
        else {
            this.visualization.setPredicted(inputs['predicted'].examples.map(function (value) { return value[0]; }));
        }
    };
    ConfusionMatrixPluginInputs.prototype.inputs = function () {
        return [
            {
                id: 'expected',
                label: 'Expected',
                min: 1,
                max: 1,
                type: 'number'
            },
            {
                id: 'predicted',
                label: 'Predicted',
                min: 1,
                max: 1,
                type: 'number'
            },
        ];
    };
    return ConfusionMatrixPluginInputs;
}(data_science_lab_core_1.PluginInputs));
var ConfusionMatrixPluginOptions = /** @class */ (function (_super) {
    __extends(ConfusionMatrixPluginOptions, _super);
    function ConfusionMatrixPluginOptions(visualization) {
        var _this = _super.call(this) || this;
        _this.visualization = visualization;
        _this.state = 1;
        return _this;
    }
    ConfusionMatrixPluginOptions.prototype.submit = function (inputs) {
        if (inputs['title'] !== '') {
            this.visualization.setTitle(inputs['title']);
        }
        this.state = 2;
    };
    ConfusionMatrixPluginOptions.prototype.options = function () {
        return [
            new data_science_lab_core_1.TextOption({
                id: 'title',
                label: 'Provide a title (if you wish to include one)',
                min: 0,
            }),
        ];
    };
    ConfusionMatrixPluginOptions.prototype.noMore = function () {
        return this.state === 2;
    };
    return ConfusionMatrixPluginOptions;
}(data_science_lab_core_1.PluginOptions));
