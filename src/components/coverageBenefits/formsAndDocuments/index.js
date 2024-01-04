import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestFormsDocs } from '../../../store/actions'; 
import { Anchor } from '../styles'
import Spinner from "../../common/spinner";
import { AnalyticsTrack } from "../../common/segment/analytics";
import { ANALYTICS_TRACK_TYPE, ANALYTICS_TRACK_CATEGORY } from "../../../constants/segment";
import FormsAndDocumentBlock from "./formsAndDocumentBlock";


const FormsAndDocuments = ({ selectedMemberId }) => {
    const { loading, documents } = useSelector((state) => state.coverageBenefits);
    const customerInfo = useSelector((state) => state.customerInfo);
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const [benfBtnIndex, setBenfBtnIndex] = useState(null);
    const [genBtnIndex, setGenBtnIndex] = useState(null);

    useEffect(() => {
        if(selectedMemberId) {
            dispatch(requestFormsDocs(selectedMemberId));
        
            document.addEventListener("mousedown", handleOutsideMenuClick);
        
            return () => {
            document.removeEventListener("mousedown", handleOutsideMenuClick);
            };
        }
      }, [selectedMemberId]);

    useEffect(() => {
        if(benfBtnIndex !== null)
          setMenuOpen(true);
        else
          setMenuOpen(false);
      }, [benfBtnIndex]);
    
    useEffect(() => {
        if(genBtnIndex !== null)
        setMenuOpen(true);
        else
        setMenuOpen(false);
    }, [genBtnIndex]);

    const handleOutsideMenuClick = (e) => {
        if (e.target.dataset.langid) handleLangSelect(e.target.getAttribute('value'), e.target);
        setBenfBtnIndex(null);
        setGenBtnIndex(null);
    }

    const handleLangSelect = (doc, target) => {
        setBenfBtnIndex(null);
        setGenBtnIndex(null);

        // Segment Track
        AnalyticsTrack(
            target.dataset.title + " Opened (Forms & Documents)", 
            customerInfo,
            {
                "raw_text": target.textContent, 
                "destination_url": doc, 
                "category": ANALYTICS_TRACK_CATEGORY.coverageAndBenefits, 
                "description": target.textContent,
                "type": ANALYTICS_TRACK_TYPE.linkClicked, 
                "targetMemberId": selectedMemberId,
                "location": {
                    "desktop":{
                        "width": 1024,
                        "value": "right"
                    },
                    "tablet":{
                        "width": 768,
                        "value": "right"
                    },
                    "mobile":{
                        "width": 0,
                        "value": "right"
                    }
                }
            }
        );
        
        window.open(doc, '_blank');
    }

    const showLangMenu = (docIndex, index) => {
        docIndex ? setBenfBtnIndex(index) : setGenBtnIndex(index);
    }

    return (
        loading && documents.length === 0 ? <Spinner/> : <>
            <Anchor id="forms-and-documents"></Anchor>
            <FormsAndDocumentBlock/>
            {/* <DocBenefitsBlock showLangMenu={showLangMenu} menuOpen={menuOpen} benfBtnIndex={benfBtnIndex} />
            <DocGeneralBlock showLangMenu={showLangMenu} menuOpen={menuOpen} genBtnIndex={genBtnIndex} /> */}
        </>
    )
}

export default FormsAndDocuments
