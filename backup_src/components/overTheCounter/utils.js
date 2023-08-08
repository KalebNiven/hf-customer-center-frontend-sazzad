export const generateCardType = (hohPlans) => {
    let cardType = "OTC"; 
    hohPlans.forEach((plans) => {
    if(["LIP1", "IBP1", "DMCR", "CC01", "CC02"].includes(plans.BenefitPackage)) return cardType = "OTC Plus";
    if(["PPOM"].includes(plans.BenefitPackage)) return cardType = "Flex";
});
    return cardType;
}