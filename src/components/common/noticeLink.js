import React from 'react'
import { useAppContext } from '../../AppContext'
import { Link } from './externalSiteLinkSSO'
import AcknowledgmentModal from './acknowledgmentModal'

const NoticeLink = ({ label, callback, styles, children}) => {
    const { setAcknowledgmentModal } = useAppContext()

    const handleClick = () => { 
        setAcknowledgmentModal({isVisible: true, label, callback})
    }

    return (
        <>
            {
                <Link onClick={() => handleClick()} styles={styles}>{children}</Link>
            }
        </>
    )
}

export default NoticeLink
