import React from 'react'
import ClaimsPage from '../../components/claims/claimsPage'

import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import {devTools} from "../../store/store";
import {SurveyContextProvider} from "../../context/surveyContext";
import {AppContextProvider} from "../../AppContext";
import createMockReduxStore from "../../test-resources/createMockReduxStore";


describe('ClaimsPage', () => {
    let store

    beforeEach(() => {
        store = createMockReduxStore()
    })

    it('renders correctly', () => {
        const {asFragment} = render(
            <AppContextProvider>
                <SurveyContextProvider>
                    <Provider store={store}>
                        <ClaimsPage ignoreSplit={true}/>
                    </Provider>
                </SurveyContextProvider>
            </AppContextProvider>)

        expect(asFragment()).toMatchSnapshot();
    })
});

