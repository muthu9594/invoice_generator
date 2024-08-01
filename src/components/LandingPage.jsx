import React from 'react'
import UploadExcelFile from './UploadExcelFile'
import UploadExcelFile2 from './uploadExcelFile2'

import LandingPage2 from './LandingPage2'

const LandingPage = () => {
  return (
    <div style={{ height:"100vh"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <h1>Invoice Generator</h1>
        </div>
        <UploadExcelFile/>
    </div>
  )
}

export default LandingPage