import { VisualizationPlugin, PluginInputs, PluginOptions, Option, PluginDataInput, PluginData } from 'data-science-lab-core';
interface Matrix {
    labels: number[];
    values: number[][];
    accuracy: number;
}
export declare class ConfusionMatrix extends VisualizationPlugin {
    options: ConfusionMatrixPluginOptions;
    inputs: ConfusionMatrixPluginInputs;
    expected: number[];
    predicted: number[];
    title: string;
    constructor();
    getOptions(): PluginOptions;
    getInputs(): PluginInputs;
    visualization(): string;
    getConfusionMatrix(): Matrix;
    getConfusionMatrixTable(isBinary: boolean, matrix: Matrix): string;
    getReport(isBinary: boolean, matrix: Matrix): string;
    getPrecision(index: number, matrix: Matrix): number;
    getRecall(index: number, matrix: Matrix): number;
    getF1Score(index: number, matrix: Matrix): number;
    getSupport(index: number, matrix: Matrix): number;
    getAvgPrecision(matrix: Matrix): number;
    getAvgRecall(matrix: Matrix): number;
    getAvgF1Score(matrix: Matrix): number;
    getTotalSupport(matrix: Matrix): number;
    isBinary(): boolean;
    setTitle(title: string): void;
    setExpected(expected: number[]): void;
    setPredicted(predicted: number[]): void;
}
declare class ConfusionMatrixPluginInputs extends PluginInputs {
    visualization: ConfusionMatrix;
    constructor(visualization: ConfusionMatrix);
    submit(inputs: {
        [id: string]: PluginData;
    }): void;
    inputs(): PluginDataInput[];
}
declare class ConfusionMatrixPluginOptions extends PluginOptions {
    visualization: ConfusionMatrix;
    state: number;
    constructor(visualization: ConfusionMatrix);
    submit(inputs: {
        [id: string]: any;
    }): void;
    options(): Option[];
    noMore(): boolean;
}
export {};
