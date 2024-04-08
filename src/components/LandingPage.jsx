import React from 'react'
import UploadExcelFile from './UploadExcelFile'

const LandingPage = () => {
  return (
    <div style={{backgroundColor:" #B2FFFF", height:"100vh"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
        <h1>Invoice Generator</h1>
        </div>
        <UploadExcelFile/>
    </div>
  )
}

export default LandingPage