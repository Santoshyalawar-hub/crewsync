package com.samayahr.dto.request;

public class SignDocumentRequest {
    private String signerName;
    private String signatureData;
    private String signedFileBase64;
    private String signedFileType;
    private String signedFileName;
	public String getSignerName() {
		return signerName;
	}
	public void setSignerName(String signerName) {
		this.signerName = signerName;
	}
	public String getSignatureData() {
		return signatureData;
	}
	public void setSignatureData(String signatureData) {
		this.signatureData = signatureData;
	}
	public String getSignedFileBase64() {
		return signedFileBase64;
	}
	public void setSignedFileBase64(String signedFileBase64) {
		this.signedFileBase64 = signedFileBase64;
	}
	public String getSignedFileType() {
		return signedFileType;
	}
	public void setSignedFileType(String signedFileType) {
		this.signedFileType = signedFileType;
	}
	public String getSignedFileName() {
		return signedFileName;
	}
	public void setSignedFileName(String signedFileName) {
		this.signedFileName = signedFileName;
	}

    
}