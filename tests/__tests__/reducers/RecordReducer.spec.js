import RecordReducer from "../../../src/reducers/RecordReducer";
import * as ActionConstants from "../../../src/constants/ActionConstants";
import { ACTION_FLAG, ACTION_STATUS } from "../../../src/constants/DefaultConstants";

describe("RecordReducer", function () {
  const record = { key: 12345678 },
    key = 12345678,
    error = {
      message: "An error has occurred.",
    };

  it("leaves state unchanged if action not recognized", () => {
    const initialState = {
      recordDeleted: {},
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: "NONEXISTENT_ACTION_TYPE",
        payload: "error",
      }),
    ).toEqual({
      recordDeleted: {},
      testEntry: initialState.testEntry,
    });
  });

  it("handles SAVE_RECORD_PENDING", () => {
    const initialState = {
      recordSaved: {},
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.SAVE_RECORD_PENDING,
      }),
    ).toEqual({
      recordSaved: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles SAVE_RECORD_SUCCESS", () => {
    const initialState = {
      recordSaved: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.SAVE_RECORD_SUCCESS,
        actionFlag: ACTION_FLAG.CREATE_ENTITY,
        key,
        record,
      }),
    ).toEqual({
      recordSaved: {
        actionFlag: ACTION_FLAG.CREATE_ENTITY,
        status: ACTION_STATUS.SUCCESS,
        record: {
          ...record,
          key,
        },
        error: "",
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles SAVE_RECORD_ERROR", () => {
    const initialState = {
      recordSaved: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.SAVE_RECORD_ERROR,
        actionFlag: ACTION_FLAG.CREATE_ENTITY,
        record,
        error,
      }),
    ).toEqual({
      recordSaved: {
        actionFlag: ACTION_FLAG.CREATE_ENTITY,
        status: ACTION_STATUS.ERROR,
        record,
        error,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles UNLOAD_SAVED_RECORD", () => {
    const initialState = {
      recordSaved: {
        actionFlag: ACTION_FLAG.CREATE_ENTITY,
        status: ACTION_STATUS.SUCCESS,
        record,
        error: "",
      },
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.UNLOAD_SAVED_RECORD,
      }),
    ).toEqual({
      recordSaved: {
        status: ACTION_STATUS.SUCCESS,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles DELETE_RECORD_PENDING", () => {
    const initialState = {
      recordDeleted: {},
      recordsDeleting: [],
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.DELETE_RECORD_PENDING,
        key,
      }),
    ).toEqual({
      recordDeleted: {
        status: ACTION_STATUS.PENDING,
        key,
      },
      recordsDeleting: [key],
      testEntry: initialState.testEntry,
    });
  });

  it("handles DELETE_RECORD_SUCCESS", () => {
    const initialState = {
      recordDeleted: {
        status: ACTION_STATUS.PENDING,
      },
      recordsDeleting: [],
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.DELETE_RECORD_SUCCESS,
        record,
        key,
      }),
    ).toEqual({
      recordDeleted: {
        status: ACTION_STATUS.SUCCESS,
        record,
        error: "",
      },
      recordsDeleting: [],
      testEntry: initialState.testEntry,
    });
  });

  it("handles DELETE_RECORD_ERROR", () => {
    const initialState = {
      recordDeleted: {
        status: ACTION_STATUS.PENDING,
      },
      recordsDeleting: [],
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.DELETE_RECORD_ERROR,
        record,
        error,
        key,
      }),
    ).toEqual({
      recordDeleted: {
        status: ACTION_STATUS.ERROR,
        record,
        error,
      },
      recordsDeleting: [],
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_RECORD_PENDING", () => {
    const initialState = {
      recordLoaded: {
        testEntry: "should not touch",
      },
      testEntry2: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.LOAD_RECORD_PENDING,
      }),
    ).toEqual({
      recordLoaded: {
        testEntry: initialState.recordLoaded.testEntry,
        status: ACTION_STATUS.PENDING,
      },
      testEntry2: initialState.testEntry2,
    });
  });

  it("handles LOAD_RECORD_SUCCESS", () => {
    const initialState = {
      recordLoaded: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.LOAD_RECORD_SUCCESS,
        record,
      }),
    ).toEqual({
      recordLoaded: {
        status: ACTION_STATUS.SUCCESS,
        record,
        error: "",
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles LOAD_RECORD_ERROR", () => {
    const initialState = {
      recordLoaded: {
        status: ACTION_STATUS.PENDING,
      },
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.LOAD_RECORD_ERROR,
        error,
      }),
    ).toEqual({
      recordLoaded: {
        status: ACTION_STATUS.ERROR,
        error,
      },
      testEntry: initialState.testEntry,
    });
  });

  it("handles UNLOAD_RECORD", () => {
    const initialState = {
      recordLoaded: {
        status: ACTION_STATUS.SUCCESS,
        record,
      },
      testEntry: "should not touch",
    };

    expect(
      RecordReducer(initialState, {
        type: ActionConstants.UNLOAD_RECORD,
      }),
    ).toEqual({
      recordLoaded: {},
      testEntry: initialState.testEntry,
    });
  });
});
