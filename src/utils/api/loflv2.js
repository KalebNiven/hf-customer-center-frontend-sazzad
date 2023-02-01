import axios from "axios";

// store
import store from '../../store/store'
store.subscribe(listener)

const LOFL_API_BASE_URL= process.env.LOFL_API_BASE_URL

// configuration
const LOFLv2 = axios.create({
    baseURL: LOFL_API_BASE_URL + '/api/v2/',
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


function getCustomerInfoData(state) {
    return state.customerInfo.data
}

function listener() {
    // let customerInfo = getCustomerInfoData(store.getState())
    const authFlag = (localStorage.getItem("authFlag")!==null)

    if(!authFlag){
    const localStorageOKTA = JSON.parse(localStorage.getItem('okta-token-storage'));
    const accessToken = 'Bearer ' + localStorageOKTA.accessToken.accessToken;
    const idToken = 'Bearer ' + localStorageOKTA.idToken.idToken;
    LOFLv2.defaults.headers.common['Authorization'] = accessToken;
    LOFLv2.defaults.headers.common['id-token'] = idToken;
    }
}

export default LOFLv2