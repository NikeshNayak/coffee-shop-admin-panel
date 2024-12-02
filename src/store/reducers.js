import { combineReducers } from '@reduxjs/toolkit';

// Front
import Layout from './layout/reducer';
import usedKeysReducer from './keys/usedKeysListSlice';
import newKeysReducer from './keys/newKeysListSlice';
import comanyReducer from './companies/companySlice';

import staffDetailsReducer from './admin/adminDetailsSlice';

const rootReducer = combineReducers({

    Layout,
    usedKeys: usedKeysReducer,
    newKeys: newKeysReducer,
    company: comanyReducer,
    staffDetails: staffDetailsReducer,
});

export default rootReducer;