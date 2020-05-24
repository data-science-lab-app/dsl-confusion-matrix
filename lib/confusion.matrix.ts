import { VisualizationPlugin, PluginInputs, PluginOptions, Option, PluginDataInput, PluginData, TextOption, ChoicesOption } from 'data-science-lab-core';

interface Matrix {
    labels: number[];
    values: number[][];
    accuracy: number;
};

export class ConfusionMatrix extends VisualizationPlugin {

    options: ConfusionMatrixPluginOptions;
    inputs: ConfusionMatrixPluginInputs;

    expected: number[];
    predicted: number[];
    title: string;

    constructor() {
        super();
        this.options = new ConfusionMatrixPluginOptions(this);
        this.inputs = new ConfusionMatrixPluginInputs(this);

        this.expected = [];
        this.predicted = [];
        this.title = 'Confusion Matrix';
    }

    getOptions(): PluginOptions {
        return this.options;
    }
    getInputs(): PluginInputs {
        return this.inputs;
    }

    visualization(): string {
        const binary = this.isBinary();
        const matrix = this.getConfusionMatrix();

        return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                }
                table,
                th,
                td {
                    border: 1px solid transparent;
                    text-align: center;
                    font-weight: normal;
                    font-size: xx-large;
                }
                th,
                td {
                    padding: 10px;
                }
                td {
                    background: rgb(251, 229, 214);
                }
                .downward span {
                    writing-mode: vertical-lr;
                    -webkit-writing-mode: vertical-lr;
                    -ms-writing-mode: vertical-lr;
                    text-align: center;
                }
                .gold {
                    background: rgb(215, 183, 64);
                    color: white;
                    font-weight: bolder;
                }
                .dark-blue {
                    background: #3ad8ff;
                    color: white;
                    font-weight: bolder;
                }
                .blue {
                    background: rgb(218, 227, 243);
                    color: black;
                }
                .green {
                    background: rgb(197, 224, 180);
                }
            </style>
        </head>
        
        <body>
            ${this.getConfusionMatrixTable(binary, matrix)}
            ${this.getReport(binary, matrix)}
        </body>`;
    }

    getConfusionMatrix(): Matrix {
        const set = new Set<number>();
        for (let i = 0; i < this.expected.length; ++i) {
            set.add(this.expected[i]);
            set.add(this.predicted[i]);
        }
        const labels = Array.from(set).sort((a, b) => a - b);
        const values = Array(labels.length).fill([]).map((value) => Array(labels.length).fill(0));

        let correct = 0.0;
        for (let i = 0; i < this.expected.length; ++i) {
            const expected = labels.indexOf(this.expected[i]);
            const predicted = labels.indexOf(this.predicted[i]);

            correct += this.expected[i] === this.predicted[i] ? 1 : 0;
            values[predicted][expected] += 1.0;
        }


        return {
            labels,
            values,
            accuracy: correct / this.expected.length
        };
    }

    getConfusionMatrixTable(isBinary: boolean, matrix: Matrix): string {
        let title = '';
        if (!!this.title) {
            title = this.title;
        } else {
            title = 'Confusion Matrix';
        }
        if (isBinary) {
            return `
            <table>
                <thead>
                    <tr>
                        <th colspan="2" rowspan="2" class="dark-blue">
                            ${title}
                        </th>
                        <th colspan="2" class="gold">
                            Expected
                        </th>
                    </tr>
                    <tr>
                        <th class="blue">Positive</th>
                        <th class="blue">Negative</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="downward gold" rowspan="2">
                            <span>Predicted</span>
                        </td>
                        <td class="blue">Positive</td>
                        <td class="green">${matrix.values[1][1]}</td>
                        <td>${matrix.values[1][0]}</td>
                    </tr>
                    <tr>
                        <td class="blue">Negative</td>
                        <td>${matrix.values[0][1]}</td>
                        <td class="green">${matrix.values[0][0]}</td>
                    </tr>
                </tbody>
            </table>`;
        } else {
            return `
                <table>
                <thead>
                    <tr>
                        <th colspan="2" rowspan="2" class="dark-blue">
                            ${title}
                        </th>
                        <th colspan="${matrix.labels.length}" class="gold">
                            Expected
                        </th>
                    </tr>
                    <tr>
                        ${matrix.labels.map((value) => `<td>${value}</td>`).join('\n')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="downward gold" rowspan="${matrix.labels.length}">
                            <span>Predicted</span>
                        </td>
                        <td class="blue">${matrix.labels[0]}</td>
                        <td class="green">${matrix.values[0][0]}</td>
                        ${matrix.values[0].slice(1).map((value) => `<td>${value}</td>`).join('\n')}
                    </tr>
                    ${
                matrix.values.slice(1).map((row, index) => `
                            <tr>
                                <td class="blue">${matrix.labels[index + 1]}</td>
                                ${row.map((value, cmpIndex) => `<td class="${index + 1 === cmpIndex ? 'green' : ''}">${value}</td>`).join('\n')}
                            </tr>
                        `).join('\n')
                }
                </tbody>
                </table>
            `;
        }
    }

    getReport(isBinary: boolean, matrix: Matrix): string {
        if (isBinary) {
            return `
            <table>
                <thead>
                    <tr>
                        <th rowspan="2" class="dark-blue">
                            Report
                        </th>
                        <th colspan="4" class="gold">
                            Accuracy ${matrix.accuracy * 100}%
                        </th>
                    </tr>
                    <tr>
                        <th class="blue">Precision</th>
                        <th class="blue">Recall</th>
                        <th class="blue">F1-Score</th>
                        <th class="blue">Support</th>  
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="blue">Positive</td>
                        <td>${this.getPrecision(1, matrix)}</td>
                        <td>${this.getRecall(1, matrix)}</td>
                        <td>${this.getF1Score(1, matrix)}</td>
                        <td>${this.getSupport(1, matrix)}</td>
                    </tr>
                    <tr>
                        <td class="blue">Negative</td>
                        <td>${this.getPrecision(0, matrix)}</td>
                        <td>${this.getRecall(0, matrix)}</td>
                        <td>${this.getF1Score(0, matrix)}</td>
                        <td>${this.getSupport(0, matrix)}</td>
                    </tr>
                    <tr>
                        <td class="blue">avg / total</td>
                        <td>${this.getAvgPrecision(matrix)}</td>
                        <td>${this.getAvgRecall(matrix)}</td>
                        <td>${this.getAvgF1Score(matrix)}</td>
                        <td>${this.getTotalSupport(matrix)}</td>
                    </tr>
                </tbody>
            </table>`;
        } else {
            return `
            <table>
            <thead>
            <tr>
                <th rowspan="2" class="dark-blue">
                    Report
                </th>
                <th colspan="4" class="gold">
                    Accuracy ${matrix.accuracy * 100}%
                </th>
            </tr>
            <tr>
                <th class="blue">Precision</th>
                <th class="blue">Recall</th>
                <th class="blue">F1-Score</th>
                <th class="blue">Support</th>  
            </tr>
        </thead>
        <tbody>
            ${
                matrix.labels.map((label, index) =>
                    `
                    <tr>
                        <td class="blue">${label}</td>
                        <td>${this.getPrecision(index, matrix)}</td>
                        <td>${this.getRecall(index, matrix)}</td>
                        <td>${this.getF1Score(index, matrix)}</td>
                        <td>${this.getSupport(index, matrix)}</td>
                    </tr>
                    `
                ).join('\n')
                }
            <tr>
                <td class="blue">avg / total</td>
                <td>${this.getAvgPrecision(matrix)}</td>
                <td>${this.getAvgRecall(matrix)}</td>
                <td>${this.getAvgF1Score(matrix)}</td>
                <td>${this.getTotalSupport(matrix)}</td>
            </tr>
        </tbody>
            </table>
            `;
        }
    }

    getPrecision(index: number, matrix: Matrix): number {
        const total = matrix.values[index].reduce((acc, current) => acc + current);
        return matrix.values[index][index] / total;
    }

    getRecall(index: number, matrix: Matrix) {
        const total = matrix.values.reduce((acc, current) => [...acc, current[index]], [])
            .reduce((acc, current) => acc + current);
        return matrix.values[index][index] / total;
    }

    getF1Score(index: number, matrix: Matrix) {
        const precision = this.getPrecision(index, matrix);
        const recall = this.getRecall(index, matrix);
        if (precision + recall === 0) {
            return 0;
        }
        return 2 * (precision * recall) / (precision + recall);
    }

    getSupport(index: number, matrix: Matrix) {
        return matrix.values[index].reduce((acc, current) => acc + current);
    }

    getAvgPrecision(matrix: Matrix) {
        return matrix.labels
            .map((_, index) => this.getPrecision(index, matrix))
            .reduce((acc, curr) => acc + curr) / matrix.labels.length;
    }

    getAvgRecall(matrix: Matrix) {
        return matrix.labels
            .map((_, index) => this.getRecall(index, matrix))
            .reduce((acc, curr) => acc + curr) / matrix.labels.length;
    }
    getAvgF1Score(matrix: Matrix) {
        return matrix.labels
            .map((_, index) => this.getF1Score(index, matrix))
            .reduce((acc, curr) => acc + curr) / matrix.labels.length;
    }

    getTotalSupport(matrix: Matrix) {
        return matrix.labels
            .map((_, index) => this.getSupport(index, matrix))
            .reduce((acc, curr) => acc + curr);
    }

    isBinary() {
        for (let i = 0; i < this.expected.length; ++i) {
            if (this.expected[i] !== 0 && this.expected[i] !== 1) {
                return false;
            }
            if (this.predicted[i] !== 0 && this.predicted[i] !== 1) {
                return false;
            }
        }
        return true;
    }

    setTitle(title: string) {
        this.title = title;
    }

    setExpected(expected: number[]) {
        this.expected = expected;
    }

    setPredicted(predicted: number[]) {
        this.predicted = predicted;
    }

}

class ConfusionMatrixPluginInputs extends PluginInputs {
    constructor(public visualization: ConfusionMatrix) {
        super();
    }

    submit(inputs: { [id: string]: PluginData; }): void {
        if (inputs['expected'] === undefined) {
            throw new Error(`Confusion Matrix's submit expecting plugin data with key expected`);
        } else {
            this.visualization.setExpected(
                inputs['expected'].examples.map(value => value[0]));
        }

        if (inputs['predicted'] === undefined) {
            throw new Error(`Confusion Matrix's submit expecting plugin data with key predicted`);
        } else {
            this.visualization.setPredicted(inputs['predicted'].examples.map(value => value[0]));
        }
    }

    inputs(): PluginDataInput[] {
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
    }
}

class ConfusionMatrixPluginOptions extends PluginOptions {
    state: number;

    constructor(public visualization: ConfusionMatrix) {
        super();
        this.state = 1;
    }

    submit(inputs: { [id: string]: any; }): void {
        if (inputs['title'] !== '') {
            this.visualization.setTitle(inputs['title']);
        }
        this.state = 2;
    }
    options(): Option[] {
        return [
            new TextOption({
                id: 'title',
                label: 'Provide a title (if you wish to include one)',
                min: 0,
            }),
        ];
    }

    noMore(): boolean {
        return this.state === 2;
    }

}


