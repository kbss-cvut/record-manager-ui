const States = {
    INITIAL: 0,
    COMPLETE: 1,
    INCOMPLETE: 2
};

class RecordState {

    constructor(initialState = States.INITIAL) {
        this.state = initialState;
    }

    recordComplete = () => {
        this.state = States.COMPLETE;
    };

    recordIncomplete = () => {
        if (this.state === States.INITIAL) {
            return;
        }
        this.state = States.INCOMPLETE;
    };

    isComplete = () => {
        return this.state === States.COMPLETE;
    };

    isInitial = () => {
        return this.state === States.INITIAL;
    }
}

module.exports = {
    createInitialState: function () {
        return new RecordState();
    },

    createRecordState: function () {
        return new RecordState(States.COMPLETE);
    }
};