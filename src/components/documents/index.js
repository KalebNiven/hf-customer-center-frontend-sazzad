import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDocumentsBasedOnId } from '../../store/saga/apis'

// WIP
const index = () => {
    const { id } = useParams();

    // useEffect(() => {
    //     // call API with the documentId to get the document and stream it back

    //     getDocumentsBasedOnId(id).then(res=>{
    //       if(res.status === 200) {
    //           // stream the document we just received
    //       }
    //     })
    // }, [id]);

    return <></>
}

export default index
