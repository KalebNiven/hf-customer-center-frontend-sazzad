// for testing
import FormsAndDocumentsModel from "./formsAndDocument";
import styled from "styled-components";

import React, { useState, useEffect, useRef } from "react";
import { Box, useMediaQuery, useTheme, Hidden } from "@material-ui/core";
import Pagination from "../common/pagination";
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import { LanguageSelect, Language } from "../common/styles";
import DocGeneralBlock from "../coverageBenefits/formsAndDocuments/docGeneralBlock";
import CommonlyUsedForm from "./commonlyUsedForm";
import {
  Container,
  Main,
  MyDocuments,
  SubTitle,
  CurrentlyEnrolled,
  HrLine,
  TableDataUI,
  Paperless,
  LeafIcon,
  FilterWrapper,
  DocumentRangeButton,
  ClearAll,
  NoData,
  DocumentRangeShowWrapper,
  DependentBlockWrapper,
  DateContent,
  DateComponent,
  EndDateComponent,
  DateButton,
  DateWrapper,
  styleWithMargin,
  styleWithoutMargin,
  ImgIcon,
  NoHighlight,
  Highlight,
  Day,
  FilterButton,
} from "./style";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DocumentType from "./documentType";
import DocumentsCenterPage from "../../pages/documents-center/DocumentsCenterPage";
import { useDispatch, useSelector } from "react-redux";
import { requestCCFormsDocs } from "../../store/actions";

const FormsAndDocuments = (props) => {

// for test  purpose
const data = [
  {
      "id": 5,
      "benefitPackage": "LIP1",
      "companyCode": "30",
      "lob": "LIP",
      "groupNumber": "LIP65+",
      "year": 2024,
      "cc_additional_resources": [
          {
              "id": 1,
              "Name": "Medicare Part B Step Therapy Information",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:07:04.000Z",
              "created_at": "2023-12-11T17:06:20.000Z",
              "updated_at": "2023-12-14T19:07:53.000Z",
              "assetUrl": {
                  "id": 2877,
                  "en": "https://assets.healthfirst.org/pdf_1fd4ad0d7549be0427b802161e9b6a53",
                  "es": "https://assets.healthfirst.org/pdf_426097dde710d88b54514e837402e975",
                  "zh": "https://assets.healthfirst.org/pdf_22a8cb932fa1e222263aed4e4fc3105d"
              }
          },
          {
              "id": 2,
              "Name": "Regulation 194 - Disclosure",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:06:56.000Z",
              "created_at": "2023-12-11T17:06:49.000Z",
              "updated_at": "2023-12-14T19:08:09.000Z",
              "assetUrl": {
                  "id": 2878,
                  "en": "https://assets.healthfirst.org/pdf_93da4eb6aaf2c951021ef1e1f123854e",
                  "es": "https://assets.healthfirst.org/pdf_d31dd832ecc30538c5129a9c543b3961 ",
                  "zh": "https://assets.healthfirst.org/pdf_7ad5f3e6e8b3118ba8a67afc930b2946 "
              }
          },
          {
              "id": 3,
              "Name": "Dental Quick Reference Guide",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:07:44.000Z",
              "created_at": "2023-12-11T17:07:43.000Z",
              "updated_at": "2023-12-14T19:08:34.000Z",
              "assetUrl": {
                  "id": 2879,
                  "en": "https://assets.healthfirst.org/pdf_4V6UaL99A8/2024-medicare-advantage-plans-dental-benefits-english",
                  "es": "https://assets.healthfirst.org/pdf_ENB5sa_V_UB/2024-medicare-advantage-plans-dental-benefits-spanish",
                  "zh": "https://assets.healthfirst.org/pdf_TfFqdqjF8FUQ/2024-medicare-advantage-plans-dental-benefits-chinese"
              }
          },
          {
              "id": 4,
              "Name": "Advance Directives",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:08:28.000Z",
              "created_at": "2023-12-11T17:08:26.000Z",
              "updated_at": "2023-12-14T19:08:49.000Z",
              "assetUrl": {
                  "id": 2880,
                  "en": "https://assets.healthfirst.org/pdf_F36W9G1EvEu2/2024-advance-directives-english",
                  "es": "https://assets.healthfirst.org/pdf_ISgFwo2ZM78G/2024-advance-directives-spanish",
                  "zh": "https://assets.healthfirst.org/pdf_xwaHTXiUC7S1/2024-advance-directives-chinese"
              }
          },
          {
              "id": 5,
              "Name": "Healthfirst’s Privacy Notice",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:09:07.000Z",
              "created_at": "2023-12-11T17:09:05.000Z",
              "updated_at": "2023-12-14T19:09:06.000Z",
              "assetUrl": {
                  "id": 2881,
                  "en": "https://assets.healthfirst.org/pdf_bdbbf2b17950a361672404fed5c33d90 ",
                  "es": "https://assets.healthfirst.org/pdf_9a6c203fa4ad9f694ad7d2046b8c74dd ",
                  "zh": "https://assets.healthfirst.org/pdf_ea7d8b80fb553148f2902c02606aeb51 "
              }
          },
          {
              "id": 6,
              "Name": "Nondiscrimination Notice",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:09:42.000Z",
              "created_at": "2023-12-11T17:09:40.000Z",
              "updated_at": "2023-12-14T19:09:21.000Z",
              "assetUrl": {
                  "id": 2882,
                  "en": "https://assets.healthfirst.org/Notice_of_Non-Discrimination ",
                  "es": "http://assets.healthfirst.org/pdf_bb5922e421b358c6326ea35a4721b806 ",
                  "zh": "http://assets.healthfirst.org/pdf_a14b9cc1646333917e2d85aa2d37776b "
              }
          }
      ],
      "cc_commonly_used_form": null,
      "cc_general_form": null,
      "cc_plan_document": null,
      "published_at": "2023-12-14T19:22:05.000Z",
      "created_at": "2023-12-14T19:22:03.000Z",
      "updated_at": "2023-12-15T15:42:37.000Z",
      "cc_commonly_used_forms": [
          {
              "id": 5,
              "Name": "Appointment of Representative (AOR) Form",
              "benefitPackage": "NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "30",
              "year": 2024,
              "groupNumber": "MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "published_at": "2023-12-14T19:01:16.000Z",
              "created_at": "2023-12-14T18:34:06.000Z",
              "updated_at": "2023-12-14T19:01:16.000Z",
              "assetUrl": {
                  "id": 2911,
                  "en": "https://assets.healthfirst.org/pdf_0837330832/appointment-of-representative-form-english",
                  "es": "https://assets.healthfirst.org/pdf_98cb9867a5/appointment-of-representative-form-spanish",
                  "zh": "https://assets.healthfirst.org/pdf_9a3a80598c8a27f8731d5a7178fff79b/appointment-of-representative-form-chinese"
              }
          },
          {
              "id": 6,
              "Name": "Authorization to Release Protected Health Information (PHI) Form",
              "benefitPackage": "NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "30",
              "year": 2024,
              "groupNumber": "MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "published_at": "2023-12-14T19:01:48.000Z",
              "created_at": "2023-12-14T19:01:46.000Z",
              "updated_at": "2023-12-14T19:01:48.000Z",
              "assetUrl": {
                  "id": 2912,
                  "en": "https://assets.healthfirst.org/pdf_70c9e7336404250905d93411135787b3/authorization-release-protected-health-information-form-english",
                  "es": "https://assets.healthfirst.org/pdf_70c9e7336404250905d93411135787b3/authorization-release-protected-health-information-form-english",
                  "zh": "https://assets.healthfirst.org/pdf_5296682cfb5035d4ea59f3b80ca83d74/authorization-release-protected-health-information-form-chinese"
              }
          }
      ],
      "cc_general_forms": [
          {
              "id": 7,
              "Name": "Authorization to Release Protected Health Information (PHI) Form",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:01:08.000Z",
              "created_at": "2023-12-11T17:01:07.000Z",
              "updated_at": "2023-12-14T19:03:32.000Z",
              "assetUrl": {
                  "id": 2875,
                  "en": "https://assets.healthfirst.org/pdf_70c9e7336404250905d93411135787b3/authorization-release-protected-health-information-form-english",
                  "es": "https://assets.healthfirst.org/pdf_ab0c5153e86ec5c0f12d98018639ca84/authorization-release-protected-health-information-form-spanish",
                  "zh": "https://assets.healthfirst.org/pdf_5296682cfb5035d4ea59f3b80ca83d74/authorization-release-protected-health-information-form-chinese"
              }
          },
          {
              "id": 8,
              "Name": "Appointment of Representative (AOR) Form",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:01:50.000Z",
              "created_at": "2023-12-11T17:01:48.000Z",
              "updated_at": "2023-12-14T19:03:39.000Z",
              "assetUrl": {
                  "id": 2876,
                  "en": "https://assets.healthfirst.org/pdf_0837330832/appointment-of-representative-form-english",
                  "es": "https://assets.healthfirst.org/pdf_98cb9867a5/appointment-of-representative-form-spanish",
                  "zh": "https://assets.healthfirst.org/pdf_9a3a80598c8a27f8731d5a7178fff79b/appointment-of-representative-form-chinese"
              }
          },
          {
              "id": 1,
              "Name": "General Medicare Member Benefit Reimbursement Form",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T16:57:40.000Z",
              "created_at": "2023-12-11T16:52:40.000Z",
              "updated_at": "2023-12-14T19:03:49.000Z",
              "assetUrl": {
                  "id": 2868,
                  "en": "https://assets.healthfirst.org/pdf_644751755bd39661e7beb7a12ddb87be",
                  "es": "https://assets.healthfirst.org/pdf_a384bc9bbed89e46ba15dfa1a4de88f8",
                  "zh": "https://assets.healthfirst.org/pdf_41779bf6850aba93df2c496e06175b12"
              }
          },
          {
              "id": 2,
              "Name": "Post-Discharge Meals Benefit Instructions and Request/Prescription Form",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T16:57:46.000Z",
              "created_at": "2023-12-11T16:53:16.000Z",
              "updated_at": "2023-12-14T19:04:03.000Z",
              "assetUrl": {
                  "id": 2870,
                  "en": "https://assets.healthfirst.org/pdf_39b320476478aadde31eb93a072a511d/2023-post-discharge-meals-benefit-instructions-english",
                  "es": "https://assets.healthfirst.org/pdf_a1fdaa9dd4abc673a0510134acefb9ed/2023-post-discharge-meals-benefit-instructions-spanish",
                  "zh": "https://assets.healthfirst.org/pdf_896e0ef50c1d2a6ce51161031c5f9d3d/2023-post-discharge-meals-benefit-instructions-chinese"
              }
          },
          {
              "id": 3,
              "Name": "Part D Coverage Determination Form",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:00:19.000Z",
              "created_at": "2023-12-11T16:58:20.000Z",
              "updated_at": "2023-12-14T19:04:27.000Z",
              "assetUrl": {
                  "id": 2871,
                  "en": "https://assets.healthfirst.org/pdf_a91a4864365e99e25c6ae324c88b2835",
                  "es": "https://assets.healthfirst.org/pdf_730bc3b338d70ba0e0dedd0650ea8c0d",
                  "zh": ""
              }
          },
          {
              "id": 4,
              "Name": "Part D Coverage Redetermination Form",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T16:59:02.000Z",
              "created_at": "2023-12-11T16:59:01.000Z",
              "updated_at": "2023-12-14T19:04:43.000Z",
              "assetUrl": {
                  "id": 2872,
                  "en": "https://assets.healthfirst.org/pdf_6c3eca5e09cb61e2216257d699c457d6",
                  "es": "https://assets.healthfirst.org/pdf_01afad1df8df5ed9667320a1f13d8929",
                  "zh": ""
              }
          },
          {
              "id": 5,
              "Name": "CVS Mail Service Order Form",
              "benefitPackage": "PPOM,CCO1,CC02,NY65,DMCR, IBP1, LIP1, SIGO,SIGT",
              "companyCode": "45,34, 30",
              "groupNumber": "MCRPPO,CC1000,MCR65+,DMEDC,IBP65+,LIP65+,SIGHM1,SIGHM2",
              "year": 2024,
              "published_at": "2023-12-11T17:00:00.000Z",
              "created_at": "2023-12-11T16:59:46.000Z",
              "updated_at": "2023-12-14T19:04:55.000Z",
              "assetUrl": {
                  "id": 2873,
                  "en": "https://assets.healthfirst.org/pdf_3708882840332c59d748f85e855b898e",
                  "es": "https://assets.healthfirst.org/pdf_63d4f7e613e08f8bd0c6065a3b936d83",
                  "zh": ""
              }
          },
          {
              "id": 6,
              "Name": "Pharmacy Claims Reimbursement Form",
              "benefitPackage": "PPOM,CCO1,CC02",
              "companyCode": "45,34",
              "groupNumber": "MCRPPO,CC1000",
              "year": 2024,
              "published_at": "2023-12-11T17:00:23.000Z",
              "created_at": "2023-12-11T17:00:15.000Z",
              "updated_at": "2023-12-12T15:15:13.000Z",
              "assetUrl": {
                  "id": 2874,
                  "en": "https://assets.healthfirst.org/pdf_0f9c3e22b746dd15672a7e93256e1068",
                  "es": "",
                  "zh": ""
              }
          }
      ],
      "cc_plan_documents": [
          {
              "id": 49,
              "Name": "Comprehensive Formulary",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:28:49.000Z",
              "created_at": "2023-12-15T15:28:48.000Z",
              "updated_at": "2023-12-15T15:28:49.000Z",
              "assetUrl": {
                  "id": 2934,
                  "en": "https://assets.healthfirst.org/pdf_DqomnqvRbl65/2024-life-improvement-plan-comprehensive-formulary-multi-language",
                  "es": "",
                  "zh": ""
              }
          },
          {
              "id": 50,
              "Name": "Life Improvement Plan Monthly Formulary Changes",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:29:37.000Z",
              "created_at": "2023-12-15T15:29:35.000Z",
              "updated_at": "2023-12-15T15:29:37.000Z",
              "assetUrl": {
                  "id": 2935,
                  "en": "https://assets.healthfirst.org/pdf_9FPs7zHNZpPt/2024-65-plus-cc-lip-ibp-monthly-formulary-changes-english",
                  "es": "https://assets.healthfirst.org/pdf_IftyIkVjdMBn/2024-65-plus-cc-lip-ibp-monthly-formulary-changes-spanish",
                  "zh": "https://assets.healthfirst.org/pdf_wSOQc29f0Ath/2024-65-plus-cc-lip-ibp-monthly-formulary-changes-chinese"
              }
          },
          {
              "id": 51,
              "Name": "Annual Notice of Changes",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:30:11.000Z",
              "created_at": "2023-12-15T15:30:09.000Z",
              "updated_at": "2023-12-15T15:30:12.000Z",
              "assetUrl": {
                  "id": 2936,
                  "en": "https://assets.healthfirst.org/pdf_d_5Rtx7EEp8U/2024-life-improvement-plan-annual-notice-of-change-english ",
                  "es": "https://assets.healthfirst.org/pdf_AP7F_JzqfImO/2024-life-improvement-plan-annual-notice-of-change-spanish ",
                  "zh": "https://assets.healthfirst.org/pdf_Jdrx_FuhT6FC/2024-life-improvement-plan-annual-notice-of-change-chinese "
              }
          },
          {
              "id": 52,
              "Name": "Evidence of Coverage",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:31:35.000Z",
              "created_at": "2023-12-15T15:31:33.000Z",
              "updated_at": "2023-12-15T15:31:35.000Z",
              "assetUrl": {
                  "id": 2937,
                  "en": "https://assets.healthfirst.org/pdf_qkLshZAK3uQG/2024-life-improvement-plan-evidence-of-coverage-english ",
                  "es": "https://assets.healthfirst.org/pdf_5rIFyAxr_GyV/2024-life-improvement-plan-evidence-of-coverage-spanish ",
                  "zh": "https://assets.healthfirst.org/pdf_NIqpevRNbJaO/2024-life-improvement-plan-evidence-of-coverage-chinese "
              }
          },
          {
              "id": 53,
              "Name": "Summary of Benefits",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:32:06.000Z",
              "created_at": "2023-12-15T15:32:04.000Z",
              "updated_at": "2023-12-15T15:32:06.000Z",
              "assetUrl": {
                  "id": 2938,
                  "en": "https://assets.healthfirst.org/pdf_j6bO86KUsxI_/2024-life-improvement-plan-summary-of-benefits-english ",
                  "es": "https://assets.healthfirst.org/pdf_gNd3ftCA2gHr/2024-life-improvement-plan-summary-of-benefits-spanish ",
                  "zh": "https://assets.healthfirst.org/pdf_sg9AYbR9M2lj/2024-life-improvement-plan-summary-of-benefits-chinese "
              }
          },
          {
              "id": 54,
              "Name": "Welcome Kit Booklet",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:32:33.000Z",
              "created_at": "2023-12-15T15:32:31.000Z",
              "updated_at": "2023-12-15T15:32:33.000Z",
              "assetUrl": {
                  "id": 2939,
                  "en": "https://assets.healthfirst.org/pdf_pKcrNZlOXlEe/2024-life-improvement-plan-guide-to-getting-started-booklet-english ",
                  "es": "https://assets.healthfirst.org/pdf_ov9A35FHfNu4/2024-life-improvement-plan-guide-to-getting-started-booklet-spanish ",
                  "zh": "https://assets.healthfirst.org/pdf_FOmZj992sES2/2024-life-improvement-plan-guide-to-getting-started-booklet-chinese "
              }
          },
          {
              "id": 55,
              "Name": "2024 Star Ratings",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:33:40.000Z",
              "created_at": "2023-12-15T15:33:38.000Z",
              "updated_at": "2023-12-15T15:33:40.000Z",
              "assetUrl": {
                  "id": 2940,
                  "en": "https://assets.healthfirst.org/pdf_JEvVNAFNGdl/2024-65p-cc-ibp-lip-plan-h3359-medicare-star-ratings-english ",
                  "es": "https://assets.healthfirst.org/pdf_2D3IjahEQuC/2024-65p-cc-ibp-lip-plan-h3359-medicare-star-ratings-spanish ",
                  "zh": "https://assets.healthfirst.org/pdf_9fsZ5lP71etm/2024-65p-cc-ibp-lip-plan-h3359-medicare-star-ratings-chinese "
              }
          },
          {
              "id": 56,
              "Name": "Post-Discharge Meals Benefit Frequently Asked Questions",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:34:21.000Z",
              "created_at": "2023-12-15T15:34:19.000Z",
              "updated_at": "2023-12-15T15:34:21.000Z",
              "assetUrl": {
                  "id": 2941,
                  "en": "https://assets.healthfirst.org/pdf_2e128b74480ae7c2fbe25c9d3ab80e3c/2023-post-discharge-meal-benefit-frequently-asked-questions-english ",
                  "es": "https://assets.healthfirst.org/pdf_b6bff2fc5c073b772c265ef37615e0e7/2023-post-discharge-meal-benefit-frequently-asked-questions-spanish ",
                  "zh": "https://assets.healthfirst.org/pdf_5f5e3986960eb9f9bfd8c478f486fb29/2023-post-discharge-meal-benefit-frequently-asked-questions-chinese "
              }
          },
          {
              "id": 57,
              "Name": "Medicare Dental Benefit Limitations and Exclusions Guide",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:34:54.000Z",
              "created_at": "2023-12-15T15:34:52.000Z",
              "updated_at": "2023-12-15T15:34:54.000Z",
              "assetUrl": {
                  "id": 2942,
                  "en": "https://assets.healthfirst.org/pdf_tTOf0qM4PPlV/2024-medicare-advantage-plans-dental-benefit-limitations-and-exclusions-guide-english ",
                  "es": "https://assets.healthfirst.org/pdf_sBGtTx6wZ51/2024-medicare-advantage-plans-dental-benefit-limitations-and-exclusions-guide-spanish ",
                  "zh": "https://assets.healthfirst.org/pdf_g7Fg0tFpfvs6/2024-medicare-advantage-plans-dental-benefit-limitations-and-exclusions-guide-chinese "
              }
          },
          {
              "id": 58,
              "Name": "List of Drugs Requiring Prior Authorization",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:35:20.000Z",
              "created_at": "2023-12-15T15:35:19.000Z",
              "updated_at": "2023-12-15T15:35:20.000Z",
              "assetUrl": {
                  "id": 2943,
                  "en": "https://assets.healthfirst.org/pdf_YIlphSo1WWgE/2024-65p-ibp-sig-hmo-sig-ppo-list-of-drugs-requiring-prior-authorization-english",
                  "es": "",
                  "zh": ""
              }
          },
          {
              "id": 59,
              "Name": "List of Drugs Requiring Step Therapy",
              "benefitPackage": "LIP1",
              "companyCode": "30",
              "groupNumber": "LIP65+",
              "year": 2024,
              "published_at": "2023-12-15T15:41:35.000Z",
              "created_at": "2023-12-15T15:41:33.000Z",
              "updated_at": "2023-12-15T15:41:35.000Z",
              "assetUrl": {
                  "id": 2944,
                  "en": "https://assets.healthfirst.org/pdf_Z12YKtkNbyWN/2024-65p-ibp-sig-hmo-sig-ppo-list-of-drugs-requiring-step-therapy-english",
                  "es": "",
                  "zh": ""
              }
          }
      ]
  }
]

  const dispatch = useDispatch();

  const [navItems, setNavItems] = useState([
    {
      activeIcon: `/react/images/icn-hf-logo.svg`,
      inactiveIcon: `/react/images/icn-hf-logo.svg`,
      label: "Forms and Plan Documents",
      labelForSegment: "Forms and Plan Documents",
      type: "logo",
      href: "/forms-and-documents",
      childNavs: [],
      coachmark: null,
      mobileCoachmark: null,
      treatmentName: null,
    },
    {
      activeIcon: `/react/images/icn-my-plan-active.svg`,
      inactiveIcon: `/react/images/ico-plan.svg`,
      label: "Plan Communications",
      labelForSegment: "Plan Communications",
      type: "navItem",
      href: "/document-center",
      childNavs: null,
      coachmark: null,
      mobileCoachmark: "myPlanMobileNav-coachmark",
      treatmentName: null,
    },
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const history = useHistory();
  const [RowId, setRowID] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [benfBtnIndex, setBenfBtnIndex] = useState(null);
  const [genBtnIndex, setGenBtnIndex] = useState(null);
  const languageModelRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(navItems[0].href);
  const { loading, documents } = useSelector((state) => state.ccFormsDoc);

  useEffect(() => {
    const data = {
      memberId: 138679451,
      benefitPackage: "LIP1",
      companyCode: 30,
      lob: "LIP",
      year: 2024
    };

    dispatch(requestCCFormsDocs(data));
  }, []);

 

  useEffect(() => {
    sessionStorage.setItem("longLoad", false);
  }, []);

  const handleClick = (href) => {
    setSelectedTab(href);
  };

  const showLangMenu = (docIndex, index) => {
    docIndex ? setBenfBtnIndex(1) : setGenBtnIndex(1);
  };

  return (
    <Container>
      <MyDocuments isMobile={isMobile}>Forms and Documents</MyDocuments>
      {isMobile ? (
        <>
          <SubTitle>Select a Document Type</SubTitle>
          <DocumentType />
        </>
      ) : (
        <Main>
          <Tabs
            value={false}
            TabIndicatorProps={{
              style: { background: "#3e7128" },
            }}
            className="reactNavMenu-coachmark"
            style={{ display: "inline-flex" }}
          >
            {navItems.map((eachNav, index) => (
              <Tab
                label={eachNav.label}
                value={eachNav.href}
                onClick={() => handleClick(eachNav.href)}
                className={
                  selectedTab == eachNav.href
                    ? "child-tab-active"
                    : "child-tab-inactive"
                }
              />
            ))}
          </Tabs>
          <HrLine />

          {selectedTab === "/document-center" ? (
            <DocumentsCenterPage />
          ) : (
            <>
              <MyDocuments>Forms and Plan Document</MyDocuments>
              <SubTitle>Commonly Used Forms</SubTitle>
              <Wrapper>
              <CommonlyUsedForm data = {data[0].cc_commonly_used_forms} />
              </Wrapper>
              <SubTitle>General Forms</SubTitle>
              <DocsList data = {data[0].cc_general_forms}/>
              <SubTitle>Plan Documents</SubTitle>
              <DocsList data = {data[0].cc_plan_documents}/>
              <SubTitle>Additional Resources</SubTitle>
              <DocsList data = {data[0].cc_additional_resources}/>
              
            </>
          )}
        </Main>
      )}
    </Container>
  );
};

const DocsList = (props) =>{

  const [isOpen, setIsOpen] = useState();
  const [RowName,setRowName] = useState();

  const languageModelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageModelRef.current &&
        !languageModelRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [languageModelRef]);

  const customStyles = {
    headCells: {
      style: {
        background: "#f4f4f4",
        color: "#757575",
        fontSize: "12px",
        fontWeight: "400",
        textTransform: "uppercase",
        border: "none",
      },
    },
    table: {
      style: {
        borderCollapse: "separate",
        borderSpacing: "8px",
      },
    },
    rows: {
      style: {
        boxShadow: "0px 2px 8px 0px rgb(0 0 0 / 10%)",
        borderRadius: "4px",
        width: "auto",
        padding: "0",
        outline: 0,
      },
    },
    cells: {
      style: {
        width: "auto",
        height: "auto",
        padding: "0",
      },
    },
  };

  const columns = [
    {
      id: "Documents",
      selector: (row) => (
        <div data-tag="allowRowEvents" className="iconWrapper">
          <div data-tag="allowRowEvents" className="icon">
            <img
              data-tag="allowRowEvents"
              src="/react/images/documents-pdf-icon.svg"
            />
          </div>
          <div data-tag="allowRowEvents" className="name">
            {row.Name}
          </div>
        </div>
      ),
    },
    {
      id: "download",
      selector: "download",
      cell: (row) => (
        <a
          className="download"
          onClick={(e) => {
            handleSegmentBtn("Download button", row);
            window.open(
              `/documents/${
                row.NodeID ? row.NodeID : row.DocumentID
              }?isNodeId=${row.NodeID ? "true" : "false"}`,
              "_blank"
            );
          }}
        >
          <img
            ref={languageModelRef}
            className="download-icon"
            src="/react/images/download_pdf.svg"
            onClick={() => {setIsOpen(true),setRowName(row.Name)}}
          ></img>

          <LanguageSelect isOpen={(row.Name === RowName) } last={false}>
            <Language onClick={() => window.open(row.assetUrl.en)}>
              English
            </Language>

            <Language onClick={() => window.open(row.assetUrl.es)}>
              Spanish
            </Language>

            <Language onClick={() => window.open(row.assetUrl.zh)}>
              Chinese
            </Language>
          </LanguageSelect>
        </a>
      ),
      name: "",
      maxWidth: "60px",
    },
  ];

  return (
    <TableDataUI>
                <Hidden only={["xs"]}>
                  <DataTable
                    noHeader={true}
                    data={props.data}
                    columns={columns}
                    pagination
                    paginationPerPage={10}
                    paginationComponent={Pagination}
                    onChangePage={(page) => {
                      if (page) {
                        const segmentMessage = `Page No. ${page}`;
                        handleSegmentBtn(
                          "PageChangeButton",
                          undefined,
                          segmentMessage
                        );
                      }
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage) => {
                      if (currentRowsPerPage) {
                        const segmentMessage = `No. of Documents per page ${currentRowsPerPage}`;
                        handleSegmentBtn(
                          "DocumentsPerPage",
                          undefined,
                          segmentMessage
                        );
                      }
                    }}
                    defaultSortField="CreationDate"
                    onSort={({ name }) => {
                      if (name) {
                        const segmentMessage = `${name} sort`;
                        handleSegmentBtn(
                          segmentMessage,
                          undefined,
                          segmentMessage
                        );
                      }
                    }}
                    defaultSortAsc={false}
                    noDataComponent={<NoData />}
                    style={{
                      boxShadow: "0 2px 8px 0 #d8d8d8",
                      borderRadius: "4px",
                      display: "inline",
                    }}
                    onRowClicked={(row) => {
                      handleSegmentBtn("Download button", row);
                      window.open(
                        `/documents/${
                          row.NodeID ? row.NodeID : row.DocumentID
                        }?isNodeId=${row.NodeID ? "true" : "false"}`,
                        "_blank"
                      );
                    }}
                    customStyles={customStyles}
                  />
                </Hidden>
              </TableDataUI>
  );

}

const Index = (props) => {
  return <FormsAndDocuments />;
};

export default Index;

//const IconDownload = styled.div``

const Wrapper = styled.div`
display :flex ;
`;
