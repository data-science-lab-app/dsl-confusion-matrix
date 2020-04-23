import { ConfusionMatrix } from "./confusion.matrix"

describe('Confusion Matrix Tests', () => {
    let visualization: ConfusionMatrix;

    beforeEach(() => {
        visualization = new ConfusionMatrix();
    });

    it('options should return false for no more', () => {
        expect(visualization.getOptions().noMore()).toBeFalsy();
    });

    it('options should return one options', () => {
        expect(visualization.getOptions().options().length).toBe(1);
    });

    it('submit should be no more afterwards', () => {
        visualization.getOptions().submit({
            title: 'My title',
        });

        expect(visualization.getOptions().noMore()).toBeTruthy();
    });

    it('submit should be no more afterwards no title', () => {
        visualization.getOptions().submit({
            title: '',
        });

        expect(visualization.getOptions().noMore()).toBeTruthy();
    });

    it('inputs should return two inputs', () => {
        expect(visualization.getInputs().inputs().length).toBe(2);
    });

    it('visualize should set data with title', () => {
        visualization.getOptions().submit({
            title: 'My title',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [0], [1], [0], [0], [1], [0], [0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [0], [1], [0], [0], [1], [1], [1], [0]]
            },
        });
        expect(visualization.title).toBe('My title');
        expect(visualization.expected).toEqual([1, 1, 0, 1, 0, 0, 1, 0, 0, 0]);
        expect(visualization.predicted).toEqual([1, 0, 0, 1, 0, 0, 1, 1, 1, 0]);
        expect(visualization.getOptions().noMore()).toBeTruthy();
    });

    it('submit should throw for not providing predicted', (done) => {
        try {
            visualization.getInputs().submit({
                expected: {
                    features: ['y label'],
                    examples: [[1], [2], [3], [4], [5]]
                },
            });
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('submit should throw for not providing expected', (done) => {
        try {
            visualization.getInputs().submit({
                predicted: {
                    features: ['x label'],
                    examples: [[1], [2], [3], [4], [5]]
                },
            });
            done.fail();
        } catch (error) {
            expect().nothing();
            done();
        }
    });

    it('visualize should set data without title', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [0], [1], [0], [0], [1], [0], [0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [0], [1], [0], [0], [1], [1], [1], [0]]
            },
        });
        expect(visualization.title).toBe('Confusion Matrix');
        expect(visualization.expected).toEqual([1, 1, 0, 1, 0, 0, 1, 0, 0, 0]);
        expect(visualization.predicted).toEqual([1, 0, 0, 1, 0, 0, 1, 1, 1, 0]);
        expect(visualization.getOptions().noMore()).toBeTruthy();
        expect(visualization.getOptions().noMore()).toBeTruthy();
    });

    it('isBinary should return true', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [-0], [1.], [0], [0], [1.0], [0], [0.0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [-0], [1.0], [0], [0.0], [1.0], [1], [1], [0]]
            },
        });
        expect(visualization.isBinary()).toBeTruthy();
    });
    
    it('isBinary should return false in epxected', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [-0], [1.], [2], [0], [1.0], [0], [0.0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [-0], [1.0], [0], [0.0], [1.0], [1], [1], [0]]
            },
        });
        expect(visualization.isBinary()).toBeFalsy();
    });
    
    it('isBinary should return false in predicted', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [-0], [1.], [0], [0], [1.0], [0], [0.0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [-0], [1.0], [2], [0.0], [1.0], [1], [1], [0]]
            },
        });
        expect(visualization.isBinary()).toBeFalsy();
    });

    it('getConfusionMatrix should return binary matrix', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [0], [1], [0], [0], [1], [0], [0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [0], [1], [0], [0], [1], [1], [1], [0]]
            },
        });
        expect(visualization.getConfusionMatrix()).toEqual({
            accuracy: 0.7,
            labels: [0, 1],
            values: [[4, 1], [2, 3]]
        });
    });
    
    it('getConfusionMatrix for non-binary matrix', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[0], [1], [2], [3], [0], [1], [2], [3], [0], [1]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[0], [1], [2], [0], [1], [2], [3], [1], [2], [3]]
            },
        });
        expect(visualization.getConfusionMatrix()).toEqual({
            accuracy: 0.3,
            labels: [0, 1, 2, 3],
            values: [[1, 0, 0, 1], [1, 1, 0, 1], [1, 1, 1, 0], [0, 1, 1, 0]]
        });
    });

    it('getPrecision for index 0 and binary matrix', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [0], [1], [0], [0], [1], [0], [0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [0], [1], [0], [0], [1], [1], [1], [0]]
            },
        });
        expect(visualization.getPrecision(0, visualization.getConfusionMatrix()))
            .toEqual(0.8);
    });
    
    it('getPrecision for index 1 and binary matrix', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [0], [1], [0], [0], [1], [0], [0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [0], [1], [0], [0], [1], [1], [1], [0]]
            },
        });
        expect(visualization.getPrecision(1, visualization.getConfusionMatrix()))
            .toEqual(0.6);
    });

    it('getPrecision for non-binary matrix', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[0], [1], [2], [3], [0], [1], [2], [3], [0], [1]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[0], [1], [2], [0], [1], [2], [3], [1], [2], [3]]
            },
        });
        expect(visualization.getPrecision(0, visualization.getConfusionMatrix()))
            .toEqual(0.5);
        expect(visualization.getPrecision(1, visualization.getConfusionMatrix()))
            .toEqual(1.0/3.0);
        expect(visualization.getPrecision(2, visualization.getConfusionMatrix()))
            .toEqual(1.0/3.0);
        expect(visualization.getPrecision(3, visualization.getConfusionMatrix()))
            .toEqual(0);
    });

    it('getRecall for binary matrix', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[1], [1], [0], [1], [0], [0], [1], [0], [0], [0]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[1], [0], [0], [1], [0], [0], [1], [1], [1], [0]]
            },
        });
        expect(visualization.getRecall(0, visualization.getConfusionMatrix()))
            .toEqual(4.0 / 6.0);
        expect(visualization.getRecall(1, visualization.getConfusionMatrix()))
            .toEqual(0.75);
    });

    
    it('getRecall for non-binary matrix', () => {
        visualization.getOptions().submit({
            title: '',
        });
        visualization.getInputs().submit({
            expected: {
                features: ['expected'],
                examples: [[0], [1], [2], [3], [0], [1], [2], [3], [0], [1]]
            },
            predicted: {
                features: ['predicted'],
                examples: [[0], [1], [2], [0], [1], [2], [3], [1], [2], [3]]
            },
        });
        expect(visualization.getConfusionMatrix()).toEqual({
            accuracy: 0.3,
            labels: [0, 1, 2, 3],
            values: [[1, 0, 0, 1], [1, 1, 0, 1], [1, 1, 1, 0], [0, 1, 1, 0]]
        });
        expect(visualization.getRecall(0, visualization.getConfusionMatrix()))
            .toEqual(1.0/3.0);
        expect(visualization.getRecall(1, visualization.getConfusionMatrix()))
            .toEqual(1.0/3.0);
        expect(visualization.getRecall(2, visualization.getConfusionMatrix()))
            .toEqual(1.0/2.0);
        expect(visualization.getRecall(3, visualization.getConfusionMatrix()))
            .toEqual(0.0);
    });





});
