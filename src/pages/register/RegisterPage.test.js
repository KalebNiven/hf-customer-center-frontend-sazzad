import React from 'react'

import {fireEvent, render, screen} from '@testing-library/react'
import { Provider } from 'react-redux'

import {devTools} from "../../store/store";
import {AppContextProvider} from "../../AppContext";
import createMockReduxStore from "../../test-resources/createMockReduxStore";
import CreateAccount from "../../components/auth/registration/createAccount";
import {Router} from "react-router-dom";


describe('RegisterPage', () => {
    let store

    beforeEach(() => {
        process.env.MIX_APP_DOMAIN = 'https://place.com'
        window.analytics = { track: jest.fn()}
        store = createMockReduxStore()
    })

    it('renders correctly', () => {
        const {asFragment} = render(
            <AppContextProvider>
                    <Provider store={store}>
                        <Router history={{
                            push: () => {},
                            listen(listener) {},
                            location: {pathname: '/register'}
                        }}>
                            <CreateAccount ignoreSplit={true}/>
                        </Router>
                    </Provider>
            </AppContextProvider>)

        expect(asFragment()).toMatchSnapshot();
    })

    it('routes to /login when clicking healthfirst logo', async () => {
        const mockPush = jest.fn()

        render(
            <AppContextProvider>
                <Provider store={store}>
                    <Router history={{
                        push: mockPush,
                        listen(listener) {},
                        location: {pathname: '/register'}
                    }}>
                        <CreateAccount ignoreSplit={true}/>
                    </Router>
                </Provider>
            </AppContextProvider>)

        fireEvent.click(screen.getByTestId('healthfirst-logo'))

        expect(mockPush).toBeCalledWith('/login')
    })

    it('routes to /login when clicking back icon', async () => {
        const mockPush = jest.fn()

        render(
            <AppContextProvider>
                <Provider store={store}>
                    <Router history={{
                        push: mockPush,
                        listen(listener) {},
                        location: {pathname: '/register'}
                    }}>
                        <CreateAccount ignoreSplit={true}/>
                    </Router>
                </Provider>
            </AppContextProvider>)

        fireEvent.click(screen.getByTestId('back-icon'))

        expect(mockPush).toBeCalledWith('/login')
    })

    it('routes to /login when clicking back text', async () => {
        const mockPush = jest.fn()

        render(
            <AppContextProvider>
                <Provider store={store}>
                    <Router history={{
                        push: mockPush,
                        listen(listener) {},
                        location: {pathname: '/register'}
                    }}>
                        <CreateAccount ignoreSplit={true}/>
                    </Router>
                </Provider>
            </AppContextProvider>)

        fireEvent.click(screen.getByTestId('back-text'))

        expect(mockPush).toBeCalledWith('/login')
    })
});

