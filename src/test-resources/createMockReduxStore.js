import configureMockStore from 'redux-mock-store'

export default () => {
    const mockStore = configureMockStore()

    var claims =  {
        "964311200": [],
        "964311201": [],
        "964311202": [],
        "964311203": [],
        "420000000696100": []
    };
    var claimsList = [];
    var claimStatus = "";
    for (var member in claims) {
        claims[member].forEach(claim => {

            if (claim.ClaimStatus === "Paid") {
                claimStatus = "Processed";
            } else {
                claimStatus = "Pending";
            }

            claimsList.push({
                id: claim.ClaimNo,
                claimId: claim.ClaimNo,
                memberId: claim.Member.MemberId,
                firstName: formatNameCapitalize(claim.Member.FirstName),
                lastName: formatNameCapitalize(claim.Member.LastName),
                provider: {
                    firstName: claim.Provider.FirstName,
                    lastName: claim.Provider.LastName
                },
                serviceDate: formatDate(claim.ServiceFromDate),
                claimStatus: claimStatus,
                copayAmount: claim.CopayAmt,
                prepaidAmount: claim.PrepaidAmt
            });
        });
    };

    const initialState = {
        claim: {
            loading: false,
            claimList: claimsList.map(val =>
                val && {...val , memberName : val.firstName.concat(' ',val.lastName),providerName:val.provider.firstName.concat(' ',val.provider.lastName)}
            ),
        },
        customerInfo: { data: {
                "hohPlans": [
                    {
                        "CustomerId": "CUST-119586438",
                        "MemberId": "420000000696100",
                        "MembershipKey": "MHS|ENBMAS|420000000696100|QHP307|1|27960094",
                        "FirstName": "Sasha",
                        "LastName": "Buffin",
                        "DOB": "1979-09-05",
                        "age": 44,
                        "Gender": "M",
                        "subscriberId": "420000000696100",
                        "ZipCode": "11801",
                        "MembershipEffectiveDate": "2019-09-01",
                        "MembershipExpirationDate": "9999-12-31",
                        "CompanyNumber": "42",
                        "MembershipStatus": "active",
                        "PlanName": "Silver Leaf",
                        "RelationshipCode": "SELF",
                        "RelationshipTypeCode": "1",
                        "RelationshipRefCode": "18",
                        "BenefitPackage": "QHSV",
                        "GroupNumber": "QHP307",
                        "LOBCode": "QSVP",
                        "coverageStatus": "Enrolled",
                        "pcpId": "252519-A13",
                        "renewalDate": "2023-12-31",
                        "memberYear": "2024",
                        "CarrierCode": ""
                    },
                    {
                        "CustomerId": "CUST-119586438",
                        "MemberId": "964311200",
                        "MembershipKey": "MHS|MEMMAS|964311200|SCHP01|1",
                        "FirstName": "Sasha",
                        "LastName": "Buffin",
                        "DOB": "1979-09-05",
                        "age": 44,
                        "Gender": "M",
                        "subscriberId": "964311200",
                        "ZipCode": "11801",
                        "MembershipEffectiveDate": "2021-01-01",
                        "MembershipExpirationDate": "9999-12-31",
                        "CompanyNumber": "20",
                        "MembershipStatus": "active",
                        "PlanName": "CHILD HEALTH PLUS STATE PAY",
                        "RelationshipCode": "SELF",
                        "RelationshipTypeCode": "1",
                        "RelationshipRefCode": "18",
                        "BenefitPackage": "LI",
                        "GroupNumber": "SCHP01",
                        "LOBCode": null,
                        "coverageStatus": "Enrolled",
                        "pcpId": null,
                        "renewalDate": null,
                        "memberYear": "2024",
                        "CarrierCode": ""
                    }
                ],
                "previousPlans": [],
                "customerId": "CUST-119586438",
                "firstName": "Sasha",
                "lastName": "Buffin",
                "dob": "1979-09-05",
                "membershipStatus": "active",
                "email": "IPIATKOV@HEALTHFIRST.ORG",
                "mobilePhone": "",
                "emailStatus": false,
                "phoneStatus": false,
                "wantsMedicare": false,
                "oktaId": "00u1255p1ddAVY84k0h8",
                "accountStatus": "MEMBER",
                "phoneNumber": "",
                "planName": "Silver Leaf",
                "companyCode": "42",
                "sessLobCode": "QSVP",
                "membershipEffectiveDate": "2019-09-01",
                "membershipExpirationDate": "9999-12-31",
                "memberId": "420000000696100",
                "groupNumber": "QHP307",
                "memberYear": "2024",
                "language": "en",
                "pcpId": "252519-A13",
                "benefitPackage": "QHSV",
                "zipcode": "11801",
                "gender": "M",
                "age": 44,
                "csrf": "UECADejyDg1OdJrROZf1l6URyRxzI9nX1GsaRVmK",
                "appVersion": "v1.1315.0",
                "dependents": [
                    {
                        "customerId": "CUST-118800909",
                        "memberId": "964311202",
                        "firstName": "SUZY",
                        "lastName": "BUFFIN",
                        "DOB": "2015-10-27",
                        "Age": 8,
                        "address": "",
                        "companyCode": "20",
                        "LobCode": "",
                        "groupNumber": "SCHP01",
                        "benefitPackage": "CHPS",
                        "MembershipKey": "964311202|SCHP01|1",
                        "Status": "active",
                        "disablePcpUpdate": false,
                        "RelationshipType": "CHILD",
                        "RelationshipTypeCode": "3",
                        "RelationshipRefCode": "14",
                        "CarrierCode": "",
                        "MembershipEffectiveDate": "2021-01-01",
                        "year": "2024",
                        "MembershipExpirationDate": "9999-12-31",
                        "BenefitPackageEffectiveDate": "2021-01-01",
                        "BenefitPackageExpirationDate": "9999-12-31",
                        "pcpId": null,
                        "planName": "Child Health Plus",
                        "renewalDate": "2023-12-31"
                    },
                    {
                        "customerId": "CUST-140493262",
                        "memberId": "964311201",
                        "firstName": "AMEL",
                        "lastName": "BUFFIN",
                        "DOB": "2020-06-17",
                        "Age": 3,
                        "address": "",
                        "companyCode": "20",
                        "LobCode": "",
                        "groupNumber": "SCHP01",
                        "benefitPackage": "CHPS",
                        "MembershipKey": "964311201|SCHP01|1",
                        "Status": "active",
                        "disablePcpUpdate": false,
                        "RelationshipType": "CHILD",
                        "RelationshipTypeCode": "3",
                        "RelationshipRefCode": "18",
                        "CarrierCode": "",
                        "MembershipEffectiveDate": "2021-01-01",
                        "year": "2024",
                        "MembershipExpirationDate": "9999-12-31",
                        "BenefitPackageEffectiveDate": "2021-01-01",
                        "BenefitPackageExpirationDate": "9999-12-31",
                        "pcpId": null,
                        "planName": "Child Health Plus",
                        "renewalDate": "2023-12-31"
                    },
                    {
                        "customerId": "CUST-118798257",
                        "memberId": "964311203",
                        "firstName": "ATHANASIOS",
                        "lastName": "BUFFIN",
                        "DOB": "2014-07-06",
                        "Age": 9,
                        "address": "",
                        "companyCode": "20",
                        "LobCode": "",
                        "groupNumber": "SCHP01",
                        "benefitPackage": "CHPS",
                        "MembershipKey": "964311203|SCHP01|1",
                        "Status": "active",
                        "disablePcpUpdate": false,
                        "RelationshipType": "CHILD",
                        "RelationshipTypeCode": "3",
                        "RelationshipRefCode": "14",
                        "CarrierCode": "",
                        "MembershipEffectiveDate": "2021-01-01",
                        "year": "2024",
                        "MembershipExpirationDate": "9999-12-31",
                        "BenefitPackageEffectiveDate": "2021-01-01",
                        "BenefitPackageExpirationDate": "9999-12-31",
                        "pcpId": null,
                        "planName": "Child Health Plus",
                        "renewalDate": "2023-12-31"
                    },
                    {
                        "customerId": "CUST-119590236",
                        "memberId": "420000000696101",
                        "firstName": "NORIKO",
                        "lastName": "BUFFIN",
                        "DOB": "1985-09-06",
                        "Age": 38,
                        "address": "",
                        "companyCode": "42",
                        "LobCode": "QSVP",
                        "groupNumber": "QHP307",
                        "benefitPackage": "QHSV",
                        "MembershipKey": "420000000696101|QHP307|1",
                        "Status": "active",
                        "disablePcpUpdate": false,
                        "RelationshipType": "SPOUSE",
                        "RelationshipTypeCode": "2",
                        "RelationshipRefCode": "01",
                        "CarrierCode": "",
                        "MembershipEffectiveDate": "2019-09-01",
                        "year": "2024",
                        "MembershipExpirationDate": "9999-12-31",
                        "BenefitPackageEffectiveDate": "2022-01-01",
                        "BenefitPackageExpirationDate": "9999-12-31",
                        "pcpId": null,
                        "planName": "Silver Leaf",
                        "renewalDate": "2023-12-31"
                    }
                ]
            }},
        customerDemographicsInfo: {
            data: {
                "hoh": [
                    {
                        "memberId": "420000000696100",
                        "info": {
                            "addresses": [
                                {
                                    "addressType": "Home",
                                    "addressPrecedence": 1,
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "0",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "I2",
                                    "latitude": "40.763593",
                                    "longitude": "-73.523059",
                                    "email": "SASHA.BUFFIN@HFTDM.COM",
                                    "phones": [
                                        {
                                            "phoneType": "Home",
                                            "phoneNumber": "19312533389"
                                        },
                                        {
                                            "phoneType": "Other",
                                            "phoneNumber": "14322736639"
                                        }
                                    ]
                                }
                            ],
                            "contact": {
                                "addressType": "Home",
                                "prefix": "",
                                "firstName": "SASHA",
                                "middleName": "",
                                "lastName": "BUFFIN",
                                "suffix": "",
                                "fullName": "SASHA BUFFIN",
                                "contactType": "MEMBER",
                                "contactAddress": {
                                    "addressType": "Home",
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "0",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "I2",
                                    "latitude": "40.763593",
                                    "longitude": "-73.523059",
                                    "email": "SASHA.BUFFIN@HFTDM.COM",
                                    "phones": [
                                        {
                                            "phoneType": "Home",
                                            "phoneNumber": "19312533389"
                                        },
                                        {
                                            "phoneType": "Other",
                                            "phoneNumber": "14322736639"
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        "memberId": "964311200",
                        "info": {
                            "addresses": [
                                {
                                    "addressType": "Home",
                                    "addressPrecedence": 1,
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "0",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "I2",
                                    "latitude": "40.763593",
                                    "longitude": "-73.523059",
                                    "email": "SASHA.BUFFIN@HFTDM.COM",
                                    "phones": [
                                        {
                                            "phoneType": "Home",
                                            "phoneNumber": "19312533389"
                                        },
                                        {
                                            "phoneType": "Other",
                                            "phoneNumber": "14322736639"
                                        }
                                    ]
                                }
                            ],
                            "contact": {
                                "addressType": "Home",
                                "prefix": "",
                                "firstName": "SASHA",
                                "middleName": "",
                                "lastName": "BUFFIN",
                                "suffix": "",
                                "fullName": "SASHA BUFFIN",
                                "contactType": "MEMBER",
                                "contactAddress": {
                                    "addressType": "Home",
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "0",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "I2",
                                    "latitude": "40.763593",
                                    "longitude": "-73.523059",
                                    "email": "SASHA.BUFFIN@HFTDM.COM",
                                    "phones": [
                                        {
                                            "phoneType": "Home",
                                            "phoneNumber": "19312533389"
                                        },
                                        {
                                            "phoneType": "Other",
                                            "phoneNumber": "14322736639"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ],
                "dependents": [
                    {
                        "memberId": "964311202",
                        "info": {
                            "addresses": [
                                {
                                    "addressType": "Home",
                                    "addressPrecedence": 1,
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.844966",
                                    "longitude": "-73.596804",
                                    "email": "",
                                    "phones": []
                                },
                                {
                                    "addressType": "Responsible Party",
                                    "addressPrecedence": 2,
                                    "prefix": "",
                                    "firstName": "SASHA",
                                    "middleName": "",
                                    "lastName": "BUFFIN",
                                    "suffix": "",
                                    "fullName": "SASHA BUFFIN",
                                    "responsiblePartyType": "Miscellaneous Responsible Party",
                                    "addressLine1": "4496 MELVILLE STREET",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.840490",
                                    "longitude": "-73.633679",
                                    "email": "",
                                    "phones": []
                                }
                            ],
                            "contact": {
                                "addressType": "Home",
                                "prefix": "",
                                "firstName": "SUZY",
                                "middleName": "LEVINGSTON",
                                "lastName": "BUFFIN",
                                "suffix": "",
                                "fullName": "SUZY LEVINGSTON BUFFIN",
                                "contactType": "MEMBER",
                                "contactAddress": {
                                    "addressType": "Home",
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.844966",
                                    "longitude": "-73.596804",
                                    "email": "",
                                    "phones": []
                                }
                            }
                        }
                    },
                    {
                        "memberId": "964311201",
                        "info": {
                            "addresses": [
                                {
                                    "addressType": "Home",
                                    "addressPrecedence": 1,
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.844966",
                                    "longitude": "-73.596804",
                                    "email": "AMEL.BUFFIN@HFTDM.COM",
                                    "phones": [
                                        {
                                            "phoneType": "Home",
                                            "phoneNumber": "19312533389"
                                        },
                                        {
                                            "phoneType": "Alt",
                                            "phoneNumber": "14322736639"
                                        },
                                        {
                                            "phoneType": "Other",
                                            "phoneNumber": "19312533389"
                                        }
                                    ]
                                },
                                {
                                    "addressType": "Responsible Party",
                                    "addressPrecedence": 2,
                                    "prefix": "",
                                    "firstName": "SASHA",
                                    "middleName": "",
                                    "lastName": "BUFFIN",
                                    "suffix": "",
                                    "fullName": "SASHA BUFFIN",
                                    "responsiblePartyType": "Miscellaneous Responsible Party",
                                    "addressLine1": "4496 MELVILLE STREET",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.840490",
                                    "longitude": "-73.633679",
                                    "email": "",
                                    "phones": []
                                }
                            ],
                            "contact": {
                                "addressType": "Home",
                                "prefix": "",
                                "firstName": "AMEL",
                                "middleName": "MCDONALD",
                                "lastName": "BUFFIN",
                                "suffix": "",
                                "fullName": "AMEL MCDONALD BUFFIN",
                                "contactType": "MEMBER",
                                "contactAddress": {
                                    "addressType": "Home",
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.844966",
                                    "longitude": "-73.596804",
                                    "email": "AMEL.BUFFIN@HFTDM.COM",
                                    "phones": [
                                        {
                                            "phoneType": "Home",
                                            "phoneNumber": "19312533389"
                                        },
                                        {
                                            "phoneType": "Alt",
                                            "phoneNumber": "14322736639"
                                        },
                                        {
                                            "phoneType": "Other",
                                            "phoneNumber": "19312533389"
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        "memberId": "964311203",
                        "info": {
                            "addresses": [
                                {
                                    "addressType": "Home",
                                    "addressPrecedence": 1,
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.844966",
                                    "longitude": "-73.596804",
                                    "email": "",
                                    "phones": []
                                },
                                {
                                    "addressType": "Responsible Party",
                                    "addressPrecedence": 2,
                                    "prefix": "",
                                    "firstName": "SASHA",
                                    "middleName": "",
                                    "lastName": "BUFFIN",
                                    "suffix": "",
                                    "fullName": "SASHA BUFFIN",
                                    "responsiblePartyType": "Miscellaneous Responsible Party",
                                    "addressLine1": "4496 MELVILLE STREET",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.840490",
                                    "longitude": "-73.633679",
                                    "email": "",
                                    "phones": []
                                }
                            ],
                            "contact": {
                                "addressType": "Home",
                                "prefix": "",
                                "firstName": "ATHANASIOS",
                                "middleName": "",
                                "lastName": "BUFFIN",
                                "suffix": "",
                                "fullName": "ATHANASIOS BUFFIN",
                                "contactType": "MEMBER",
                                "contactAddress": {
                                    "addressType": "Home",
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.844966",
                                    "longitude": "-73.596804",
                                    "email": "",
                                    "phones": []
                                }
                            }
                        }
                    },
                    {
                        "memberId": "420000000696101",
                        "info": {
                            "addresses": [
                                {
                                    "addressType": "Home",
                                    "addressPrecedence": 1,
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.844966",
                                    "longitude": "-73.596804",
                                    "email": "",
                                    "phones": [
                                        {
                                            "phoneType": "Home",
                                            "phoneNumber": "19312533389"
                                        },
                                        {
                                            "phoneType": "Other",
                                            "phoneNumber": "14322736639"
                                        }
                                    ]
                                }
                            ],
                            "contact": {
                                "addressType": "Home",
                                "prefix": "",
                                "firstName": "NORIKO",
                                "middleName": "",
                                "lastName": "BUFFIN",
                                "suffix": "",
                                "fullName": "NORIKO BUFFIN",
                                "contactType": "MEMBER",
                                "contactAddress": {
                                    "addressType": "Home",
                                    "addressLine1": "1302 UPLAND AVENUE",
                                    "addressLine2": "",
                                    "city": "HICKSVILLE",
                                    "state": "NY",
                                    "zip": "11801",
                                    "zipExt": "",
                                    "county": "NASSAU",
                                    "country": "USA",
                                    "mailScore": "5",
                                    "certifiedMailScore": "",
                                    "certifiedMailStatus": "",
                                    "latitude": "40.844966",
                                    "longitude": "-73.596804",
                                    "email": "",
                                    "phones": [
                                        {
                                            "phoneType": "Home",
                                            "phoneNumber": "19312533389"
                                        },
                                        {
                                            "phoneType": "Other",
                                            "phoneNumber": "14322736639"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        },
        submitClaimDetails: {
            loading: false
        },
        submitAttestationAgreement: {
            loading: false
        }
    }
    return mockStore(initialState)
}