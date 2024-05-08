export const cards = {
  deductible: {
    header: "Deductible",
    maxTitle: "Annual Deductible",
    currrentTitle: "Amount Applied To Deductable",
  },
  outOfPocket: {
    header: "Out Of Pocket",
    maxTitle: "Maximum Out Of Pocket (MOOP)",
    currrentTitle: "Amount Applied To Maximum Out Of Pocket (MOOP)",
  },
  familyDeductible: {
    header: "Family Deductible",
    maxTitle: "Annual Deductible",
    currrentTitle: "Amount Applied To Deductable",
  },
  familyOutOfPocket: {
    header: "Family Out Of Pocket",
    maxTitle: "Maximum Out Of Pocket (MOOP)",
    currrentTitle: "Amount Applied To Maximum Out Of Pocket (MOOP)",
  },
};

export const content = [
  {
    id: 0,
    type: "Individual",
    data: [
      { id: 0, title: "deductible" },
      { id: 1, title: "outOfPocket" },
    ],
  },
  {
    id: 1,
    type: "Family",
    data: [
      { id: 0, title: "familyDeductible" },
      { id: 1, title: "familyOutOfPocket" },
    ],
  },
];
