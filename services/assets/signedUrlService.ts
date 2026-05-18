export function buildSignedUploadRequest(input: {
  bucketName: string;
  storagePath: string;
}) {
  return {
    bucketName: input.bucketName,
    storagePath: input.storagePath,
    expiresInSeconds: 60 * 10,
    mode: "signed-upload-placeholder",
  };
}

export function buildSignedDownloadRequest(input: {
  bucketName: string;
  storagePath: string;
}) {
  return {
    bucketName: input.bucketName,
    storagePath: input.storagePath,
    expiresInSeconds: 60 * 60,
    mode: "signed-download-placeholder",
  };
}
