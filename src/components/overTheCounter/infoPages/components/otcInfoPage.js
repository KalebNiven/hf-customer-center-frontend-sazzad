import React from 'react'
import CompleteCareHMOPage from '../pages/CompleteCareHMOPage'
import ConnectionHMOPage from '../pages/ConnectionHMOPage'
import IncreasedBenefitsHMOPage from '../pages/IncreasedBenefitsHMOPage'
import LifeImprovementHMOPage from '../pages/LifeImprovementHMOPage'
import SignatureHMOPage from '../pages/SignatureHMOPage'
import SignaturePPOPage from '../pages/SignaturePPOPage'
import { useSelector } from 'react-redux'
import { SHOW_OTC_LEARN_MORE_PAGES } from "../../../../constants/splits";
import { FeatureTreatment } from "../../../../libs/featureFlags";

const OTCInfoPage = () => {

    const customerInfo = useSelector((state) => state.customerInfo.data);

    const getInfoPage = (benefitPackages) => {
        switch (true) {
            case benefitPackages.includes("CC01"):
            case benefitPackages.includes("CC02"):
                return <CompleteCareHMOPage />
            case benefitPackages.includes("DMCR"):
                return <ConnectionHMOPage />
            case benefitPackages.includes("IBP1"):
                return <IncreasedBenefitsHMOPage />
            case benefitPackages.includes("LIP1"):
                return <LifeImprovementHMOPage />
            case benefitPackages.includes("SIGO"):
                return <SignatureHMOPage />
            case benefitPackages.includes("PPOM"):
                return <SignaturePPOPage />
            default:
                return <></>
        }
    }

    return (
        <>
            <FeatureTreatment
                treatmentName={SHOW_OTC_LEARN_MORE_PAGES}
                onTimedout={() => { }}
                attributes={{
                    planCode: customerInfo?.planCode,
                    companyCode: customerInfo?.companyCode,
                    benefitPackage: customerInfo?.hohPlans?.map(plan => plan.BenefitPackage),
                    membershipStatus: customerInfo?.membershipStatus,
                }}
            >
                {getInfoPage(customerInfo?.hohPlans?.map(plan => plan.BenefitPackage))}
            </FeatureTreatment>
        </>
    )
}

export default OTCInfoPage
